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
  account1: SignerWithAddress;
  account2: SignerWithAddress;
};

export const getSigners = async (): Promise<TestSigners> => {
  const [deployer, account0, account1, account2] = await ethers.getSigners();
  return {
    deployer,
    account0,
    account1,
    account2
  };
};

export const deployNounsDescriptor = async (
  deployer?: SignerWithAddress,
): Promise<NounsDescriptor> => {
  const signer = deployer || (await getSigners()).deployer;
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
  const factory = new NounsSeeder__factory(deployer || (await getSigners()).deployer);

  return factory.deploy();
};

export const deployNounsERC721 = async (
  deployer?: SignerWithAddress,
  noundersDAO?: string,
  minter?: string,
  descriptor?: string,
  seeder?: string,
): Promise<NounsErc721> => {
  const signer = deployer || (await getSigners()).deployer;
  const factory = new NounsErc721__factory(signer);

  return factory.deploy(
    noundersDAO || signer.address,
    minter || signer.address,
    descriptor || (await deployNounsDescriptor(signer)).address,
    seeder || (await deployNounsSeeder(signer)).address,
  );
};

export const deployWeth = async (deployer?: SignerWithAddress): Promise<Weth> => {
  const factory = new Weth__factory(deployer || (await await getSigners()).deployer);

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

/**
 * Return a function used to mint `amount` Nouns on the provided `token`
 * @param token The Nouns ERC721 token
 * @param amount The number of Nouns to mint
 */
export const MintNouns = (token: NounsErc721, burnNoundersTokens: boolean = true): (amount: number) => Promise<void> => {
  return async function (amount: number): Promise<void> {
    for (let i=0; i<amount; i++){
      await token.mint();
    }
    if (!burnNoundersTokens) return

    await setTotalSupply(token, amount)
  }
}

/**
 * Mints or burns tokens to target a total supply. Due to Nounders' rewards tokens may be burned and tokenIds will not be sequential
 */
export const setTotalSupply = async (token: NounsErc721, newTotalSupply: number): Promise<void> => {

  const totalSupply = (await token.totalSupply()).toNumber()

  if (totalSupply < newTotalSupply) {
    for (let i=0; i<newTotalSupply-totalSupply; i++){
      await token.mint();
    }
    // If Nounder's reward tokens were minted totalSupply will be more than expected, so run setTotalSupply again to burn extra tokens
    await setTotalSupply(token, newTotalSupply)
  }

  if (totalSupply > newTotalSupply){
    for (let i=newTotalSupply; i<totalSupply; i++){
      await token.burn(i)
    }

  }
}