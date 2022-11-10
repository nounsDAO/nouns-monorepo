// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsBRDAOLogicSharedBaseTest } from '../helpers/NounsBRDAOLogicSharedBase.t.sol';
import { NounsBRDAOLogicV1 } from '../../../contracts/governance/NounsBRDAOLogicV1.sol';
import { NounsBRDAOLogicV2 } from '../../../contracts/governance/NounsBRDAOLogicV2.sol';
import { NounsBRDAOProxyV2 } from '../../../contracts/governance/NounsBRDAOProxyV2.sol';
import { NounsBRDAOStorageV1, NounsBRDAOStorageV2 } from '../../../contracts/governance/NounsBRDAOInterfaces.sol';
import { Utils } from '../helpers/Utils.sol';

abstract contract NounsBRDAOLogicV2InflationHandlingTest is NounsBRDAOLogicSharedBaseTest, Utils {
    uint256 constant proposalThresholdBPS_ = 678; // 6.78%
    uint16 constant minQuorumVotesBPS = 1100; // 11%
    address tokenHolder;
    address user1;
    address user2;
    address user3;

    function daoVersion() internal pure override returns (uint256) {
        return 2;
    }

    function deployDAOProxy() internal override returns (NounsBRDAOLogicV1) {
        NounsBRDAOLogicV2 daoLogic = new NounsBRDAOLogicV2();

        return
            NounsBRDAOLogicV1(
                payable(
                    new NounsBRDAOProxyV2(
                        address(timelock),
                        address(nounsbrToken),
                        vetoer,
                        admin,
                        address(daoLogic),
                        votingPeriod,
                        votingDelay,
                        proposalThresholdBPS_,
                        NounsBRDAOStorageV2.DynamicQuorumParams({
                            minQuorumVotesBPS: minQuorumVotesBPS,
                            maxQuorumVotesBPS: 2000,
                            quorumCoefficient: 10000
                        })
                    )
                )
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
        mint(tokenHolder, totalSupply - nounsbrToken.totalSupply());

        // Burn extra nounsbr minted because of founder rewards
        while (nounsbrToken.totalSupply() > totalSupply) {
            uint256 lastId = nounsbrToken.totalSupply() - 1;

            vm.prank(minter);
            nounsbrToken.burn(lastId);
        }
    }
}

contract NounsBRDAOLogicV2InflationHandling40TotalSupplyTest is NounsBRDAOLogicV2InflationHandlingTest {
    function setUp() public virtual override {
        super.setUp();

        setTotalSupply(40);
        assertEq(nounsbrToken.totalSupply(), 40);
    }

    function testSetsParametersCorrectly() public {
        assertEq(daoProxy.proposalThresholdBPS(), proposalThresholdBPS_);
        // assertEq(daoProxyAsV2().minQuorumVotesBPS(), minQuorumVotesBPS);

        assertEq(daoProxyAsV2().getDynamicQuorumParamsAt(block.number).minQuorumVotesBPS, minQuorumVotesBPS);
    }

    function testProposalThresholdBasedOnTotalSupply() public {
        // 6.78% of 40 = 2.712, floored to 2
        assertEq(daoProxy.proposalThreshold(), 2);
    }

    function testMinimumQuorumVotes() public {
        // 11% of 40 = 4.4, floored to 4
        assertEq(daoProxyAsV2().minQuorumVotes(), 4);
    }

    function testRejectsIfProposingBelowThreshold() public {
        // Give user1 2 tokens, proposal requires 3
        vm.startPrank(tokenHolder);
        nounsbrToken.transferFrom(tokenHolder, user1, 1);
        nounsbrToken.transferFrom(tokenHolder, user1, 2);
        vm.stopPrank();

        vm.roll(block.number + 1);

        assertEq(nounsbrToken.getPriorVotes(user1, block.number - 1), 2);

        vm.expectRevert('NounsBRDAO::propose: proposer votes below proposal threshold');
        propose(user1, address(0), 0, '', '');
    }

    function testAllowsProposingIfAboveTreshold() public {
        // Give user1 3 tokens, proposal requires 3
        vm.startPrank(tokenHolder);
        nounsbrToken.transferFrom(tokenHolder, user1, 1);
        nounsbrToken.transferFrom(tokenHolder, user1, 2);
        nounsbrToken.transferFrom(tokenHolder, user1, 3);
        vm.stopPrank();

        vm.roll(block.number + 1);

        assertEq(nounsbrToken.getPriorVotes(user1, block.number - 1), 3);

        propose(user1, address(0), 0, '', '');
    }
}

abstract contract TotalSupply40WithAProposalState is NounsBRDAOLogicV2InflationHandlingTest {
    uint256 proposalId;

    function setUp() public virtual override {
        super.setUp();

        setTotalSupply(40);

        vm.startPrank(tokenHolder);
        // 3 votes to user1
        nounsbrToken.transferFrom(tokenHolder, user1, 1);
        nounsbrToken.transferFrom(tokenHolder, user1, 2);
        nounsbrToken.transferFrom(tokenHolder, user1, 3);

        // 3 votes to user2
        nounsbrToken.transferFrom(tokenHolder, user2, 11);
        nounsbrToken.transferFrom(tokenHolder, user2, 12);
        nounsbrToken.transferFrom(tokenHolder, user2, 13);

        // 5 votes to user3
        nounsbrToken.transferFrom(tokenHolder, user3, 21);
        nounsbrToken.transferFrom(tokenHolder, user3, 22);
        nounsbrToken.transferFrom(tokenHolder, user3, 23);
        nounsbrToken.transferFrom(tokenHolder, user3, 24);
        nounsbrToken.transferFrom(tokenHolder, user3, 25);
        vm.stopPrank();

        vm.roll(block.number + 1);

        assertEq(nounsbrToken.getPriorVotes(user1, block.number - 1), 3);

        proposalId = propose(user1, address(0), 0, '', '');
    }
}

contract InflationHandlingWithAProposalTest is TotalSupply40WithAProposalState {
    function testSetsProposalAttrbiutesCorrectly() public {
        assertEq(daoProxyAsV2().proposals(proposalId).proposalThreshold, 2);
        assertEq(daoProxyAsV2().proposals(proposalId).quorumVotes, 4);
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
        assertEq(daoProxyAsV2().minQuorumVotes(), 8);
    }

    function testRejectsProposalsPreviouslyAboveThresholdButNowBelowBecauseSupplyIncreased() public {
        vm.expectRevert('NounsBRDAO::propose: proposer votes below proposal threshold');
        propose(user1, address(0), 0, '', '');
    }

    function testDoesntChangePreviousProposalAttributes() public {
        assertEq(daoProxyAsV2().proposals(proposalId).proposalThreshold, 2);
        assertEq(daoProxyAsV2().proposals(proposalId).quorumVotes, 4);
    }

    function testProposalPassesWhenForVotesAboveQuorumAndAgainstVotes() public {
        vm.roll(block.number + 1);

        vm.prank(user1);
        daoProxy.castVote(proposalId, 1); // 3 votes
        vm.prank(user2);
        daoProxy.castVote(proposalId, 1); // 3 votes
        vm.prank(user3);
        daoProxy.castVote(proposalId, 0); // 5 votes

        assertEq(daoProxyAsV2().proposals(proposalId).forVotes, 6);
        assertEq(daoProxyAsV2().proposals(proposalId).againstVotes, 5);

        vm.roll(block.number + votingPeriod);

        assertEq(uint256(daoProxy.state(proposalId)), uint256(NounsBRDAOStorageV1.ProposalState.Succeeded));
    }
}
