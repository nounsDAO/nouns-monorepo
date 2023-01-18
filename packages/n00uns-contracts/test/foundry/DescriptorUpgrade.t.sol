// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { N00unsToken } from '../../contracts/N00unsToken.sol';
import { N00unsDescriptor } from '../../contracts/N00unsDescriptor.sol';
import { N00unsDescriptorV2 } from '../../contracts/N00unsDescriptorV2.sol';
import { N00unsSeeder } from '../../contracts/N00unsSeeder.sol';
import { IProxyRegistry } from '../../contracts/external/opensea/IProxyRegistry.sol';
import { IN00unsSeeder } from '../../contracts/interfaces/IN00unsSeeder.sol';
import { Base64 } from 'base64-sol/base64.sol';

contract DescriptorUpgradeTest is Test, DeployUtils {
    N00unsToken n00unsToken;
    address minter = address(2);
    N00unsDescriptor descriptor;
    N00unsDescriptorV2 descriptorV2;

    function setUp() public {
        IProxyRegistry proxyRegistry = IProxyRegistry(address(0));
        address n00undersDAO = address(1);

        descriptor = new N00unsDescriptor();
        _populateDescriptor(descriptor);
        n00unsToken = new N00unsToken(n00undersDAO, minter, descriptor, new N00unsSeeder(), proxyRegistry);

        descriptorV2 = _deployAndPopulateV2();
    }

    function testUpgradeToV2MaintainsTokenURI() public {
        uint256 tokensToMint = 10;
        for (uint256 i = 0; i < tokensToMint; i++) {
            vm.prank(minter);
            n00unsToken.mint();
        }

        for (uint256 i = 0; i < tokensToMint; i++) {
            (, uint48 body, , uint48 head, uint48 glasses) = n00unsToken.seeds(i);
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

            n00unsToken.setDescriptor(descriptor);
            string memory tokenURIwithV1 = n00unsToken.tokenURI(i);

            n00unsToken.setDescriptor(descriptorV2);
            string memory tokenURIwithV2 = n00unsToken.tokenURI(i);

            assertEq(tokenURIwithV2, tokenURIwithV1);
        }
    }

    /// @dev exports and html file with svgs to inspect manually. quite slow, so ignored by default
    function ignore_testSaveHtmlFileWithSvgs() public {
        N00unsDescriptorV2 d = _deployAndPopulateV2();
        uint256 max = d.headCount();
        for (uint256 i = 0; i < max; i++) {
            string memory svg = d.generateSVGImage(
                IN00unsSeeder.Seed({
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
