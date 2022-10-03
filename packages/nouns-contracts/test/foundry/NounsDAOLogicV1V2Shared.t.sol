// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicV1 } from '../../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOLogicV2 } from '../../contracts/governance/NounsDAOLogicV2.sol';
import { NounsDAOProxy } from '../../contracts/governance/NounsDAOProxy.sol';
import { NounsDAOProxyV2 } from '../../contracts/governance/NounsDAOProxyV2.sol';
import { NounsDAOStorageV1, NounsDAOStorageV2 } from '../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsDescriptorV2 } from '../../contracts/NounsDescriptorV2.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { NounsToken } from '../../contracts/NounsToken.sol';
import { NounsSeeder } from '../../contracts/NounsSeeder.sol';
import { IProxyRegistry } from '../../contracts/external/opensea/IProxyRegistry.sol';
import { NounsDAOExecutor } from '../../contracts/governance/NounsDAOExecutor.sol';
import { NounsDAOLogicSharedBaseTest } from './helpers/NounsDAOLogicSharedBase.t.sol';

abstract contract NounsDAOLogicV1V2StateTest is NounsDAOLogicSharedBaseTest {
    function setUp() public override {
        super.setUp();

        mint(proposer, 1);

        vm.roll(block.number + 1);
    }

    function testRevertsGivenProposalIdThatDoesntExist() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.expectRevert('NounsDAO::state: invalid proposal id');
        daoProxy.state(proposalId + 1);
    }

    function testPendingGivenProposalJustCreated() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        assertTrue(daoProxy.state(proposalId) == NounsDAOStorageV1.ProposalState.Pending);
    }

    function testActiveGivenProposalPastVotingDelay() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.roll(block.number + daoProxy.votingDelay() + 1);
        assertTrue(daoProxy.state(proposalId) == NounsDAOStorageV1.ProposalState.Active);
    }

    function testCanceledGivenCanceledProposal() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.prank(proposer);
        daoProxy.cancel(proposalId);

        assertTrue(daoProxy.state(proposalId) == NounsDAOStorageV1.ProposalState.Canceled);
    }

    function testDefeatedByRunningOutOfTime() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.roll(block.number + daoProxy.votingDelay() + daoProxy.votingPeriod() + 1);

        assertTrue(daoProxy.state(proposalId) == NounsDAOStorageV1.ProposalState.Defeated);
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

        assertTrue(daoProxy.state(proposalId) == NounsDAOStorageV1.ProposalState.Defeated);
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

        assertTrue(daoProxy.state(proposalId) == NounsDAOStorageV1.ProposalState.Succeeded);
    }

    function testQueueRevertsGivenDefeatedProposal() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.roll(block.number + daoProxy.votingDelay() + daoProxy.votingPeriod() + 1);

        assertTrue(daoProxy.state(proposalId) == NounsDAOStorageV1.ProposalState.Defeated);

        vm.expectRevert('NounsDAO::queue: proposal can only be queued if it is succeeded');
        daoProxy.queue(proposalId);
    }

    function testQueueRevertsGivenCanceledProposal() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.prank(proposer);
        daoProxy.cancel(proposalId);

        assertTrue(daoProxy.state(proposalId) == NounsDAOStorageV1.ProposalState.Canceled);

        vm.expectRevert('NounsDAO::queue: proposal can only be queued if it is succeeded');
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

        assertTrue(daoProxy.state(proposalId) == NounsDAOStorageV1.ProposalState.Queued);
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

        assertTrue(daoProxy.state(proposalId) == NounsDAOStorageV1.ProposalState.Expired);
    }

    function testExecutedOnlyAfterQueued() public {
        address forVoter = utils.getNextUserAddress();
        mint(forVoter, 4);

        vm.deal(address(timelock), 100);
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.expectRevert('NounsDAO::execute: proposal can only be executed if it is queued');
        daoProxy.execute(proposalId);

        startVotingPeriod();
        vote(forVoter, proposalId, 1);
        vm.expectRevert('NounsDAO::execute: proposal can only be executed if it is queued');
        daoProxy.execute(proposalId);

        endVotingPeriod();
        vm.expectRevert('NounsDAO::execute: proposal can only be executed if it is queued');
        daoProxy.execute(proposalId);

        daoProxy.queue(proposalId);
        vm.expectRevert("NounsDAOExecutor::executeTransaction: Transaction hasn't surpassed time lock.");
        daoProxy.execute(proposalId);

        vm.warp(block.timestamp + timelock.delay() + 1);
        daoProxy.execute(proposalId);

        assertTrue(daoProxy.state(proposalId) == NounsDAOStorageV1.ProposalState.Executed);

        vm.warp(block.timestamp + timelock.delay() + timelock.GRACE_PERIOD() + 1);
        assertTrue(daoProxy.state(proposalId) == NounsDAOStorageV1.ProposalState.Executed);
    }
}

contract NounsDAOLogicV1StateTest is NounsDAOLogicV1V2StateTest {
    function deployDAOProxy() internal override returns (NounsDAOLogicV1) {
        NounsDAOLogicV1 daoLogic = new NounsDAOLogicV1();

        return
            NounsDAOLogicV1(
                payable(
                    new NounsDAOProxy(
                        address(timelock),
                        address(nounsToken),
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

contract NounsDAOLogicV2StateTest is NounsDAOLogicV1V2StateTest {
    function deployDAOProxy() internal override returns (NounsDAOLogicV1) {
        NounsDAOLogicV2 daoLogic = new NounsDAOLogicV2();

        return
            NounsDAOLogicV1(
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
    }
}
