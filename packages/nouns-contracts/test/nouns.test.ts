import chai from 'chai';
import { ethers } from 'hardhat';
import { BigNumber as EthersBN, constants } from 'ethers';
import { solidity } from 'ethereum-waffle';
import { NDescriptorV2__factory as NDescriptorV2Factory, NToken, NSeeder__factory as NSeederFactory } from '../typechain';
import { deployNToken, populateDescriptorV2, populateSeeder } from './utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);
const { expect } = chai;

describe('NToken', () => {
  let nounsToken: NToken;
  let deployer: SignerWithAddress;
  let noundersDAO: SignerWithAddress;
  let snapshotId: number;

  before(async () => {
    [deployer, noundersDAO] = await ethers.getSigners();
    nounsToken = await deployNToken(deployer, noundersDAO.address, deployer.address);

    const descriptor = await nounsToken.descriptor();
    const seeder = await nounsToken.seeder();

    await populateDescriptorV2(NDescriptorV2Factory.connect(descriptor, deployer));
    await populateSeeder(NSeederFactory.connect(seeder, deployer));
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('should allow the minter to mint a noun to itself and a reward noun to the noundersDAO', async () => {
    const receipt = await (await nounsToken.mint()).wait();

    const [, , , noundersNounCreated, , , , ownersNounCreated] = receipt.events || [];

    expect(await nounsToken.ownerOf(10_000)).to.eq(noundersDAO.address);
    expect(noundersNounCreated?.event).to.eq('PunkCreated');
    expect(noundersNounCreated?.args?.tokenId).to.eq(10_000);
    expect(noundersNounCreated?.args?.seed.length).to.equal(3);
    expect(noundersNounCreated?.args?.seed.punkType).to.be.a('number');
    expect(noundersNounCreated?.args?.seed.skinTone).to.be.a('number');

    expect(await nounsToken.ownerOf(10_001)).to.eq(deployer.address);
    expect(ownersNounCreated?.event).to.eq('PunkCreated');
    expect(ownersNounCreated?.args?.tokenId).to.eq(10_001);
    expect(ownersNounCreated?.args?.seed.length).to.equal(3);
    expect(ownersNounCreated?.args?.seed.punkType).to.be.a('number');
    expect(ownersNounCreated?.args?.seed.skinTone).to.be.a('number');

    noundersNounCreated?.args?.seed.accessories.forEach((item: any) => {
      expect(item.accType).to.be.a('number');
      expect(item.accId).to.be.a('number');
    });

    ownersNounCreated?.args?.seed.accessories.forEach((item: any) => {
      expect(item.accType).to.be.a('number');
      expect(item.accId).to.be.a('number');
    });
  });

  it('should set symbol', async () => {
    expect(await nounsToken.symbol()).to.eq('PUNK');
  });

  it('should set name', async () => {
    expect(await nounsToken.name()).to.eq('Cryptopunks');
  });

  it('should allow minter to mint a noun to itself', async () => {
    await (await nounsToken.mint()).wait();

    const receipt = await (await nounsToken.mint()).wait();
    const nounCreated = receipt.events?.[3];

    expect(await nounsToken.ownerOf(10_002)).to.eq(deployer.address);
    expect(nounCreated?.event).to.eq('PunkCreated');
    expect(nounCreated?.args?.tokenId).to.eq(10_002);
    expect(nounCreated?.args?.seed.length).to.equal(3);
    expect(nounCreated?.args?.seed.punkType).to.be.a('number');
    expect(nounCreated?.args?.seed.skinTone).to.be.a('number');

    nounCreated?.args?.seed.accessories.forEach((item: any) => {
      expect(item.accType).to.be.a('number');
      expect(item.accId).to.be.a('number');
    });
  });

  it('should emit two transfer logs on mint', async () => {
    const [, , creator, minter] = await ethers.getSigners();

    await (await nounsToken.mint()).wait();

    await (await nounsToken.setMinter(minter.address)).wait();
    await (await nounsToken.transferOwnership(creator.address)).wait();

    const tx = nounsToken.connect(minter).mint();

    await expect(tx)
      .to.emit(nounsToken, 'Transfer')
      .withArgs(constants.AddressZero, creator.address, 10_002);
    await expect(tx).to.emit(nounsToken, 'Transfer').withArgs(creator.address, minter.address, 10_002);
  });

  it('should allow minter to burn a noun', async () => {
    await (await nounsToken.mint()).wait();

    const tx = nounsToken.burn(10_000);
    await expect(tx).to.emit(nounsToken, 'PunkBurned').withArgs(10_000);
  });

  it('should revert on non-minter mint', async () => {
    const account0AsNounErc721Account = nounsToken.connect(noundersDAO);
    await expect(account0AsNounErc721Account.mint()).to.be.reverted;
  });

  it('generated seeds have sorted accessories', async () => {
    const seederAddress = await nounsToken.seeder();
    const seeder = NSeederFactory.connect(seederAddress, deployer);
    for (let i = 0; i < 20 ; i ++) {
      const n = ethers.BigNumber.from(ethers.utils.keccak256(ethers.BigNumber.from(i).toHexString()));
      const seed = await seeder.generateSeedFromNumber(n);
      const accessories = seed.accessories;
      for (let j = 0 ; j < accessories.length - 1 ; j ++) {
        expect(accessories[j].accType).to.be.lt(accessories[j+1].accType);
      }
    }
  });

  it('calculates correct seed hash', async () => {
    const seed = {punkType: 1, skinTone: 2, accessories: [{accType: 9, accId: 23}, {accType: 10, accId: 5}, {accType: 11, accId: 15}]}
    const seedHash = await nounsToken.calculateSeedHash(seed);
    expect(seedHash).to.be.equal('0x00000000000000000000000000000000000000000000000f0b050a1709030201');
  });

  describe('contractURI', async () => {
    it('should return correct contractURI', async () => {
      expect(await nounsToken.contractURI()).to.eq(
        'ipfs://QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX',
      );
    });
    it('should allow owner to set contractURI', async () => {
      await nounsToken.setContractURIHash('ABC123');
      expect(await nounsToken.contractURI()).to.eq('ipfs://ABC123');
    });
    it('should not allow non owner to set contractURI', async () => {
      const [, nonOwner] = await ethers.getSigners();
      await expect(nounsToken.connect(nonOwner).setContractURIHash('BAD')).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
    });
  });
});
