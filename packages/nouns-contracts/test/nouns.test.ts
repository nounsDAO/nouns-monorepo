import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { NounsErc721 } from '../typechain';
import { deployNounsErc721, getSigners, TestSigners } from './utils';

chai.use(solidity);
const { expect } = chai;

describe('NounsERC721', () => {
  let nounsErc721: NounsErc721;
  let signers: TestSigners;

  beforeEach(async () => {
    signers = await getSigners();
    nounsErc721 = await deployNounsErc721();
  });

  it('should set base URI', async () => {
    await (await nounsErc721.mint()).wait();
    expect(await nounsErc721.tokenURI(0)).to.eq('ipfs://0');
  });

  it('should allow owner to mint a noun', async () => {
    const receipt = await (await nounsErc721.mint()).wait();
    expect(await nounsErc721.ownerOf(0)).to.eq(signers.deployer.address);
    expect(receipt.events?.[1].event).to.eq('NounCreated');
  });

  it('should allow owner to burn a noun', async () => {
    await (await nounsErc721.mint()).wait();

    const tx = nounsErc721.burn(0);
    await expect(tx).to.emit(nounsErc721, 'NounBurned').withArgs(0);
  });

  it('should revert on non-owner createNoun', async () => {
    const account0AsNounErc721Account = nounsErc721.connect(signers.account0);
    await expect(account0AsNounErc721Account.mint()).to.be.reverted;
  });
});
