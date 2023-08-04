// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicV3BaseTest } from './NounsDAOLogicV3BaseTest.sol';
import { NounsDAOLogicV1 } from '../../../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOLogicV2 } from '../../../contracts/governance/NounsDAOLogicV2.sol';
import { NounsDAOLogicV3 } from '../../../contracts/governance/NounsDAOLogicV3.sol';
import { DeployUtils } from '../helpers/DeployUtils.sol';
import { NounsDAOExecutorV2 } from '../../../contracts/governance/NounsDAOExecutorV2.sol';
import { NounsDAOExecutorProxy } from '../../../contracts/governance/NounsDAOExecutorProxy.sol';
import { INounsDAOExecutor, NounsDAOStorageV2, NounsDAOStorageV3 } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsDAOForkEscrow } from '../../../contracts/governance/fork/NounsDAOForkEscrow.sol';
import { ForkDAODeployer } from '../../../contracts/governance/fork/ForkDAODeployer.sol';
import { ERC20Mock } from '../helpers/ERC20Mock.sol';

contract UpgradeToDAOV3Test is DeployUtils {
    NounsDAOLogicV1 daoProxy;
    address proposer = makeAddr('proposer');
    address proposer2 = makeAddr('proposer2');
    INounsDAOExecutor timelockV1;
    ERC20Mock stETH = new ERC20Mock();

    address[] targets;
    uint256[] values;
    string[] signatures;
    bytes[] calldatas;

    event ProposalCreatedOnTimelockV1(uint256 id);

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
        address[] memory erc20TokensToIncludeInFork = new address[](1);
        erc20TokensToIncludeInFork[0] = address(stETH);
        (
            NounsDAOForkEscrow forkEscrow,
            ForkDAODeployer forkDeployer,
            NounsDAOLogicV3 daoV3Implementation,
            NounsDAOExecutorV2 timelockV2
        ) = deployNewContracts();
        uint256 proposalId = proposeUpgradeToDAOV3(
            address(daoV3Implementation),
            address(timelockV2),
            address(daoProxy.timelock()),
            500 ether,
            forkEscrow,
            forkDeployer,
            erc20TokensToIncludeInFork
        );

        rollAndCastVote(proposer, proposalId, 1);

        queueAndExecute(proposalId);

        NounsDAOLogicV3 daoProxyAsV3 = NounsDAOLogicV3(payable(address(daoProxy)));

        assertEq(daoProxy.implementation(), address(daoV3Implementation));
        assertEq(daoProxyAsV3.timelockV1(), address(timelockV1));
        assertEq(address(daoProxy.timelock()), address(timelockV2));

        // check fork params
        assertEq(address(daoProxyAsV3.forkEscrow()), address(forkEscrow));
        assertEq(address(daoProxyAsV3.forkDAODeployer()), address(forkDeployer));
        assertEq(daoProxyAsV3.forkPeriod(), 7 days);
        assertEq(daoProxyAsV3.forkThresholdBPS(), 2_000);

        address[] memory erc20sInFork = daoProxyAsV3.erc20TokensToIncludeInFork();
        assertEq(erc20sInFork.length, 1);
        assertEq(erc20sInFork[0], address(stETH));

        // check funds were transferred
        assertEq(address(daoProxyAsV3.timelock()).balance, 500 ether);
        assertEq(address(daoProxyAsV3.timelockV1()).balance, 500 ether);
    }

    function test_proposalToSendETHWorksBeforeUpgrade() public {
        uint256 proposalId = proposeToSendETH(proposer2, proposer2, 100 ether);

        rollAndCastVote(proposer, proposalId, 1);

        queueAndExecute(proposalId);

        assertEq(proposer2.balance, 100 ether);
    }

    function test_proposalQueuedBeforeUpgrade_executeRevertsButExecuteOnV1Works() public {
        uint256 proposalId = deployContractsAndProposeUpgradeToDAOV3(address(daoProxy.timelock()), 500 ether);

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
        uint256 proposalId = deployContractsAndProposeUpgradeToDAOV3(address(daoProxy.timelock()), 500 ether);

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

    function test_proposalAfterUpgrade() public {
        upgradeToV3();

        uint256 proposalId = proposeToSendETH(proposer2, proposer2, 100 ether);

        // check executeOnTimelockV1 is false
        NounsDAOLogicV3 daoV3 = NounsDAOLogicV3(payable(address(daoProxy)));
        NounsDAOStorageV3.ProposalCondensed memory proposal = daoV3.proposalsV3(proposalId);
        assertFalse(proposal.executeOnTimelockV1);

        rollAndCastVote(proposer, proposalId, 1);

        queueAndExecute(proposalId);

        assertEq(proposer2.balance, 100 ether);
    }

    function test_proposeOnTimelockV1() public {
        upgradeToV3();

        targets = [proposer];
        values = [400 ether];
        signatures = [''];
        calldatas = [bytes('')];
        vm.expectEmit(true, true, true, true);
        emit ProposalCreatedOnTimelockV1(2);
        vm.prank(proposer);
        NounsDAOLogicV3 daoV3 = NounsDAOLogicV3(payable(address(daoProxy)));
        uint256 proposalId = daoV3.proposeOnTimelockV1(targets, values, signatures, calldatas, 'send eth');

        NounsDAOStorageV3.ProposalCondensed memory proposal = daoV3.proposalsV3(proposalId);
        assertTrue(proposal.executeOnTimelockV1);

        rollAndCastVote(proposer, proposalId, 1);
        queueAndExecute(proposalId);

        assertEq(proposer.balance, 400 ether);
        assertEq(address(timelockV1).balance, 100 ether);
        assertEq(address(daoProxy.timelock()).balance, 500 ether);
    }

    function test_timelockV2IsUpgradable() public {
        upgradeToV3();

        targets = [address(daoProxy.timelock())];
        values = [0];
        signatures = ['upgradeTo(address)'];
        address newTimelock = address(new NewTimelockMock());
        calldatas = [abi.encode(newTimelock)];
        vm.prank(proposer);
        uint256 proposalId = daoProxy.propose(targets, values, signatures, calldatas, 'upgrade to 1234');

        rollAndCastVote(proposer, proposalId, 1);
        queueAndExecute(proposalId);

        assertEq(get1967Implementation(address(daoProxy.timelock())), address(newTimelock));
        assertEq(NewTimelockMock(payable(address(daoProxy.timelock()))).banner(), 'NewTimelockMock');
    }

    function test_daoCanBeUpgradedAfterUpgradeToV3() public {
        upgradeToV3();

        targets = [address(daoProxy)];
        values = [0];
        signatures = ['_setImplementation(address)'];
        calldatas = [abi.encode(address(1234))];
        vm.prank(proposer);
        uint256 proposalId = daoProxy.propose(targets, values, signatures, calldatas, 'upgrade to 1234');

        rollAndCastVote(proposer, proposalId, 1);
        queueAndExecute(proposalId);

        assertEq(daoProxy.implementation(), address(1234));
    }

    using stdStorage for StdStorage;

    function test_proposalCreatedInV2HasSameFieldsInV3() public {
        vm.roll(block.number + 256);

        uint256 proposalId = proposeToSendETH(proposer2, proposer2, 100 ether);
        rollAndCastVote(proposer, proposalId, 1);
        queueAndExecute(proposalId);

        NounsDAOStorageV2.ProposalCondensed memory propV2 = NounsDAOLogicV2(payable(address(daoProxy))).proposals(1);

        upgradeToV3();

        NounsDAOStorageV2.ProposalCondensed memory propV3 = NounsDAOLogicV3(payable(address(daoProxy))).proposals(1);

        assertEq(propV2.id, propV3.id);
        assertEq(propV2.proposer, propV3.proposer);
        assertEq(propV2.proposalThreshold, propV3.proposalThreshold);
        assertEq(propV2.quorumVotes, propV3.quorumVotes);
        assertEq(propV2.eta, propV3.eta);
        assertEq(propV2.startBlock, propV3.startBlock);
        assertEq(propV2.endBlock, propV3.endBlock);
        assertEq(propV2.forVotes, propV3.forVotes);
        assertEq(propV2.againstVotes, propV3.againstVotes);
        assertEq(propV2.abstainVotes, propV3.abstainVotes);
        assertEq(propV2.canceled, propV3.canceled);
        assertEq(propV2.vetoed, propV3.vetoed);
        assertEq(propV2.executed, propV3.executed);
        assertEq(propV2.totalSupply, propV3.totalSupply);
        assertEq(propV2.creationBlock, propV3.creationBlock);
    }

    function upgradeToV3() internal returns (uint256 proposalId) {
        proposalId = deployContractsAndProposeUpgradeToDAOV3(address(daoProxy.timelock()), 500 ether);
        rollAndCastVote(proposer, proposalId, 1);
        queueAndExecute(proposalId);
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
        targets = [to];
        values = [amount];
        signatures = [''];
        calldatas = [bytes('')];

        vm.prank(proposer_);
        proposalId = daoProxy.propose(targets, values, signatures, calldatas, 'send eth');
    }

    function deployAndInitTimelockV2() internal returns (NounsDAOExecutorV2 timelockV2, address timelockV2Impl) {
        timelockV2Impl = address(new NounsDAOExecutorV2());

        bytes memory initCallData = abi.encodeWithSignature(
            'initialize(address,uint256)',
            address(daoProxy),
            timelockV1.delay()
        );

        timelockV2 = NounsDAOExecutorV2(payable(address(new NounsDAOExecutorProxy(timelockV2Impl, initCallData))));

        assertEq(timelockV2.delay(), timelockV1.delay());
        assertEq(get1967Implementation(address(timelockV2)), timelockV2Impl);

        return (timelockV2, timelockV2Impl);
    }

    function deployNewContracts()
        internal
        returns (
            NounsDAOForkEscrow forkEscrow,
            ForkDAODeployer forkDeployer,
            NounsDAOLogicV3 daoV3Impl,
            NounsDAOExecutorV2 timelockV2
        )
    {
        forkEscrow = new NounsDAOForkEscrow(address(daoProxy), address(daoProxy.nouns()));
        forkDeployer = new ForkDAODeployer(
            address(0), // tokenImpl_,
            address(0), // auctionImpl_,
            address(0), // governorImpl_,
            address(0), // treasuryImpl_,
            30 days,
            FORK_DAO_VOTING_PERIOD,
            FORK_DAO_VOTING_DELAY,
            FORK_DAO_PROPOSAL_THRESHOLD_BPS,
            FORK_DAO_QUORUM_VOTES_BPS
        );
        daoV3Impl = new NounsDAOLogicV3();
        (timelockV2, ) = deployAndInitTimelockV2();
    }

    function deployContractsAndProposeUpgradeToDAOV3(address timelockV1_, uint256 ethToSendToNewTimelock)
        internal
        returns (uint256 proposalId)
    {
        (
            NounsDAOForkEscrow forkEscrow,
            ForkDAODeployer forkDeployer,
            NounsDAOLogicV3 daoV3Impl,
            NounsDAOExecutorV2 timelockV2
        ) = deployNewContracts();

        address[] memory erc20TokensToIncludeInFork = new address[](1);
        erc20TokensToIncludeInFork[0] = address(stETH);
        proposalId = proposeUpgradeToDAOV3(
            address(daoV3Impl),
            address(timelockV2),
            timelockV1_,
            ethToSendToNewTimelock,
            forkEscrow,
            forkDeployer,
            erc20TokensToIncludeInFork
        );
    }

    function proposeUpgradeToDAOV3(
        address daoV3Implementation,
        address timelockV2,
        address timelockV1_,
        uint256 ethToSendToNewTimelock,
        NounsDAOForkEscrow forkEscrow,
        ForkDAODeployer forkDeployer,
        address[] memory erc20TokensToIncludeInFork
    ) internal returns (uint256 proposalId) {
        targets = new address[](4);
        values = new uint256[](4);
        signatures = new string[](4);
        calldatas = new bytes[](4);

        uint256 i = 0;
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
        signatures[i] = '_setForkParams(address,address,address[],uint256,uint256)';
        calldatas[i] = abi.encode(
            address(forkEscrow),
            address(forkDeployer),
            erc20TokensToIncludeInFork,
            7 days,
            2_000
        );

        i++;
        targets[i] = address(daoProxy);
        values[i] = 0;
        signatures[i] = '_setTimelocksAndAdmin(address,address,address)';
        calldatas[i] = abi.encode(timelockV2, timelockV1_, timelockV2);

        vm.prank(proposer);
        proposalId = daoProxy.propose(targets, values, signatures, calldatas, 'upgrade to v3');
    }
}

contract NewTimelockMock is NounsDAOExecutorV2 {
    function banner() public pure returns (string memory) {
        return 'NewTimelockMock';
    }
}
