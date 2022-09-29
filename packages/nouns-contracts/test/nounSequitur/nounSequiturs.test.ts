import chai from 'chai';
import { ethers } from 'hardhat';
import { BigNumber as EthersBN, constants } from 'ethers';
import { solidity } from 'ethereum-waffle';
import { NounSequiturToken } from '../../typechain';
import { deployNounSequiturToken } from './utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);
const { expect } = chai;

describe('NounSequiturToken', () => {
  let nounSequiturToken: NounSequiturToken;
  let deployer: SignerWithAddress;
  let soundersDAO: SignerWithAddress;
  let snapshotId: number;

  before(async () => {
    [deployer, soundersDAO] = await ethers.getSigners();
    nounSequiturToken = await deployNounSequiturToken(
      deployer,
      soundersDAO.address,
      deployer.address,
    );
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  // it('should allow the minter to mint a noun to itself and a reward noun to the soundersDAO', async () => {});

  it('should set symbol', async () => {
    expect(await nounSequiturToken.symbol()).to.eq('NOUNSEQUITER');
  });

  it('should set name', async () => {
    expect(await nounSequiturToken.name()).to.eq('Noun Sequiturs');
  });

  it('should allow minter to mint a noun to itself', async () => {
    await (await nounSequiturToken.mint()).wait();

    const receipt = await (await nounSequiturToken.mint()).wait();
    const nounSequiturCreated = receipt.events?.[3];

    expect(await nounSequiturToken.ownerOf(2)).to.eq(deployer.address);
    expect(nounSequiturCreated?.event).to.eq('NounSequiturCreated');
    expect(nounSequiturCreated?.args?.tokenId).to.eq(2);
  });

  it('should emit two transfer logs on mint', async () => {
    const [, , creator, minter] = await ethers.getSigners();

    await (await nounSequiturToken.mint()).wait();

    await (await nounSequiturToken.setMinter(minter.address)).wait();
    await (await nounSequiturToken.transferOwnership(creator.address)).wait();

    const tx = nounSequiturToken.connect(minter).mint();

    await expect(tx)
      .to.emit(nounSequiturToken, 'Transfer')
      .withArgs(constants.AddressZero, creator.address, 2);
    await expect(tx)
      .to.emit(nounSequiturToken, 'Transfer')
      .withArgs(creator.address, minter.address, 2);
  });

  it('should allow minter to burn a noun sequitur', async () => {
    await (await nounSequiturToken.mint()).wait();

    const tx = nounSequiturToken.burn(0);
    await expect(tx).to.emit(nounSequiturToken, 'NounSequiturBurned').withArgs(0);
  });

  it('should revert on non-minter mint', async () => {
    const account0AsNounErc721Account = nounSequiturToken.connect(soundersDAO);
    await expect(account0AsNounErc721Account.mint()).to.be.reverted;
  });

  describe('contractURI', async () => {
    it('should return correct contractURI', async () => {
      expect(await nounSequiturToken.contractURI()).to.eq(
        'ipfs://QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX', // TODO: @enx
      );
    });
    it('should allow owner to set contractURI', async () => {
      await nounSequiturToken.setContractURIHash('ABC123');
      expect(await nounSequiturToken.contractURI()).to.eq('ipfs://ABC123');
    });
    it('should not allow non owner to set contractURI', async () => {
      const [, nonOwner] = await ethers.getSigners();
      await expect(
        nounSequiturToken.connect(nonOwner).setContractURIHash('BAD'),
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
});
