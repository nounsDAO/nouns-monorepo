import chai from 'chai';
import { ethers } from 'hardhat';
import { BigNumber as EthersBN } from 'ethers';
import { solidity } from 'ethereum-waffle';
import { NounsDescriptor__factory as NounsDescriptorFactory, NounsToken } from '../typechain-types';
import { deployNounsToken } from './utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);
const { expect } = chai;

const hash = 'testhash';
const expectedUri = `ipfs://${hash}`;

describe('NounsToken.tokenURI', () => {
  let nounsToken: NounsToken;
  let deployer: SignerWithAddress;
  let noundersDAO: SignerWithAddress;
  let uriUpdater: SignerWithAddress;
  let snapshotId: number;

  before(async () => {
    [deployer, noundersDAO, uriUpdater] = await ethers.getSigners();
    nounsToken = await deployNounsToken(
      deployer,
      noundersDAO.address,
      deployer.address,
      uriUpdater.address,
    );
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('should error when fetching tokenURI of unminted tokenId', async () => {
    try {
      await nounsToken.tokenURI(1);
    } catch (e) {
      expect(e.message).to.include('NounsToken: URI query for nonexistent token');
    }
  });

  it('should return under construction URI when minted but tokenURI not set yet', async () => {
    const receipt = await (await nounsToken.mint()).wait();
    const tokenId = receipt.events?.[3]?.args?.tokenId;

    expect(tokenId).to.eq(0);
    const tokenUri = await nounsToken.tokenURI(tokenId);
    expect(tokenUri).to.eq('ipfs://QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX');
  });

  it('should let uriUpdater set tokenURI and retrieve', async () => {
    const receipt = await (await nounsToken.mint()).wait();
    const tokenId = receipt.events?.[3]?.args?.tokenId;

    expect(tokenId).to.eq(0);
    const setReceipt = await (
      await nounsToken.connect(uriUpdater).setTokenURI(tokenId, hash)
    ).wait();
    const updateEvent = setReceipt.events?.[0];

    expect(updateEvent?.args?.tokenId).to.eq(tokenId);
    expect(updateEvent?.args?.uri).to.eq(hash);

    const tokenUri = await nounsToken.tokenURI(tokenId);
    expect(tokenUri).to.eq(expectedUri);
  });

  it('should reject setTokenURI request because unauthorized', async () => {
    const receipt = await (await nounsToken.mint()).wait();
    const tokenId = receipt.events?.[3]?.args?.tokenId;

    expect(tokenId).to.eq(0);
    try {
      await (await nounsToken.setTokenURI(tokenId, hash)).wait();
    } catch (e) {
      expect(e.message).to.include('Sender is not the URI updater');
      return;
    }
    expect(false).to.eq(true);
  });
});
