// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';

import { DeployUtilsFork } from '../../helpers/DeployUtilsFork.sol';
import { NounsTokenFork } from '../../../../contracts/governance/fork/newdao/token/NounsTokenFork.sol';
import { NounsDAOForkEscrowMock } from '../../helpers/NounsDAOForkEscrowMock.sol';
import { NounsTokenLikeMock } from '../../helpers/NounsTokenLikeMock.sol';
import { INounsSeeder } from '../../../../contracts/interfaces/INounsSeeder.sol';

contract NounsTokenForkTest is DeployUtilsFork {
    NounsTokenFork token;
    NounsTokenLikeMock originalToken;
    uint32 forkId;

    address treasury = makeAddr('treasury');
    address minter = makeAddr('minter');
    address originalDAO = makeAddr('original dao');

    function setUp() public {
        originalToken = new NounsTokenLikeMock();
        forkId = 1;
        NounsDAOForkEscrowMock escrow = new NounsDAOForkEscrowMock(forkId, originalDAO, originalToken);

        token = new NounsTokenFork();
        token.initialize(treasury, minter, escrow, forkId, 0, 0, block.timestamp + FORK_PERIOD);
    }

    function test_claimDuringForkPeriod_revertsForSenderOtherThanOriginalDAO() public {
        vm.expectRevert(abi.encodeWithSelector(NounsTokenFork.OnlyOriginalDAO.selector));
        vm.prank(makeAddr('not DAO'));
        token.claimDuringForkPeriod(makeAddr('recipient'), new uint256[](0));
    }

    function test_claimDuringForkPeriod_revertsAfterForkingPeriodEndTimestamp() public {
        vm.warp(token.forkingPeriodEndTimestamp() + 1);
        vm.prank(originalDAO);
        vm.expectRevert(abi.encodeWithSelector(NounsTokenFork.OnlyDuringForkingPeriod.selector));
        token.claimDuringForkPeriod(makeAddr('recipient'), new uint256[](0));
    }

    function test_claimDuringForkPeriod_mintsTokensSameIDsSameSeeds() public {
        address recipient = makeAddr('recipient');
        originalToken.setSeed(1, INounsSeeder.Seed(0, 1, 2, 3, 4));
        originalToken.setSeed(4, INounsSeeder.Seed(5, 6, 7, 8, 9));
        originalToken.setSeed(2, INounsSeeder.Seed(10, 11, 12, 13, 14));

        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = 1;
        tokenIds[1] = 4;
        tokenIds[2] = 2;

        vm.prank(originalDAO);
        token.claimDuringForkPeriod(recipient, tokenIds);

        assertEq(token.balanceOf(recipient), 3);
        assertEq(token.ownerOf(1), recipient);
        assertEq(token.ownerOf(4), recipient);
        assertEq(token.ownerOf(2), recipient);
        assertSeedEquals(getSeed(1), INounsSeeder.Seed(0, 1, 2, 3, 4));
        assertSeedEquals(getSeed(4), INounsSeeder.Seed(5, 6, 7, 8, 9));
        assertSeedEquals(getSeed(2), INounsSeeder.Seed(10, 11, 12, 13, 14));
    }

    function assertSeedEquals(INounsSeeder.Seed memory actual, INounsSeeder.Seed memory expected) internal {
        assertEqUint(expected.background, actual.background);
        assertEqUint(expected.body, actual.body);
        assertEqUint(expected.accessory, actual.accessory);
        assertEqUint(expected.head, actual.head);
        assertEqUint(expected.glasses, actual.glasses);
    }

    function getSeed(uint256 nounId) internal view returns (INounsSeeder.Seed memory) {
        (uint48 background, uint48 body, uint48 accessory, uint48 head, uint48 glasses) = token.seeds(nounId);
        return INounsSeeder.Seed(background, body, accessory, head, glasses);
    }
}
