// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicBaseTest } from './NounsDAOLogicBaseTest.sol';
import { NounsDAOAdmin } from '../../../contracts/governance/NounsDAOAdmin.sol';
import { NounsDAOProxyV3 } from '../../../contracts/governance/NounsDAOProxyV3.sol';
import { INounsDAOLogic } from '../../../contracts/interfaces/INounsDAOLogic.sol';
import { NounsDAOTypes } from '../../../contracts/governance/NounsDAOInterfaces.sol';

contract NounsDAOLogicAdminTest is NounsDAOLogicBaseTest {
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

    function test__setVotingDelay_onlyAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
        dao._setVotingDelay(1);
    }

    function test__setVotingDelay_worksAndEmits() public {
        uint256 expectedValue = dao.votingDelay() + 1;

        vm.expectEmit(true, true, true, true);
        emit NounsDAOAdmin.VotingDelaySet(dao.votingDelay(), expectedValue);

        vm.prank(address(dao.timelock()));
        dao._setVotingDelay(expectedValue);

        assertEq(dao.votingDelay(), expectedValue);
    }

    function test__setVotingPeriod_onlyAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
        dao._setVotingPeriod(1);
    }

    function test__setVotingPeriod_worksAndEmits() public {
        uint256 expectedValue = dao.votingPeriod() + 1;

        vm.expectEmit(true, true, true, true);
        emit NounsDAOAdmin.VotingPeriodSet(dao.votingPeriod(), expectedValue);

        vm.prank(address(dao.timelock()));
        dao._setVotingPeriod(expectedValue);

        assertEq(dao.votingPeriod(), expectedValue);
    }

    function test__setProposalThresholdBPS_onlyAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
        dao._setProposalThresholdBPS(1);
    }

    function test__setProposalThresholdBPS_worksAndEmits() public {
        uint256 expectedValue = dao.proposalThresholdBPS() + 1;

        vm.expectEmit(true, true, true, true);
        emit NounsDAOAdmin.ProposalThresholdBPSSet(dao.proposalThresholdBPS(), expectedValue);

        vm.prank(address(dao.timelock()));
        dao._setProposalThresholdBPS(expectedValue);

        assertEq(dao.proposalThresholdBPS(), expectedValue);
    }

    function test__setObjectionPeriodDurationInBlocks_onlyAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
        dao._setObjectionPeriodDurationInBlocks(1);
    }

    function test__setObjectionPeriodDurationInBlocks_worksAndEmits() public {
        uint32 expectedValue = uint32(dao.objectionPeriodDurationInBlocks()) + 1;

        vm.expectEmit(true, true, true, true);
        emit ObjectionPeriodDurationSet(uint32(dao.objectionPeriodDurationInBlocks()), expectedValue);

        vm.prank(address(dao.timelock()));
        INounsDAOLogic(address(dao))._setObjectionPeriodDurationInBlocks(expectedValue);

        assertEq(uint32(dao.objectionPeriodDurationInBlocks()), expectedValue);
    }

    function test__setProposalUpdatablePeriodInBlocks_onlyAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
        dao._setProposalUpdatablePeriodInBlocks(1);
    }

    function test__setProposalUpdatablePeriodInBlocks_worksAndEmits() public {
        uint32 expectedValue = uint32(dao.proposalUpdatablePeriodInBlocks()) + 1;

        vm.expectEmit(true, true, true, true);
        emit ProposalUpdatablePeriodSet(uint32(dao.proposalUpdatablePeriodInBlocks()), expectedValue);

        vm.prank(address(dao.timelock()));
        INounsDAOLogic(address(dao))._setProposalUpdatablePeriodInBlocks(expectedValue);

        assertEq(uint32(dao.proposalUpdatablePeriodInBlocks()), expectedValue);
    }

    function test__setLastMinuteWindowInBlocks_onlyAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
        dao._setLastMinuteWindowInBlocks(1);
    }

    function test__setLastMinuteWindowInBlocks_worksAndEmits() public {
        uint32 expectedValue = uint32(dao.lastMinuteWindowInBlocks()) + 1;

        vm.expectEmit(true, true, true, true);
        emit NounsDAOAdmin.LastMinuteWindowSet(uint32(dao.lastMinuteWindowInBlocks()), expectedValue);

        vm.prank(address(dao.timelock()));
        INounsDAOLogic(address(dao))._setLastMinuteWindowInBlocks(expectedValue);

        assertEq(uint32(dao.lastMinuteWindowInBlocks()), expectedValue);
    }

    function test__setPendingAdmin_onlyAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
        dao._setPendingAdmin(address(1));
    }

    function test__acceptAdmin_givenZeroPendingAdmin_reverts() public {
        vm.expectRevert('NounsDAO::_acceptAdmin: pending admin only');
        dao._acceptAdmin();
    }

    function test__acceptAdmin_givenSenderNotPendingAdmin_reverts() public {
        vm.prank(address(dao.admin()));
        dao._setPendingAdmin(makeAddr('new pending admin'));

        vm.expectRevert('NounsDAO::_acceptAdmin: pending admin only');
        dao._acceptAdmin();
    }

    function test_changingAdmin_worksForAdmin() public {
        address newAdmin = makeAddr('new admin');
        address oldAdmin = address(dao.admin());
        assertNotEq(newAdmin, address(dao.admin()));

        vm.expectEmit(true, true, true, true);
        emit NounsDAOAdmin.NewPendingAdmin(address(0), newAdmin);

        vm.prank(address(dao.admin()));
        dao._setPendingAdmin(newAdmin);

        vm.expectEmit(true, true, true, true);
        emit NounsDAOAdmin.NewAdmin(oldAdmin, newAdmin);
        vm.expectEmit(true, true, true, true);
        emit NounsDAOAdmin.NewPendingAdmin(newAdmin, address(0));

        vm.prank(newAdmin);
        dao._acceptAdmin();

        assertEq(address(dao.admin()), newAdmin);
    }

    function test__setMinQuorumVotesBPS_onlyAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
        dao._setMinQuorumVotesBPS(1);
    }

    function test__setMinQuorumVotesBPS_worksAndEmits() public {
        NounsDAOTypes.DynamicQuorumParams memory oldParams = dao.getDynamicQuorumParamsAt(block.number);
        uint16 expectedValue = oldParams.minQuorumVotesBPS + 1;

        vm.expectEmit(true, true, true, true);
        emit NounsDAOAdmin.MinQuorumVotesBPSSet(oldParams.minQuorumVotesBPS, expectedValue);

        vm.prank(address(dao.timelock()));
        dao._setMinQuorumVotesBPS(expectedValue);

        NounsDAOTypes.DynamicQuorumParams memory newParams = dao.getDynamicQuorumParamsAt(block.number);
        assertEq(newParams.minQuorumVotesBPS, expectedValue);
    }

    function test__setMaxQuorumVotesBPS_onlyAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
        dao._setMaxQuorumVotesBPS(1);
    }

    function test__setMaxQuorumVotesBPS_worksAndEmits() public {
        NounsDAOTypes.DynamicQuorumParams memory oldParams = dao.getDynamicQuorumParamsAt(block.number);
        uint16 expectedValue = oldParams.maxQuorumVotesBPS + 1;

        vm.expectEmit(true, true, true, true);
        emit NounsDAOAdmin.MaxQuorumVotesBPSSet(oldParams.maxQuorumVotesBPS, expectedValue);

        vm.prank(address(dao.timelock()));
        dao._setMaxQuorumVotesBPS(expectedValue);

        NounsDAOTypes.DynamicQuorumParams memory newParams = dao.getDynamicQuorumParamsAt(block.number);
        assertEq(newParams.maxQuorumVotesBPS, expectedValue);
    }

    function test__setQuorumCoefficient_onlyAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
        dao._setQuorumCoefficient(1);
    }

    function test__setQuorumCoefficient_worksAndEmits() public {
        NounsDAOTypes.DynamicQuorumParams memory oldParams = dao.getDynamicQuorumParamsAt(block.number);
        uint32 expectedValue = oldParams.quorumCoefficient + 1;

        vm.expectEmit(true, true, true, true);
        emit NounsDAOAdmin.QuorumCoefficientSet(oldParams.quorumCoefficient, expectedValue);

        vm.prank(address(dao.timelock()));
        dao._setQuorumCoefficient(expectedValue);

        NounsDAOTypes.DynamicQuorumParams memory newParams = dao.getDynamicQuorumParamsAt(block.number);
        assertEq(newParams.quorumCoefficient, expectedValue);
    }

    function test__setDynamicQuorumParams_onlyAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
        dao._setDynamicQuorumParams(1, 1, 1);
    }

    function test__setDynamicQuorumParams_worksAndEmits() public {
        NounsDAOTypes.DynamicQuorumParams memory oldParams = dao.getDynamicQuorumParamsAt(block.number);
        NounsDAOTypes.DynamicQuorumParams memory expectedValue = NounsDAOTypes.DynamicQuorumParams({
            minQuorumVotesBPS: oldParams.minQuorumVotesBPS + 1,
            maxQuorumVotesBPS: oldParams.maxQuorumVotesBPS + 1,
            quorumCoefficient: oldParams.quorumCoefficient + 1
        });

        vm.expectEmit(true, true, true, true);
        emit NounsDAOAdmin.MinQuorumVotesBPSSet(oldParams.minQuorumVotesBPS, expectedValue.minQuorumVotesBPS);
        vm.expectEmit(true, true, true, true);
        emit NounsDAOAdmin.MaxQuorumVotesBPSSet(oldParams.maxQuorumVotesBPS, expectedValue.maxQuorumVotesBPS);
        vm.expectEmit(true, true, true, true);
        emit NounsDAOAdmin.QuorumCoefficientSet(oldParams.quorumCoefficient, expectedValue.quorumCoefficient);

        vm.prank(address(dao.timelock()));
        dao._setDynamicQuorumParams(
            expectedValue.minQuorumVotesBPS,
            expectedValue.maxQuorumVotesBPS,
            expectedValue.quorumCoefficient
        );

        NounsDAOTypes.DynamicQuorumParams memory newParams = dao.getDynamicQuorumParamsAt(block.number);
        assertEq(newParams.minQuorumVotesBPS, expectedValue.minQuorumVotesBPS);
        assertEq(newParams.maxQuorumVotesBPS, expectedValue.maxQuorumVotesBPS);
        assertEq(newParams.quorumCoefficient, expectedValue.quorumCoefficient);
    }

    function test__setForkDAODeployer_onlyAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
        dao._setForkDAODeployer(address(1));
    }

    function test__setForkDAODeployer_worksAndEmits() public {
        address expectedValue = makeAddr('new fork dao deployer');
        address oldValue = address(dao.forkDAODeployer());

        vm.expectEmit(true, true, true, true);
        emit NounsDAOAdmin.ForkDAODeployerSet(oldValue, expectedValue);

        vm.prank(address(dao.timelock()));
        dao._setForkDAODeployer(expectedValue);

        assertEq(address(dao.forkDAODeployer()), expectedValue);
    }

    function test_setForkPeriod_onlyAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
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

        vm.expectRevert(NounsDAOAdmin.ForkPeriodTooLong.selector);
        dao._setForkPeriod(14 days + 1);
    }

    function test_setForkPeriod_limitedByLowerBound() public {
        vm.startPrank(address(dao.timelock()));

        // doesn't revert
        dao._setForkPeriod(2 days);

        vm.expectRevert(NounsDAOAdmin.ForkPeriodTooShort.selector);
        dao._setForkPeriod(2 days - 1);
    }

    function test_setForkThresholdBPS_onlyAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
        dao._setForkThresholdBPS(2000);
    }

    function test_setForkThresholdBPS_works() public {
        vm.prank(address(dao.timelock()));
        vm.expectEmit(true, true, true, true);
        emit ForkThresholdSet(2000, 1234);
        dao._setForkThresholdBPS(1234);

        assertEq(dao.forkThresholdBPS(), 1234);
    }

    function test__setForkParams_onlyAdmin() public {
        address[] memory erc20s = new address[](0);
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
        dao._setForkParams(makeAddr('fork escrow'), makeAddr('fork DAO deployer'), erc20s, 1, 1);
    }

    function test__setForkParams_works() public {
        address[] memory erc20s = new address[](1);
        erc20s[0] = makeAddr('erc20');

        vm.startPrank(address(dao.timelock()));
        dao._setForkParams(
            makeAddr('fork escrow'),
            makeAddr('fork DAO deployer'),
            erc20s,
            NounsDAOAdmin.MIN_FORK_PERIOD + 1,
            42
        );
        vm.stopPrank();

        assertEq(address(dao.forkEscrow()), makeAddr('fork escrow'));
        assertEq(address(dao.forkDAODeployer()), makeAddr('fork DAO deployer'));
        assertEq(dao.erc20TokensToIncludeInFork().length, 1);
        assertEq(dao.erc20TokensToIncludeInFork()[0], erc20s[0]);
        assertEq(dao.forkPeriod(), NounsDAOAdmin.MIN_FORK_PERIOD + 1);
        assertEq(dao.forkThresholdBPS(), 42);
    }

    function test__zeroOutVoteSnapshotBlockSwitchProposalId_onlyAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
        dao._zeroOutVoteSnapshotBlockSwitchProposalId();
    }

    function test__zeroOutVoteSnapshotBlockSwitchProposalId_works() public {
        vm.prank(address(dao.timelock()));
        dao._zeroOutVoteSnapshotBlockSwitchProposalId();

        assertEq(dao.voteSnapshotBlockSwitchProposalId(), 0);
    }

    function test_setErc20TokensToIncludeInFork_onlyAdmin() public {
        tokens = [address(1), address(2)];

        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
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
        address[] memory tokens_ = new address[](2);
        tokens_[0] = address(42);
        tokens_[1] = address(42);

        vm.prank(address(dao.timelock()));
        vm.expectRevert(NounsDAOAdmin.DuplicateTokenAddress.selector);
        dao._setErc20TokensToIncludeInFork(tokens_);
    }

    function test_setForkEscrow_onlyAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
        dao._setForkEscrow(address(1));
    }

    function test_setForkEscrow_works() public {
        vm.prank(address(dao.timelock()));
        dao._setForkEscrow(address(1));

        assertEq(address(dao.forkEscrow()), address(1));
    }

    function test_setTimelocks_onlyAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
        dao._setTimelocksAndAdmin(address(1), address(2), address(3));
    }

    function test_setTimelocks_works() public {
        vm.prank(address(dao.timelock()));
        dao._setTimelocksAndAdmin(address(1), address(2), address(3));

        assertEq(address(dao.timelock()), address(1));
        assertEq(address(dao.timelockV1()), address(2));
        assertEq(NounsDAOProxyV3(payable(address(dao))).admin(), address(3));
    }

    function test_setObjectionPeriodDurationInBlocks_onlyAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
        INounsDAOLogic(address(dao))._setObjectionPeriodDurationInBlocks(3 days / 12);
    }

    function test_setObjectionPeriodDurationInBlocks_worksForAdmin() public {
        uint32 blocks = 3 days / 12;
        vm.expectEmit(true, true, true, true);
        emit ObjectionPeriodDurationSet(10, blocks);

        vm.prank(address(dao.timelock()));
        INounsDAOLogic(address(dao))._setObjectionPeriodDurationInBlocks(blocks);

        assertEq(dao.objectionPeriodDurationInBlocks(), blocks);
    }

    function test_setObjectionPeriodDurationInBlocks_givenValueAboveUpperBound_reverts() public {
        uint32 blocks = 8 days / 12;

        vm.prank(address(dao.timelock()));
        vm.expectRevert(NounsDAOAdmin.InvalidObjectionPeriodDurationInBlocks.selector);
        INounsDAOLogic(address(dao))._setObjectionPeriodDurationInBlocks(blocks);
    }

    function test_setProposalUpdatablePeriodInBlocks_onlyAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
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
        vm.expectRevert(NounsDAOAdmin.InvalidProposalUpdatablePeriodInBlocks.selector);
        dao._setProposalUpdatablePeriodInBlocks(blocks);
    }
}
