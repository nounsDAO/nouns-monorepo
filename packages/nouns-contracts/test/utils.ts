import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  NounsDescriptor,
  NounsDescriptor__factory,
  NounsErc721,
  NounsErc721__factory,
  NounsSeeder,
  NounsSeeder__factory,
  Weth,
  Weth__factory,
} from '../typechain';
import { bgcolors, partcolors, parts } from '../files/encoded-layers.json';
import { chunkArray } from '../utils';

export type TestSigners = {
  deployer: SignerWithAddress;
  account0: SignerWithAddress;
};

export const getSigners = async (): Promise<TestSigners> => {
  const [deployer, account0] = await ethers.getSigners();
  return {
    deployer,
    account0,
  };
};

export const deployNounsDescriptor = async (
  deployer?: SignerWithAddress,
): Promise<NounsDescriptor> => {
  const signers = await getSigners();
  const signer = deployer || signers.deployer;
  const nftDescriptorLibraryFactory = await ethers.getContractFactory('NFTDescriptor', signer);
  const nftDescriptorLibrary = await nftDescriptorLibraryFactory.deploy();
  const nounsDescriptorFactory = new NounsDescriptor__factory(
    {
      __$e1d8844a0810dc0e87a665b1f2b5fa7c69$__: nftDescriptorLibrary.address,
    },
    signer,
  );

  return nounsDescriptorFactory.deploy();
};

export const deployNounsSeeder = async (deployer?: SignerWithAddress): Promise<NounsSeeder> => {
  const signers = await getSigners();
  const factory = new NounsSeeder__factory(deployer || signers.deployer);

  return factory.deploy();
};

export const deployNounsERC721 = async (
  deployer?: SignerWithAddress,
  noundersDAO?: string,
  minter?: string,
  descriptor?: string,
  seeder?: string,
): Promise<NounsErc721> => {
  const signers = await getSigners();
  const signer = deployer || signers.deployer;
  const factory = new NounsErc721__factory(signer);

  return factory.deploy(
    noundersDAO || signer.address,
    minter || signer.address,
    descriptor || (await deployNounsDescriptor(signer)).address,
    seeder || (await deployNounsSeeder(signer)).address,
  );
};

export const deployWeth = async (deployer?: SignerWithAddress): Promise<Weth> => {
  const signers = await getSigners();
  const factory = new Weth__factory(deployer || signers.deployer);

  return factory.deploy();
};

export const populateDescriptor = async (nounsDescriptor: NounsDescriptor): Promise<void> => {
  const [bodies, accessories, heads, glasses] = parts;

  // Split up head and accessory population due to high gas usage
  await Promise.all([
    nounsDescriptor.addManyBackgrounds(bgcolors),
    nounsDescriptor.addManyColorsToPalette(0, partcolors),
    nounsDescriptor.addManyBodies(bodies.map(({ data }) => data)),
    chunkArray(accessories, 10).map(chunk =>
      nounsDescriptor.addManyAccessories(chunk.map(({ data }) => data)),
    ),
    chunkArray(heads, 10).map(chunk => nounsDescriptor.addManyHeads(chunk.map(({ data }) => data))),
    nounsDescriptor.addManyGlasses(glasses.map(({ data }) => data)),
  ]);
};
