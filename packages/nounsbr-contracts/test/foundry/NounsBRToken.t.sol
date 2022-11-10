// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { NounsBRToken } from '../../contracts/NounsBRToken.sol';
import { NounsBRDescriptorV2 } from '../../contracts/NounsBRDescriptorV2.sol';
import { NounsBRSeeder } from '../../contracts/NounsBRSeeder.sol';
import { IProxyRegistry } from '../../contracts/external/opensea/IProxyRegistry.sol';
import { SVGRenderer } from '../../contracts/SVGRenderer.sol';
import { NounsBRArt } from '../../contracts/NounsBRArt.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';

contract NounsBRTokenTest is Test, DeployUtils {
    NounsBRToken nounsbrToken;
    address noundersbrDAO = address(1);
    address minter = address(2);

    function setUp() public {
        NounsBRDescriptorV2 descriptor = _deployAndPopulateV2();
        _populateDescriptorV2(descriptor);

        nounsbrToken = new NounsBRToken(noundersbrDAO, minter, descriptor, new NounsBRSeeder(), IProxyRegistry(address(0)));
    }

    function testSymbol() public {
        assertEq(nounsbrToken.symbol(), 'NOUNBR');
    }

    function testName() public {
        assertEq(nounsbrToken.name(), 'NounsBR');
    }

    function testMintANounBRToSelfAndRewardsNoundersBRDao() public {
        vm.prank(minter);
        nounsbrToken.mint();

        assertEq(nounsbrToken.ownerOf(0), noundersbrDAO);
        assertEq(nounsbrToken.ownerOf(1), minter);
    }

    function testRevertsOnNotMinterMint() public {
        vm.expectRevert('Sender is not the minter');
        nounsbrToken.mint();
    }
}
