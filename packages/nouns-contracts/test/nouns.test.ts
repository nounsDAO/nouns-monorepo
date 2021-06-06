import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { NounsErc721 } from '../typechain';
import { deployNounsErc721, getSigners, TestSigners } from './utils';

chai.use(solidity);
const { expect } = chai;

describe('NounsErc721', () => {
  let nounsErc721: NounsErc721;
  let signers: TestSigners;

  beforeEach(async () => {
    signers = await getSigners();
    nounsErc721 = await deployNounsErc721();
  });

  it('should set base URI', async () => {
    expect(await nounsErc721.baseURI()).to.eq('ipfs://');
  });

  it('should allow owner/deployer to createNoun and emit NounCreated', async () => {
    const receipt = await (await nounsErc721.createNoun()).wait();
    expect(await nounsErc721.ownerOf(0)).to.eq(signers.deployer.address);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(receipt.events![1].event).to.eq('NounCreated');
  });

  it('should revert on non-owner createNoun', async () => {
    const account0AsNounErc721Account = nounsErc721.connect(signers.account0);
    await expect(
      account0AsNounErc721Account.createNoun(),
    ).to.be.reverted;
  });
});
