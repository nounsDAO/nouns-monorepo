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
    mapping(uint256 => uint256) internal accExclusion; // i: acc index, excluded acc indexes as bitmap

    uint256[] internal accCountByType; // accessories count by punk type, acc type, joined with one byte chunks
    uint16[][] internal accTypeWeight; // accessory types sum of weight by punk type
    uint16[][][] internal accAggWeightByType; // accessory aggregated sum of weight by punk type and acc type

    // punk type, acc type, acc order id => accId
    mapping(uint256 => mapping(uint256 => mapping(uint256 => uint256))) internal accIdByType;

    // Whether the seeder can be updated
    bool public areProbabilitiesLocked;

    event ProbabilitiesLocked();

    modifier whenProbabilitiesNotLocked() {
        require(!areProbabilitiesLocked, 'Seeder probabilities are locked');
        _;
    }

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
        seed.accessories = new Accessory[](curAccCount);
        uint16[] memory currAccTypeWeights = accTypeWeight[seed.punkType];
        assert(currAccTypeWeights.length == accTypeCount);
        uint16[] memory currAggAccTypeWeights = new uint16[](currAccTypeWeights.length);
        for (uint256 i = 0; i < curAccCount; i ++) {
            // calculate currAggAccTypeWeights
            uint16 temp = 0; // need to save variables, solidity stack-to-deep error, temp is acc aggregated weight
            for (uint256 j = 0; j < accTypeCount; j ++) {
                temp += currAccTypeWeights[j];
                currAggAccTypeWeights[j] = temp;
            }
            // todo temp == 0 check
            // random number for acc type selection
            temp = uint16((pseudorandomness % temp) + 1); // temp is acc type random
            pseudorandomness >>= 16;
            // select acc type
            uint256 accType = 0;
            for (uint256 j = 0; j < accTypeCount; j ++) {
                if (temp <= currAggAccTypeWeights[j]) {
                    accType = j;
                    break;
                }
            }
            // random number for acc id selection
            uint16[] memory currAccAggWeight = accAggWeightByType[seed.punkType][accType];
            temp = uint16((pseudorandomness % (currAccAggWeight[currAccAggWeight.length - 1])) + 1); // temp is acc id random
            pseudorandomness >>= 8;
            // select acc accId
            uint256 accIdx = 0;
            for (uint256 j = 0; j < currAccAggWeight.length; j ++) {
                if (temp <= currAccAggWeight[j]) {
                    accIdx = j;
                    break;
                }
            }
            // set Accessory
            seed.accessories[i] = Accessory({
                accType: uint16(accType),
                accId: uint16(accIdByType[seed.punkType][accType][accIdx])
            });
            // apply exclusions
            uint256 accExclusiveGroup = accExclusion[accType];
            for (uint256 j = 0; j < accTypeCount; j ++) {
                if ((accExclusiveGroup >> j) & 1 == 1) {
                    currAccTypeWeights[j] = 0;
                }
            }
        }

        seed.accessories = _sortAccessories(seed.accessories);
        return seed;
    }

    function _sortAccessories(Accessory[] memory accessories) internal pure returns (Accessory[] memory) {
        // all operations are safe
        unchecked {
            uint256[] memory accessoriesMap = new uint256[](16);
            for (uint256 i = 0 ; i < accessories.length; i ++) {
                // just check
                assert(accessoriesMap[accessories[i].accType] == 0);
                // 10_000 is a trick so filled entries are not zero
                accessoriesMap[accessories[i].accType] = 10_000 + accessories[i].accId;
            }

            Accessory[] memory sortedAccessories = new Accessory[](accessories.length);
            uint256 j = 0;
            for (uint256 i = 0 ; i < 16 ; i ++) {
                if (accessoriesMap[i] != 0) {
                    sortedAccessories[j] = Accessory(uint16(i), uint16(accessoriesMap[i] - 10_000));
                    j++;
                }
            }

            return sortedAccessories;
        }
    }

    function setTypeProbability(uint256[] calldata probabilities) external onlyOwner whenProbabilitiesNotLocked {
        delete cTypeProbability;
        cTypeProbability = _calcProbability(probabilities);
    }

    function setSkinProbability(uint16 punkType, uint256[] calldata probabilities) external onlyOwner whenProbabilitiesNotLocked {
        while (cSkinProbability.length < punkType + 1) {
            cSkinProbability.push(0);
        }
        delete cSkinProbability[punkType];
        cSkinProbability[punkType] = _calcProbability(probabilities);
    }

    function setAccCountProbability(uint16 punkType, uint256[] calldata probabilities) external onlyOwner whenProbabilitiesNotLocked {
        while (cAccCountProbability.length < punkType + 1) {
            cAccCountProbability.push(0);
        }
        delete cAccCountProbability[punkType];
        cAccCountProbability[punkType] = _calcProbability(probabilities);
    }

    // group list
    // key: group, value: accessory type
    function setAccExclusion(uint256[] calldata _accExclusion) external onlyOwner whenProbabilitiesNotLocked {
        require(_accExclusion.length == accTypeCount, "NSeeder: A");
        for(uint256 i = 0; i < accTypeCount; i ++) {
            accExclusion[i] = _accExclusion[i];
        }
    }

    /**
     * @notice Sets: accCountByType, accTypeCount, accIdByType.
     * According to accIds.
     */
    function setAccIdByType(uint256[][][] memory accIds, uint256[][][] memory accWeights) external onlyOwner whenProbabilitiesNotLocked {
        delete accCountByType;
        delete accTypeWeight;
        delete accAggWeightByType;
        require(accIds.length > 0, "NSeeder: B");
        require(accIds.length == accWeights.length, "NSeeder: H");
        uint256 count = accIds[0].length; // count of accessory types
        require(count < 28, "NSeeder: C"); // beacuse of seedHash calculation
        for (uint256 i = 0 ; i < accIds.length ; i ++) {
            require(accIds[i].length == count, "NSeeder: D");
            require(accWeights[i].length == count, "NSeeder: I");
            uint256 accCounts = 0;
            uint16[] memory accTypeWeightForPunk = new uint16[](count);
            uint16[][] memory accAggWeightByTypeForPunk = new uint16[][](count);
            for (uint256 j = 0 ; j < accIds[i].length ; j ++) {
                require(accIds[i][j].length < 255, "NSeeder: E"); // 256 - 1, because of seedHash calculation
                require(accIds[i][j].length == accWeights[i][j].length, "NSeeder: J");
                accCounts |= (1 << (j * 8)) * accIds[i][j].length;
                uint16[] memory accAggWeightByTypeForPunkAndType = new uint16[](accWeights[i][j].length);
                uint16 currAccAggWeightByTypeForPunkAndType = 0;
                for (uint256 k = 0 ; k < accIds[i][j].length ; k ++) {
                    require(accWeights[i][j][k] < type(uint16).max, "NSeeder: K");
                    require(accWeights[i][j][k] > 0, "NSeeder: L");
                    accIdByType[i][j][k] = accIds[i][j][k];
                    currAccAggWeightByTypeForPunkAndType += uint16(accWeights[i][j][k]);
                    accAggWeightByTypeForPunkAndType[k] = currAccAggWeightByTypeForPunkAndType;
                }
                accTypeWeightForPunk[j] = currAccAggWeightByTypeForPunkAndType;
                accAggWeightByTypeForPunk[j] = accAggWeightByTypeForPunkAndType;
            }
            accCountByType.push(accCounts);
            accTypeWeight.push(accTypeWeightForPunk);
            accAggWeightByType.push(accAggWeightByTypeForPunk);
        }
        accTypeCount = count;
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

    /**
     * @notice Lock the seeder.
     * @dev This cannot be reversed and is only callable by the owner when not locked.
     */
    function lockProbabilities() external onlyOwner whenProbabilitiesNotLocked {
        areProbabilitiesLocked = true;
        emit ProbabilitiesLocked();
    }

}
