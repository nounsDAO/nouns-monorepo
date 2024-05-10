// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { NounsDAOLogicSharedBaseTest } from '../helpers/NounsDAOLogicSharedBase.t.sol';
import { NounsDAOTypes } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsDAOProposals } from '../../../contracts/governance/NounsDAOProposals.sol';
import { NounsDAOAdmin } from '../../../contracts/governance/NounsDAOAdmin.sol';
import { INounsDAOLogic } from '../../../contracts/interfaces/INounsDAOLogic.sol';

contract NounsDAOLogicV3VetoTest is NounsDAOLogicSharedBaseTest {
    event NewPendingVetoer(address oldPendingVetoer, address newPendingVetoer);
    event NewVetoer(address oldVetoer, address newVetoer);

    function setUp() public override {
        super.setUp();

        mint(proposer, 1);

        vm.roll(block.number + 1);
    }

    function testVetoerSetAsExpected() public {
        assertEq(daoProxy.vetoer(), vetoer);
    }

    function test_burnVetoPower_revertsForNonVetoer() public {
        vm.expectRevert('NounsDAO::_burnVetoPower: vetoer only');
        daoProxy._burnVetoPower();
    }

    function test_burnVetoPower_worksForVetoer() public {
        assertEq(daoProxy.vetoer(), vetoer);

        vm.prank(vetoer);
        daoProxy._burnVetoPower();

        assertEq(daoProxy.vetoer(), address(0));
    }

    function test_veto_revertsForNonVetoer() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');

        vm.expectRevert(NounsDAOProposals.VetoerOnly.selector);

        daoProxy.veto(proposalId);
    }

    function test_veto_revertsWhenVetoerIsBurned() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.startPrank(vetoer);
        daoProxy._burnVetoPower();

        vm.expectRevert(NounsDAOProposals.VetoerBurned.selector);

        daoProxy.veto(proposalId);

        vm.stopPrank();
    }

    function test_veto_worksForPropStatePending() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        // Need to roll one block because in V3 on the proposal creation block the state is Updatable
        vm.roll(block.number + 1);
        assertTrue(daoProxy.state(proposalId) == NounsDAOTypes.ProposalState.Pending);

        vm.prank(vetoer);
        daoProxy.veto(proposalId);

        assertTrue(daoProxy.state(proposalId) == NounsDAOTypes.ProposalState.Vetoed);
    }

    function test_veto_worksForPropStateActive() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.roll(block.number + daoProxy.votingDelay() + 1);
        assertTrue(daoProxy.state(proposalId) == NounsDAOTypes.ProposalState.Active);

        vm.prank(vetoer);
        daoProxy.veto(proposalId);

        assertTrue(daoProxy.state(proposalId) == NounsDAOTypes.ProposalState.Vetoed);
    }

    function test_veto_worksForPropStateCanceled() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.prank(proposer);
        daoProxy.cancel(proposalId);
        assertTrue(daoProxy.state(proposalId) == NounsDAOTypes.ProposalState.Canceled);

        vm.prank(vetoer);
        daoProxy.veto(proposalId);

        assertTrue(daoProxy.state(proposalId) == NounsDAOTypes.ProposalState.Vetoed);
    }

    function test_veto_worksForPropStateDefeated() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.roll(block.number + daoProxy.votingDelay() + 1);
        vm.prank(proposer);
        daoProxy.castVote(proposalId, 0);
        vm.roll(block.number + daoProxy.votingPeriod() + 1);
        assertTrue(daoProxy.state(proposalId) == NounsDAOTypes.ProposalState.Defeated);

        vm.prank(vetoer);
        daoProxy.veto(proposalId);

        assertTrue(daoProxy.state(proposalId) == NounsDAOTypes.ProposalState.Vetoed);
    }

    function test_veto_worksForPropStateSucceeded() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.roll(block.number + daoProxy.votingDelay() + 1);
        vm.prank(proposer);
        daoProxy.castVote(proposalId, 1);
        vm.roll(block.number + daoProxy.votingPeriod() + 1);
        assertTrue(daoProxy.state(proposalId) == NounsDAOTypes.ProposalState.Succeeded);

        vm.prank(vetoer);
        daoProxy.veto(proposalId);

        assertTrue(daoProxy.state(proposalId) == NounsDAOTypes.ProposalState.Vetoed);
    }

    function test_veto_worksForPropStateQueued() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.roll(block.number + daoProxy.votingDelay() + 1);
        vm.prank(proposer);
        daoProxy.castVote(proposalId, 1);
        vm.roll(block.number + daoProxy.votingPeriod() + 1);
        daoProxy.queue(proposalId);
        assertTrue(daoProxy.state(proposalId) == NounsDAOTypes.ProposalState.Queued);

        vm.prank(vetoer);
        daoProxy.veto(proposalId);

        assertTrue(daoProxy.state(proposalId) == NounsDAOTypes.ProposalState.Vetoed);
    }

    function test_veto_worksForPropStateExpired() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.roll(block.number + daoProxy.votingDelay() + 1);
        vm.prank(proposer);
        daoProxy.castVote(proposalId, 1);
        vm.roll(block.number + daoProxy.votingPeriod() + 1);
        daoProxy.queue(proposalId);
        vm.warp(block.timestamp + timelock.delay() + timelock.GRACE_PERIOD() + 1);
        assertTrue(daoProxy.state(proposalId) == NounsDAOTypes.ProposalState.Expired);

        vm.prank(vetoer);
        daoProxy.veto(proposalId);

        assertTrue(daoProxy.state(proposalId) == NounsDAOTypes.ProposalState.Vetoed);
    }

    function test_veto_revertsForPropStateExecuted() public {
        vm.deal(address(timelock), 100);
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.roll(block.number + daoProxy.votingDelay() + 1);
        vm.prank(proposer);
        daoProxy.castVote(proposalId, 1);
        vm.roll(block.number + daoProxy.votingPeriod() + 1);
        daoProxy.queue(proposalId);
        vm.warp(block.timestamp + timelock.delay() + 1);
        daoProxy.execute(proposalId);
        assertTrue(daoProxy.state(proposalId) == NounsDAOTypes.ProposalState.Executed);

        vm.expectRevert(NounsDAOProposals.CantVetoExecutedProposal.selector);
        vm.prank(vetoer);
        daoProxy.veto(proposalId);
    }

    function test_veto_worksForPropStateVetoed() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.prank(vetoer);
        daoProxy.veto(proposalId);
        assertTrue(daoProxy.state(proposalId) == NounsDAOTypes.ProposalState.Vetoed);

        vm.prank(vetoer);
        daoProxy.veto(proposalId);

        assertTrue(daoProxy.state(proposalId) == NounsDAOTypes.ProposalState.Vetoed);
    }

    function test_veto_worksForPropStateUpdatable() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        INounsDAOLogic daoAsV3 = INounsDAOLogic(payable(address(daoProxy)));

        assertTrue(daoAsV3.state(proposalId) == NounsDAOTypes.ProposalState.Updatable);

        vm.prank(vetoer);
        daoAsV3.veto(proposalId);

        assertTrue(daoAsV3.state(proposalId) == NounsDAOTypes.ProposalState.Vetoed);
    }

    function test_setPendingVetoer_failsIfNotCurrentVetoer() public {
        vm.expectRevert(NounsDAOProposals.VetoerOnly.selector);
        daoProxy._setPendingVetoer(address(0x1234));
    }

    function test_setPendingVetoer_updatePendingVetoer() public {
        assertEq(daoProxy.pendingVetoer(), address(0));

        address pendingVetoer = address(0x3333);

        vm.prank(vetoer);
        vm.expectEmit(true, true, true, true);
        emit NewPendingVetoer(address(0), pendingVetoer);
        daoProxy._setPendingVetoer(pendingVetoer);

        assertEq(daoProxy.pendingVetoer(), pendingVetoer);
    }

    function test_onlyPendingVetoerCanAcceptNewVetoer() public {
        address pendingVetoer = address(0x3333);

        vm.prank(vetoer);
        daoProxy._setPendingVetoer(pendingVetoer);

        vm.expectRevert(NounsDAOAdmin.PendingVetoerOnly.selector);
        daoProxy._acceptVetoer();

        vm.prank(pendingVetoer);
        vm.expectEmit(true, true, true, true);
        emit NewVetoer(vetoer, pendingVetoer);
        daoProxy._acceptVetoer();

        assertEq(daoProxy.vetoer(), pendingVetoer);
        assertEq(daoProxy.pendingVetoer(), address(0x0));
    }

    function test_burnVetoPower_failsIfNotVetoer() public {
        vm.expectRevert('NounsDAO::_burnVetoPower: vetoer only');
        daoProxy._burnVetoPower();
    }

    function test_burnVetoPower_setsVetoerToZero() public {
        vm.prank(vetoer);
        vm.expectEmit(true, true, true, true);
        emit NewVetoer(vetoer, address(0));
        daoProxy._burnVetoPower();

        assertEq(daoProxy.vetoer(), address(0));
    }

    function test_burnVetoPower_setsPendingVetoerToZero() public {
        address pendingVetoer = address(0x3333);

        vm.prank(vetoer);
        daoProxy._setPendingVetoer(pendingVetoer);

        vm.prank(vetoer);
        vm.expectEmit(true, true, true, true);
        emit NewPendingVetoer(pendingVetoer, address(0));
        daoProxy._burnVetoPower();

        vm.prank(pendingVetoer);
        vm.expectRevert(NounsDAOAdmin.PendingVetoerOnly.selector);
        daoProxy._acceptVetoer();

        assertEq(daoProxy.pendingVetoer(), address(0));
    }

    function deployDAOProxy(
        address timelock,
        address nounsToken,
        address vetoer
    ) internal override returns (INounsDAOLogic) {
        return _createDAOV3Proxy(timelock, nounsToken, vetoer);
    }

    function daoVersion() internal pure override returns (uint256) {
        return 3;
    }
}
