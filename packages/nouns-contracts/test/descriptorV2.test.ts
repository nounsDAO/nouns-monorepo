import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { NounsDescriptorV2 } from '../typechain';
import ImageData from '../files/image-data-v2.json';
import { LongestPart } from './types';
import { deployNounsDescriptorV2, populateDescriptorV2 } from './utils';
import { ethers } from 'hardhat';
import { appendFileSync } from 'fs';

chai.use(solidity);
const { expect } = chai;

describe('NounsDescriptorV2', () => {
  let nounsDescriptor: NounsDescriptorV2;
  let snapshotId: number;

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
    nounsDescriptor = await deployNounsDescriptorV2();

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
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('should generate valid token uri metadata when data uris are disabled', async () => {
    const BASE_URI = 'https://api.nouns.wtf/metadata/';

    await nounsDescriptor.setBaseURI(BASE_URI);
    await nounsDescriptor.toggleDataURIEnabled();

    const tokenUri = await nounsDescriptor.tokenURI(0, {
      background: 0,
      body: longest.bodies.index,
      accessory: longest.accessories.index,
      head: longest.heads.index,
      glasses: longest.glasses.index,
    });
    expect(tokenUri).to.equal(`${BASE_URI}0`);
  });

  // Skipping until we resolve the CI memory issue
  it('should generate valid token uri metadata when data uris are enabled [ @skip-on-coverage ]', async () => {
    const tokenUri = await nounsDescriptor.tokenURI(
      0,
      {
        background: 0,
        body: longest.bodies.index,
        accessory: longest.accessories.index,
        head: longest.heads.index,
        glasses: longest.glasses.index,
      },
      { gasLimit: 200_000_000 },
    );
    const { name, description, image } = JSON.parse(
      Buffer.from(tokenUri.replace('data:application/json;base64,', ''), 'base64').toString(
        'ascii',
      ),
    );
    expect(name).to.equal('Noun 0');
    expect(description).to.equal('Noun 0 is a member of the Nouns DAO');
    expect(image).to.not.be.undefined;
  }).timeout(1_000_000);

  // Unskip this test to validate the encoding of all parts. It ensures that no parts revert when building the token URI.
  // This test also outputs a parts.html file, which can be visually inspected.
  // Note that this test takes a long time to run. You must increase the mocha timeout to a large number.
  it.skip('should generate valid token uri metadata for all supported parts when data uris are enabled', async () => {
    console.log('Running... this may take a little while...');

    const { bgcolors, images } = ImageData;
    const { bodies, accessories, heads, glasses } = images;
    const max = Math.max(bodies.length, accessories.length, heads.length, glasses.length);
    for (let i = 0; i < max; i++) {
      const tokenUri = await nounsDescriptor.tokenURI(i, {
        background: Math.min(i, bgcolors.length - 1),
        body: Math.min(i, bodies.length - 1),
        accessory: Math.min(i, accessories.length - 1),
        head: Math.min(i, heads.length - 1),
        glasses: Math.min(i, glasses.length - 1),
      });
      const { name, description, image } = JSON.parse(
        Buffer.from(tokenUri.replace('data:application/json;base64,', ''), 'base64').toString(
          'ascii',
        ),
      );
      expect(name).to.equal(`Noun ${i}`);
      expect(description).to.equal(`Noun ${i} is a member of the Nouns DAO`);
      expect(image).to.not.be.undefined;

      appendFileSync(
        'parts.html',
        Buffer.from(image.split(';base64,').pop(), 'base64').toString('ascii'),
      );

      if (i && i % Math.round(max / 10) === 0) {
        console.log(`${Math.round((i / max) * 100)}% complete`);
      }
    }
  });
});
