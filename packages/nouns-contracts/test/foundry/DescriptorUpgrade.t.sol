// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { NounsToken } from '../../contracts/NounsToken.sol';
import { NounsDescriptor } from '../../contracts/NounsDescriptor.sol';
import { NounsDescriptorV2 } from '../../contracts/NounsDescriptorV2.sol';
import { NounsSeeder } from '../../contracts/NounsSeeder.sol';
import { IProxyRegistry } from '../../contracts/external/opensea/IProxyRegistry.sol';

contract DescriptorUpgradeTest is Test, DeployUtils {
    NounsToken nounsToken;

    function setUp() public {
        IProxyRegistry proxyRegistry = IProxyRegistry(address(0));
        address noundersDAO = address(1);
        address minter = address(2);

        NounsDescriptor descriptor = new NounsDescriptor();
        _populateDescriptor(descriptor);
        nounsToken = new NounsToken(noundersDAO, minter, descriptor, new NounsSeeder(), proxyRegistry);

        vm.prank(minter);
        nounsToken.mint();
    }

    function testUpgradeToV2MaintainsTokenURI() public {
        string memory tokenURIwithV1 = nounsToken.tokenURI(1);

        NounsDescriptorV2 descriptorV2 = _deployAndPopulateV2();
        _populateDescriptorV2(descriptorV2);
        nounsToken.setDescriptor(descriptorV2);

        string memory tokenURIwithV2 = nounsToken.tokenURI(1);

        // both _populateDescriptor and _populateDescriptorV2 are hard-coded to populate
        // with the first item of each type found in image-data.json.
        assertEq(tokenURIwithV2, tokenURIwithV1);
    }
}
