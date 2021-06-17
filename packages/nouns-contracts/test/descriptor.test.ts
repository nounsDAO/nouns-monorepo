import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';
import { NounsDescriptor } from '../typechain';
import { colors, layers } from './files/encoded-layers.json';

chai.use(solidity);
const { expect } = chai;

describe('NounsDescriptor', () => {
  let nounsDescriptor: NounsDescriptor;

  async function deploy() {
    const nftDescriptorLibraryFactory = await ethers.getContractFactory(
      'NFTDescriptor',
    );
    const nftDescriptorLibrary = await nftDescriptorLibraryFactory.deploy();

    await nftDescriptorLibrary.deployed();

    const nounsDescriptorFactory = await ethers.getContractFactory(
      'NounsDescriptor',
      {
        libraries: {
          NFTDescriptor: nftDescriptorLibrary.address,
        },
      },
    );
    nounsDescriptor =
      (await nounsDescriptorFactory.deploy()) as NounsDescriptor;

    return nounsDescriptor.deployed();
  }

  const longestLengths = [0, 0, 0, 0, 0];
  const longestIndices = [0, 0, 0, 0, 0];

  beforeEach(async () => {
    nounsDescriptor = await deploy();

    const [bodies, accessories, heads, glasses, arms] = layers;

    for (const [i, item] of bodies.entries()) {
      if (item.data.length > longestLengths[0]) {
        longestLengths[0] = item.data.length;
        longestIndices[0] = i;
      }
    }
    for (const [i, item] of accessories.entries()) {
      if (item.data.length > longestLengths[1]) {
        longestLengths[1] = item.data.length;
        longestIndices[1] = i;
      }
    }
    for (const [i, item] of heads.entries()) {
      if (item.data.length > longestLengths[2]) {
        longestLengths[2] = item.data.length;
        longestIndices[2] = i;
      }
    }
    for (const [i, item] of glasses.entries()) {
      if (item.data.length > longestLengths[3]) {
        longestLengths[3] = item.data.length;
        longestIndices[3] = i;
      }
    }
    for (const [i, item] of arms.entries()) {
      if (item.data.length > longestLengths[4]) {
        longestLengths[4] = item.data.length;
        longestIndices[4] = i;
      }
    }

    console.log(`Longest body: #${longestIndices[0]} (${longestLengths[0]})`);
    console.log(`Longest accessory: #${longestIndices[1]} (${longestLengths[1]})`);
    console.log(`Longest head: #${longestIndices[2]} (${longestLengths[2]})`);
    console.log(`Longest glasses: #${longestIndices[3]} (${longestLengths[3]})`);
    console.log(`Longest arms: #${longestIndices[4]} (${longestLengths[4]})`);

    await Promise.all([
      nounsDescriptor.addManyColorsToPalette(
        0,
        colors.map(color => color),
      ),
      nounsDescriptor.addManyBodies(bodies.map(({ data }) => data)),
      nounsDescriptor.addManyAccessories(accessories.map(({ data }) => data)),
      // Split up head insertion due to high gas usage
      nounsDescriptor.addManyHeads(
        heads.map(({ data }) => data).filter((_, i) => i % 2 === 0),
      ),
      nounsDescriptor.addManyHeads(
        heads.map(({ data }) => data).filter((_, i) => i % 2 === 1),
      ),
      nounsDescriptor.addManyGlasses(glasses.map(({ data }) => data)),
      nounsDescriptor.addManyArms(arms.map(({ data }) => data)),
    ]);
  });

  it('should generate valid token uri metadata', async () => {
    const tokenUri = await nounsDescriptor.tokenURI(
      0,
      [
        longestIndices[0], 
        longestIndices[1], 
        longestIndices[2], 
        longestIndices[3], 
        longestIndices[4]
      ],
    );
    expect(tokenUri).to.not.be.undefined;
  });
});
