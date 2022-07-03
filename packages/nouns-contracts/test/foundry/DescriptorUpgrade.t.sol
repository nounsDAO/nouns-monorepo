// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { NounsToken } from '../../contracts/NounsToken.sol';
import { NounsDescriptor } from '../../contracts/NounsDescriptor.sol';
import { NounsDescriptorV2 } from '../../contracts/NounsDescriptorV2.sol';
import { NounsSeeder } from '../../contracts/NounsSeeder.sol';
import { IProxyRegistry } from '../../contracts/external/opensea/IProxyRegistry.sol';
import { INounsSeeder } from '../../contracts/interfaces/INounsSeeder.sol';
import { Base64 } from 'base64-sol/base64.sol';

contract DescriptorUpgradeTest is Test, DeployUtils {
    NounsToken nounsToken;
    address minter = address(2);
    NounsDescriptor descriptor;
    NounsDescriptorV2 descriptorV2;

    function setUp() public {
        IProxyRegistry proxyRegistry = IProxyRegistry(address(0));
        address noundersDAO = address(1);

        descriptor = new NounsDescriptor();
        _populateDescriptor(descriptor);
        nounsToken = new NounsToken(noundersDAO, minter, descriptor, new NounsSeeder(), proxyRegistry);

        descriptorV2 = _deployAndPopulateV2();
    }

    function testUpgradeToV2MaintainsTokenURI() public {
        for (uint256 i = 0; i < 10; i++) {
            vm.prank(minter);
            nounsToken.mint();
        }

        for (uint256 i = 0; i < 10; i++) {
            nounsToken.setDescriptor(descriptor);
            string memory tokenURIwithV1 = nounsToken.tokenURI(1);

            nounsToken.setDescriptor(descriptorV2);
            string memory tokenURIwithV2 = nounsToken.tokenURI(1);

            // both _populateDescriptor and _populateDescriptorV2 are hard-coded to populate
            // with the first item of each type found in image-data.json.
            assertEq(tokenURIwithV2, tokenURIwithV1);
        }
    }

    /// @dev exports and html file with svgs to inspect manually. quite slow, so ignored by default
    function ignore_testSaveHtmlFileWithSvgs() public {
        NounsDescriptorV2 d = _deployAndPopulateV2();
        uint256 max = d.headCount();
        for (uint256 i = 0; i < max; i++) {
            string memory svg = d.generateSVGImage(
                INounsSeeder.Seed({
                    background: uint48(i % d.backgroundCount()),
                    body: uint48(i % d.bodyCount()),
                    accessory: uint48(i % d.accessoryCount()),
                    head: uint48(i % d.headCount()),
                    glasses: uint48(i % d.glassesCount())
                })
            );

            string memory img = string.concat('<img src="data:image/svg+xml;base64,', svg, '">\n');

            string[] memory inputs = new string[](3);
            inputs[0] = './test/write-to-file.sh';
            inputs[1] = 'svgs.html';
            inputs[2] = img;
            vm.ffi(inputs);
        }
    }
}
