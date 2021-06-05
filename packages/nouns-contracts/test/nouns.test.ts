import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';
import { NounsErc721 } from '../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);
const { expect } = chai;

describe('NounsErc721', () => {
  let ownerAccount: SignerWithAddress;
  let nounsErc721: NounsErc721;

  beforeEach(async () => {
    [ownerAccount] = await ethers.getSigners();

    const nounsErc721Factory = await ethers.getContractFactory(
      'NounsErc721',
      ownerAccount,
    );
    nounsErc721 = (await nounsErc721Factory.deploy()) as NounsErc721;
    await nounsErc721.deployed();
  });

  it('should set base URI', async () => {
    expect(await nounsErc721.baseURI()).to.eq('ipfs://');
  });
});
