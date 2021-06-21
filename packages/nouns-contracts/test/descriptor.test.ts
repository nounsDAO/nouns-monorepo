import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';
import { NounsDescriptor } from '../typechain';
import { colors, layers } from './files/encoded-layers.json';
import { LongestPart } from './types';

chai.use(solidity);
const { expect } = chai;

describe('NounsDescriptor', () => {
  let nounsDescriptor: NounsDescriptor;
  let nounsDAO: SignerWithAddress;

  async function deploy() {
    const nftDescriptorLibraryFactory = await ethers.getContractFactory(
      'NFTDescriptor',
      nounsDAO,
    );
    const nftDescriptorLibrary = await nftDescriptorLibraryFactory.deploy();

    await nftDescriptorLibrary.deployed();

    const nounsDescriptorFactory = await ethers.getContractFactory(
      'NounsDescriptor',
      {
        signer: nounsDAO,
        libraries: {
          NFTDescriptor: nftDescriptorLibrary.address,
        },
      },
    );
    nounsDescriptor = (await nounsDescriptorFactory.deploy(
      nounsDAO.address,
    )) as NounsDescriptor;

    return nounsDescriptor.deployed();
  }

  const part: LongestPart = {
    length: 0,
    index: 0,
  };
  const longestParts = [part, part, part, part, part];
  let longestBody: LongestPart;
  let longestAccessory: LongestPart;
  let longestHead: LongestPart;
  let longestGlasses: LongestPart;
  let longestArms: LongestPart;

  beforeEach(async () => {
    [nounsDAO] = await ethers.getSigners();
    nounsDescriptor = await deploy();

    const [bodies, accessories, heads, glasses, arms] = layers;

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
    [longestBody, longestAccessory, longestHead, longestGlasses, longestArms] =
      longestParts;

    console.log(`Longest body: #${longestBody.index} (${longestBody.length})`);
    console.log(
      `Longest accessory: #${longestAccessory.index} (${longestAccessory.length})`,
    );
    console.log(`Longest head: #${longestHead.index} (${longestHead.length})`);
    console.log(
      `Longest glasses: #${longestGlasses.index} (${longestGlasses.length})`,
    );
    console.log(`Longest arms: #${longestArms.index} (${longestArms.length})`);

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
    const tokenUri = await nounsDescriptor.tokenURI(0, [
      longestBody.index,
      longestAccessory.index,
      longestHead.index,
      longestGlasses.index,
      longestArms.index,
    ]);
    expect(tokenUri).to.not.be.undefined;
  });
});
