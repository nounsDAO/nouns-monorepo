import chai from 'chai';
import { ethers } from 'hardhat';
import { constants } from 'ethers';
import { solidity } from 'ethereum-waffle';
import { WhalezToken } from '../typechain';
import { deployWhalezToken } from './utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);
const { expect } = chai;
const IPFS_URL = 'changeThis';

describe('WhalezToken', () => {
  let whalezToken: WhalezToken;
  let deployer: SignerWithAddress;
  let diatomDAO: SignerWithAddress;
  let snapshotId: number;

  before(async () => {
    [deployer, diatomDAO] = await ethers.getSigners();
    whalezToken = await deployWhalezToken(deployer, diatomDAO.address, deployer.address);
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('should allow the minter to mint a whale to itself', async () => {
    const receipt = await (await whalezToken.mint()).wait();

    const [, , whaleCreated] = receipt.events || [];

    expect(await whalezToken.ownerOf(1)).to.eq(deployer.address);
    expect(whaleCreated?.event).to.eq('WhaleCreated');
    expect(whaleCreated?.args?.tokenId).to.eq(1);
  });

  it('should return correct tokenURI', async () => {
    await (await whalezToken.mint()).wait();

    const tokenURI = await whalezToken.tokenURI(1);
    expect(tokenURI).to.equal(`ipfs://${IPFS_URL}/1`)
  })

  it('should set symbol', async () => {
    expect(await whalezToken.symbol()).to.eq('WHALEZ');
  });

  it('should set name', async () => {
    expect(await whalezToken.name()).to.eq('whalez');
  });

  it('should emit two transfer logs on mint', async () => {
    const [, , creator, minter] = await ethers.getSigners();

    await (await whalezToken.mint()).wait();

    await (await whalezToken.setMinter(minter.address)).wait();
    await (await whalezToken.transferOwnership(creator.address)).wait();

    const tx = whalezToken.connect(minter).mint();

    await expect(tx)
      .to.emit(whalezToken, 'Transfer')
      .withArgs(constants.AddressZero, creator.address, 2);
    await expect(tx).to.emit(whalezToken, 'Transfer').withArgs(creator.address, minter.address, 2);
  });

  it('should allow minter to burn a whale', async () => {
    await (await whalezToken.mint()).wait();

    const tx = whalezToken.burn(1);
    await expect(tx).to.emit(whalezToken, 'WhaleBurned').withArgs(1);
  });

  it('should revert on non-minter mint', async () => {
    const account0AsNounErc721Account = whalezToken.connect(diatomDAO);
    await expect(account0AsNounErc721Account.mint()).to.be.reverted;
  });

  it('should get max supply', async () => {
    const maxSupply = await whalezToken.getMaxSupply();
    expect(maxSupply).to.equal(50);
  });

  it('should update diatomDAO address from original diatomDAO address', async () => {
    const [, , , newDiatomDAOaddress] = await ethers.getSigners();

    const diatomDAOAccount = whalezToken.connect(diatomDAO);
    await expect(diatomDAOAccount.setDiatomDAO(newDiatomDAOaddress.address))
      .to.emit(diatomDAOAccount, 'DiatomDAOUpdated')
      .withArgs(newDiatomDAOaddress.address);

    expect(await whalezToken.diatomDAO()).to.equal(newDiatomDAOaddress.address);
  });

  it('should revert on non-diatomDAO update', async () => {
    const [, , , newDiatomDAOaddress] = await ethers.getSigners();

    await expect(whalezToken.setDiatomDAO(newDiatomDAOaddress.address)).to.be.reverted;
  });
});
