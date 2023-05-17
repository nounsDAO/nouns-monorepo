import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { NDescriptorV2 } from '../typechain';
import ImageData from '../files/image-data-v2.json';
import { LongestPart } from './types';
import { deployNDescriptorV2, populateDescriptorV2 } from './utils';
import { ethers } from 'hardhat';
import { appendFileSync } from 'fs';

chai.use(solidity);
const { expect } = chai;

describe('NDescriptorV2', () => {
  let nDescriptor: NDescriptorV2;
  let snapshotId: number;

  const part: LongestPart = {
    length: 0,
    index: 0,
  };
  const longest: Record<string, LongestPart> = {
    types: part,
    necks: part,
    cheekses: part,
    faces: part,
    beards: part,
    mouths: part,
    earses: part,
    hats: part,
    hairs: part,
    teeths: part,
    lipses: part,
    emotions: part,
    eyeses: part,
    glasseses: part,
    goggleses: part,
    noses: part,
  };

  before(async () => {
    nDescriptor = await deployNDescriptorV2();

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

    await populateDescriptorV2(nDescriptor);
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('should generate valid token uri metadata when data uris are disabled', async () => {
    const BASE_URI = 'https://api.nouns.wtf/metadata/';

    await nDescriptor.setBaseURI(BASE_URI);
    await nDescriptor.toggleDataURIEnabled();

    const tokenUri = await nDescriptor.tokenURI(0, {
      punkType: 0,
      skinTone: 0,
      accessories: [ {accType: 6, accId: 0}, {accType: 12, accId: 1} ],
    });
    expect(tokenUri).to.equal(`${BASE_URI}0`);
  });

  // Skipping until we resolve the CI memory issue
  it('should generate valid token uri metadata when data uris are enabled [ @skip-on-coverage ]', async () => {
    const tokenUri = await nDescriptor.tokenURI(
      0,
      {
        punkType: 0,
        skinTone: 0,
        accessories: [ {accType: 6, accId: 0}, {accType: 12, accId: 1} ],
      },
      { gasLimit: 200_000_000 },
    );
    const { name, description, image } = JSON.parse(
      Buffer.from(tokenUri.replace('data:application/json;base64,', ''), 'base64').toString(
        'ascii',
      ),
    );
    expect(name).to.equal('Token 0');
    expect(description).to.equal('Token 0 is a member of the Punk DAO');
    expect(image).to.not.be.undefined;
  }).timeout(1_000_000);

  // Unskip this test to validate the encoding of all parts. It ensures that no parts revert when building the token URI.
  // This test also outputs a parts.html file, which can be visually inspected.
  // Note that this test takes a long time to run. You must increase the mocha timeout to a large number.
  it.skip('should generate valid token uri metadata for all supported parts when data uris are enabled', async () => {
    console.log('Running... this may take a little while...');

    const { images } = ImageData;
    const { types, necks, cheekses, faces, beards, mouths, earses, hats, hairs, teeths, lipses, emotions, eyeses, glasseses, goggleses, noses } = images;
    const lengths = [ necks.length, cheekses.length, faces.length, beards.length, mouths.length, earses.length, hats.length, hairs.length, teeths.length, lipses.length, emotions.length, eyeses.length, glasseses.length, goggleses.length, noses.length ];
    const punkTypes = [0,0,0,0,1,1,1,1,2,3,4];
    const skinTones = [0,1,2,3,0,1,2,3,4,5,6];
    const max = Math.max(necks.length, cheekses.length, faces.length, beards.length, mouths.length, earses.length, hats.length, hairs.length, teeths.length, lipses.length, emotions.length, eyeses.length, glasseses.length, goggleses.length, noses.length );
    for (let i = 0; i < max * 15; i++) {
      const type = i % types.length;
      const punkType = punkTypes[i];
      const skinTone = skinTones[i];
      const accType = i % lengths.length;
      const accId = i % lengths[accType];
      const tokenUri = await nDescriptor.tokenURI(i, {
        punkType: punkType,
        skinTone: skinTone,
        accessories: [ {accType: accType, accId: accId} ],
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
