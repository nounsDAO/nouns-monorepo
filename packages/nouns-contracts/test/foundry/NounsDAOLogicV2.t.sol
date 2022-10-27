// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicV2 } from '../../contracts/governance/NounsDAOLogicV2.sol';
import { NounsDAOProxyV2 } from '../../contracts/governance/NounsDAOProxyV2.sol';
import { NounsDAOStorageV2, NounsDAOStorageV1Adjusted } from '../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsDescriptorV2 } from '../../contracts/NounsDescriptorV2.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { NounsToken } from '../../contracts/NounsToken.sol';
import { NounsSeeder } from '../../contracts/NounsSeeder.sol';
import { IProxyRegistry } from '../../contracts/external/opensea/IProxyRegistry.sol';
import { NounsDAOExecutor } from '../../contracts/governance/NounsDAOExecutor.sol';

contract NounsDAOLogicV2Test is Test, DeployUtils {
    NounsDAOLogicV2 daoLogic;
    NounsDAOLogicV2 daoProxy;
    NounsToken nounsToken;
    NounsDAOExecutor timelock = new NounsDAOExecutor(address(1), TIMELOCK_DELAY);
    address vetoer = address(0x3);
    address admin = address(0x4);
    address noundersDAO = address(0x5);
    address minter = address(0x6);
    address proposer = address(0x7);
    uint256 votingPeriod = 6000;
    uint256 votingDelay = 1;
    uint256 proposalThresholdBPS = 200;

    event Withdraw(uint256 amount, bool sent);

    function setUp() public virtual {
        daoLogic = new NounsDAOLogicV2();

        NounsDescriptorV2 descriptor = _deployAndPopulateV2();

        nounsToken = new NounsToken(noundersDAO, minter, descriptor, new NounsSeeder(), IProxyRegistry(address(0)));

        daoProxy = NounsDAOLogicV2(
            payable(
                new NounsDAOProxyV2(
                    address(timelock),
                    address(nounsToken),
                    vetoer,
                    admin,
                    address(daoLogic),
                    votingPeriod,
                    votingDelay,
                    proposalThresholdBPS,
                    NounsDAOStorageV2.DynamicQuorumParams({
                        minQuorumVotesBPS: 200,
                        maxQuorumVotesBPS: 2000,
                        quorumCoefficient: 10000
                    })
                )
            )
        );

        vm.prank(address(timelock));
        timelock.setPendingAdmin(address(daoProxy));
        vm.prank(address(daoProxy));
        timelock.acceptAdmin();
    }

    function propose(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data
    ) internal returns (uint256 proposalId) {
        vm.prank(proposer);
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = value;
        string[] memory signatures = new string[](1);
        signatures[0] = signature;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = data;
        proposalId = daoProxy.propose(targets, values, signatures, calldatas, 'my proposal');
    }
}

contract CancelProposalTest is NounsDAOLogicV2Test {
    uint256 proposalId;

    function setUp() public override {
        super.setUp();

        vm.prank(minter);
        nounsToken.mint();

        vm.prank(minter);
        nounsToken.transferFrom(minter, proposer, 1);

        vm.roll(block.number + 1);

        proposalId = propose(address(0x1234), 100, '', '');
    }

    function testProposerCanCancelProposal() public {
        vm.prank(proposer);
        daoProxy.cancel(proposalId);

        assertEq(uint256(daoProxy.state(proposalId)), uint256(NounsDAOStorageV1Adjusted.ProposalState.Canceled));
    }

    function testNonProposerCantCancel() public {
        vm.expectRevert('NounsDAO::cancel: proposer above threshold');
        daoProxy.cancel(proposalId);

        assertEq(uint256(daoProxy.state(proposalId)), uint256(NounsDAOStorageV1Adjusted.ProposalState.Pending));
    }

    function testAnyoneCanCancelIfProposerVotesBelowThreshold() public {
        vm.prank(proposer);
        nounsToken.transferFrom(proposer, address(0x9999), 1);

        vm.roll(block.number + 1);

        daoProxy.cancel(proposalId);

        assertEq(uint256(daoProxy.state(proposalId)), uint256(NounsDAOStorageV1Adjusted.ProposalState.Canceled));
    }
}

contract WithdrawTest is NounsDAOLogicV2Test {
    function setUp() public override {
        super.setUp();
    }

    function test_withdraw_worksForAdmin() public {
        vm.deal(address(daoProxy), 100 ether);
        uint256 balanceBefore = admin.balance;

        vm.expectEmit(true, true, true, true);
        emit Withdraw(100 ether, true);

        vm.prank(admin);
        (uint256 amount, bool sent) = daoProxy._withdraw();

        assertEq(amount, 100 ether);
        assertTrue(sent);
        assertEq(admin.balance - balanceBefore, 100 ether);
    }

    function test_withdraw_revertsForNonAdmin() public {
        vm.expectRevert(NounsDAOLogicV2.AdminOnly.selector);
        daoProxy._withdraw();
    }
}
