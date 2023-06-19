// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { VrbsToken } from '../../contracts/VrbsToken.sol';
import { Descriptor } from '../../contracts/Descriptor.sol';
import { DescriptorV2 } from '../../contracts/DescriptorV2.sol';
import { Seeder } from '../../contracts/Seeder.sol';
import { IProxyRegistry } from '../../contracts/external/opensea/IProxyRegistry.sol';
import { ISeeder } from '../../contracts/interfaces/ISeeder.sol';
import { Base64 } from 'base64-sol/base64.sol';

contract DescriptorUpgradeTest is Test, DeployUtils {
    VrbsToken vrbsToken;
    address minter = address(2);
    Descriptor descriptor;
    DescriptorV2 descriptorV2;

    function setUp() public {
        IProxyRegistry proxyRegistry = IProxyRegistry(address(0));
        address vrbsDAO = address(1);

        descriptor = new Descriptor();
        _populateDescriptor(descriptor);
        vrbsToken = new VrbsToken(vrbsDAO, minter, descriptor, new Seeder(), proxyRegistry);

        descriptorV2 = _deployAndPopulateV2();
    }

    function testUpgradeToV2MaintainsTokenURI() public {
        uint256 tokensToMint = 10;
        for (uint256 i = 0; i < tokensToMint; i++) {
            vm.prank(minter);
            vrbsToken.mint();
        }

        for (uint256 i = 0; i < tokensToMint; i++) {
            (, uint48 body, , uint48 head, uint48 glasses) = vrbsToken.seeds(i);
            if (
                body == 8 ||
                head == 11 ||
                head == 154 ||
                glasses == 8 ||
                glasses == 14 ||
                glasses == 18 ||
                glasses == 19
            ) {
                // these images were fixed prior to v2 deployment so not comparing these
                continue;
            }

            vrbsToken.setDescriptor(descriptor);
            string memory tokenURIwithV1 = vrbsToken.tokenURI(i);

            vrbsToken.setDescriptor(descriptorV2);
            string memory tokenURIwithV2 = vrbsToken.tokenURI(i);

            assertEq(tokenURIwithV2, tokenURIwithV1);
        }
    }

    /// @dev exports and html file with svgs to inspect manually. quite slow, so ignored by default
    function ignore_testSaveHtmlFileWithSvgs() public {
        DescriptorV2 d = _deployAndPopulateV2();
        uint256 max = d.headCount();
        for (uint256 i = 0; i < max; i++) {
            string memory svg = d.generateSVGImage(
                ISeeder.Seed({
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
