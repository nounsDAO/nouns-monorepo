import chai from 'chai';
import { ethers } from 'hardhat';
import { BigNumber as EthersBN, constants } from 'ethers';
import { solidity } from 'ethereum-waffle';
import {
  VrbsDescriptorV2__factory as VrbsDescriptorV2Factory,
  VrbsToken,
} from '../typechain';
import { deployVrbsToken, populateDescriptorV2 } from './utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);
const { expect } = chai;

describe('VrbsToken', () => {
  let vrbsToken: VrbsToken;
  let deployer: SignerWithAddress;
  let vrbsDAO: SignerWithAddress;
  let snapshotId: number;

  before(async () => {
    [deployer, vrbsDAO] = await ethers.getSigners();
    vrbsToken = await deployVrbsToken(deployer, vrbsDAO.address, deployer.address);

    const descriptor = await vrbsToken.descriptor();

    await populateDescriptorV2(VrbsDescriptorV2Factory.connect(descriptor, deployer));
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('should allow the minter to mint a vrb to itself and a reward vrb to the vrbsDAO', async () => {
    const receipt = await (await vrbsToken.mint()).wait();

    const [, , , vrbsVrbCreated, , , , ownersVrbCreated] = receipt.events || [];

    expect(await vrbsToken.ownerOf(0)).to.eq(vrbsDAO.address);
    expect(vrbsVrbCreated?.event).to.eq('VrbCreated');
    expect(vrbsVrbCreated?.args?.tokenId).to.eq(0);
    expect(vrbsVrbCreated?.args?.seed.length).to.equal(5);

    expect(await vrbsToken.ownerOf(1)).to.eq(deployer.address);
    expect(ownersVrbCreated?.event).to.eq('VrbCreated');
    expect(ownersVrbCreated?.args?.tokenId).to.eq(1);
    expect(ownersVrbCreated?.args?.seed.length).to.equal(5);

    vrbsVrbCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });

    ownersVrbCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });
  });

  it('should set symbol', async () => {
    expect(await vrbsToken.symbol()).to.eq('N00UN');
  });

  it('should set name', async () => {
    expect(await vrbsToken.name()).to.eq('Vrbs');
  });

  it('should allow minter to mint a vrb to itself', async () => {
    await (await vrbsToken.mint()).wait();

    const receipt = await (await vrbsToken.mint()).wait();
    const vrbCreated = receipt.events?.[3];

    expect(await vrbsToken.ownerOf(2)).to.eq(deployer.address);
    expect(vrbCreated?.event).to.eq('VrbCreated');
    expect(vrbCreated?.args?.tokenId).to.eq(2);
    expect(vrbCreated?.args?.seed.length).to.equal(5);

    vrbCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });
  });

  it('should emit two transfer logs on mint', async () => {
    const [, , creator, minter] = await ethers.getSigners();

    await (await vrbsToken.mint()).wait();

    await (await vrbsToken.setMinter(minter.address)).wait();
    await (await vrbsToken.transferOwnership(creator.address)).wait();

    const tx = vrbsToken.connect(minter).mint();

    await expect(tx)
      .to.emit(vrbsToken, 'Transfer')
      .withArgs(constants.AddressZero, creator.address, 2);
    await expect(tx).to.emit(vrbsToken, 'Transfer').withArgs(creator.address, minter.address, 2);
  });

  it('should allow minter to burn a vrb', async () => {
    await (await vrbsToken.mint()).wait();

    const tx = vrbsToken.burn(0);
    await expect(tx).to.emit(vrbsToken, 'VrbBurned').withArgs(0);
  });

  it('should revert on non-minter mint', async () => {
    const account0AsVrbErc721Account = vrbsToken.connect(vrbsDAO);
    await expect(account0AsVrbErc721Account.mint()).to.be.reverted;
  });

  describe('contractURI', async () => {
    it('should return correct contractURI', async () => {
      expect(await vrbsToken.contractURI()).to.eq(
        'ipfs://QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX',
      );
    });
    it('should allow owner to set contractURI', async () => {
      await vrbsToken.setContractURIHash('ABC123');
      expect(await vrbsToken.contractURI()).to.eq('ipfs://ABC123');
    });
    it('should not allow non owner to set contractURI', async () => {
      const [, nonOwner] = await ethers.getSigners();
      await expect(vrbsToken.connect(nonOwner).setContractURIHash('BAD')).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
    });
  });
});
