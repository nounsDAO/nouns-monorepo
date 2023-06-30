// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicV3BaseTest } from './NounsDAOLogicV3BaseTest.sol';
import { ForkDAODeployerMock } from '../helpers/ForkDAODeployerMock.sol';
import { ERC20Mock } from '../helpers/ERC20Mock.sol';
import { NounsDAOV3Fork } from '../../../contracts/governance/fork/NounsDAOV3Fork.sol';
import { NounsDAOForkEscrow } from '../../../contracts/governance/fork/NounsDAOForkEscrow.sol';
import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import { INounsDAOForkEscrow } from '../../../contracts/governance/NounsDAOInterfaces.sol';

abstract contract DAOForkZeroState is NounsDAOLogicV3BaseTest {
    address tokenHolder = makeAddr('tokenHolder');
    address tokenHolder2 = makeAddr('tokenHolder2');
    uint256[] tokenIds;
    uint256[] proposalIds;
    ForkDAODeployerMock forkDAODeployer;
    ERC20Mock erc20Mock = new ERC20Mock();
    address[] erc20Tokens = [address(erc20Mock)];
    INounsDAOForkEscrow escrow;

    function setUp() public virtual override {
        super.setUp();

        forkDAODeployer = new ForkDAODeployerMock();
        vm.startPrank(address(timelock));
        dao._setForkDAODeployer(address(forkDAODeployer));
        dao._setErc20TokensToIncludeInFork(erc20Tokens);
        vm.stopPrank();

        // Seed treasury with 1000 ETH and 300e18 of an erc20 token
        deal(address(timelock), 1000 ether);
        erc20Mock.mint(address(timelock), 300e18);

        // Mint total of 20 tokens. 18 to token holder, 2 to nounders
        vm.startPrank(minter);
        while (nounsToken.totalSupply() < 20) {
            nounsToken.mint();
            nounsToken.transferFrom(minter, tokenHolder, nounsToken.totalSupply() - 1);
        }
        vm.stopPrank();
        assertEq(dao.nouns().balanceOf(tokenHolder), 18);

        escrow = dao.forkEscrow();
    }

    function assertOwnerOfTokens(
        address token,
        uint256[] memory tokenIds_,
        address owner
    ) internal {
        for (uint256 i = 0; i < tokenIds_.length; i++) {
            assertEq(IERC721(token).ownerOf(tokenIds_[i]), owner);
        }
    }
}

contract DAOForkZeroStateTest is DAOForkZeroState {
    function test_signalFork_transfersTokens() public {
        tokenIds = [1, 2, 3];

        vm.startPrank(tokenHolder);
        nounsToken.setApprovalForAll(address(dao), true);
        dao.escrowToFork(tokenIds, new uint256[](0), '');
        vm.stopPrank();

        assertEq(dao.nouns().balanceOf(tokenHolder), 15);
    }

    function test_escrowToForkEmitsEvent() public {
        tokenIds = [1, 2, 3];
        proposalIds = [4, 5, 6];

        vm.startPrank(tokenHolder);
        nounsToken.setApprovalForAll(address(dao), true);

        vm.expectEmit(true, true, true, true);
        emit NounsDAOV3Fork.EscrowedToFork(escrow.forkId(), tokenHolder, tokenIds, proposalIds, 'time to fork');
        dao.escrowToFork(tokenIds, proposalIds, 'time to fork');
    }

    function test_executeFork_reverts() public {
        vm.expectRevert(NounsDAOV3Fork.ForkThresholdNotMet.selector);
        dao.executeFork();
    }

    function test_joinFork_reverts() public {
        tokenIds = [4, 5];
        vm.expectRevert(NounsDAOV3Fork.ForkPeriodNotActive.selector);
        vm.prank(tokenHolder);
        dao.joinFork(tokenIds, new uint256[](0), '');
    }

    function test_withdrawDAONounsFromEscrow_onlyAdmin() public {
        vm.expectRevert(NounsDAOV3Fork.AdminOnly.selector);
        dao.withdrawDAONounsFromEscrowToTreasury(tokenIds);

        vm.expectRevert(NounsDAOV3Fork.AdminOnly.selector);
        dao.withdrawDAONounsFromEscrowIncreasingTotalSupply(tokenIds, address(1));
    }

    function test_givenThresholdSetToZero_requiresOneTokenInEscrowToFork() public {
        vm.prank(address(dao.timelock()));
        dao._setForkThresholdBPS(0);
        assertEq(escrow.numTokensInEscrow(), 0);

        vm.expectRevert(NounsDAOV3Fork.ForkThresholdNotMet.selector);
        dao.executeFork();

        tokenIds = [1];
        vm.startPrank(tokenHolder);
        nounsToken.setApprovalForAll(address(dao), true);
        dao.escrowToFork(tokenIds, new uint256[](0), '');
        vm.stopPrank();

        dao.executeFork();
    }
}

abstract contract DAOForkSignaledUnderThresholdState is DAOForkZeroState {
    function setUp() public virtual override {
        super.setUp();

        // signal fork with 3 tokens (15%)
        tokenIds = [1, 2, 3];

        vm.startPrank(tokenHolder);
        nounsToken.setApprovalForAll(address(dao), true);
        dao.escrowToFork(tokenIds, new uint256[](0), '');
        vm.stopPrank();
    }
}

contract DAOForkSignaledUnderThresholdStateTest is DAOForkSignaledUnderThresholdState {
    function test_executeFork_reverts() public {
        vm.expectRevert(NounsDAOV3Fork.ForkThresholdNotMet.selector);
        dao.executeFork();
    }

    function test_joinFork_reverts() public {
        tokenIds = [4, 5];
        vm.expectRevert(NounsDAOV3Fork.ForkPeriodNotActive.selector);
        vm.prank(tokenHolder);
        dao.joinFork(tokenIds, new uint256[](0), '');
    }

    function test_unsignalFork_returnsTokens() public {
        assertEq(dao.nouns().balanceOf(tokenHolder), 15);

        tokenIds = [1, 2, 3];

        vm.expectEmit(true, true, true, true);
        emit NounsDAOV3Fork.WithdrawFromForkEscrow(escrow.forkId(), tokenHolder, tokenIds);
        vm.prank(tokenHolder);
        dao.withdrawFromForkEscrow(tokenIds);

        assertEq(dao.nouns().balanceOf(tokenHolder), 18);
    }

    function test_unsignalForkWithDifferentTokens_reverts() public {
        // move Noun #7 to tokenHolder2
        vm.prank(tokenHolder);
        nounsToken.transferFrom(tokenHolder, tokenHolder2, 7);
        assertEq(dao.nouns().ownerOf(7), tokenHolder2);

        // tokenHolder2 signals fork with Noun #7
        vm.startPrank(tokenHolder2);
        nounsToken.approve(address(dao), 7);
        tokenIds = [7];
        dao.escrowToFork(tokenIds, new uint256[](0), '');
        vm.stopPrank();

        tokenIds = [7];
        vm.expectRevert(NounsDAOForkEscrow.NotOwner.selector);
        vm.prank(tokenHolder);
        dao.withdrawFromForkEscrow(tokenIds);
    }

    function test_withdrawTokens_reverts() public {
        tokenIds = [1];
        vm.startPrank(address(dao.timelock()));

        vm.expectRevert(NounsDAOForkEscrow.NotOwner.selector);
        dao.withdrawDAONounsFromEscrowToTreasury(tokenIds);

        vm.expectRevert(NounsDAOForkEscrow.NotOwner.selector);
        dao.withdrawDAONounsFromEscrowIncreasingTotalSupply(tokenIds, address(1));
    }
}

abstract contract DAOForkSignaledOverThresholdState is DAOForkSignaledUnderThresholdState {
    function setUp() public virtual override {
        super.setUp();

        // signal fork with 5 tokens (25%)
        tokenIds = [4, 5];

        vm.startPrank(tokenHolder);
        nounsToken.setApprovalForAll(address(dao), true);
        dao.escrowToFork(tokenIds, new uint256[](0), '');
        vm.stopPrank();
    }
}

contract DAOForkSignaledOverThresholdStateTest is DAOForkSignaledOverThresholdState {
    function test_increaseForkThreshold() public {
        vm.prank(address(dao.timelock()));
        dao._setForkThresholdBPS(3_000); // 30%

        vm.expectRevert(NounsDAOV3Fork.ForkThresholdNotMet.selector);
        dao.executeFork();

        // adjustedTotalSupply = 20
        // 30% of 20 = 6
        // 7 tokens are needed to execute fork
        tokenIds = [6, 7];
        vm.prank(tokenHolder);
        dao.escrowToFork(tokenIds, new uint256[](0), '');

        dao.executeFork();
    }

    function test_joinFork_reverts() public {
        tokenIds = [6, 7];
        vm.expectRevert(NounsDAOV3Fork.ForkPeriodNotActive.selector);
        vm.prank(tokenHolder);
        dao.joinFork(tokenIds, new uint256[](0), '');
    }

    event ETHSent(address indexed to, uint256 amount);
    event ERC20Sent(address indexed to, address indexed erc20Token, uint256 amount);

    function test_executeFork() public {
        vm.expectEmit(true, true, true, true);
        emit ETHSent(address(forkDAODeployer.mockTreasury()), 250 ether);
        vm.expectEmit(true, true, true, true);
        emit ERC20Sent(address(forkDAODeployer.mockTreasury()), address(erc20Mock), 75 ether);
        vm.expectEmit(true, true, true, true);
        emit NounsDAOV3Fork.ExecuteFork(
            0,
            forkDAODeployer.mockTreasury(),
            forkDAODeployer.mockToken(),
            block.timestamp + dao.forkPeriod(),
            5
        );
        dao.executeFork();

        // 25% of treasury should be sent to new DAO
        assertEq(address(timelock).balance, 750 ether);
        assertEq(address(forkDAODeployer.mockTreasury()).balance, 250 ether);

        // 25% of erc20 should be sent to new DAO
        assertEq(erc20Mock.balanceOf(address(timelock)), 225e18);
        assertEq(erc20Mock.balanceOf(address(forkDAODeployer.mockTreasury())), 75e18);
    }

    function test_executeFork_givenERC20ZeroBalance_doesNotCallTransfer() public {
        // zero out treasury's token balance
        vm.startPrank(address(timelock));
        erc20Mock.transfer(address(1), erc20Mock.balanceOf(address(timelock)));
        vm.stopPrank();

        erc20Mock.setWasTransferCalled(false);

        dao.executeFork();

        assertFalse(erc20Mock.wasTransferCalled());
    }

    function test_unsignalForkUnderThreshold_blocksExecuteFork() public {
        tokenIds = [1, 2, 3];

        vm.prank(tokenHolder);
        dao.withdrawFromForkEscrow(tokenIds);

        vm.expectRevert(NounsDAOV3Fork.ForkThresholdNotMet.selector);
        dao.executeFork();
    }

    function test_withdrawTokens_reverts() public {
        tokenIds = [1];
        vm.startPrank(address(dao.timelock()));

        vm.expectRevert(NounsDAOForkEscrow.NotOwner.selector);
        dao.withdrawDAONounsFromEscrowToTreasury(tokenIds);

        vm.expectRevert(NounsDAOForkEscrow.NotOwner.selector);
        dao.withdrawDAONounsFromEscrowIncreasingTotalSupply(tokenIds, address(1));
    }

    function test_proposalThresholdIsLowered() public {
        vm.prank(address(timelock));
        dao._setProposalThresholdBPS(1000); // 10%

        // Before fork execute
        assertEq(dao.proposalThreshold(), 2);

        dao.executeFork();

        // there are 20 tokens, but 5 are now the DAO's, so adjusted total supply is 15
        assertEq(dao.adjustedTotalSupply(), 15);
        assertEq(dao.proposalThreshold(), 1); // 1.5 tokens

        // check that 2 tokens are enough for proposing
        address someone = makeAddr('someone');
        vm.prank(tokenHolder);
        nounsToken.transferFrom(tokenHolder, someone, 13);
        vm.prank(tokenHolder);
        nounsToken.transferFrom(tokenHolder, someone, 14);
        vm.roll(block.number + 1);
        propose(someone, address(0), 0, '', '', '');
    }
}

abstract contract DAOForkExecutedState is DAOForkSignaledOverThresholdState {
    function setUp() public virtual override {
        super.setUp();

        dao.executeFork();
    }
}

contract DAOForkExecutedStateTest is DAOForkExecutedState {
    function test_signalFork_reverts() public {
        tokenIds = [8, 9];

        vm.expectRevert(NounsDAOV3Fork.ForkPeriodActive.selector);
        vm.prank(tokenHolder);
        dao.escrowToFork(tokenIds, new uint256[](0), '');
    }

    function test_executeFork_reverts() public {
        vm.expectRevert(NounsDAOV3Fork.ForkPeriodActive.selector);
        dao.executeFork();
    }

    function test_unsignalFork_reverts() public {
        tokenIds = [4, 5];

        vm.expectRevert(NounsDAOV3Fork.ForkPeriodActive.selector);
        vm.prank(tokenHolder);
        dao.withdrawFromForkEscrow(tokenIds);
    }

    function test_joinFork() public {
        tokenIds = [8, 9];
        proposalIds = [1, 2];

        vm.expectEmit(true, true, true, true);
        emit NounsDAOV3Fork.JoinFork(escrow.forkId() - 1, tokenHolder, tokenIds, proposalIds, 'some reason');
        vm.prank(tokenHolder);
        dao.joinFork(tokenIds, proposalIds, 'some reason');

        // now 35% of the treasury is in the new DAO
        assertEq(address(timelock).balance, 650 ether);
        assertEq(address(forkDAODeployer.mockTreasury()).balance, 350 ether);

        assertEq(erc20Mock.balanceOf(address(timelock)), 195e18);
        assertEq(erc20Mock.balanceOf(address(forkDAODeployer.mockTreasury())), 105e18);

        // 1 more token joins
        tokenIds = [7];
        vm.prank(tokenHolder);
        dao.joinFork(tokenIds, proposalIds, 'some reason');

        // now 40% of the treasury is in the new DAO
        assertEq(address(timelock).balance, 600 ether);
        assertEq(address(forkDAODeployer.mockTreasury()).balance, 400 ether);

        assertEq(erc20Mock.balanceOf(address(timelock)), 180e18);
        assertEq(erc20Mock.balanceOf(address(forkDAODeployer.mockTreasury())), 120e18);

        // Tokens are in the OG DAO timelock
        tokenIds = [7, 8, 9];
        assertOwnerOfTokens(address(dao.nouns()), tokenIds, address(timelock));

        // Timelock can move the tokens
        vm.startPrank(address(timelock));
        dao.nouns().transferFrom(address(timelock), address(1), 9);
        assertEq(dao.nouns().ownerOf(9), address(1));
    }

    function test_withdrawTokensToAddress() public {
        tokenIds = [1, 2, 3];
        vm.prank(address(dao.timelock()));
        vm.expectEmit(true, true, true, true);
        emit NounsDAOV3Fork.DAONounsSupplyIncreasedFromEscrow(3, address(1));
        dao.withdrawDAONounsFromEscrowIncreasingTotalSupply(tokenIds, address(1));

        assertEq(dao.nouns().ownerOf(1), address(1));
        assertEq(dao.nouns().ownerOf(2), address(1));
        assertEq(dao.nouns().ownerOf(3), address(1));
    }

    function test_withdrawTokensToTreasury() public {
        tokenIds = [1, 2, 3];
        vm.prank(address(dao.timelock()));
        dao.withdrawDAONounsFromEscrowToTreasury(tokenIds);

        assertEq(dao.nouns().ownerOf(1), address(dao.timelock()));
        assertEq(dao.nouns().ownerOf(2), address(dao.timelock()));
        assertEq(dao.nouns().ownerOf(3), address(dao.timelock()));
    }
}

abstract contract DAOForkExecutedActivePeriodOverState is DAOForkExecutedState {
    function setUp() public virtual override {
        super.setUp();

        skip(FORK_PERIOD);
    }
}

contract DAOForkExecutedActivePeriodOverStateTest is DAOForkExecutedActivePeriodOverState {
    function test_joinFork_reverts() public {
        tokenIds = [8, 9];

        vm.prank(tokenHolder);
        vm.expectRevert(NounsDAOV3Fork.ForkPeriodNotActive.selector);
        dao.joinFork(tokenIds, new uint256[](0), '');
    }

    function test_execute_reverts() public {
        vm.expectRevert(NounsDAOV3Fork.ForkThresholdNotMet.selector);
        dao.executeFork();
    }

    function test_withdrawTokens() public {
        tokenIds = [1, 2, 3];
        vm.prank(address(dao.timelock()));
        dao.withdrawDAONounsFromEscrowIncreasingTotalSupply(tokenIds, address(1));

        assertOwnerOfTokens(address(dao.nouns()), tokenIds, address(1));
    }

    function test_withdrawTokensToTreasury() public {
        tokenIds = [1, 2, 3];
        vm.prank(address(dao.timelock()));
        dao.withdrawDAONounsFromEscrowToTreasury(tokenIds);

        assertOwnerOfTokens(address(dao.nouns()), tokenIds, address(dao.timelock()));
    }

    function test_signalOnNewFork() public {
        tokenIds = [11, 12];
        vm.prank(tokenHolder);
        dao.escrowToFork(tokenIds, new uint256[](0), '');

        assertOwnerOfTokens(address(dao.nouns()), tokenIds, address(forkEscrow));
    }
}

abstract contract DAOSecondForkSignaledUnderThreshold is DAOForkExecutedActivePeriodOverState {
    function setUp() public virtual override {
        super.setUp();

        tokenIds = [11, 12];
        vm.prank(tokenHolder);
        dao.escrowToFork(tokenIds, new uint256[](0), '');
    }
}

contract DAOSecondForkSignaledUnderThresholdTest is DAOSecondForkSignaledUnderThreshold {
    function test_executeFork_reverts() public {
        vm.expectRevert(NounsDAOV3Fork.ForkThresholdNotMet.selector);
        dao.executeFork();
    }

    function test_joinFork_reverts() public {
        tokenIds = [14, 15];
        vm.expectRevert(NounsDAOV3Fork.ForkPeriodNotActive.selector);
        vm.prank(tokenHolder);
        dao.joinFork(tokenIds, new uint256[](0), '');
    }

    function test_unsignalFork_returnsTokens() public {
        tokenIds = [11, 12];
        assertOwnerOfTokens(address(dao.nouns()), tokenIds, address(forkEscrow));

        vm.prank(tokenHolder);
        dao.withdrawFromForkEscrow(tokenIds);

        assertOwnerOfTokens(address(dao.nouns()), tokenIds, tokenHolder);
    }

    function test_withdrawTokens_reverts() public {
        tokenIds = [11];
        vm.startPrank(address(dao.timelock()));

        vm.expectRevert(NounsDAOForkEscrow.NotOwner.selector);
        dao.withdrawDAONounsFromEscrowIncreasingTotalSupply(tokenIds, address(1));

        vm.expectRevert(NounsDAOForkEscrow.NotOwner.selector);
        dao.withdrawDAONounsFromEscrowToTreasury(tokenIds);
    }
}

abstract contract DAOSecondForkSignaledOverThreshold is DAOSecondForkSignaledUnderThreshold {
    function setUp() public virtual override {
        super.setUp();

        // adjusted total supply is 15, so for 20% 4 tokens are enough (15 * 0.2 = 3, and tokens in escrow need to be
        // greater than the threshold).
        tokenIds = [13, 14];
        vm.prank(tokenHolder);
        dao.escrowToFork(tokenIds, new uint256[](0), '');
    }
}

contract DAOSecondForkSignaledOverThresholdTest is DAOSecondForkSignaledOverThreshold {
    function test_executeFork() public {
        assertEq(address(timelock).balance, 750 ether);
        assertEq(dao.adjustedTotalSupply(), 15);

        dao.executeFork();

        // OG DAO should retain 73.333% of its funds
        // Since we have 4 Nouns in escrow out of 15
        // 1 - (4/15) = 0.73333333
        assertEq(address(timelock).balance, 550 ether);
        assertEq(address(forkDAODeployer.mockTreasury()).balance, 450 ether);

        assertEq(erc20Mock.balanceOf(address(timelock)), 165e18);
        assertEq(erc20Mock.balanceOf(address(forkDAODeployer.mockTreasury())), 135e18);

        tokenIds = [11, 12, 13];
        vm.prank(address(dao.timelock()));
        dao.withdrawDAONounsFromEscrowIncreasingTotalSupply(tokenIds, address(1));

        assertOwnerOfTokens(address(dao.nouns()), tokenIds, address(1));
    }
}

contract DAOFork_SendFundsFailureTest is DAOForkSignaledOverThresholdState {
    function test_givenERC20TransferFailure_reverts() public {
        erc20Mock.setFailNextTransfer(true);

        vm.expectRevert('SafeERC20: ERC20 operation did not succeed');
        dao.executeFork();
    }

    function test_givenETHTransferFailure_reverts() public {
        forkDAODeployer.setTreasury(address(new ETHBlocker()));

        vm.expectRevert('Address: unable to send value, recipient may have reverted');
        dao.executeFork();
    }
}

contract ETHBlocker {}
