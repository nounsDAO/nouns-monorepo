// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';

import { NounsTokenFork } from '../../../../contracts/governance/fork/newdao/token/NounsTokenFork.sol';
import { INounsDAOForkEscrow, NounsTokenLike } from '../../../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsTokenLikeMock } from '../../helpers/NounsTokenLikeMock.sol';

contract NounsDAOForkEscrowMock {
    NounsTokenLikeMock token;

    constructor(NounsTokenLikeMock _token) {
        token = _token;
    }

    function nounsToken() external view returns (NounsTokenLike) {
        return token;
    }
}

contract NounsTokenForkTest is Test {
    NounsTokenFork token;

    address owner = makeAddr('owner');
    address minter = makeAddr('minter');
    address nounders = makeAddr('nounders');
    NounsDAOForkEscrowMock escrow;
    uint32 forkId = 1;
    uint256 startNounId = 123;
    uint256 tokensToClaim = 42;

    function setUp() public {
        NounsTokenLikeMock originalTokenMock = new NounsTokenLikeMock();
        originalTokenMock.setNoundersDAO(nounders);
        escrow = new NounsDAOForkEscrowMock(originalTokenMock);
        token = new NounsTokenFork();
        token.initialize(owner, minter, INounsDAOForkEscrow(address(escrow)), forkId, startNounId, tokensToClaim);
    }

    function test_setNoundersDAO_revertsGivenAddressZero() public {
        vm.expectRevert(abi.encodeWithSelector(NounsTokenFork.NoundersCannotBeAddressZero.selector));
        vm.prank(nounders);
        token.setNoundersDAO(address(0));
    }

    function test_setNoundersDAO_worksForNoundersSettingNonZeroAddress() public {
        vm.prank(nounders);
        token.setNoundersDAO(address(1));
    }
}
