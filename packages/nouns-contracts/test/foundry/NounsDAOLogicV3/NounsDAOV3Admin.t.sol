// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicV3BaseTest } from './NounsDAOLogicV3BaseTest.sol';
import { NounsDAOV3Admin } from '../../../contracts/governance/NounsDAOV3Admin.sol';
import { NounsDAOProxy } from '../../../contracts/governance/NounsDAOProxy.sol';

contract NounsDAOLogicV3AdminTest is NounsDAOLogicV3BaseTest {
    event ForkPeriodSet(uint256 oldForkPeriod, uint256 newForkPeriod);
    event ForkThresholdSet(uint256 oldForkThreshold, uint256 newForkThreshold);
    event ERC20TokensToIncludeInForkSet(address[] oldErc20Tokens, address[] newErc20tokens);
    event ObjectionPeriodDurationSet(
        uint32 oldObjectionPeriodDurationInBlocks,
        uint32 newObjectionPeriodDurationInBlocks
    );
    event ProposalUpdatablePeriodSet(
        uint32 oldProposalUpdatablePeriodInBlocks,
        uint32 newProposalUpdatablePeriodInBlocks
    );

    address[] tokens;

    function test_setForkPeriod_onlyAdmin() public {
        vm.expectRevert(NounsDAOV3Admin.AdminOnly.selector);
        dao._setForkPeriod(8 days);
    }

    function test_setForkPeriod_works() public {
        vm.prank(address(dao.timelock()));
        vm.expectEmit(true, true, true, true);
        emit ForkPeriodSet(7 days, 8 days);
        dao._setForkPeriod(8 days);

        assertEq(dao.forkPeriod(), 8 days);
    }

    function test_setForkPeriod_limitedByUpperBound() public {
        vm.startPrank(address(dao.timelock()));

        // doesn't revert
        dao._setForkPeriod(14 days);

        vm.expectRevert(NounsDAOV3Admin.ForkPeriodTooLong.selector);
        dao._setForkPeriod(14 days + 1);
    }

    function test_setForkPeriod_limitedByLowerBound() public {
        vm.startPrank(address(dao.timelock()));

        // doesn't revert
        dao._setForkPeriod(2 days);

        vm.expectRevert(NounsDAOV3Admin.ForkPeriodTooShort.selector);
        dao._setForkPeriod(2 days - 1);
    }

    function test_setForkThresholdBPS_onlyAdmin() public {
        vm.expectRevert(NounsDAOV3Admin.AdminOnly.selector);
        dao._setForkThresholdBPS(2000);
    }

    function test_setForkThresholdBPS_works() public {
        vm.prank(address(dao.timelock()));
        vm.expectEmit(true, true, true, true);
        emit ForkThresholdSet(2000, 1234);
        dao._setForkThresholdBPS(1234);

        assertEq(dao.forkThresholdBPS(), 1234);
    }

    function test_setErc20TokensToIncludeInFork_onlyAdmin() public {
        tokens = [address(1), address(2)];

        vm.expectRevert(NounsDAOV3Admin.AdminOnly.selector);
        dao._setErc20TokensToIncludeInFork(tokens);
    }

    function test_setErc20TokensToIncludeInFork_works() public {
        tokens = [address(1), address(2)];

        vm.prank(address(dao.timelock()));
        vm.expectEmit(true, true, true, true);
        emit ERC20TokensToIncludeInForkSet(new address[](0), tokens);
        dao._setErc20TokensToIncludeInFork(tokens);

        assertEq(dao.erc20TokensToIncludeInFork(), tokens);
    }

    function test_setErc20TokensToIncludeInFork_allowsEmptyArray() public {
        tokens = new address[](0);

        vm.prank(address(dao.timelock()));
        vm.expectEmit(true, true, true, true);
        emit ERC20TokensToIncludeInForkSet(new address[](0), tokens);
        dao._setErc20TokensToIncludeInFork(tokens);

        assertEq(dao.erc20TokensToIncludeInFork(), tokens);
    }

    function test_setErc20TokensToIncludeInFork_givenDuplicateAddressesInInput_reverts() public {
        address[] memory tokens = new address[](2);
        tokens[0] = address(42);
        tokens[1] = address(42);

        vm.prank(address(dao.timelock()));
        vm.expectRevert(NounsDAOV3Admin.DuplicateTokenAddress.selector);
        dao._setErc20TokensToIncludeInFork(tokens);
    }

    function test_setForkEscrow_onlyAdmin() public {
        vm.expectRevert(NounsDAOV3Admin.AdminOnly.selector);
        dao._setForkEscrow(address(1));
    }

    function test_setForkEscrow_works() public {
        vm.prank(address(dao.timelock()));
        dao._setForkEscrow(address(1));

        assertEq(address(dao.forkEscrow()), address(1));
    }

    function test_setTimelocks_onlyAdmin() public {
        vm.expectRevert(NounsDAOV3Admin.AdminOnly.selector);
        dao._setTimelocksAndAdmin(address(1), address(2), address(3));
    }

    function test_setTimelocks_works() public {
        vm.prank(address(dao.timelock()));
        dao._setTimelocksAndAdmin(address(1), address(2), address(3));

        assertEq(address(dao.timelock()), address(1));
        assertEq(address(dao.timelockV1()), address(2));
        assertEq(NounsDAOProxy(payable(address(dao))).admin(), address(3));
    }

    function test_setVoteSnapshotBlockSwitchProposalId_onlyAdmin() public {
        vm.expectRevert(NounsDAOV3Admin.AdminOnly.selector);
        dao._setVoteSnapshotBlockSwitchProposalId();
    }

    function test_setVoteSnapshotBlockSwitchProposalId_setsToNextProposalId() public {
        // overwrite proposalCount
        vm.store(address(dao), bytes32(uint256(8)), bytes32(uint256(100)));

        vm.prank(address(dao.timelock()));
        dao._setVoteSnapshotBlockSwitchProposalId();

        assertEq(dao.voteSnapshotBlockSwitchProposalId(), 101);
    }

    function test_setVoteSnapshotBlockSwitchProposalId_revertsIfCalledTwice() public {
        vm.prank(address(dao.timelock()));
        dao._setVoteSnapshotBlockSwitchProposalId();

        vm.prank(address(dao.timelock()));
        vm.expectRevert(NounsDAOV3Admin.VoteSnapshotSwitchAlreadySet.selector);
        dao._setVoteSnapshotBlockSwitchProposalId();
    }

    function test_setObjectionPeriodDurationInBlocks_onlyAdmin() public {
        vm.expectRevert(NounsDAOV3Admin.AdminOnly.selector);
        dao._setObjectionPeriodDurationInBlocks(3 days / 12);
    }

    function test_setObjectionPeriodDurationInBlocks_worksForAdmin() public {
        uint32 blocks = 3 days / 12;
        vm.expectEmit(true, true, true, true);
        emit ObjectionPeriodDurationSet(10, blocks);

        vm.prank(address(dao.timelock()));
        dao._setObjectionPeriodDurationInBlocks(blocks);

        assertEq(dao.objectionPeriodDurationInBlocks(), blocks);
    }

    function test_setObjectionPeriodDurationInBlocks_givenValueAboveUpperBound_reverts() public {
        uint32 blocks = 8 days / 12;

        vm.prank(address(dao.timelock()));
        vm.expectRevert(NounsDAOV3Admin.InvalidObjectionPeriodDurationInBlocks.selector);
        dao._setObjectionPeriodDurationInBlocks(blocks);
    }

    function test_setProposalUpdatablePeriodInBlocks_onlyAdmin() public {
        vm.expectRevert(NounsDAOV3Admin.AdminOnly.selector);
        dao._setProposalUpdatablePeriodInBlocks(3 days / 12);
    }

    function test_setProposalUpdatablePeriodInBlocks_worksForAdmin() public {
        uint32 blocks = 3 days / 12;
        vm.expectEmit(true, true, true, true);
        emit ProposalUpdatablePeriodSet(10, blocks);

        vm.prank(address(dao.timelock()));
        dao._setProposalUpdatablePeriodInBlocks(blocks);

        assertEq(dao.proposalUpdatablePeriodInBlocks(), blocks);
    }

    function test_setProposalUpdatablePeriodInBlocks_givenValueAboveUpperBound_reverts() public {
        uint32 blocks = 8 days / 12;

        vm.prank(address(dao.timelock()));
        vm.expectRevert(NounsDAOV3Admin.InvalidProposalUpdatablePeriodInBlocks.selector);
        dao._setProposalUpdatablePeriodInBlocks(blocks);
    }
}
