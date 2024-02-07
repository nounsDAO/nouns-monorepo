// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { INounsDAOLogic } from '../../../contracts/interfaces/INounsDAOLogic.sol';
import { NounsDAOProposals } from '../../../contracts/governance/NounsDAOProposals.sol';
import { NounsDAOLogicSharedBaseTest } from '../helpers/NounsDAOLogicSharedBase.t.sol';
import { NounsDAOProxyV3 } from '../../../contracts/governance/NounsDAOProxyV3.sol';
import { NounsDAOTypes } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { Utils } from '../helpers/Utils.sol';
import { DeployUtilsV3 } from '../helpers/DeployUtilsV3.sol';

abstract contract NounsDAOLogicV3InflationHandlingTest is NounsDAOLogicSharedBaseTest, Utils {
    uint256 constant proposalThresholdBPS_ = 678; // 6.78%
    uint16 constant minQuorumVotesBPS = 1100; // 11%
    address tokenHolder;
    address user1;
    address user2;
    address user3;

    function daoVersion() internal pure override returns (uint256) {
        return 3;
    }

    function deployDAOProxy(
        address timelock,
        address nounsToken,
        address vetoer
    ) internal override returns (INounsDAOLogic) {
        return
            _createDAOV3Proxy(
                timelock,
                nounsToken,
                vetoer,
                NounsDAOTypes.NounsDAOParams({
                    votingPeriod: votingPeriod,
                    votingDelay: votingDelay,
                    proposalThresholdBPS: proposalThresholdBPS_,
                    lastMinuteWindowInBlocks: LAST_MINUTE_BLOCKS,
                    objectionPeriodDurationInBlocks: OBJECTION_PERIOD_BLOCKS,
                    proposalUpdatablePeriodInBlocks: 0
                }),
                NounsDAOTypes.DynamicQuorumParams({
                    minQuorumVotesBPS: minQuorumVotesBPS,
                    maxQuorumVotesBPS: 2000,
                    quorumCoefficient: 10000
                })
            );
    }

    function setUp() public virtual override {
        super.setUp();

        tokenHolder = getAndLabelAddress('token holder');
        user1 = getAndLabelAddress('user1');
        user2 = getAndLabelAddress('user2');
        user3 = getAndLabelAddress('user3');
    }

    function setTotalSupply(uint256 totalSupply) public {
        mint(tokenHolder, totalSupply - nounsToken.totalSupply());

        // Burn extra nouns minted because of founder rewards
        while (nounsToken.totalSupply() > totalSupply) {
            uint256 lastId = nounsToken.totalSupply() - 1;

            vm.prank(minter);
            nounsToken.burn(lastId);
        }
    }
}

contract NounsDAOLogic3InflationHandling40TotalSupplyTest is NounsDAOLogicV3InflationHandlingTest {
    function setUp() public virtual override {
        super.setUp();

        setTotalSupply(40);
        assertEq(nounsToken.totalSupply(), 40);
    }

    function testSetsParametersCorrectly() public {
        assertEq(daoProxy.proposalThresholdBPS(), proposalThresholdBPS_);
        assertEq(daoProxy.getDynamicQuorumParamsAt(block.number).minQuorumVotesBPS, minQuorumVotesBPS);
    }

    function testProposalThresholdBasedOnTotalSupply() public {
        // 6.78% of 40 = 2.712, floored to 2
        assertEq(daoProxy.proposalThreshold(), 2);
    }

    function testMinimumQuorumVotes() public {
        // 11% of 40 = 4.4, floored to 4
        assertEq(daoProxy.minQuorumVotes(), 4);
    }

    function testRejectsIfProposingBelowThreshold() public {
        // Give user1 2 tokens, proposal requires 3
        vm.startPrank(tokenHolder);
        nounsToken.transferFrom(tokenHolder, user1, 1);
        nounsToken.transferFrom(tokenHolder, user1, 2);
        vm.stopPrank();

        vm.roll(block.number + 1);

        assertEq(nounsToken.getPriorVotes(user1, block.number - 1), 2);

        vm.expectRevert(NounsDAOProposals.VotesBelowProposalThreshold.selector);
        propose(user1, address(0), 0, '', '');
    }

    function testAllowsProposingIfAboveThreshold() public {
        // Give user1 3 tokens, proposal requires 3
        vm.startPrank(tokenHolder);
        nounsToken.transferFrom(tokenHolder, user1, 1);
        nounsToken.transferFrom(tokenHolder, user1, 2);
        nounsToken.transferFrom(tokenHolder, user1, 3);
        vm.stopPrank();

        vm.roll(block.number + 1);

        assertEq(nounsToken.getPriorVotes(user1, block.number - 1), 3);

        propose(user1, address(0), 0, '', '');
    }
}

abstract contract TotalSupply40WithAProposalState is NounsDAOLogicV3InflationHandlingTest {
    uint256 proposalId;

    function setUp() public virtual override {
        super.setUp();

        setTotalSupply(40);

        vm.startPrank(tokenHolder);
        // 3 votes to user1
        nounsToken.transferFrom(tokenHolder, user1, 1);
        nounsToken.transferFrom(tokenHolder, user1, 2);
        nounsToken.transferFrom(tokenHolder, user1, 3);

        // 3 votes to user2
        nounsToken.transferFrom(tokenHolder, user2, 11);
        nounsToken.transferFrom(tokenHolder, user2, 12);
        nounsToken.transferFrom(tokenHolder, user2, 13);

        // 5 votes to user3
        nounsToken.transferFrom(tokenHolder, user3, 21);
        nounsToken.transferFrom(tokenHolder, user3, 22);
        nounsToken.transferFrom(tokenHolder, user3, 23);
        nounsToken.transferFrom(tokenHolder, user3, 24);
        nounsToken.transferFrom(tokenHolder, user3, 25);
        vm.stopPrank();

        vm.roll(block.number + 1);

        assertEq(nounsToken.getPriorVotes(user1, block.number - 1), 3);

        proposalId = propose(user1, address(0), 0, '', '');
    }
}

contract InflationHandlingWithAProposalTest is TotalSupply40WithAProposalState {
    function testSetsProposalAttrbiutesCorrectly() public {
        assertEq(daoProxy.proposals(proposalId).proposalThreshold, 2);
        assertEq(daoProxy.proposals(proposalId).quorumVotes, 4);
    }
}

abstract contract SupplyIncreasedState is TotalSupply40WithAProposalState {
    function setUp() public virtual override {
        super.setUp();
        setTotalSupply(80);
    }
}

contract SupplyIncreasedStateTest is SupplyIncreasedState {
    function testQuorumAndProposalThresholdChangedBasedOnTotalSupply() public {
        // 6.78% of 80 = 5.424, floored to 5
        assertEq(daoProxy.proposalThreshold(), 5);

        // 11% of 80 = 8.88, floored to 8
        assertEq(daoProxy.minQuorumVotes(), 8);
    }

    function testRejectsProposalsPreviouslyAboveThresholdButNowBelowBecauseSupplyIncreased() public {
        vm.expectRevert(NounsDAOProposals.VotesBelowProposalThreshold.selector);
        propose(user1, address(0), 0, '', '');
    }

    function testDoesntChangePreviousProposalAttributes() public {
        assertEq(daoProxy.proposals(proposalId).proposalThreshold, 2);
        assertEq(daoProxy.proposals(proposalId).quorumVotes, 4);
    }

    function testProposalPassesWhenForVotesAboveQuorumAndAgainstVotes() public {
        vm.roll(block.number + 1);

        vm.prank(user1);
        daoProxy.castVote(proposalId, 1); // 3 votes
        vm.prank(user2);
        daoProxy.castVote(proposalId, 1); // 3 votes
        vm.prank(user3);
        daoProxy.castVote(proposalId, 0); // 5 votes

        assertEq(daoProxy.proposals(proposalId).forVotes, 6);
        assertEq(daoProxy.proposals(proposalId).againstVotes, 5);

        vm.roll(block.number + votingPeriod);

        assertEq(uint256(daoProxy.state(proposalId)), uint256(NounsDAOTypes.ProposalState.Succeeded));
    }
}
