import { expect } from 'chai';
import { keccak256 as solidityKeccak256 } from '@ethersproject/solidity';
import {
  shiftRightAndCast,
  getPseudorandomPart,
  getNounBRSeedFromBlockHash,
  getNounBRData,
} from '../src/index';
import { images } from '../src/image-data.json';
import { NounBRSeed } from '../src/types';

const { bodies, accessories, heads, glasses } = images;

describe('@nounbr/assets utils', () => {
  // Test against NounBR 116, created at block 13661786
  const NOUNBR116_ID = 116;
  const NOUNBR116_SEED: NounBRSeed = {
    background: 1,
    body: 28,
    accessory: 120,
    head: 95,
    glasses: 15,
  };
  const NOUNBR116_PREV_BLOCKHASH =
    '0x5014101691e81d79a2eba711e698118e1a90c9be7acb2f40d7f200134ee53e01';
  const NOUNBR116_PSEUDORANDOMNESS = solidityKeccak256(
    ['bytes32', 'uint256'],
    [NOUNBR116_PREV_BLOCKHASH, NOUNBR116_ID],
  );

  describe('shiftRightAndCast', () => {
    it('should work correctly', () => {
      expect(shiftRightAndCast(NOUNBR116_PREV_BLOCKHASH, 0, 48)).to.equal('0x00134ee53e01');
      expect(shiftRightAndCast(NOUNBR116_PREV_BLOCKHASH, 48, 48)).to.equal('0x7acb2f40d7f2');
    });
  });

  describe('getPseudorandomPart', () => {
    it('should match NounsBRSeeder.sol implementation for a pseudorandomly chosen part', () => {
      const headShift = 144;
      const { head } = NOUNBR116_SEED;
      expect(getPseudorandomPart(NOUNBR116_PSEUDORANDOMNESS, heads.length, headShift)).to.be.equal(
        head,
      );
    });
  });

  describe('getNounBRSeedFromBlockHash', () => {
    it('should match NounsBRSeeder.sol implementation for generating a NounBR seed', () => {
      expect(getNounBRSeedFromBlockHash(NOUNBR116_ID, NOUNBR116_PREV_BLOCKHASH)).to.deep.equal(
        NOUNBR116_SEED,
      );
    });
  });
});
