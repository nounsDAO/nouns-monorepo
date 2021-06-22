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
import { colors, layers } from './files/encoded-layers.json';

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
  nounsDAO?: string,
): Promise<NounsDescriptor> => {
  const signers = await getSigners();
  const signer = deployer || signers.deployer;
  const nftDescriptorLibraryFactory = await ethers.getContractFactory(
    'NFTDescriptor',
    signer,
  );
  const nftDescriptorLibrary = await nftDescriptorLibraryFactory.deploy();
  const nounsDescriptorFactory = new NounsDescriptor__factory(
    {
      __$e1d8844a0810dc0e87a665b1f2b5fa7c69$__: nftDescriptorLibrary.address,
    },
    signer,
  );

  return nounsDescriptorFactory.deploy(nounsDAO || signer.address);
};

export const deployNounsSeeder = async (
  deployer?: SignerWithAddress,
): Promise<NounsSeeder> => {
  const signers = await getSigners();
  const factory = new NounsSeeder__factory(deployer || signers.deployer);

  return factory.deploy();
};

export const deployNounsERC721 = async (
  deployer?: SignerWithAddress,
  nounsDAO?: string,
  descriptor?: string,
  seeder?: string,
): Promise<NounsErc721> => {
  const signers = await getSigners();
  const signer = deployer || signers.deployer;
  const factory = new NounsErc721__factory(signer);

  return factory.deploy(
    nounsDAO || signer.address,
    descriptor || (await deployNounsDescriptor(signer, nounsDAO)).address,
    seeder || (await deployNounsSeeder(signer)).address,
  );
};

export const deployWeth = async (
  deployer?: SignerWithAddress,
): Promise<Weth> => {
  const signers = await getSigners();
  const factory = new Weth__factory(deployer || signers.deployer);

  return factory.deploy();
};

export const populateDescriptor = async (
  nounsDescriptor: NounsDescriptor,
): Promise<void> => {
  const [bodies, accessories, heads, glasses] = layers;

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
  ]);
};
