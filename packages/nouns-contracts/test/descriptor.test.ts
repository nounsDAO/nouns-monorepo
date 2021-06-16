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

  beforeEach(async () => {
    nounsDescriptor = await deploy();

    const [bodies, accessories, heads, glasses, arms] = layers;

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
      [10, 0, 0, 0, 0],
    );
    expect(tokenUri).to.not.be.undefined;
  });
});
