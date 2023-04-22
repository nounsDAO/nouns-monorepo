import { keccak256 as solidityKeccak256 } from '@ethersproject/solidity';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { ISeed, PunkData } from './types';
import { images/*, bgcolors*/ } from './image-data.json';
import probDoc from './config/probability.json'

const probs: any = probDoc
const { types, necks, cheekses, faces, beards, mouths, earses, hats, hairs, teeths, lipses, emotions, eyeses, glasseses, noses } = images;
const accResource = [ necks, cheekses, faces, lipses, emotions, beards, teeths, earses, hats, hairs, mouths, glasseses, eyeses, noses ]

export const type2PunkBasic = [
  { punkType: 0, skinTone: 0 },
  { punkType: 0, skinTone: 1 },
  { punkType: 0, skinTone: 2 },
  { punkType: 0, skinTone: 3 },
  { punkType: 1, skinTone: 0 },
  { punkType: 1, skinTone: 1 },
  { punkType: 1, skinTone: 2 },
  { punkType: 1, skinTone: 3 },
  { punkType: 2, skinTone: 6 },
  { punkType: 3, skinTone: 5 },
  { punkType: 4, skinTone: 4 }
]
const shortPunkType: any = {
  male: "m",
  female: "f",
  alien: "l",
  ape: "p",
  zombie: "z",
}
/**
 * Get encoded part and background information using a Noun seed
 * @param seed The Noun seed
 */

export const getPunkData = (seed: ISeed): PunkData => {
  const punkTypeChr = shortPunkType[probDoc.types[seed.punkType]]
  return {
    parts: [
      types[type2PunkBasic.findIndex((acc: any) => acc.punkType == seed.punkType && acc.skinTone == seed.skinTone)],
      ...seed.accessories.map(acc =>
        accResource[acc.accType][acc.accId]
      )
      // bodies[seed.body],
      // accessories[seed.accessory],
      // heads[seed.head],
      // glasses[seed.glasses],
    ],
//    background: bgcolors[seed.background],
  };
};

/**
 * Generate a random Noun seed
 * @param seed The Noun seed
 */
const pickRandom = (possibilities: Array<number>) => {
  const accumulated = [...possibilities];
  for (let i = 1; i < accumulated.length; i++)
    accumulated[i] = accumulated[i - 1] + possibilities[i];
  const max = accumulated[accumulated.length - 1];
  const randomness = Math.random() * max;
  return accumulated.findIndex((val) => val > randomness);
};
const groupByExclusive = (_accs: Array<any>, exclusive_groups: Array<any>) => {
  const accs = [..._accs];
  const res: Array<any> = [];
  exclusive_groups.forEach((exc, index) => {
    const group = exc.reduce((total: Array<any>, item: any) => {
      const idx = accs.indexOf(item);
      if (idx < 0) return total;
      accs.splice(idx, 1);
      total.push(item);
      return total;
    }, []);
    res.push(group);
    return res
  }, []);
  return res.concat(accs.map((item) => [item]));
};
export const getRandomPunkSeed = (): ISeed => {
  const typeProbabilities = Object.values(probs.probabilities).map((probObj: any) =>
    Math.floor(probObj.probability * 1000)
  );
  const punkType = pickRandom(typeProbabilities);
  const punkTypeName = probDoc.types[punkType];
  const skinTone = pickRandom(probs.probabilities[punkTypeName].skin);
  const availableAccs = probs.probabilities[punkTypeName].accessories;

  const groupedAccs = groupByExclusive(availableAccs, probs.exclusive_groups);
  const accCount = pickRandom(
    probs.accessory_count_probabbilities.slice(
      0,
      groupedAccs.length
    )
  );

  const countPerGroup = groupedAccs.map((group) => {
    return group
      .map(
        (item: any) =>
          accResource[Object.keys(probs.acc_types).indexOf(item)].length
      )
      .reduce((sum: number, val: number) => sum + val, 0);
  });
  const selectedGroups = [];
  for (let i = 0; i < accCount; i++) {
    const selectedGroup = pickRandom(countPerGroup);
    selectedGroups.push(selectedGroup);
    countPerGroup[selectedGroup] = 0;
  }

  const accessories = []
  for(let i in selectedGroups) {
    const currentGroup = groupedAccs[selectedGroups[i]]
    const selectedAccIndex = pickRandom(currentGroup.map((item: any) => accResource[Object.keys(probs.acc_types).indexOf(item)].length))
    const selectedAcc = Object.keys(probs.acc_types).indexOf(currentGroup[selectedAccIndex])
    accessories.push({ accType: selectedAcc, accId: Math.floor(Math.random() * accResource[selectedAcc].length) })
  }
  return {
    punkType,
    skinTone,
    accessories,
  };
};

/**
 * Emulate bitwise right shift and uint cast
 * @param value A Big Number
 * @param shiftAmount The amount to right shift
 * @param uintSize The uint bit size to cast to
 */
export const shiftRightAndCast = (
  value: BigNumberish,
  shiftAmount: number,
  uintSize: number,
): string => {
  const shifted = BigNumber.from(value).shr(shiftAmount).toHexString();
  return `0x${shifted.substring(shifted.length - uintSize / 4)}`;
};

/**
 * Emulates the NounsSeeder.sol methodology for pseudorandomly selecting a part
 * @param pseudorandomness Hex representation of a number
 * @param partCount The number of parts to pseudorandomly choose from
 * @param shiftAmount The amount to right shift
 * @param uintSize The size of the unsigned integer
 */
export const getPseudorandomPart = (
  pseudorandomness: string,
  partCount: number,
  shiftAmount: number,
  uintSize: number = 48,
): number => {
  const hex = shiftRightAndCast(pseudorandomness, shiftAmount, uintSize);
  return BigNumber.from(hex).mod(partCount).toNumber();
};

/**
 * Emulates the NounsSeeder.sol methodology for generating a Noun seed
 * @param nounId The Noun tokenId used to create pseudorandomness
 * @param blockHash The block hash use to create pseudorandomness
 */
export const getPunkSeedFromBlockHash = (punkId: BigNumberish, blockHash: string): ISeed => {
  const pseudorandomness = solidityKeccak256(['bytes32', 'uint256'], [blockHash, punkId]);
  return getRandomPunkSeed()
};
