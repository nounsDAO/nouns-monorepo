// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import 'forge-std/StdJson.sol';
import { N00unsDescriptor } from '../../contracts/N00unsDescriptor.sol';
import { IN00unsSeeder } from '../../contracts/interfaces/IN00unsSeeder.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { Base64 } from 'base64-sol/base64.sol';
import { strings } from './lib/strings.sol';

contract N00unsDescriptorWithRealArtTest is DeployUtils {
    using strings for *;
    using stdJson for string;
    using Base64 for string;

    N00unsDescriptor descriptor;

    function setUp() public {
        descriptor = _deployAndPopulateDescriptor();
    }

    function testGeneratesValidTokenURI() public {
        string memory uri = descriptor.tokenURI(
            0,
            IN00unsSeeder.Seed({ background: 0, body: 0, accessory: 0, head: 0, glasses: 0 })
        );

        string memory json = string(removeDataTypePrefix(uri).decode());
        string memory imageDecoded = string(removeDataTypePrefix(json.readString('.image')).decode());
        strings.slice memory imageSlice = imageDecoded.toSlice();

        assertEq(json.readString('.name'), 'N00un 0');
        assertEq(json.readString('.description'), 'N00un 0 is a member of the N00uns DAO');
        assertEq(bytes(imageDecoded).length, 6849);
        assertTrue(
            imageSlice.startsWith(
                '<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">'
                    .toSlice()
            )
        );
        assertTrue(
            imageSlice.endsWith(
                '<rect width="60" height="10" x="100" y="160" fill="#ff638d" /><rect width="60" height="10" x="170" y="160" fill="#ff638d" /></svg>'
                    .toSlice()
            )
        );
    }
}
