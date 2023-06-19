// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { DAOLogicV1 } from '../../contracts/governance/DAOLogicV1.sol';
import { DAOLogicV2 } from '../../contracts/governance/DAOLogicV2.sol';
import { DAOProxy } from '../../contracts/governance/DAOProxy.sol';
import { DAOProxyV2 } from '../../contracts/governance/DAOProxyV2.sol';
import { VrbsDAOStorageV1, DAOStorageV2 } from '../../contracts/governance/DAOInterfaces.sol';
import { DescriptorV2 } from '../../contracts/DescriptorV2.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { VrbsToken } from '../../contracts/VrbsToken.sol';
import { Seeder } from '../../contracts/Seeder.sol';
import { IProxyRegistry } from '../../contracts/external/opensea/IProxyRegistry.sol';
import { DAOExecutor } from '../../contracts/governance/DAOExecutor.sol';
import { VrbsDAOLogicSharedBaseTest } from './helpers/VrbsDAOLogicSharedBase.t.sol';

abstract contract VrbsDAOLogicV1V2StateTest is VrbsDAOLogicSharedBaseTest {
    function setUp() public override {
        super.setUp();

        mint(proposer, 1);

        vm.roll(block.number + 1);
    }

    function testRevertsGivenProposalIdThatDoesntExist() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.expectRevert('VrbsDAO::state: invalid proposal id');
        daoProxy.state(proposalId + 1);
    }

    function testPendingGivenProposalJustCreated() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Pending);
    }

    function testActiveGivenProposalPastVotingDelay() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.roll(block.number + daoProxy.votingDelay() + 1);
        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Active);
    }

    function testCanceledGivenCanceledProposal() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.prank(proposer);
        daoProxy.cancel(proposalId);

        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Canceled);
    }

    function testDefeatedByRunningOutOfTime() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.roll(block.number + daoProxy.votingDelay() + daoProxy.votingPeriod() + 1);

        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Defeated);
    }

    function testDefeatedByVotingAgainst() public {
        address forVoter = utils.getNextUserAddress();
        address againstVoter = utils.getNextUserAddress();
        mint(forVoter, 3);
        mint(againstVoter, 3);

        uint256 proposalId = propose(address(0x1234), 100, '', '');
        startVotingPeriod();
        vote(forVoter, proposalId, 1);
        vote(againstVoter, proposalId, 0);
        endVotingPeriod();

        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Defeated);
    }

    function testSucceeded() public {
        address forVoter = utils.getNextUserAddress();
        address againstVoter = utils.getNextUserAddress();
        mint(forVoter, 4);
        mint(againstVoter, 3);

        uint256 proposalId = propose(address(0x1234), 100, '', '');
        startVotingPeriod();
        vote(forVoter, proposalId, 1);
        vote(againstVoter, proposalId, 0);
        endVotingPeriod();

        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Succeeded);
    }

    function testQueueRevertsGivenDefeatedProposal() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.roll(block.number + daoProxy.votingDelay() + daoProxy.votingPeriod() + 1);

        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Defeated);

        vm.expectRevert('VrbsDAO::queue: proposal can only be queued if it is succeeded');
        daoProxy.queue(proposalId);
    }

    function testQueueRevertsGivenCanceledProposal() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.prank(proposer);
        daoProxy.cancel(proposalId);

        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Canceled);

        vm.expectRevert('VrbsDAO::queue: proposal can only be queued if it is succeeded');
        daoProxy.queue(proposalId);
    }

    function testQueued() public {
        address forVoter = utils.getNextUserAddress();
        address againstVoter = utils.getNextUserAddress();
        mint(forVoter, 4);
        mint(againstVoter, 3);

        uint256 proposalId = propose(address(0x1234), 100, '', '');
        startVotingPeriod();
        vote(forVoter, proposalId, 1);
        vote(againstVoter, proposalId, 0);
        endVotingPeriod();

        // anyone can queue
        daoProxy.queue(proposalId);

        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Queued);
    }

    function testExpired() public {
        address forVoter = utils.getNextUserAddress();
        address againstVoter = utils.getNextUserAddress();
        mint(forVoter, 4);
        mint(againstVoter, 3);

        uint256 proposalId = propose(address(0x1234), 100, '', '');
        startVotingPeriod();
        vote(forVoter, proposalId, 1);
        vote(againstVoter, proposalId, 0);
        endVotingPeriod();
        daoProxy.queue(proposalId);
        vm.warp(block.timestamp + timelock.delay() + timelock.GRACE_PERIOD() + 1);

        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Expired);
    }

    function testExecutedOnlyAfterQueued() public {
        address forVoter = utils.getNextUserAddress();
        mint(forVoter, 4);

        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.expectRevert('VrbsDAO::execute: proposal can only be executed if it is queued');
        daoProxy.execute(proposalId);

        startVotingPeriod();
        vote(forVoter, proposalId, 1);
        vm.expectRevert('VrbsDAO::execute: proposal can only be executed if it is queued');
        daoProxy.execute(proposalId);

        endVotingPeriod();
        vm.expectRevert('VrbsDAO::execute: proposal can only be executed if it is queued');
        daoProxy.execute(proposalId);

        daoProxy.queue(proposalId);
        vm.expectRevert("DAOExecutor::executeTransaction: Transaction hasn't surpassed time lock.");
        daoProxy.execute(proposalId);

        vm.warp(block.timestamp + timelock.delay() + 1);
        vm.deal(address(timelock), 100);
        daoProxy.execute(proposalId);

        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Executed);

        vm.warp(block.timestamp + timelock.delay() + timelock.GRACE_PERIOD() + 1);
        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Executed);
    }
}

contract VrbsDAOLogicV1StateTest is VrbsDAOLogicV1V2StateTest {
    function daoVersion() internal pure override returns (uint256) {
        return 1;
    }

    function deployDAOProxy() internal override returns (DAOLogicV1) {
        DAOLogicV1 daoLogic = new DAOLogicV1();

        return
            DAOLogicV1(
                payable(
                    new DAOProxy(
                        address(timelock),
                        address(vrbsToken),
                        vetoer,
                        admin,
                        address(daoLogic),
                        votingPeriod,
                        votingDelay,
                        proposalThresholdBPS,
                        1000
                    )
                )
            );
    }
}

contract VrbsDAOLogicV2StateTest is VrbsDAOLogicV1V2StateTest {
    function daoVersion() internal pure override returns (uint256) {
        return 2;
    }

    function deployDAOProxy() internal override returns (DAOLogicV1) {
        DAOLogicV2 daoLogic = new DAOLogicV2();

        return
            DAOLogicV1(
                payable(
                    new DAOProxyV2(
                        address(timelock),
                        address(vrbsToken),
                        vetoer,
                        admin,
                        address(daoLogic),
                        votingPeriod,
                        votingDelay,
                        proposalThresholdBPS,
                        DAOStorageV2.DynamicQuorumParams({
                            minQuorumVotesBPS: 200,
                            maxQuorumVotesBPS: 2000,
                            quorumCoefficient: 10000
                        })
                    )
                )
            );
    }
}

abstract contract VrbsDAOLogicV1V2VetoingTest is VrbsDAOLogicSharedBaseTest {
    function setUp() public override {
        super.setUp();

        mint(proposer, 1);

        vm.roll(block.number + 1);
    }

    function testVetoerSetAsExpected() public {
        assertEq(daoProxy.vetoer(), vetoer);
    }

    function test_burnVetoPower_revertsForNonVetoer() public {
        vm.expectRevert('VrbsDAO::_burnVetoPower: vetoer only');
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

        if (daoVersion() == 1) {
            vm.expectRevert('VrbsDAO::veto: only vetoer');
        } else {
            vm.expectRevert(DAOLogicV2.VetoerOnly.selector);
        }
        daoProxy.veto(proposalId);
    }

    function test_veto_revertsWhenVetoerIsBurned() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.startPrank(vetoer);
        daoProxy._burnVetoPower();

        if (daoVersion() == 1) {
            vm.expectRevert('VrbsDAO::veto: veto power burned');
        } else {
            vm.expectRevert(DAOLogicV2.VetoerBurned.selector);
        }
        daoProxy.veto(proposalId);

        vm.stopPrank();
    }

    function test_veto_worksForPropStatePending() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Pending);

        vm.prank(vetoer);
        daoProxy.veto(proposalId);

        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Vetoed);
    }

    function test_veto_worksForPropStateActive() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.roll(block.number + daoProxy.votingDelay() + 1);
        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Active);

        vm.prank(vetoer);
        daoProxy.veto(proposalId);

        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Vetoed);
    }

    function test_veto_worksForPropStateCanceled() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.prank(proposer);
        daoProxy.cancel(proposalId);
        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Canceled);

        vm.prank(vetoer);
        daoProxy.veto(proposalId);

        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Vetoed);
    }

    function test_veto_worksForPropStateDefeated() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.roll(block.number + daoProxy.votingDelay() + 1);
        vm.prank(proposer);
        daoProxy.castVote(proposalId, 0);
        vm.roll(block.number + daoProxy.votingPeriod() + 1);
        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Defeated);

        vm.prank(vetoer);
        daoProxy.veto(proposalId);

        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Vetoed);
    }

    function test_veto_worksForPropStateSucceeded() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.roll(block.number + daoProxy.votingDelay() + 1);
        vm.prank(proposer);
        daoProxy.castVote(proposalId, 1);
        vm.roll(block.number + daoProxy.votingPeriod() + 1);
        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Succeeded);

        vm.prank(vetoer);
        daoProxy.veto(proposalId);

        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Vetoed);
    }

    function test_veto_worksForPropStateQueued() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.roll(block.number + daoProxy.votingDelay() + 1);
        vm.prank(proposer);
        daoProxy.castVote(proposalId, 1);
        vm.roll(block.number + daoProxy.votingPeriod() + 1);
        daoProxy.queue(proposalId);
        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Queued);

        vm.prank(vetoer);
        daoProxy.veto(proposalId);

        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Vetoed);
    }

    function test_veto_worksForPropStateExpired() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.roll(block.number + daoProxy.votingDelay() + 1);
        vm.prank(proposer);
        daoProxy.castVote(proposalId, 1);
        vm.roll(block.number + daoProxy.votingPeriod() + 1);
        daoProxy.queue(proposalId);
        vm.warp(block.timestamp + timelock.delay() + timelock.GRACE_PERIOD() + 1);
        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Expired);

        vm.prank(vetoer);
        daoProxy.veto(proposalId);

        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Vetoed);
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
        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Executed);

        vm.prank(vetoer);
        if (daoVersion() == 1) {
            vm.expectRevert('VrbsDAO::veto: cannot veto executed proposal');
        } else {
            vm.expectRevert(DAOLogicV2.CantVetoExecutedProposal.selector);
        }
        daoProxy.veto(proposalId);
    }

    function test_veto_worksForPropStateVetoed() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.prank(vetoer);
        daoProxy.veto(proposalId);
        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Vetoed);

        vm.prank(vetoer);
        daoProxy.veto(proposalId);

        assertTrue(daoProxy.state(proposalId) == VrbsDAOStorageV1.ProposalState.Vetoed);
    }
}

contract VrbsDAOLogicV1VetoingTest is VrbsDAOLogicV1V2VetoingTest {
    function test_setVetoer_revertsForNonVetoer() public {
        address newVetoer = utils.getNextUserAddress();

        vm.expectRevert('VrbsDAO::_setVetoer: vetoer only');
        daoProxy._setVetoer(newVetoer);
    }

    function test_setVetoer_worksForVetoer() public {
        address newVetoer = utils.getNextUserAddress();

        vm.prank(vetoer);
        daoProxy._setVetoer(newVetoer);

        assertEq(daoProxy.vetoer(), newVetoer);
    }

    function daoVersion() internal pure override returns (uint256) {
        return 1;
    }

    function deployDAOProxy() internal override returns (DAOLogicV1) {
        DAOLogicV1 daoLogic = new DAOLogicV1();

        return
            DAOLogicV1(
                payable(
                    new DAOProxy(
                        address(timelock),
                        address(vrbsToken),
                        vetoer,
                        admin,
                        address(daoLogic),
                        votingPeriod,
                        votingDelay,
                        proposalThresholdBPS,
                        1000
                    )
                )
            );
    }
}

contract VrbsDAOLogicV2VetoingTest is VrbsDAOLogicV1V2VetoingTest {
    event NewPendingVetoer(address oldPendingVetoer, address newPendingVetoer);
    event NewVetoer(address oldVetoer, address newVetoer);

    function test_setPendingVetoer_failsIfNotCurrentVetoer() public {
        vm.expectRevert(DAOLogicV2.VetoerOnly.selector);
        daoProxyAsV2()._setPendingVetoer(address(0x1234));
    }

    function test_setPendingVetoer_updatePendingVetoer() public {
        assertEq(daoProxyAsV2().pendingVetoer(), address(0));

        address pendingVetoer = address(0x3333);

        vm.prank(vetoer);
        vm.expectEmit(true, true, true, true);
        emit NewPendingVetoer(address(0), pendingVetoer);
        daoProxyAsV2()._setPendingVetoer(pendingVetoer);

        assertEq(daoProxyAsV2().pendingVetoer(), pendingVetoer);
    }

    function test_onlyPendingVetoerCanAcceptNewVetoer() public {
        address pendingVetoer = address(0x3333);

        vm.prank(vetoer);
        daoProxyAsV2()._setPendingVetoer(pendingVetoer);

        vm.expectRevert(DAOLogicV2.PendingVetoerOnly.selector);
        daoProxyAsV2()._acceptVetoer();

        vm.prank(pendingVetoer);
        vm.expectEmit(true, true, true, true);
        emit NewVetoer(vetoer, pendingVetoer);
        daoProxyAsV2()._acceptVetoer();

        assertEq(daoProxy.vetoer(), pendingVetoer);
        assertEq(daoProxyAsV2().pendingVetoer(), address(0x0));
    }

    function test_burnVetoPower_failsIfNotVetoer() public {
        vm.expectRevert('VrbsDAO::_burnVetoPower: vetoer only');
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
        daoProxyAsV2()._setPendingVetoer(pendingVetoer);

        vm.prank(vetoer);
        vm.expectEmit(true, true, true, true);
        emit NewPendingVetoer(pendingVetoer, address(0));
        daoProxy._burnVetoPower();

        vm.prank(pendingVetoer);
        vm.expectRevert(DAOLogicV2.PendingVetoerOnly.selector);
        daoProxyAsV2()._acceptVetoer();

        assertEq(daoProxyAsV2().pendingVetoer(), address(0));
    }

    function daoVersion() internal pure override returns (uint256) {
        return 2;
    }

    function deployDAOProxy() internal override returns (DAOLogicV1) {
        DAOLogicV2 daoLogic = new DAOLogicV2();

        return
            DAOLogicV1(
                payable(
                    new DAOProxyV2(
                        address(timelock),
                        address(vrbsToken),
                        vetoer,
                        admin,
                        address(daoLogic),
                        votingPeriod,
                        votingDelay,
                        proposalThresholdBPS,
                        DAOStorageV2.DynamicQuorumParams({
                            minQuorumVotesBPS: 200,
                            maxQuorumVotesBPS: 2000,
                            quorumCoefficient: 10000
                        })
                    )
                )
            );
    }
}
