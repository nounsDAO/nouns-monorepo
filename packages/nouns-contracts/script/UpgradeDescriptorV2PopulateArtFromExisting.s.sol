// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { NounsDescriptorV2 } from '../contracts/NounsDescriptorV2.sol';
import { ISVGRenderer } from '../contracts/interfaces/ISVGRenderer.sol';
import { IInflator } from '../contracts/interfaces/IInflator.sol';
import { INounsArt } from '../contracts/interfaces/INounsArt.sol';
import { NounsArt } from '../contracts/NounsArt.sol';

contract UpgradeDescriptorV2PopulateArtFromExisting is Script {
    NounsDescriptorV2 public constant EXISTING_DESCRIPTOR = NounsDescriptorV2(0x6229c811D04501523C6058bfAAc29c91bb586268);
    ISVGRenderer public constant EXISTING_RENDERER = ISVGRenderer(0x81d94554A4b072BFcd850205f0c79e97c92aab56);
    IInflator public constant EXISTING_INFLATOR = IInflator(0xa2acee85Cd81c42BcAa1FeFA8eD2516b68872Dbe);
    NounsArt public constant EXISTING_ART = NounsArt(0x48A7C62e2560d1336869D6550841222942768C49);

    function run() external {
        uint256 upgraderKey = vm.envUint('UPGRADER_KEY');
        address upgrader = vm.addr(upgraderKey);

        address palettePointer = EXISTING_ART.palettesPointers(0);

        uint256 backgroundCount = EXISTING_DESCRIPTOR.backgroundCount();
        string[] memory backgrounds = new string[](backgroundCount);
        for (uint256 i = 0; i < backgroundCount; i++) {
            backgrounds[i] = EXISTING_ART.backgrounds(i);
        }

        INounsArt.Trait memory bodies = EXISTING_ART.getBodiesTrait();
        INounsArt.Trait memory accessories = EXISTING_ART.getAccessoriesTrait();
        INounsArt.Trait memory heads = EXISTING_ART.getHeadsTrait();
        INounsArt.Trait memory glasses = EXISTING_ART.getGlassesTrait();

        INounsArt predictedArt = INounsArt(computeCreateAddress(upgrader, vm.getNonce(upgrader) + 1));

        vm.startBroadcast(upgraderKey);

        // Deploy new contracts
        NounsDescriptorV2 descriptor = new NounsDescriptorV2(predictedArt, EXISTING_RENDERER);
        new NounsArt(address(descriptor), EXISTING_INFLATOR);

        // Populate new art contract using existing pointers
        descriptor.setPalettePointer(0, palettePointer);
        descriptor.addManyBackgrounds(backgrounds);

        for (uint256 i = 0; i < bodies.storagePages.length; i++) {
            descriptor.addBodiesFromPointer(
                bodies.storagePages[i].pointer,
                bodies.storagePages[i].decompressedLength,
                bodies.storagePages[i].imageCount
            );
        }
        for (uint256 i = 0; i < accessories.storagePages.length; i++) {
            descriptor.addAccessoriesFromPointer(
                accessories.storagePages[i].pointer,
                accessories.storagePages[i].decompressedLength,
                accessories.storagePages[i].imageCount
            );
        }
        for (uint256 i = 0; i < heads.storagePages.length; i++) {
            descriptor.addHeadsFromPointer(
                heads.storagePages[i].pointer,
                heads.storagePages[i].decompressedLength,
                heads.storagePages[i].imageCount
            );
        }
        for (uint256 i = 0; i < glasses.storagePages.length; i++) {
            descriptor.addGlassesFromPointer(
                glasses.storagePages[i].pointer,
                glasses.storagePages[i].decompressedLength,
                glasses.storagePages[i].imageCount
            );
        }
        vm.stopBroadcast();
    }
}
