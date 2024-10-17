import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { NounsDescriptorV3 } from '../typechain';
import ImageData from '../files/image-data-v2.json';
import ProposalImages from '../files/proposal-test-traits.json';
import { LongestPart } from './types';
import { deployNounsDescriptorV3, populateDescriptorV2 } from './utils';
import { ethers } from 'hardhat';

chai.use(solidity);
const { expect } = chai;

const hiprose =
  '0x000b1710070300062101000621030001210202022401210100012102020224052102020224032102020224052102020224032102020224022102000121020202240121010001210202022401210300062101000621';

describe('NounsDescriptorV3', () => {
  let nounsDescriptor: NounsDescriptorV3;
  let snapshotId: number;

  // Store the initial state of all glasses traits
  let initialGlassesCount: number;
  let initialGlassesTrait: string;
  let initialGlassesTraits: string[] = [];

  const glassesTraitIndex = 1;

  const updateGlassesTraits = async () => {
    const newEncodedCompressedTrait = ProposalImages[0].glasses?.encodedCompressed ?? '';
    const decompressedLength = ProposalImages[0].glasses?.originalLength ?? 0;
    const itemCount = ProposalImages[0].glasses?.itemCount ?? 0;

    console.log(`initialGlassesCount: ${initialGlassesCount}`);
    await nounsDescriptor.updateGlasses(newEncodedCompressedTrait, decompressedLength, itemCount, {
      gasLimit: 30000000,
    });

    const glassesCountAfter = await nounsDescriptor.glassesCount();
    const glassesAtIndex = await nounsDescriptor.glasses(glassesTraitIndex);

    console.log(`glassesCountAfter: ${glassesCountAfter}. Index0: ${glassesAtIndex}`);

    // Assert that the glasses count remains the same after the update
    expect(glassesCountAfter).to.equal(initialGlassesCount);
    expect(glassesAtIndex).to.equal(hiprose);
  };


  const storeInitialGlassesTraitState = async () => {
    initialGlassesCount = (await nounsDescriptor.glassesCount()).toNumber();
    initialGlassesTrait = await nounsDescriptor.glasses(glassesTraitIndex);
    initialGlassesTraits = await Promise.all(
      Array.from({ length: initialGlassesCount }, (_, i) => nounsDescriptor.glasses(i)),
    );
  };

  const part: LongestPart = {
    length: 0,
    index: 0,
  };
  const longest: Record<string, LongestPart> = {
    bodies: part,
    accessories: part,
    heads: part,
    glasses: part,
  };

  before(async () => {
    nounsDescriptor = await deployNounsDescriptorV3();

    for (const [l, layer] of Object.entries(ImageData.images)) {
      for (const [i, item] of layer.entries()) {
        if (item.data.length > longest[l].length) {
          longest[l] = {
            length: item.data.length,
            index: i,
          };
        }
      }
    }
    await populateDescriptorV2(nounsDescriptor);
    await storeInitialGlassesTraitState();
    await updateGlassesTraits();
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('updates the glasses trait at index 1 while preserving other traits', async () => {

    // Perform the update
    await updateGlassesTraits();

    // Check that the specific trait was updated
    const updatedGlassesTrait = await nounsDescriptor.glasses(glassesTraitIndex);
    expect(updatedGlassesTrait).to.equal(hiprose);
    expect(updatedGlassesTrait).to.not.equal(initialGlassesTrait);

    // Verify that the total count of glasses traits hasn't changed
    const finalGlassesCount = await nounsDescriptor.glassesCount();
    expect(finalGlassesCount).to.equal(initialGlassesCount);

    // Check that other traits weren't affected
    for (let i = 0; i < initialGlassesCount; i++) {
      if (i !== glassesTraitIndex) {
        const trait = await nounsDescriptor.glasses(i);
        expect(trait).to.equal(
          initialGlassesTraits[i],
          `Glasses trait at index ${i} was unexpectedly modified`,
        );
      }
    }
  }).timeout(120000); // 2 minutes;
});
