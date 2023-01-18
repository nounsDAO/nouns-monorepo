import chai from 'chai';
import { ethers } from 'hardhat';
import { BigNumber as EthersBN, constants } from 'ethers';
import { solidity } from 'ethereum-waffle';
import {
  N00unsDescriptorV2__factory as N00unsDescriptorV2Factory,
  N00unsToken,
} from '../typechain';
import { deployN00unsToken, populateDescriptorV2 } from './utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);
const { expect } = chai;

describe('N00unsToken', () => {
  let n00unsToken: N00unsToken;
  let deployer: SignerWithAddress;
  let n00undersDAO: SignerWithAddress;
  let snapshotId: number;

  before(async () => {
    [deployer, n00undersDAO] = await ethers.getSigners();
    n00unsToken = await deployN00unsToken(deployer, n00undersDAO.address, deployer.address);

    const descriptor = await n00unsToken.descriptor();

    await populateDescriptorV2(N00unsDescriptorV2Factory.connect(descriptor, deployer));
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('should allow the minter to mint a n00un to itself and a reward n00un to the n00undersDAO', async () => {
    const receipt = await (await n00unsToken.mint()).wait();

    const [, , , n00undersN00unCreated, , , , ownersN00unCreated] = receipt.events || [];

    expect(await n00unsToken.ownerOf(0)).to.eq(n00undersDAO.address);
    expect(n00undersN00unCreated?.event).to.eq('N00unCreated');
    expect(n00undersN00unCreated?.args?.tokenId).to.eq(0);
    expect(n00undersN00unCreated?.args?.seed.length).to.equal(5);

    expect(await n00unsToken.ownerOf(1)).to.eq(deployer.address);
    expect(ownersN00unCreated?.event).to.eq('N00unCreated');
    expect(ownersN00unCreated?.args?.tokenId).to.eq(1);
    expect(ownersN00unCreated?.args?.seed.length).to.equal(5);

    n00undersN00unCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });

    ownersN00unCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });
  });

  it('should set symbol', async () => {
    expect(await n00unsToken.symbol()).to.eq('N00UN');
  });

  it('should set name', async () => {
    expect(await n00unsToken.name()).to.eq('N00uns');
  });

  it('should allow minter to mint a n00un to itself', async () => {
    await (await n00unsToken.mint()).wait();

    const receipt = await (await n00unsToken.mint()).wait();
    const n00unCreated = receipt.events?.[3];

    expect(await n00unsToken.ownerOf(2)).to.eq(deployer.address);
    expect(n00unCreated?.event).to.eq('N00unCreated');
    expect(n00unCreated?.args?.tokenId).to.eq(2);
    expect(n00unCreated?.args?.seed.length).to.equal(5);

    n00unCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });
  });

  it('should emit two transfer logs on mint', async () => {
    const [, , creator, minter] = await ethers.getSigners();

    await (await n00unsToken.mint()).wait();

    await (await n00unsToken.setMinter(minter.address)).wait();
    await (await n00unsToken.transferOwnership(creator.address)).wait();

    const tx = n00unsToken.connect(minter).mint();

    await expect(tx)
      .to.emit(n00unsToken, 'Transfer')
      .withArgs(constants.AddressZero, creator.address, 2);
    await expect(tx).to.emit(n00unsToken, 'Transfer').withArgs(creator.address, minter.address, 2);
  });

  it('should allow minter to burn a n00un', async () => {
    await (await n00unsToken.mint()).wait();

    const tx = n00unsToken.burn(0);
    await expect(tx).to.emit(n00unsToken, 'N00unBurned').withArgs(0);
  });

  it('should revert on non-minter mint', async () => {
    const account0AsN00unErc721Account = n00unsToken.connect(n00undersDAO);
    await expect(account0AsN00unErc721Account.mint()).to.be.reverted;
  });

  describe('contractURI', async () => {
    it('should return correct contractURI', async () => {
      expect(await n00unsToken.contractURI()).to.eq(
        'ipfs://QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX',
      );
    });
    it('should allow owner to set contractURI', async () => {
      await n00unsToken.setContractURIHash('ABC123');
      expect(await n00unsToken.contractURI()).to.eq('ipfs://ABC123');
    });
    it('should not allow non owner to set contractURI', async () => {
      const [, nonOwner] = await ethers.getSigners();
      await expect(n00unsToken.connect(nonOwner).setContractURIHash('BAD')).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
    });
  });
});
