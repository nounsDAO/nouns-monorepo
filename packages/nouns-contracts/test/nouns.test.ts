import chai from 'chai';
import { ethers } from 'hardhat';
import { BigNumber as EthersBN, constants } from 'ethers';
import { solidity } from 'ethereum-waffle';
import { NounsBRDescriptorV2__factory as NounsBRDescriptorV2Factory, NounsBRToken } from '../typechain';
import { deployNounsBRToken, populateDescriptorV2 } from './utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);
const { expect } = chai;

describe('NounsBRToken', () => {
  let nounsbrToken: NounsBRToken;
  let deployer: SignerWithAddress;
  let noundersbrDAO: SignerWithAddress;
  let snapshotId: number;

  before(async () => {
    [deployer, noundersbrDAO] = await ethers.getSigners();
    nounsbrToken = await deployNounsBRToken(deployer, noundersbrDAO.address, deployer.address);

    const descriptor = await nounsbrToken.descriptor();

    await populateDescriptorV2(NounsBRDescriptorV2Factory.connect(descriptor, deployer));
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('should allow the minter to mint a nounbr to itself and a reward nounbr to the noundersbrDAO', async () => {
    const receipt = await (await nounsbrToken.mint()).wait();

    const [, , , noundersbrNounBRCreated, , , , ownersNounBRCreated] = receipt.events || [];

    expect(await nounsbrToken.ownerOf(0)).to.eq(noundersbrDAO.address);
    expect(noundersbrNounBRCreated?.event).to.eq('NounBRCreated');
    expect(noundersbrNounBRCreated?.args?.tokenId).to.eq(0);
    expect(noundersbrNounBRCreated?.args?.seed.length).to.equal(5);

    expect(await nounsbrToken.ownerOf(1)).to.eq(deployer.address);
    expect(ownersNounBRCreated?.event).to.eq('NounBRCreated');
    expect(ownersNounBRCreated?.args?.tokenId).to.eq(1);
    expect(ownersNounBRCreated?.args?.seed.length).to.equal(5);

    noundersbrNounBRCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });

    ownersNounBRCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });
  });

  it('should set symbol', async () => {
    expect(await nounsbrToken.symbol()).to.eq('NOUNBR');
  });

  it('should set name', async () => {
    expect(await nounsbrToken.name()).to.eq('NounsBR');
  });

  it('should allow minter to mint a nounbr to itself', async () => {
    await (await nounsbrToken.mint()).wait();

    const receipt = await (await nounsbrToken.mint()).wait();
    const nounbrCreated = receipt.events?.[3];

    expect(await nounsbrToken.ownerOf(2)).to.eq(deployer.address);
    expect(nounbrCreated?.event).to.eq('NounBRCreated');
    expect(nounbrCreated?.args?.tokenId).to.eq(2);
    expect(nounbrCreated?.args?.seed.length).to.equal(5);

    nounbrCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });
  });

  it('should emit two transfer logs on mint', async () => {
    const [, , creator, minter] = await ethers.getSigners();

    await (await nounsbrToken.mint()).wait();

    await (await nounsbrToken.setMinter(minter.address)).wait();
    await (await nounsbrToken.transferOwnership(creator.address)).wait();

    const tx = nounsbrToken.connect(minter).mint();

    await expect(tx)
      .to.emit(nounsbrToken, 'Transfer')
      .withArgs(constants.AddressZero, creator.address, 2);
    await expect(tx).to.emit(nounsbrToken, 'Transfer').withArgs(creator.address, minter.address, 2);
  });

  it('should allow minter to burn a nounbr', async () => {
    await (await nounsbrToken.mint()).wait();

    const tx = nounsbrToken.burn(0);
    await expect(tx).to.emit(nounsbrToken, 'NounBRBurned').withArgs(0);
  });

  it('should revert on non-minter mint', async () => {
    const account0AsNounBRErc721Account = nounsbrToken.connect(noundersbrDAO);
    await expect(account0AsNounBRErc721Account.mint()).to.be.reverted;
  });

  describe('contractURI', async () => {
    it('should return correct contractURI', async () => {
      expect(await nounsbrToken.contractURI()).to.eq(
        'ipfs://QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX',
      );
    });
    it('should allow owner to set contractURI', async () => {
      await nounsbrToken.setContractURIHash('ABC123');
      expect(await nounsbrToken.contractURI()).to.eq('ipfs://ABC123');
    });
    it('should not allow non owner to set contractURI', async () => {
      const [, nonOwner] = await ethers.getSigners();
      await expect(nounsbrToken.connect(nonOwner).setContractURIHash('BAD')).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
    });
  });
});
