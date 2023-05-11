// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';

import { NounsDAOForkEscrow, NounsDAOLike, NounsTokenLike } from '../../../../contracts/governance/fork/NounsDAOForkEscrow.sol';
import { ERC721Mock } from '../../helpers/ERC721Mock.sol';

contract NounsDAOMock is NounsDAOLike {
    address public token;

    constructor(address token_) {
        token = token_;
    }

    function nouns() external view override returns (NounsTokenLike) {
        return NounsTokenLike(token);
    }
}

abstract contract ZeroState is Test {
    NounsDAOForkEscrow escrow;
    ERC721Mock token = new ERC721Mock();
    address dao = address(new NounsDAOMock(address(token)));

    function setUp() public virtual {
        escrow = new NounsDAOForkEscrow(dao);
    }
}

contract ZeroStateTest is ZeroState {
    function test_numTokensInEscrow_isZero() public {
        assertEq(escrow.numTokensInEscrow(), 0);
    }

    function test_numTokensOwnedByDAO_isZero() public {
        assertEq(escrow.numTokensOwnedByDAO(), 0);
    }

    function test_markOwner_onlyDAO() public {
        vm.expectRevert(NounsDAOForkEscrow.OnlyDAO.selector);
        uint256[] memory tokenIds = new uint256[](0);
        escrow.markOwner(makeAddr('user1'), tokenIds);
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
        vm.prank(dao);
        escrow.withdrawTokensToDAO(tokenIds, makeAddr('timelock'));

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
        token.transferFrom(user1, address(escrow), 0);
        token.transferFrom(user1, address(escrow), 1);

        changePrank(dao);
        escrow.markOwner(user1, user1tokenIds);

        user2tokenIds = token.mintBatch(user2, 2);

        changePrank(user2);
        token.transferFrom(user2, address(escrow), 2);
        token.transferFrom(user2, address(escrow), 3);

        changePrank(dao);
        escrow.markOwner(user2, user2tokenIds);

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
        vm.prank(dao);
        escrow.returnTokensToOwner(user1, user1tokenIds);

        assertEq(token.ownerOf(0), user1);
        assertEq(token.ownerOf(1), user1);
    }

    function test_cannotUnescrowTokensOfOtherOwners() public {
        vm.prank(dao);
        vm.expectRevert(NounsDAOForkEscrow.NotOwner.selector);
        escrow.returnTokensToOwner(user1, user2tokenIds);
    }

    function test_daoCannotWithdrawTokensYet() public {
        vm.prank(dao);
        vm.expectRevert(NounsDAOForkEscrow.NotOwner.selector);
        escrow.withdrawTokensToDAO(user1tokenIds, makeAddr('timelock'));
    }
}

abstract contract OneUserUnescrowedState is TwoUsersEscrowedState {
    function setUp() public virtual override {
        super.setUp();
        vm.prank(dao);
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
        vm.prank(dao);
        escrow.returnTokensToOwner(user2, user2tokenIds);
    }
}

abstract contract EscrowClosedState is OneUserUnescrowedState {
    uint32 closedForkId;

    function setUp() public virtual override {
        super.setUp();
        vm.prank(dao);
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

    function test_canWithdrawTokensToDAO() public {
        vm.prank(dao);
        escrow.withdrawTokensToDAO(user2tokenIds, makeAddr('timelock'));

        assertEq(token.ownerOf(2), makeAddr('timelock'));
        assertEq(token.ownerOf(3), makeAddr('timelock'));
    }

    function test_cannotReturnTokensToOwner() public {
        vm.prank(dao);
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
        token.transferFrom(user1, address(escrow), 0);
        token.transferFrom(user1, address(escrow), 1);

        changePrank(dao);
        escrow.markOwner(user1, user1tokenIds);

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

    function test_canWithdrawTokensToDAO_fromPreviousFork() public {
        vm.prank(dao);
        escrow.withdrawTokensToDAO(user2tokenIds, makeAddr('timelock'));

        assertEq(token.ownerOf(2), makeAddr('timelock'));
        assertEq(token.ownerOf(3), makeAddr('timelock'));
    }

    function test_cannotWithdrawTokensToDAO_fromCurrentFork() public {
        vm.prank(dao);
        vm.expectRevert(NounsDAOForkEscrow.NotOwner.selector);
        escrow.withdrawTokensToDAO(user1tokenIds, makeAddr('timelock'));
    }

    function test_cannotReturnTokensToOwner_fromPreviousFork() public {
        vm.prank(dao);
        vm.expectRevert(NounsDAOForkEscrow.NotOwner.selector);
        escrow.returnTokensToOwner(user2, user2tokenIds);
    }

    function test_canReturnTokensToOwner_fromCurrentFork() public {
        vm.prank(dao);
        escrow.returnTokensToOwner(user1, user1tokenIds);
    }
}
