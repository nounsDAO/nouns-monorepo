import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { NounsErc721, Weth } from '../typechain';

export type TestSigners = {
  deployer: SignerWithAddress;
  account0: SignerWithAddress;
  account1: SignerWithAddress;
  account2: SignerWithAddress;
};

export async function getSigners(): Promise<TestSigners> {
  const [deployer, account0, account1, account2] = await ethers.getSigners();
  return {
    deployer,
    account0,
    account1,
    account2
  };
}

export async function deployNounsErc721(
  deployer?: SignerWithAddress,
): Promise<NounsErc721> {
  const signers = await getSigners();
  return (await (
    await ethers.getContractFactory('NounsERC721', deployer || signers.deployer)
  ).deploy()) as NounsErc721;
}

export async function deployWeth(deployer?: SignerWithAddress): Promise<Weth> {
  const signers = await getSigners();
  return (await (
    await ethers.getContractFactory('WETH', deployer || signers.deployer)
  ).deploy()) as Weth;
}

export function MintNouns(token: NounsErc721): (amount: number) => Promise<void> {
  return async function (amount: number): Promise<void> {
    for (let i=0; i<amount; i++){
      await token.mint();
    }
  }
}