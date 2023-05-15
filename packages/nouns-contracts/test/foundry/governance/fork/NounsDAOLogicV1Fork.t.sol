// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';

import { DeployUtilsFork } from '../../helpers/DeployUtilsFork.sol';
import { NounsDAOLogicV3 } from '../../../../contracts/governance/NounsDAOLogicV3.sol';
import { NounsToken } from '../../../../contracts/NounsToken.sol';
import { NounsTokenFork } from '../../../../contracts/governance/fork/newdao/token/NounsTokenFork.sol';
import { NounsDAOExecutorV2 } from '../../../../contracts/governance/NounsDAOExecutorV2.sol';
import { NounsDAOLogicV1Fork } from '../../../../contracts/governance/fork/newdao/governance/NounsDAOLogicV1Fork.sol';
import { NounsDAOStorageV1 } from '../../../../contracts/governance/fork/newdao/governance/NounsDAOStorageV1.sol';

abstract contract NounsDAOLogicV1ForkBase is DeployUtilsFork {
    NounsDAOLogicV1Fork dao;
    address timelock;
    NounsTokenFork token;
    address proposer = makeAddr('proposer');

    function setUp() public virtual {
        (address treasuryAddress, address tokenAddress, address daoAddress) = _deployForkDAO();
        dao = NounsDAOLogicV1Fork(daoAddress);
        token = NounsTokenFork(tokenAddress);
        timelock = treasuryAddress;

        // a block buffer so prop.startBlock - votingDelay might land on a valid block.
        // in the old way of calling getPriorVotes in vote casting.
        vm.roll(block.number + 1);

        vm.startPrank(token.minter());
        token.mint();
        token.transferFrom(token.minter(), proposer, 0);
        vm.stopPrank();

        vm.roll(block.number + 1);
    }

    function propose() internal returns (uint256) {
        return propose(address(1), 0, 'signature', '');
    }

    function propose(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data
    ) internal returns (uint256) {
        vm.prank(proposer);
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = value;
        string[] memory signatures = new string[](1);
        signatures[0] = signature;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = data;
        return dao.propose(targets, values, signatures, calldatas, 'my proposal');
    }
}

contract NounsDAOLogicV1Fork_votingDelayBugFix_Test is NounsDAOLogicV1ForkBase {
    uint256 proposalId;
    uint256 creationBlock;

    function setUp() public override {
        super.setUp();

        proposalId = propose();
        creationBlock = block.number;

        vm.roll(block.number + dao.votingDelay() + 1);
    }

    function test_propose_savesCreationBlockAsExpected() public {
        assertEq(dao.proposals(proposalId).creationBlock, creationBlock);
    }

    function test_proposeAndCastVote_voteCountedAsExpected() public {
        vm.prank(proposer);
        dao.castVote(proposalId, 1);

        assertEq(dao.proposals(proposalId).forVotes, 1);
    }

    function test_proposeAndCastVote_editingVotingDelayDoesntChangeVoteCount() public {
        vm.startPrank(address(dao.timelock()));
        dao._setVotingDelay(dao.votingDelay() + 3);

        changePrank(proposer);
        dao.castVote(proposalId, 1);

        assertEq(dao.proposals(proposalId).forVotes, 1);
    }
}

contract NounsDAOLogicV1Fork_cancelProposalUnderThresholdBugFix_Test is NounsDAOLogicV1ForkBase {
    uint256 proposalId;

    function setUp() public override {
        super.setUp();

        vm.prank(timelock);
        dao._setProposalThresholdBPS(1_000);

        vm.startPrank(token.minter());
        for (uint256 i = 0; i < 9; ++i) {
            token.mint();
        }
        token.transferFrom(token.minter(), proposer, 1);
        vm.stopPrank();
        vm.roll(block.number + 1);

        proposalId = propose();
    }

    function test_cancel_nonProposerCanCancelWhenProposerBalanceEqualsThreshold() public {
        vm.prank(proposer);
        token.transferFrom(proposer, address(1), 1);
        vm.roll(block.number + 1);
        assertEq(token.getPriorVotes(proposer, block.number - 1), dao.proposalThreshold());

        vm.prank(makeAddr('not proposer'));
        dao.cancel(proposalId);

        assertTrue(dao.proposals(proposalId).canceled);
    }

    function test_cancel_nonProposerCanCancelWhenProposerBalanceIsLessThanThreshold() public {
        vm.startPrank(proposer);
        token.transferFrom(proposer, address(1), 0);
        token.transferFrom(proposer, address(1), 1);
        vm.roll(block.number + 1);
        assertEq(token.getPriorVotes(proposer, block.number - 1), dao.proposalThreshold() - 1);

        changePrank(makeAddr('not proposer'));
        dao.cancel(proposalId);

        assertTrue(dao.proposals(proposalId).canceled);
    }

    function test_cancel_nonProposerCannotCancelWhenProposerBalanceIsGtThreshold() public {
        assertEq(token.getPriorVotes(proposer, block.number - 1), dao.proposalThreshold() + 1);

        vm.startPrank(makeAddr('not proposer'));
        vm.expectRevert('NounsDAO::cancel: proposer above threshold');
        dao.cancel(proposalId);
    }
}
