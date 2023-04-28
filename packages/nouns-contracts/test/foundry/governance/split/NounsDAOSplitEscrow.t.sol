// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';

import { NounsDAOSplitEscrow, NounsDAOLike, NounsTokenLike } from '../../../../contracts/governance/split/NounsDAOSplitEscrow.sol';
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

contract NounsDAOSplitEscrowTest is Test {
    NounsDAOSplitEscrow escrow;
    ERC721Mock token = new ERC721Mock();
    address dao = address(new NounsDAOMock(address(token)));
    uint256[] tokenIds;

    function setUp() public {
        escrow = new NounsDAOSplitEscrow(dao);
    }

    function test_markOwner_andReturn() public {
        tokenIds = [1, 2];
        token.mint(address(escrow), 1);
        token.mint(address(escrow), 2);

        vm.prank(dao);
        escrow.markOwner(makeAddr("user1"), tokenIds);

        vm.prank(dao);
        escrow.returnTokensToOwner(makeAddr("user1"), tokenIds);

        assertEq(token.ownerOf(1), makeAddr("user1"));
        assertEq(token.ownerOf(2), makeAddr("user1"));
    }

    function test_remembersWhoEscrowed_afterEscrowClosed() public {
        tokenIds = [1, 2];

        vm.prank(dao);
        escrow.markOwner(makeAddr("user1"), tokenIds);

        vm.prank(dao);
        uint32 splitId1 = escrow.closeEscrow();

        vm.prank(dao);
        escrow.markOwner(makeAddr("user2"), tokenIds);

        vm.prank(dao);
        uint32 splitId2 = escrow.closeEscrow();

        assertEq(splitId2, splitId1 + 1);
        
        assertEq(escrow.ownerOfEscrowedToken(splitId1, 1), makeAddr("user1"));
        assertEq(escrow.ownerOfEscrowedToken(splitId1, 2), makeAddr("user1"));

        assertEq(escrow.ownerOfEscrowedToken(splitId2, 1), makeAddr("user2"));
        assertEq(escrow.ownerOfEscrowedToken(splitId2, 2), makeAddr("user2"));
    }
}