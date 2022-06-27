// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { NounsToken } from '../../contracts/NounsToken.sol';
import { NounsDescriptor } from '../../contracts/NounsDescriptor.sol';
import { NounsSeeder } from '../../contracts/NounsSeeder.sol';
import { IProxyRegistry } from '../../contracts/external/opensea/IProxyRegistry.sol';

contract NounsTokenTest is Test {
    NounsToken nounsToken;
    NounsDescriptor descriptor;
    NounsSeeder seeder;
    IProxyRegistry proxyRegistry = IProxyRegistry(address(0));
    address noundersDAO = address(1);
    address minter = address(2);

    function setUp() public {
        descriptor = new NounsDescriptor();
        _populateDescriptor();
        seeder = new NounsSeeder();
        nounsToken = new NounsToken(noundersDAO, minter, descriptor, seeder, proxyRegistry);
    }

    function _populateDescriptor() internal {
        descriptor.addBackground('#000000');
        descriptor.addAccessory('aaa');
        descriptor.addBody('bbb');
        descriptor.addGlasses('ggg');
        descriptor.addHead('hhh');
    }

    function testSymbol() public {
        assertEq(nounsToken.symbol(), 'NOUN');
    }

    function testName() public {
        assertEq(nounsToken.name(), 'Nouns');
    }

    function testMintANounToSelfAndRewardsNoundersDao() public {
        vm.prank(minter);
        nounsToken.mint();

        assertEq(nounsToken.ownerOf(0), noundersDAO);
        assertEq(nounsToken.ownerOf(1), minter);
    }

    function testRevertsOnNotMinterMint() public {
        vm.expectRevert('Sender is not the minter');
        nounsToken.mint();
    }
}
