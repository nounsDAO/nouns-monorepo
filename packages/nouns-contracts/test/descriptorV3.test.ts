import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { NounsDescriptorV3 } from '../typechain';
import ImageData from '../files/image-data-v2.json';
import { LongestPart } from './types';
import { deployNounsDescriptorV3, populateDescriptorV2 } from './utils';
import { ethers } from 'hardhat';
import ProposalImages from '../../nouns-assets/src/proposal-images-nouns-v2.json';
// import { appendFileSync } from 'fs';

chai.use(solidity);
const { expect } = chai;

const aardvark =
  '0x00021e14060500013802000138130002380200023811000338020003380f000438020004380f00033802000338110002380200023813000138020001380f000d380b000d380b000d380b000d380b000d380b000d380b000d380600057e0d380600017e017f017e017f017e0b38097e017f017e017f017e0b380d7e0a380524097e0b380d7e';

const eyesred =
  '0x000b17100703000624010006240300012402020265012401000124020202650524020202650324020202650224020001240202026501240100012402020265022402000124020202650124010001240202026501240300062401000624';

const hiprose =
  '0x000b1710070300062101000621030001210202022401210100012102020224052102020224032102020224052102020224032102020224022102000121020202240121010001210202022401210300062101000621';

describe('NounsDescriptorV3', () => {
  let nounsDescriptor: NounsDescriptorV3;
  let snapshotId: number;

  const glassesTraitIndex = 1;
  const bodiesTraitIndex = 0;

  const updateGlassesTraits = async () => {
    const newEncodedCompressedTrait = ProposalImages[1].glasses?.encodedCompressed ?? '';
    const decompressedLength = ProposalImages[1].glasses?.originalLength ?? 0;
    const itemCount = ProposalImages[1].glasses?.itemCount ?? 0;

    const glassesCountBefore = await nounsDescriptor.glassesCount();

    console.log(`glassesCountBefore: ${glassesCountBefore}`);
    await nounsDescriptor.updateGlasses(newEncodedCompressedTrait, decompressedLength, itemCount, {
      gasLimit: 30000000,
    });
    
    const glassesCountAfter = await nounsDescriptor.glassesCount();
    const glassesAtIdex = await nounsDescriptor.glasses(glassesTraitIndex);

    console.log(`glassesCountAfter: ${glassesCountAfter}. Index0: ${glassesAtIdex}`);

    expect(glassesAtIdex).to.equal(hiprose);
  };

  const updateHeadsTraits = async () => {
    const newEncodedCompressedTrait = ProposalImages[0].heads?.encodedCompressed ?? '';
    const decompressedLength = ProposalImages[0].heads?.originalLength ?? 0;
    const itemCount = ProposalImages[0].heads?.itemCount ?? 0;

    const headsCountBefore = await nounsDescriptor.headCount();

    console.log(`headsCountBefore: ${headsCountBefore}`);

    await nounsDescriptor.updateHeads(newEncodedCompressedTrait, decompressedLength, itemCount, {
      gasLimit: 30000000,
    });

    const headsCountAfter = await nounsDescriptor.headCount();
    const headsAtIdex = await nounsDescriptor.heads(bodiesTraitIndex);

    console.log(`headsCountAfter: ${headsCountAfter}. Index0: ${headsAtIdex}`);

    expect(headsAtIdex).to.equal(aardvark);
  };

  const checkGlassesAfterUpdate = async () => {
    const traitIndex = 1;
    const glassesTrait = await nounsDescriptor.glasses(traitIndex, {
      gasLimit: 30000000,
    });

    const glassesCountAfter = await nounsDescriptor.glassesCount();
    console.log(`glassesCountAfter: ${glassesCountAfter}. trait:${glassesTrait}`);

    expect(glassesTrait).to.equal(hiprose);
  };

  const checkHeadsAfterUpdate = async () => {
    const traitIndex = 1;
    const headsTrait = await nounsDescriptor.heads(traitIndex, {
      gasLimit: 30000000,
    });

    const headsCountAfter = await nounsDescriptor.headCount();
    console.log(`headsCountAfter: ${headsCountAfter}. trait:${headsTrait}`);

    expect(headsTrait).to.equal(aardvark);
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
    await updateGlassesTraits();
    await updateHeadsTraits();
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('updates all glasses with updated trait at index 0', async () => {
    return await checkGlassesAfterUpdate();
  });

  it('updates all heads with updated trait at index 0', async () => {
    return await checkHeadsAfterUpdate();
  });

  // Unskip this test to validate the encoding of all parts. It ensures that no parts revert when building the token URI.
  // This test also outputs a parts.html file, which can be visually inspected.
  // Note that this test takes a long time to run.
  // it.skip('should generate valid token uri metadata for all supported parts when data uris are enabled', async () => {
  //   console.log('Running... this may take a little while...');

  //   const { bgcolors, images } = ImageData;
  //   const { bodies, accessories, heads, glasses } = images;
  //   const max = Math.max(bodies.length, accessories.length, heads.length, glasses.length);
  //   for (let i = 0; i < max; i++) {
  //     const tokenUri = await nounsDescriptor.tokenURI(i, {
  //       background: Math.min(i, bgcolors.length - 1),
  //       body: Math.min(i, bodies.length - 1),
  //       accessory: Math.min(i, accessories.length - 1),
  //       head: Math.min(i, heads.length - 1),
  //       glasses: Math.min(i, glasses.length - 1),
  //     });
  //     const { name, description, image } = JSON.parse(
  //       Buffer.from(tokenUri.replace('data:application/json;base64,', ''), 'base64').toString(
  //         'ascii',
  //       ),
  //     );
  //     expect(name).to.equal(`Noun ${i}`);
  //     expect(description).to.equal(`Noun ${i} is a member of the Nouns DAO`);
  //     expect(image).to.not.be.undefined;

  //     appendFileSync(
  //       'parts.html',
  //       Buffer.from(image.split(';base64,').pop(), 'base64').toString('ascii'),
  //     );

  //     if (i && i % Math.round(max / 10) === 0) {
  //       console.log(`${Math.round((i / max) * 100)}% complete`);
  //     }
  //   }
  // });
});