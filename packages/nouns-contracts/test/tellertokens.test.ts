import chai from 'chai';
import { ethers } from 'hardhat';
import { BigNumber as EthersBN, constants } from 'ethers';
import { solidity } from 'ethereum-waffle';
import {  TellerToken, TellerTreasury } from '../typechain';
import { deployTellerToken, deployWeth, deployTellerTreasury } from './utils';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);
const { expect } = chai;

describe('NounsToken', () => {
  let tellerToken: TellerToken;
  let tellerTreasury: TellerTreasury;
  let deployer: SignerWithAddress;
  //let TreasuryDAO: SignerWithAddress;
  let snapshotId: number;

  before(async () => {
    [deployer] = await ethers.getSigners();

    tellerTreasury = await deployTellerTreasury(deployer);
    tellerToken = await deployTellerToken(deployer,  deployer.address);

    const descriptor = await tellerToken.descriptor();

    //await populateDescriptor(NounsDescriptorFactory.connect(descriptor, deployer));
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('should allow the minter to mint a noun to itself and a reward noun to the noundersDAO', async () => {
    const receipt = await (await tellerToken.mint()).wait();

    const [, , , ownersNounCreated] = receipt.events || [];
 
    expect(await tellerToken.ownerOf(0)).to.eq(deployer.address);
    expect(ownersNounCreated?.event).to.eq('TellerCardCreated');
    expect(ownersNounCreated?.args?.tokenId).to.eq(0);
    //expect(ownersNounCreated?.args?.seed.length).to.equal(5);
 

    /*ownersNounCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });*/
  });

  it('should set symbol', async () => {
    expect(await tellerToken.symbol()).to.eq('TCARD');
  });

  it('should set name', async () => {
    expect(await tellerToken.name()).to.eq('TellerCard');
  });

  it('should allow minter to mint a noun to itself', async () => {
    await (await tellerToken.mint()).wait();

    const receipt = await (await tellerToken.mint()).wait();
    const nounCreated = receipt.events?.[3];

    expect(await tellerToken.ownerOf(1)).to.eq(deployer.address);
    expect(nounCreated?.event).to.eq('TellerCardCreated');
    expect(nounCreated?.args?.tokenId).to.eq(1);
    //expect(nounCreated?.args?.seed.length).to.equal(5);

    /*nounCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });*/
  });

  it('should emit two transfer logs on mint', async () => {
    const [, , creator, minter] = await ethers.getSigners();

    await (await tellerToken.mint()).wait();

    await (await tellerToken.setMinter(minter.address)).wait();
    await (await tellerToken.transferOwnership(creator.address)).wait();

    const tx = tellerToken.connect(minter).mint();

    await expect(tx)
      .to.emit(tellerToken, 'Transfer')
      .withArgs(constants.AddressZero, creator.address, 1);

    await expect(tx).to.emit(tellerToken, 'Transfer').withArgs(creator.address, minter.address, 1);
  });

  it('should allow minter to burn a noun', async () => {
    await (await tellerToken.mint()).wait();

    const tx = tellerToken.burn(0);
    await expect(tx).to.emit(tellerToken, 'TellerCardBurned').withArgs(0);
  });

  it('should revert on non-minter mint', async () => {
    const account0AsNounErc721Account = tellerToken.connect(tellerTreasury.address);
    await expect(account0AsNounErc721Account.mint()).to.be.reverted;
  });

  describe('contractURI', async () => {
    it('should return correct contractURI', async () => {
      expect(await tellerToken.contractURI()).to.eq(
        'ipfs://QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX',
      );
    });
    it('should allow owner to set contractURI', async () => {
      await tellerToken.setContractURIHash('ABC123');
      expect(await tellerToken.contractURI()).to.eq('ipfs://ABC123');
    });
    it('should not allow non owner to set contractURI', async () => {
      const [, nonOwner] = await ethers.getSigners();
      await expect(tellerToken.connect(nonOwner).setContractURIHash('BAD')).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
    });
  });
});
