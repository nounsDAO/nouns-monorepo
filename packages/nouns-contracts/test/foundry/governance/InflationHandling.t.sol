// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicSharedBaseTest } from '../helpers/NounsDAOLogicSharedBase.t.sol';
import { NounsDAOLogicV1 } from '../../../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOLogicV2 } from '../../../contracts/governance/NounsDAOLogicV2.sol';
import { NounsDAOProxyV2 } from '../../../contracts/governance/NounsDAOProxyV2.sol';
import { NounsDAOStorageV1, NounsDAOStorageV2 } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { Utils } from '../helpers/Utils.sol';

abstract contract NounsDAOLogicV2InflationHandlingTest is NounsDAOLogicSharedBaseTest, Utils {
    uint256 constant proposalThresholdBPS_ = 678; // 6.78%
    uint16 constant minQuorumVotesBPS = 1100; // 11%
    address tokenHolder;
    address user1;
    address user2;
    address user3;

    function daoVersion() internal pure override returns (uint256) {
        return 2;
    }

    function deployDAOProxy(address timelock, address nounsToken, address vetoer) internal override returns (NounsDAOLogicV1) {
        NounsDAOLogicV2 daoLogic = new NounsDAOLogicV2();

        return
            NounsDAOLogicV1(
                payable(
                    new NounsDAOProxyV2(
                        timelock,
                        nounsToken,
                        vetoer,
                        admin,
                        address(daoLogic),
                        votingPeriod,
                        votingDelay,
                        proposalThresholdBPS_,
                        NounsDAOStorageV2.DynamicQuorumParams({
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
        mint(tokenHolder, totalSupply - nounsToken.totalSupply());

        // Burn extra nouns minted because of founder rewards
        while (nounsToken.totalSupply() > totalSupply) {
            uint256 lastId = nounsToken.totalSupply() - 1;

            vm.prank(minter);
            nounsToken.burn(lastId);
        }
    }
}

contract NounsDAOLogicV2InflationHandling40TotalSupplyTest is NounsDAOLogicV2InflationHandlingTest {
    function setUp() public virtual override {
        super.setUp();

        setTotalSupply(40);
        assertEq(nounsToken.totalSupply(), 40);
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
        nounsToken.transferFrom(tokenHolder, user1, 1);
        nounsToken.transferFrom(tokenHolder, user1, 2);
        vm.stopPrank();

        vm.roll(block.number + 1);

        assertEq(nounsToken.getPriorVotes(user1, block.number - 1), 2);

        vm.expectRevert('NounsDAO::propose: proposer votes below proposal threshold');
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

abstract contract TotalSupply40WithAProposalState is NounsDAOLogicV2InflationHandlingTest {
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
        vm.expectRevert('NounsDAO::propose: proposer votes below proposal threshold');
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

        assertEq(uint256(daoProxy.state(proposalId)), uint256(NounsDAOStorageV1.ProposalState.Succeeded));
    }
}
