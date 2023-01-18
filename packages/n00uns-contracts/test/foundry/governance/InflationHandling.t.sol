// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { N00unsDAOLogicSharedBaseTest } from '../helpers/N00unsDAOLogicSharedBase.t.sol';
import { N00unsDAOLogicV1 } from '../../../contracts/governance/N00unsDAOLogicV1.sol';
import { N00unsDAOLogicV2 } from '../../../contracts/governance/N00unsDAOLogicV2.sol';
import { N00unsDAOProxyV2 } from '../../../contracts/governance/N00unsDAOProxyV2.sol';
import { N00unsDAOStorageV1, N00unsDAOStorageV2 } from '../../../contracts/governance/N00unsDAOInterfaces.sol';
import { Utils } from '../helpers/Utils.sol';

abstract contract N00unsDAOLogicV2InflationHandlingTest is N00unsDAOLogicSharedBaseTest, Utils {
    uint256 constant proposalThresholdBPS_ = 678; // 6.78%
    uint16 constant minQuorumVotesBPS = 1100; // 11%
    address tokenHolder;
    address user1;
    address user2;
    address user3;

    function daoVersion() internal pure override returns (uint256) {
        return 2;
    }

    function deployDAOProxy() internal override returns (N00unsDAOLogicV1) {
        N00unsDAOLogicV2 daoLogic = new N00unsDAOLogicV2();

        return
            N00unsDAOLogicV1(
                payable(
                    new N00unsDAOProxyV2(
                        address(timelock),
                        address(n00unsToken),
                        vetoer,
                        admin,
                        address(daoLogic),
                        votingPeriod,
                        votingDelay,
                        proposalThresholdBPS_,
                        N00unsDAOStorageV2.DynamicQuorumParams({
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
        mint(tokenHolder, totalSupply - n00unsToken.totalSupply());

        // Burn extra n00uns minted because of founder rewards
        while (n00unsToken.totalSupply() > totalSupply) {
            uint256 lastId = n00unsToken.totalSupply() - 1;

            vm.prank(minter);
            n00unsToken.burn(lastId);
        }
    }
}

contract N00unsDAOLogicV2InflationHandling40TotalSupplyTest is N00unsDAOLogicV2InflationHandlingTest {
    function setUp() public virtual override {
        super.setUp();

        setTotalSupply(40);
        assertEq(n00unsToken.totalSupply(), 40);
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
        n00unsToken.transferFrom(tokenHolder, user1, 1);
        n00unsToken.transferFrom(tokenHolder, user1, 2);
        vm.stopPrank();

        vm.roll(block.number + 1);

        assertEq(n00unsToken.getPriorVotes(user1, block.number - 1), 2);

        vm.expectRevert('N00unsDAO::propose: proposer votes below proposal threshold');
        propose(user1, address(0), 0, '', '');
    }

    function testAllowsProposingIfAboveTreshold() public {
        // Give user1 3 tokens, proposal requires 3
        vm.startPrank(tokenHolder);
        n00unsToken.transferFrom(tokenHolder, user1, 1);
        n00unsToken.transferFrom(tokenHolder, user1, 2);
        n00unsToken.transferFrom(tokenHolder, user1, 3);
        vm.stopPrank();

        vm.roll(block.number + 1);

        assertEq(n00unsToken.getPriorVotes(user1, block.number - 1), 3);

        propose(user1, address(0), 0, '', '');
    }
}

abstract contract TotalSupply40WithAProposalState is N00unsDAOLogicV2InflationHandlingTest {
    uint256 proposalId;

    function setUp() public virtual override {
        super.setUp();

        setTotalSupply(40);

        vm.startPrank(tokenHolder);
        // 3 votes to user1
        n00unsToken.transferFrom(tokenHolder, user1, 1);
        n00unsToken.transferFrom(tokenHolder, user1, 2);
        n00unsToken.transferFrom(tokenHolder, user1, 3);

        // 3 votes to user2
        n00unsToken.transferFrom(tokenHolder, user2, 11);
        n00unsToken.transferFrom(tokenHolder, user2, 12);
        n00unsToken.transferFrom(tokenHolder, user2, 13);

        // 5 votes to user3
        n00unsToken.transferFrom(tokenHolder, user3, 21);
        n00unsToken.transferFrom(tokenHolder, user3, 22);
        n00unsToken.transferFrom(tokenHolder, user3, 23);
        n00unsToken.transferFrom(tokenHolder, user3, 24);
        n00unsToken.transferFrom(tokenHolder, user3, 25);
        vm.stopPrank();

        vm.roll(block.number + 1);

        assertEq(n00unsToken.getPriorVotes(user1, block.number - 1), 3);

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
        vm.expectRevert('N00unsDAO::propose: proposer votes below proposal threshold');
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

        assertEq(uint256(daoProxy.state(proposalId)), uint256(N00unsDAOStorageV1.ProposalState.Succeeded));
    }
}
