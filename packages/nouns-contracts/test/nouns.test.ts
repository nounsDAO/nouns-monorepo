import chai from 'chai';
import { ethers } from 'hardhat';
import { constants } from 'ethers';
import { solidity } from 'ethereum-waffle';
import { NounsToken } from '../typechain';
import { deployNounsToken } from './utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);
const { expect } = chai;
const IPFS_URL = 'someIpfsURL';

describe('NounsToken', () => {
  let nounsToken: NounsToken;
  let deployer: SignerWithAddress;
  let noundersDAO: SignerWithAddress;
  let snapshotId: number;

  before(async () => {
    [deployer, noundersDAO] = await ethers.getSigners();
    nounsToken = await deployNounsToken(deployer, noundersDAO.address, deployer.address);
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('should allow the minter to mint a noun to itself', async () => {
    const receipt = await (await nounsToken.mint(IPFS_URL)).wait();

    const [, , noundersNounCreated] = receipt.events || [];

    expect(await nounsToken.ownerOf(1)).to.eq(deployer.address);
    expect(noundersNounCreated?.event).to.eq('NounCreated');
    expect(noundersNounCreated?.args?.tokenId).to.eq(1);
  });

  it('should set symbol', async () => {
    expect(await nounsToken.symbol()).to.eq('WHALEZ');
  });

  it('should set name', async () => {
    expect(await nounsToken.name()).to.eq('whalez');
  });

  it('should emit two transfer logs on mint', async () => {
    const [, , creator, minter] = await ethers.getSigners();

    await (await nounsToken.mint(IPFS_URL)).wait();

    await (await nounsToken.setMinter(minter.address)).wait();
    await (await nounsToken.transferOwnership(creator.address)).wait();

    const tx = nounsToken.connect(minter).mint(IPFS_URL);

    await expect(tx)
      .to.emit(nounsToken, 'Transfer')
      .withArgs(constants.AddressZero, creator.address, 2);
    await expect(tx).to.emit(nounsToken, 'Transfer').withArgs(creator.address, minter.address, 2);
  });

  it('should allow minter to burn a noun', async () => {
    await (await nounsToken.mint(IPFS_URL)).wait();

    const tx = nounsToken.burn(1);
    await expect(tx).to.emit(nounsToken, 'NounBurned').withArgs(1);
  });

  it('should revert on non-minter mint', async () => {
    const account0AsNounErc721Account = nounsToken.connect(noundersDAO);
    await expect(account0AsNounErc721Account.mint(IPFS_URL)).to.be.reverted;
  });
});
