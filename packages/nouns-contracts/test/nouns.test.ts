import chai from 'chai';
import { ethers } from 'hardhat';
import { BigNumber as EthersBN,  } from 'ethers';
import { solidity } from 'ethereum-waffle';
import { NounsDescriptor__factory, NounsErc721 } from '../typechain';
import { deployNounsERC721, populateDescriptor } from './utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);
const { expect } = chai;

describe('NounsERC721', () => {
  let nounsErc721: NounsErc721;
  let deployer: SignerWithAddress;
  let noundersDAO: SignerWithAddress;

  beforeEach(async () => {
    [deployer, noundersDAO] = await ethers.getSigners();
    nounsErc721 = await deployNounsERC721(deployer, deployer.address, noundersDAO.address);

    const descriptor = await nounsErc721.descriptor();

    await populateDescriptor(NounsDescriptor__factory.connect(descriptor, deployer));
  });

  it('should allow minter to mint a noun to itself', async () => {
    const receipt = await (await nounsErc721.mint()).wait();
    const nounCreated = receipt.events?.[1];

    expect(await nounsErc721.ownerOf(0)).to.eq(deployer.address);
    expect(nounCreated?.event).to.eq('NounCreated');
    expect(nounCreated?.args?.tokenId).to.eq(0);
    expect(nounCreated?.args?.seed.length).to.equal(5);

    nounCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });
  });

  it('should allow the minter to mint a noun to itself and a reward noun to the noundersDAO', async () => {
    await (await nounsErc721.mint()).wait();

    const receipt = await (await nounsErc721.mint()).wait();
    const [, noundersNounCreated, , ownersNounCreated] = receipt.events || [];

    expect(await nounsErc721.ownerOf(1)).to.eq(noundersDAO.address);
    expect(noundersNounCreated?.event).to.eq('NounCreated');
    expect(noundersNounCreated?.args?.tokenId).to.eq(1);
    expect(noundersNounCreated?.args?.seed.length).to.equal(5);

    expect(await nounsErc721.ownerOf(2)).to.eq(deployer.address);
    expect(ownersNounCreated?.event).to.eq('NounCreated');
    expect(ownersNounCreated?.args?.tokenId).to.eq(2);
    expect(ownersNounCreated?.args?.seed.length).to.equal(5);

    noundersNounCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });

    ownersNounCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });
  });

  it('should allow minter to burn a noun', async () => {
    await (await nounsErc721.mint()).wait();

    const tx = nounsErc721.burn(0);
    await expect(tx).to.emit(nounsErc721, 'NounBurned').withArgs(0);
  });

  it('should revert on non-minter mint', async () => {
    const account0AsNounErc721Account = nounsErc721.connect(noundersDAO);
    await expect(account0AsNounErc721Account.mint()).to.be.reverted;
  });
});
