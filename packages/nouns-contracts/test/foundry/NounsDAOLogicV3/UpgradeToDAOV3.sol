// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicV3BaseTest } from './NounsDAOLogicV3BaseTest.sol';
import { NounsDAOLogicV1 } from '../../../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOLogicV3 } from '../../../contracts/governance/NounsDAOLogicV3.sol';
import { DeployUtils } from '../helpers/DeployUtils.sol';
import { NounsDAOExecutorV2 } from '../../../contracts/governance/NounsDAOExecutorV2.sol';
import { ERC1967Proxy } from '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import { INounsDAOExecutor } from '../../../contracts/governance/NounsDAOInterfaces.sol';

contract UpgradeToDAOV3Test is DeployUtils {
    NounsDAOLogicV1 daoProxy;
    address proposer = makeAddr('proposer');
    address proposer2 = makeAddr('proposer2');
    INounsDAOExecutor timelockV1;

    function setUp() public virtual {
        daoProxy = deployDAOV2();
        timelockV1 = daoProxy.timelock();

        vm.startPrank(daoProxy.nouns().minter());
        daoProxy.nouns().mint();
        daoProxy.nouns().mint();
        daoProxy.nouns().transferFrom(daoProxy.nouns().minter(), proposer, 1);
        daoProxy.nouns().transferFrom(daoProxy.nouns().minter(), proposer2, 2);
        vm.stopPrank();
        vm.roll(block.number + 1);

        vm.deal(address(daoProxy.timelock()), 1000 ether);
    }

    function test_upgradeToDAOV3() public {
        NounsDAOLogicV3 daoV3Implementation = new NounsDAOLogicV3();
        NounsDAOExecutorV2 timelockV2 = deployAndInitTimelockV2();

        uint256 proposalId = proposeToUpgradeToDAOV3(
            address(daoV3Implementation),
            address(timelockV2),
            address(daoProxy.timelock()),
            500 ether
        );

        rollAndCastVote(proposer, proposalId, 1);

        queueAndExecute(proposalId);

        assertEq(daoProxy.implementation(), address(daoV3Implementation));
        assertEq(NounsDAOLogicV3(payable(address(daoProxy))).timelockV1(), address(timelockV1));
        assertEq(address(daoProxy.timelock()), address(timelockV2));
    }

    function test_proposalToSendETHWorksBeforeUpgrade() public {
        uint256 proposalId = proposeToSendETH(proposer2, proposer2, 100 ether);

        rollAndCastVote(proposer, proposalId, 1);

        queueAndExecute(proposalId);

        assertEq(proposer2.balance, 100 ether);
    }

    function test_proposalWasQueuedBeforeUpgrade() public {
        uint256 proposalId = proposeToUpgradeToDAOV3(
            address(new NounsDAOLogicV3()),
            address(deployAndInitTimelockV2()),
            address(daoProxy.timelock()),
            500 ether
        );

        uint256 proposalId2 = proposeToSendETH(proposer2, proposer2, 100 ether);

        rollAndCastVote(proposer, proposalId, 1);

        vm.prank(proposer2);
        daoProxy.castVote(proposalId2, 1);

        vm.roll(block.number + daoProxy.votingPeriod() + 1);
        daoProxy.queue(proposalId);
        daoProxy.queue(proposalId2);

        vm.warp(block.timestamp + daoProxy.timelock().delay());
        daoProxy.execute(proposalId);

        vm.expectRevert("NounsDAOExecutor::executeTransaction: Transaction hasn't been queued.");
        daoProxy.execute(proposalId2);

        NounsDAOLogicV3(payable(address(daoProxy))).executeOnTimelockV1(proposalId2);
        assertEq(proposer2.balance, 100 ether);
    }

    function test_proposalWasQueuedAfterUpgrade() public {
        uint256 proposalId = proposeToUpgradeToDAOV3(
            address(new NounsDAOLogicV3()),
            address(deployAndInitTimelockV2()),
            address(daoProxy.timelock()),
            500 ether
        );

        uint256 proposalId2 = proposeToSendETH(proposer2, proposer2, 100 ether);

        rollAndCastVote(proposer, proposalId, 1);

        vm.prank(proposer2);
        daoProxy.castVote(proposalId2, 1);

        queueAndExecute(proposalId);

        daoProxy.queue(proposalId2);
        vm.warp(block.timestamp + daoProxy.timelock().delay());
        daoProxy.execute(proposalId2);

        assertEq(proposer2.balance, 100 ether);
    }

    function queueAndExecute(uint256 proposalId) internal {
        vm.roll(block.number + daoProxy.votingPeriod() + 1);
        daoProxy.queue(proposalId);

        vm.warp(block.timestamp + daoProxy.timelock().delay());
        daoProxy.execute(proposalId);
    }

    function rollAndCastVote(
        address voter,
        uint256 proposalId,
        uint8 support
    ) internal {
        vm.roll(block.number + daoProxy.votingDelay() + 1);
        vm.prank(voter);
        daoProxy.castVote(proposalId, support);
    }

    function proposeToSendETH(
        address proposer_,
        address to,
        uint256 amount
    ) internal returns (uint256 proposalId) {
        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        string[] memory signatures = new string[](1);
        bytes[] memory calldatas = new bytes[](1);

        targets[0] = to;
        values[0] = amount;
        signatures[0] = '';
        calldatas[0] = '';

        vm.prank(proposer_);
        proposalId = daoProxy.propose(targets, values, signatures, calldatas, 'send eth');
    }

    function deployAndInitTimelockV2() internal returns (NounsDAOExecutorV2) {
        NounsDAOExecutorV2 timelockV2 = NounsDAOExecutorV2(
            payable(address(new ERC1967Proxy(address(new NounsDAOExecutorV2()), '')))
        );
        timelockV2.initialize(address(daoProxy), timelockV1.delay());
        return timelockV2;
    }

    function proposeToUpgradeToDAOV3(
        address daoV3Implementation,
        address timelockV2,
        address timelockV1_,
        uint256 ethToSendToNewTimelock
    ) internal returns (uint256 proposalId) {
        uint256 i = 0;
        address[] memory targets = new address[](3);
        uint256[] memory values = new uint256[](3);
        string[] memory signatures = new string[](3);
        bytes[] memory calldatas = new bytes[](3);

        targets[i] = address(timelockV2);
        values[i] = ethToSendToNewTimelock;
        signatures[i] = '';
        calldatas[i] = '';

        i++;
        targets[i] = address(daoProxy);
        values[i] = 0;
        signatures[i] = '_setImplementation(address)';
        calldatas[i] = abi.encode(daoV3Implementation);

        i++;
        targets[i] = address(daoProxy);
        values[i] = 0;
        signatures[i] = '_setTimelocks(address,address)';
        calldatas[i] = abi.encode(timelockV2, timelockV1_);

        vm.prank(proposer);
        proposalId = daoProxy.propose(targets, values, signatures, calldatas, 'upgrade to v3');
    }
}
