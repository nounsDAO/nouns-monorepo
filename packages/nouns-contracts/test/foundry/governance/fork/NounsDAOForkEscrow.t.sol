// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';

import { NounsDAOForkEscrow, NounsTokenLike } from '../../../../contracts/governance/fork/NounsDAOForkEscrow.sol';
import { ERC721Mock } from '../../helpers/ERC721Mock.sol';
import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';

contract DAOMock {
    IERC721 token;

    constructor(IERC721 token_) {
        token = token_;
    }

    function sendTokensToEscrow(address escrow, uint256[] memory tokenIds) public {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            token.safeTransferFrom(msg.sender, escrow, tokenIds[i]);
        }
    }
}

abstract contract ZeroState is Test {
    NounsDAOForkEscrow escrow;
    ERC721Mock token = new ERC721Mock();
    DAOMock dao;

    function setUp() public virtual {
        dao = new DAOMock(token);
        escrow = new NounsDAOForkEscrow(address(dao), address(token));
    }
}

contract ZeroStateTest is ZeroState {
    function test_numTokensInEscrow_isZero() public {
        assertEq(escrow.numTokensInEscrow(), 0);
    }

    function test_numTokensOwnedByDAO_isZero() public {
        assertEq(escrow.numTokensOwnedByDAO(), 0);
    }

    function test_onERC721Received_onlyNounsToken() public {
        vm.expectRevert(NounsDAOForkEscrow.OnlyNounsToken.selector);
        escrow.onERC721Received(address(0), address(0), 0, '');
    }

    function test_onERC721Received_onlyFromDAO() public {
        token.mint(address(this), 1234);

        vm.expectRevert(NounsDAOForkEscrow.OnlyDAO.selector);
        token.safeTransferFrom(address(this), address(escrow), 1234);
    }

    function test_returnTokensToOwner_onlyDAO() public {
        vm.expectRevert(NounsDAOForkEscrow.OnlyDAO.selector);
        uint256[] memory tokenIds = new uint256[](0);
        escrow.returnTokensToOwner(makeAddr('user1'), tokenIds);
    }

    function test_closeEscrow_onlyDAO() public {
        vm.expectRevert(NounsDAOForkEscrow.OnlyDAO.selector);
        escrow.closeEscrow();
    }

    function test_tokenIsSentToEscrowWithoutMarking() public {
        token.mint(address(escrow), 123);

        assertEq(token.ownerOf(123), address(escrow));
        assertEq(escrow.numTokensInEscrow(), 0);
        assertEq(escrow.numTokensOwnedByDAO(), 1);

        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = 123;
        vm.prank(address(dao));
        escrow.withdrawTokens(tokenIds, makeAddr('timelock'));

        assertEq(token.ownerOf(123), makeAddr('timelock'));
        assertEq(escrow.numTokensOwnedByDAO(), 0);
    }
}

abstract contract TwoUsersEscrowedState is ZeroState {
    address user1 = makeAddr('user1');
    address user2 = makeAddr('user2');
    uint256[] user1tokenIds;
    uint256[] user2tokenIds;

    function setUp() public virtual override {
        super.setUp();
        user1tokenIds = token.mintBatch(user1, 2);

        vm.startPrank(user1);
        token.setApprovalForAll(address(dao), true);
        dao.sendTokensToEscrow(address(escrow), user1tokenIds);

        user2tokenIds = token.mintBatch(user2, 2);

        changePrank(user2);
        token.setApprovalForAll(address(dao), true);
        dao.sendTokensToEscrow(address(escrow), user2tokenIds);

        vm.stopPrank();
    }
}

contract TwoUsersEscrowedStateTest is TwoUsersEscrowedState {
    function test_numTokensIsEscrow() public {
        assertEq(escrow.numTokensInEscrow(), 4);
    }

    function test_numTokensOwnedByDAO_isZero() public {
        assertEq(escrow.numTokensOwnedByDAO(), 0);
    }

    function test_canUnescrowToOwner() public {
        vm.prank(address(dao));
        escrow.returnTokensToOwner(user1, user1tokenIds);

        assertEq(token.ownerOf(0), user1);
        assertEq(token.ownerOf(1), user1);
    }

    function test_cannotUnescrowTokensOfOtherOwners() public {
        vm.prank(address(dao));
        vm.expectRevert(NounsDAOForkEscrow.NotOwner.selector);
        escrow.returnTokensToOwner(user1, user2tokenIds);
    }

    function test_daoCannotWithdrawTokensYet() public {
        vm.prank(address(dao));
        vm.expectRevert(NounsDAOForkEscrow.NotOwner.selector);
        escrow.withdrawTokens(user1tokenIds, makeAddr('timelock'));
    }
}

abstract contract OneUserUnescrowedState is TwoUsersEscrowedState {
    function setUp() public virtual override {
        super.setUp();
        vm.prank(address(dao));
        escrow.returnTokensToOwner(user1, user1tokenIds);
    }
}

contract OneUserUnescrowedStateTest is OneUserUnescrowedState {
    function test_numTokensIsEscrow() public {
        assertEq(escrow.numTokensInEscrow(), 2);
    }

    function test_numTokensOwnedByDAO_isZero() public {
        assertEq(escrow.numTokensOwnedByDAO(), 0);
    }

    function test_otherUserCanWithdraw() public {
        vm.prank(address(dao));
        escrow.returnTokensToOwner(user2, user2tokenIds);
    }
}

abstract contract EscrowClosedState is OneUserUnescrowedState {
    uint32 closedForkId;

    function setUp() public virtual override {
        super.setUp();
        vm.prank(address(dao));
        closedForkId = escrow.closeEscrow();
    }
}

contract EscrowClosedStateTest is EscrowClosedState {
    function test_numTokensIsEscrow() public {
        assertEq(escrow.numTokensInEscrow(), 0);
    }

    function test_numTokensOwnedByDAO_isZero() public {
        assertEq(escrow.numTokensOwnedByDAO(), 2);
    }

    function test_canWithdrawTokens() public {
        vm.prank(address(dao));
        escrow.withdrawTokens(user2tokenIds, makeAddr('timelock'));

        assertEq(token.ownerOf(2), makeAddr('timelock'));
        assertEq(token.ownerOf(3), makeAddr('timelock'));
    }

    function test_cannotReturnTokensToOwner() public {
        vm.prank(address(dao));
        vm.expectRevert(NounsDAOForkEscrow.NotOwner.selector);
        escrow.returnTokensToOwner(user2, user2tokenIds);
    }

    function test_ownerOfEscrowedToken() public {
        assertEq(escrow.ownerOfEscrowedToken(closedForkId, 0), address(0));
        assertEq(escrow.ownerOfEscrowedToken(closedForkId, 1), address(0));

        assertEq(escrow.ownerOfEscrowedToken(closedForkId, 2), user2);
        assertEq(escrow.ownerOfEscrowedToken(closedForkId, 3), user2);
    }
}

abstract contract EscrowedTokensAfterClosingState is EscrowClosedState {
    function setUp() public virtual override {
        super.setUp();

        vm.startPrank(user1);
        token.setApprovalForAll(address(dao), true);
        dao.sendTokensToEscrow(address(escrow), user1tokenIds);

        vm.stopPrank();
    }
}

contract EscrowedTokensAfterClosingStateTest is EscrowedTokensAfterClosingState {
    function test_numTokensIsEscrow() public {
        assertEq(escrow.numTokensInEscrow(), 2);
    }

    function test_numTokensOwnedByDAO_isZero() public {
        assertEq(escrow.numTokensOwnedByDAO(), 2);
    }

    function test_canWithdrawTokens_fromPreviousFork() public {
        vm.prank(address(dao));
        escrow.withdrawTokens(user2tokenIds, makeAddr('timelock'));

        assertEq(token.ownerOf(2), makeAddr('timelock'));
        assertEq(token.ownerOf(3), makeAddr('timelock'));
    }

    function test_cannotWithdrawTokens_fromCurrentFork() public {
        vm.prank(address(dao));
        vm.expectRevert(NounsDAOForkEscrow.NotOwner.selector);
        escrow.withdrawTokens(user1tokenIds, makeAddr('timelock'));
    }

    function test_cannotReturnTokensToOwner_fromPreviousFork() public {
        vm.prank(address(dao));
        vm.expectRevert(NounsDAOForkEscrow.NotOwner.selector);
        escrow.returnTokensToOwner(user2, user2tokenIds);
    }

    function test_canReturnTokensToOwner_fromCurrentFork() public {
        vm.prank(address(dao));
        escrow.returnTokensToOwner(user1, user1tokenIds);
    }
}
