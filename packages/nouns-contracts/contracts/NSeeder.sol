// SPDX-License-Identifier: GPL-3.0

/// @title The NounsToken pseudo-random seed generator

/*********************************
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░██░░░████░░██░░░████░░░ *
 * ░░██████░░░████████░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 *********************************/

pragma solidity ^0.8.6;

import { ISeeder } from './interfaces/ISeeder.sol';
import { INounsDescriptorMinimal } from './interfaces/IDescriptorMinimal.sol';

contract NounsSeeder is ISeeder {
    /**
     * @notice Generate a pseudo-random Noun seed using the previous blockhash and noun ID.
     */
    // prettier-ignore
    uint24[] public cTypeProbability;
    uint24[][] public cSkinProbability;
    uint24[] public cAccCountProbability;
    uint256[] public accFlags;
    uint256 accTypeCount;
    mapping(uint256 => uint256) public accExclusiveGroupMapping; // i: acc index, group index
    uint256[][] accExclusiveGroup; // i: group id, j: acc index in a group

    uint256[] accCountByType;
    uint256[] typeOrderSortedByCount; // [sorted_index] = real_group_id

    function generateSeed(uint256 nounId, INounsDescriptorMinimal descriptor) external view override returns (Seed memory) {
        uint256 pseudorandomness = uint256(
            keccak256(abi.encodePacked(blockhash(block.number - 1), nounId))
        );

        Seed memory seed;
        uint256 tmp;

        // Pick up random punk type
        uint24 partRandom = uint24(pseudorandomness);
        tmp = cTypeProbability.length;
        for(uint8 i = 0; i < tmp; i ++) {
            if(partRandom < cTypeProbability[i]) {
                seed.punkType = i;
                break;
            }
        }
        
        // Pick up random skin tone
        partRandom = uint24(pseudorandomness >> 24);
        tmp = cSkinProbability.length;
        for(uint8 i = 0; i < tmp; i ++) {
            if(partRandom < cSkinProbability[seed.punkType][i]) {
                seed.skinTone = i;
                break;
            }
        }

        // Get possible groups for the current punk type
        tmp = uint16(accFlags[seed.punkType]); //punkType
        uint256[] memory usedGroupFlags = new uint256[](accExclusiveGroup.length);
        uint256[] memory availableGroups = new uint256[](accExclusiveGroup.length);
        uint256 availableGroupCount = 0;
        for(uint8 acc = 0; tmp > 0; acc ++) {
            if(tmp & 0x01 == 1) {
                uint256 group = accExclusiveGroupMapping[acc];
                if(usedGroupFlags[group] == 0) {
                    availableGroups[availableGroupCount ++] = group;
                    usedGroupFlags[group] = 1;
                }
            }
            tmp >>= 1;
        }

        // Pick up random accessory count
        partRandom = uint24(pseudorandomness >> 48);
        uint16 curAccCount = 0;
        for(uint16 i = 0; i < availableGroupCount; i ++) {
            if(uint256(partRandom) * cAccCountProbability[availableGroupCount - 1] / 0xffffff < cAccCountProbability[i]) {
                curAccCount = i;
                break;
            }
        }

        pseudorandomness >>= 72;
        uint _accTypeCount = accTypeCount;
        uint256[] memory selectedRandomness = new uint256[](_accTypeCount);
        uint256[] memory typeUsed = new uint256[](_accTypeCount);
        for(uint i = 0; i < _accTypeCount; i ++) {
            selectedRandomness[i] = uint16((pseudorandomness >> (i * 16)) % (accCountByType[i] * 1000));
        }

        pseudorandomness >>= curAccCount * 16;
        seed.accessories = new Accessory[](curAccCount);

        tmp = 0; // accType
        uint maxValue = 0;
        for(uint i = 0; i < curAccCount; i ++) {
            tmp = 0;
            maxValue = 0;
            for(uint j = 0; j < _accTypeCount; j ++) {
                if(typeUsed[j] == 1) continue;
                if(maxValue >= accCountByType[j]) break;
                if(maxValue < selectedRandomness[j]) {
                    maxValue = selectedRandomness[j];
                    tmp = typeOrderSortedByCount[j];
                }
            }

            uint accRand = uint8(pseudorandomness >> (i * 8)) % accCountByType[tmp];
            seed.accessories[i] = Accessory({
                accType: uint16(tmp),
                accId: uint16(accRand)
            });
        }

        return seed;
    }
    function setTypeProbability(uint256[] calldata probabilities) external onlyOwner {
        delete cTypeProbability;
        _setProbability(cTypeProbability, probabilities);
    }
    function setSkinProbability(uint16 punkType, uint256[] calldata probabilities) external onlyOwner {
        while(cSkinProbability.length < punkType + 1)
            cSkinProbability.push(new uint24[](0));
        delete cSkinProbability[punkType];
        _setProbability(cSkinProbability[punkType], probabilities);
    }
    function setAccCountProbability(uint256[] calldata probabilities) external onlyOwner {
        delete cAccCountProbability;
        _setProbability(cAccCountProbability, probabilities);
    }

    function setAccAvailability(uint256 count, uint256[] calldata flags) external onlyOwner {
        // i = 0;1;2;3;4
        delete accFlags;
        for(uint256 i = 0; i < flags.length; i ++)
            accFlags.push(flags[i]);
        accTypeCount = count;
    }

    // group list
    // key: group, value: accessory type
    function setExclusiveAcc(uint256 groupCount, uint256[] calldata exclusives) external onlyOwner {
        delete accExclusiveGroup;
        for(uint256 i = 0; i < groupCount; i ++)
            accExclusiveGroup.push();
        for(uint256 i = 0; i < accTypeCount; i ++) {
            accExclusiveGroupMapping[i] = exclusives[i];
            accExclusiveGroup[exclusives[i]].push(i);
        }
    }

    function setAccCountPerType(uint256[] memory counts) external {
        uint256[] memory _typeOrderSortedByCount = new uint256[](counts.length);
        for(uint i = 0; i < counts.length; i ++)
            _typeOrderSortedByCount[i] = i;
        for(uint i = 0; i < counts.length; i ++) {
            for(uint j = i + 1; j < counts.length; j ++) {
                if(counts[i] < counts[j]) {
                    uint temp = counts[i];
                    counts[i] = counts[j];
                    counts[j] = temp;

                    temp = _typeOrderSortedByCount[i];
                    _typeOrderSortedByCount[i] = _typeOrderSortedByCount[j];
                    _typeOrderSortedByCount[j] = temp;
                }
            }
        }
        for(uint i = 0; i < counts.length; i ++) {
            typeOrderSortedByCount.push(_typeOrderSortedByCount[i]);
            accCountByType.push(counts[i]);
        }
    }


    function _setProbability(
        uint24[] storage cumulativeArray,
        uint256[] calldata probabilities
    ) internal {
        uint256 cumulative = 0;
        for(uint256 i = 0; i < probabilities.length; i ++) {
            cumulative += probabilities[i];
            cumulativeArray.push(uint24(cumulative * 0xffffff / 100000));
        }
        require(cumulative == 100000, "Probability must be summed up 100000 ( 100.000% x1000 )");
    }
}
