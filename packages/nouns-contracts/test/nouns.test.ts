import { BigNumber as EthersBN } from 'ethers';
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { NounsDescriptor__factory, NounsErc721 } from '../typechain';
import {
  deployNounsERC721,
  getSigners,
  populateDescriptor,
  TestSigners,
} from './utils';

chai.use(solidity);
const { expect } = chai;

describe('NounsERC721', () => {
  let nounsErc721: NounsErc721;
  let signers: TestSigners;

  beforeEach(async () => {
    signers = await getSigners();
    nounsErc721 = await deployNounsERC721();

    const descriptor = await nounsErc721.descriptor();

    await populateDescriptor(
      NounsDescriptor__factory.connect(descriptor, signers.deployer),
    );
  });

  it('should allow owner to mint a noun', async () => {
    const receipt = await (await nounsErc721.mint()).wait();
    const nounCreated = receipt.events?.[1];

    expect(await nounsErc721.ownerOf(0)).to.eq(signers.deployer.address);
    expect(nounCreated?.event).to.eq('NounCreated');
    expect(nounCreated?.args?.tokenId).to.eq(0);
    expect(nounCreated?.args?.seed.length).to.equal(5);

    nounCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });
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
