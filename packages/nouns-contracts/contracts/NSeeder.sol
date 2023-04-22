// SPDX-License-Identifier: GPL-3.0

/// @title The NToken pseudo-random seed generator

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
import { IDescriptorMinimal } from './interfaces/IDescriptorMinimal.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

contract NSeeder is ISeeder, Ownable {
    /**
     * @notice Generate a pseudo-random Punk seed using the previous blockhash and punk ID.
     */
    // prettier-ignore
    uint24[] public cTypeProbability;
    uint24[][] public cSkinProbability;
    uint24[] public cAccCountProbability;
    uint256[] public accFlags;
    uint256 accTypeCount;
    mapping(uint256 => uint256) public accExclusiveGroupMapping; // i: acc index, group index
    uint256[][] accExclusiveGroup; // i: group id, j: acc index in a group

    uint256[][] accCountByType_; // accessories count by punk type, acc type
    uint256[][] accCountByType; // typeOrderSorted actually
    uint256[][] typeOrderSortedByCount; // [sorted_index] = real_group_id

    // punk type, acc type, acc order id => accId
    mapping(uint256 => mapping(uint256 => mapping(uint256 => uint256))) internal accIdByType; // not typeOrderSorted

    function generateSeed(uint256 punkId, uint256 salt) external view override returns (ISeeder.Seed memory) {
        uint256 pseudorandomness = uint256(
            keccak256(abi.encodePacked(blockhash(block.number - 1), punkId, salt))
        );
        return generateSeedFromNumber(pseudorandomness);
    }

    /**
     * @return a seed with sorted accessories
     * Public for test purposes.
     */
    function generateSeedFromNumber(uint256 pseudorandomness) public view returns (ISeeder.Seed memory) {
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
        tmp = cSkinProbability[seed.punkType].length;
        for(uint8 i = 0; i < tmp; i ++) {
            if(partRandom < cSkinProbability[seed.punkType][i]) {
                seed.skinTone = i;
                break;
            }
        }

        // Get possible groups for the current punk type
        tmp = uint16(accFlags[seed.punkType]); //punkType
        uint256[] memory usedGroupFlags = new uint256[](accExclusiveGroup.length);
        uint256 availableGroupCount = 0;
        for(uint8 acc = 0; tmp > 0; acc ++) {
            if(tmp & 0x01 == 1) {
                if(accCountByType_[seed.punkType][acc] != 0) {
                    uint256 group = accExclusiveGroupMapping[acc];
                    if(usedGroupFlags[group] == 0) {
                        availableGroupCount ++;
                        usedGroupFlags[group] = 1;
                    }
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
        uint256[] memory selectedRandomness = new uint256[](accTypeCount);
        for(uint i = 0; i < accTypeCount; i ++) {
            if(accCountByType[seed.punkType][i] == 0)
                selectedRandomness[i] = 0;
            else
                selectedRandomness[i] = uint16((pseudorandomness >> (i * 16)) % (accCountByType[seed.punkType][i] * 1000 - 1) + 1);
        }

        pseudorandomness >>= curAccCount * 16;
        seed.accessories = new Accessory[](curAccCount);

        tmp = 0; // accType
        uint maxValue = 0;
        for(uint i = 0; i < accExclusiveGroup.length; i ++)
            usedGroupFlags[i] = 0;
        for(uint i = 0; i < curAccCount; i ++) {
            tmp = 0;
            maxValue = 0;
            for(uint j = 0; j < accTypeCount; j ++) {
                if(usedGroupFlags[accExclusiveGroupMapping[typeOrderSortedByCount[seed.punkType][j]]] == 1) continue;

                if(maxValue >= accCountByType[seed.punkType][j] * 1000) break;
                if(maxValue < selectedRandomness[j]) {
                    maxValue = selectedRandomness[j];
                    tmp = j;
                }
            }

            uint256 accRand = uint8(pseudorandomness >> (i * 8)) % accCountByType[seed.punkType][tmp];
            uint256 accType = typeOrderSortedByCount[seed.punkType][tmp];
            usedGroupFlags[accExclusiveGroupMapping[accType]] = 1;
            seed.accessories[i] = Accessory({
                accType: uint16(accType),
                accId: uint16(accIdByType[seed.punkType][accType][accRand])
            });
        }

        seed.accessories = _sortAccessories(seed.accessories);
        return seed;
    }

    function _sortAccessories(Accessory[] memory accessories) internal pure returns (Accessory[] memory) {
        // all operations are safe
        unchecked {
            uint256[] memory accessoriesMap = new uint256[](14);
            for (uint256 i = 0 ; i < accessories.length; i ++) {
                // just check
                assert(accessoriesMap[accessories[i].accType] == 0);
                // 10_000 is a trick so filled entries are not zero
                accessoriesMap[accessories[i].accType] = 10_000 + accessories[i].accId;
            }

            Accessory[] memory sortedAccessories = new Accessory[](accessories.length);
            uint256 j = 0;
            for (uint256 i = 0 ; i < 14 ; i ++) {
                if (accessoriesMap[i] != 0) {
                    sortedAccessories[j] = Accessory(uint16(i), uint16(accessoriesMap[i] - 10_000));
                    j++;
                }
            }

            return sortedAccessories;
        }
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

    function setAccCountPerTypeAndPunk(uint256[][] memory counts) external {
        for(uint k = 0; k < counts.length; k ++) {
            accCountByType_.push();
            for(uint i = 0; i < counts[k].length; i ++) {
                accCountByType_[k].push(counts[k][i]);
            }
        }
        uint256[][] memory _typeOrderSortedByCount = new uint256[][](counts.length);
        for(uint k = 0; k < counts.length; k ++) {
            _typeOrderSortedByCount[k] = new uint256[](counts[k].length);
            for(uint i = 0; i < counts[k].length; i ++)
                _typeOrderSortedByCount[k][i] = i;
        }
        for(uint k = 0; k < counts.length; k ++) {
            for(uint i = 0; i < counts[k].length; i ++) {
                for(uint j = i + 1; j < counts[k].length; j ++) {
                    if(counts[k][i] < counts[k][j]) {
                        uint temp = counts[k][i];
                        counts[k][i] = counts[k][j];
                        counts[k][j] = temp;

                        temp = _typeOrderSortedByCount[k][i];
                        _typeOrderSortedByCount[k][i] = _typeOrderSortedByCount[k][j];
                        _typeOrderSortedByCount[k][j] = temp;
                    }
                }
            }
        }
        for(uint k = 0; k < counts.length; k ++) {
            typeOrderSortedByCount.push();
            accCountByType.push();
            for(uint i = 0; i < counts[k].length; i ++) {
                typeOrderSortedByCount[k].push(_typeOrderSortedByCount[k][i]);
                accCountByType[k].push(counts[k][i]);
            }
        }
    }

    function setAccIdByType(uint256[][][] memory accIds) external onlyOwner {
        for (uint256 i = 0 ; i < accIds.length ; i ++) {
            for (uint256 j = 0 ; j < accIds[i].length ; j ++) {
                for (uint256 k = 0 ; k < accIds[i][j].length ; k ++) {
                    accIdByType[i][j][k] = accIds[i][j][k];
                }
            }
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
