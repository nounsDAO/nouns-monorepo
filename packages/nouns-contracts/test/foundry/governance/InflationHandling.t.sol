// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicSharedBaseTest } from '../helpers/NounsDAOLogicSharedBase.t.sol';
import { NounsDAOLogicV1 } from '../../../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOLogicV2 } from '../../../contracts/governance/NounsDAOLogicV2.sol';
import { NounsDAOProxyV2 } from '../../../contracts/governance/NounsDAOProxyV2.sol';
import { NounsDAOStorageV1, NounsDAOStorageV2 } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { Utils } from '../helpers/Utils.sol';

contract NounsDAOLogicV2InflationHandling is NounsDAOLogicSharedBaseTest, Utils {
    uint256 constant proposalThresholdBPS_ = 678; // 6.78%
    uint16 constant minQuorumVotesBPS = 1100; // 11%
    address tokenHolder;
    address user1;

    function daoVersion() internal pure override returns (uint256) {
        return 2;
    }

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

    function setUp() public override {
        super.setUp();

        tokenHolder = getAndLabelAddress('token holder');
        user1 = getAndLabelAddress('user1');

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

    function testAllowsProposingIfAboveTreshold() public {
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

    function setsProposalAttrbiutesCorrectly() public {
        // Give user1 3 tokens, proposal requires 3
        vm.startPrank(tokenHolder);
        nounsToken.transferFrom(tokenHolder, user1, 1);
        nounsToken.transferFrom(tokenHolder, user1, 2);
        nounsToken.transferFrom(tokenHolder, user1, 3);
        vm.stopPrank();

        vm.roll(block.number + 1);

        assertEq(nounsToken.getPriorVotes(user1, block.number - 1), 3);

        uint256 proposalId = propose(user1, address(0), 0, '', '');

        assertEq(daoProxyAsV2().proposals(proposalId).proposalThreshold, 2);
        assertEq(daoProxyAsV2().proposals(proposalId).quorumVotes, 4);
    }

    function setTotalSupply(uint256 totalSupply) public {
        mint(tokenHolder, 40);

        // Burn extra nouns minted because of founder rewards
        while (nounsToken.totalSupply() > totalSupply) {
            uint256 lastId = nounsToken.totalSupply() - 1;

            vm.prank(minter);
            nounsToken.burn(lastId);
        }
    }
}
