import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { NounsDescriptor } from '../typechain';
import { layers } from './files/encoded-layers.json';
import { LongestPart } from './types';
import { deployNounsDescriptor, populateDescriptor } from './utils';

chai.use(solidity);
const { expect } = chai;

describe('NounsDescriptor', () => {
  let nounsDescriptor: NounsDescriptor;

  const part: LongestPart = {
    length: 0,
    index: 0,
  };
  const longestParts = [part, part, part, part];
  let longestBody: LongestPart;
  let longestAccessory: LongestPart;
  let longestHead: LongestPart;
  let longestGlasses: LongestPart;

  beforeEach(async () => {
    nounsDescriptor = await deployNounsDescriptor();

    for (const [l, layer] of layers.entries()) {
      for (const [i, item] of layer.entries()) {
        if (item.data.length > longestParts[l].length) {
          longestParts[l] = {
            length: item.data.length,
            index: i,
          };
        }
      }
    }
    [longestBody, longestAccessory, longestHead, longestGlasses] = longestParts;

    await populateDescriptor(nounsDescriptor);
  });

  it('should generate valid token uri metadata when data uris are disabled', async () => {
    const BASE_URI = 'https://api.nouns.wtf/metadata/';

    await nounsDescriptor.setBaseURI(BASE_URI);

    const tokenUri = await nounsDescriptor.tokenURI(0, {
      background: 0,
      body: longestBody.index,
      accessory: longestAccessory.index,
      head: longestHead.index,
      glasses: longestGlasses.index,
    });
    expect(tokenUri).to.equal(`${BASE_URI}0`);
  });

  it('should generate valid token uri metadata when data uris are enabled', async () => {
    await nounsDescriptor.setDataURIEnabled(true);

    const tokenUri = await nounsDescriptor.tokenURI(0, {
      background: 0,
      body: longestBody.index,
      accessory: longestAccessory.index,
      head: longestHead.index,
      glasses: longestGlasses.index,
    });
    const { name, description, image } = JSON.parse(
      Buffer.from(tokenUri.replace('data:application/json;base64,', ''), 'base64').toString(
        'ascii',
      ),
    );
    expect(name).to.equal('Noun #0');
    expect(description).to.equal('Noun #0 is a member of the NounsDAO');
    expect(image).to.not.be.undefined;
  });
});
