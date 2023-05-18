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
    uint256 public cTypeProbability;
    uint256[] public cSkinProbability;
    uint256[] public cAccCountProbability;
    uint256 public accTypeCount;
    mapping(uint256 => uint256) public accExclusion; // i: acc index, excluded acc indexes as bitmap

    uint256[] accCountByType; // accessories count by punk type, acc type, joined with one byte chunks

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
        tmp = cTypeProbability;
        for (uint256 i = 0; tmp > 0; i ++) {
            if (partRandom <= tmp & 0xffffff) {
                seed.punkType = uint8(i);
                break;
            }
            tmp >>= 24;
        }

        // Pick up random skin tone
        partRandom = uint24(pseudorandomness >> 24);
        tmp = cSkinProbability[seed.punkType];
        for (uint256 i = 0; tmp > 0; i ++) {
            if (partRandom <= tmp & 0xffffff) {
                seed.skinTone = uint8(i);
                break;
            }
            tmp >>= 24;
        }

        // Pick up random accessory count
        partRandom = uint24(pseudorandomness >> 48);
        tmp = cAccCountProbability[seed.punkType];
        uint256 curAccCount = 0;
        for (uint256 i = 0; tmp > 0; i ++) {
            if (partRandom <= tmp & 0xffffff) {
                curAccCount = uint8(i);
                break;
            }
            tmp >>= 24;
        }

        // Pick random values for accessories
        pseudorandomness >>= 72;
        uint256 accCounts = accCountByType[seed.punkType];
        assert(accCounts > 0);
        seed.accessories = new Accessory[](curAccCount);
        uint256 remainingAccCount = 0;
        for (uint256 i = 0; i < accTypeCount; i ++) {
            remainingAccCount += (accCounts >> (i * 8)) & 0xff;
        }
        for (uint256 i = 0; i < curAccCount; i ++) {
            // just in case
            if (remainingAccCount == 0) {
                // todo
                break;
            }
            uint256 accSelection = pseudorandomness % remainingAccCount;
            pseudorandomness >>= 16;
            for (uint j = 0; j < accTypeCount; j ++) {
                // we loop until accSelection overflow, and it WILL overflow
                unchecked {
                    accSelection -= (accCounts >> (j * 8)) & 0xff;
                }
                if (accSelection > remainingAccCount) {
                    seed.accessories[i] = Accessory({
                        accType: uint16(j),
                        accId: uint16(accIdByType[seed.punkType][j][pseudorandomness % ((accCounts >> (j * 8)) & 0xff)])
                    });
                    pseudorandomness >>= 8;
                    uint256 accExclusiveGroup = accExclusion[j];
                    for (uint256 k = 0; k < accTypeCount; k ++) {
                        if ((accExclusiveGroup >> k) & 1 == 1) {
                            remainingAccCount -= (accCounts >> (k * 8)) & 0xff;
                            accCounts &= (0xff << (k * 8)) ^ 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
                        }
                    }
                    break;
                }
            }
        }

        seed.accessories = _sortAccessories(seed.accessories);
        return seed;
    }

    function _sortAccessories(Accessory[] memory accessories) internal pure returns (Accessory[] memory) {
        // all operations are safe
        unchecked {
            uint256[] memory accessoriesMap = new uint256[](15);
            for (uint256 i = 0 ; i < accessories.length; i ++) {
                // just check
                assert(accessoriesMap[accessories[i].accType] == 0);
                // 10_000 is a trick so filled entries are not zero
                accessoriesMap[accessories[i].accType] = 10_000 + accessories[i].accId;
            }

            Accessory[] memory sortedAccessories = new Accessory[](accessories.length);
            uint256 j = 0;
            for (uint256 i = 0 ; i < 15 ; i ++) {
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
        cTypeProbability = _calcProbability(probabilities);
    }

    function setSkinProbability(uint16 punkType, uint256[] calldata probabilities) external onlyOwner {
        while (cSkinProbability.length < punkType + 1) {
            cSkinProbability.push(0);
        }
        delete cSkinProbability[punkType];
        cSkinProbability[punkType] = _calcProbability(probabilities);
    }

    function setAccCountProbability(uint16 punkType, uint256[] calldata probabilities) external onlyOwner {
        while (cAccCountProbability.length < punkType + 1) {
            cAccCountProbability.push(0);
        }
        delete cAccCountProbability[punkType];
        cAccCountProbability[punkType] = _calcProbability(probabilities);
    }

    // group list
    // key: group, value: accessory type
    function setAccExclusion(uint256[] calldata _accExclusion) external onlyOwner {
        require(_accExclusion.length == accTypeCount, "NSeeder: A");
        for(uint256 i = 0; i < accTypeCount; i ++) {
            accExclusion[i] = _accExclusion[i];
        }
    }

    /**
     * @notice Sets: accCountByType, accTypeCount.
     * According to counts.
     */
    function setAccCountPerTypeAndPunk(uint256[][] memory counts) external onlyOwner {
        delete accCountByType;
        require(counts.length > 0, "NSeeder: B");
        uint256 count = counts[0].length;
        require(count < 32, "NSeeder: C");
        for(uint256 k = 0; k < counts.length; k ++) {
            require(counts[k].length == count, "NSeeder: D");
            uint256 accCounts = 0;
            for(uint256 i = 0; i < counts[k].length; i ++) {
                require(counts[k][i] < 256, "NSeeder: E");
                accCounts |= (1 << (i * 8)) * counts[k][i];
            }
            accCountByType.push(accCounts);
        }
        accTypeCount = count;
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

    function _calcProbability(
        uint256[] calldata probabilities
    ) internal pure returns (uint256) {
        uint256 cumulative = 0;
        uint256 probs;
        require(probabilities.length > 0, "NSeeder: F");
        require(probabilities.length < 11, "NSeeder: G");
        for(uint256 i = 0; i < probabilities.length; i ++) {
            cumulative += probabilities[i];
            probs += (cumulative * 0xffffff / 100000) << (i * 24);
        }
        require(cumulative == 100000, "Probability must be summed up 100000 ( 100.000% x1000 )");
        return probs;
    }
}
