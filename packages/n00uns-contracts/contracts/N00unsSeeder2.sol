// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.6;

import { IN00unsSeeder } from './interfaces/IN00unsSeeder.sol';
import { IN00unsDescriptorMinimal } from './interfaces/IN00unsDescriptorMinimal.sol';

contract N00unsSeeder2 is IN00unsSeeder {
    // Keeping track of predefined IDs for each part
    uint48[][] public predefinedBackgrounds;
    uint48[][] public predefinedBodies;
    uint48[][] public predefinedAccessories;
    uint48[][] public predefinedHeads;
    uint48[][] public predefinedGlasses;

   mapping(uint256 => bytes) public imgData;


    // Keeping track of unused combinations
    uint256[] private unusedCombinations;

    // Function to add predefined IDs
    function addPredefined(
        uint48[] calldata backgrounds,
        uint48[] calldata bodies,
        uint48[] calldata accessories,
        uint48[] calldata heads,
        uint48[] calldata glasses
    ) external {
        uint256 newIndex = predefinedBackgrounds.length;

        predefinedBackgrounds.push(backgrounds);
        predefinedBodies.push(bodies);
        predefinedAccessories.push(accessories);
        predefinedHeads.push(heads);
        predefinedGlasses.push(glasses);

        // Add the new combination to the unused list
        unusedCombinations.push(newIndex);
    }


    function setImgData(uint256 tokenId, bytes calldata data) external {
        imgData[tokenId] = data;
    }
   
    function generateSeed(uint256 n00unId, IN00unsDescriptorMinimal descriptor) external override returns (Seed memory) {
        require(unusedCombinations.length > 0, "No more predefined combinations available.");

        uint256 pseudorandomness = uint256(
            keccak256(abi.encodePacked(blockhash(block.number - 1), n00unId))
        );

        uint256 randomIndex = pseudorandomness % unusedCombinations.length;
        uint256 chosenIndex = unusedCombinations[randomIndex];

        // Remove the chosen combination from the unused list
        unusedCombinations[randomIndex] = unusedCombinations[unusedCombinations.length - 1];
        unusedCombinations.pop();

        // Return predefined Seed
        return Seed({
            background: predefinedBackgrounds[chosenIndex][0],
            body: predefinedBodies[chosenIndex][0],
            accessory: predefinedAccessories[chosenIndex][0],
            head: predefinedHeads[chosenIndex][0],
            glasses: predefinedGlasses[chosenIndex][0],
            imgData: imgData[n00unId]
        });
    }
}
