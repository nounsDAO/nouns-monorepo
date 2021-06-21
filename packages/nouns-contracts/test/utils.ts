import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { NounsErc721, Weth } from '../typechain';
import { constants } from 'ethers';

export type TestSigners = {
  deployer: SignerWithAddress;
  account0: SignerWithAddress;
};

export async function getSigners(): Promise<TestSigners> {
  const [deployer, account0] = await ethers.getSigners();
  return {
    deployer,
    account0,
  };
}

export async function deployNounsErc721(
  deployer?: SignerWithAddress,
  nounsDAO = constants.AddressZero,
  descriptor = constants.AddressZero,
): Promise<NounsErc721> {
  const signers = await getSigners();
  return (await (
    await ethers.getContractFactory('NounsERC721', deployer || signers.deployer)
  ).deploy(nounsDAO, descriptor)) as NounsErc721;
}

export async function deployWeth(deployer?: SignerWithAddress): Promise<Weth> {
  const signers = await getSigners();
  return (await (
    await ethers.getContractFactory('WETH', deployer || signers.deployer)
  ).deploy()) as Weth;
}
