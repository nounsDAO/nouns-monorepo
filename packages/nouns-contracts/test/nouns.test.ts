import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { NounsErc721 } from '../typechain';
import { deployNounsErc721, getSigners, TestSigners } from './utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';

chai.use(solidity);
const { expect } = chai;

describe('NounsERC721', () => {
  let nounsErc721: NounsErc721;
  let auctionHouseAsNounErc721Account: NounsErc721;
  let signers: TestSigners;

  beforeEach(async () => {
    signers = await getSigners();
    nounsErc721 = await deployNounsErc721();
    // setAuctionHouse to immediately to make things easier; otherwise its address(0)
    await nounsErc721.setAuctionHouse(signers.account1.address);
    auctionHouseAsNounErc721Account = nounsErc721.connect(signers.account1)
  });


  it('should assign owner address correctly', async () => {
    expect(await nounsErc721.owner()).to.eq(signers.deployer.address);
  })

  it('should set base URI', async () => {
    await (await auctionHouseAsNounErc721Account.mint()).wait();
    expect(await nounsErc721.tokenURI(0)).to.eq('ipfs://0');
  });

  it('should allow auction house to mint a noun', async () => {
    const receipt = await (await auctionHouseAsNounErc721Account.mint()).wait();
    expect(await nounsErc721.ownerOf(0)).to.eq(signers.account1.address);
    expect(receipt.events?.[1].event).to.eq('NounCreated');
  });

  it('should allow auction house to burn a noun', async () => {
    await (await auctionHouseAsNounErc721Account.mint()).wait();

    const tx = auctionHouseAsNounErc721Account.burn(0);
    await expect(tx).to.emit(nounsErc721, 'NounBurned').withArgs(0);
  });

  it('should revert on non-auction house mint', async () => {
    const account0AsNounErc721Account = nounsErc721.connect(signers.account0);
    await expect(account0AsNounErc721Account.mint()).to.be.reverted;
  });

  it('should allow owner to change auctionHouse address', async () => {
    const tx = nounsErc721.setAuctionHouse(signers.account0.address);
    await expect(tx).to.emit(nounsErc721, 'AuctionHouseChanged').withArgs(signers.account1.address, signers.account0.address);
  })

  it('should revert on non-owner auctionHouse change', async () => {
    const account0AsNounErc721Account = nounsErc721.connect(signers.account0);
    await expect(account0AsNounErc721Account.setAuctionHouse(signers.deployer.address)).to.be.reverted;
  });
});
