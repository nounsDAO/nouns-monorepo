// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { NounsDescriptor } from '../../../contracts/NounsDescriptor.sol';
import { NounsDescriptorV2 } from '../../../contracts/NounsDescriptorV2.sol';
import { Constants } from './Constants.sol';

abstract contract DescriptorHelpers is Test, Constants {
    function _populateDescriptor(NounsDescriptor descriptor) internal {
        // created with `npx hardhat descriptor-v1-export-abi`
        string memory filename = './test/foundry/files/descriptor_v1/image-data.abi';
        bytes memory content = readFile(filename);
        (
            string[] memory bgcolors,
            string[] memory palette,
            bytes[] memory bodies,
            bytes[] memory accessories,
            bytes[] memory heads,
            bytes[] memory glasses
        ) = abi.decode(content, (string[], string[], bytes[], bytes[], bytes[], bytes[]));

        descriptor.addManyBackgrounds(bgcolors);
        descriptor.addManyColorsToPalette(0, palette);
        descriptor.addManyBodies(bodies);
        descriptor.addManyAccessories(accessories);
        descriptor.addManyHeads(heads);
        descriptor.addManyGlasses(glasses);
    }

    function _populateDescriptorV2(NounsDescriptorV2 descriptor) internal {
        // created with `npx hardhat descriptor-art-to-console`
        (bytes memory palette, string[] memory backgrounds) = abi.decode(
            readFile('./test/foundry/files/descriptor_v2/paletteAndBackgrounds.abi'),
            (bytes, string[])
        );
        descriptor.setPalette(0, palette);
        descriptor.addManyBackgrounds(backgrounds);

        (bytes memory bodies, uint80 bodiesLength, uint16 bodiesCount) = abi.decode(
            readFile('./test/foundry/files/descriptor_v2/bodiesPage.abi'),
            (bytes, uint80, uint16)
        );
        descriptor.addBodies(bodies, bodiesLength, bodiesCount);

        (bytes memory heads, uint80 headsLength, uint16 headsCount) = abi.decode(
            readFile('./test/foundry/files/descriptor_v2/headsPage.abi'),
            (bytes, uint80, uint16)
        );
        descriptor.addHeads(heads, headsLength, headsCount);

        (bytes memory accessories, uint80 accessoriesLength, uint16 accessoriesCount) = abi.decode(
            readFile('./test/foundry/files/descriptor_v2/accessoriesPage.abi'),
            (bytes, uint80, uint16)
        );
        descriptor.addAccessories(accessories, accessoriesLength, accessoriesCount);

        (bytes memory glasses, uint80 glassesLength, uint16 glassesCount) = abi.decode(
            readFile('./test/foundry/files/descriptor_v2/glassesPage.abi'),
            (bytes, uint80, uint16)
        );
        descriptor.addGlasses(glasses, glassesLength, glassesCount);
    }

    function readFile(string memory filepath) internal returns (bytes memory output) {
        string[] memory inputs = new string[](2);
        inputs[0] = 'cat';
        inputs[1] = filepath;
        output = vm.ffi(inputs);
    }

    function getGlassesPage()
        public
        returns (
            bytes memory glasses,
            uint80 glassesLength,
            uint16 glassesCount
        )
    {
        return abi.decode(readFile('./test/foundry/files/descriptor_v2/glassesPage.abi'), (bytes, uint80, uint16));
    }
}
