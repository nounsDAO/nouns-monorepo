import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers, upgrades } from 'hardhat';
import { NounsAuctionHouse, NounsErc721, Weth } from '../typechain';
import { deployNounsErc721, deployWeth } from './utils';

chai.use(solidity);
const { expect } = chai;

describe('NounsAuctionHouse', () => {
  let nounsAuctionHouse: NounsAuctionHouse;
  let nounsErc721: NounsErc721;
  let weth: Weth;
  let noundersDAO: SignerWithAddress;
  let nounsDAO: SignerWithAddress;
  let bidderA: SignerWithAddress;
  let bidderB: SignerWithAddress;

  const TIME_BUFFER = 15 * 60;
  const RESERVE_PRICE = 2;
  const MIN_INCREMENT_BID_PERCENTAGE = 5;
  const DURATION = 60 * 60 * 24;

  async function deploy(deployer?: SignerWithAddress) {
    const auctionHouseFactory = await ethers.getContractFactory(
      'NounsAuctionHouse',
      deployer,
    );
    nounsAuctionHouse = (await upgrades.deployProxy(auctionHouseFactory, [
      nounsErc721.address,
      nounsDAO.address,
      noundersDAO.address,
      weth.address,
      TIME_BUFFER,
      RESERVE_PRICE,
      MIN_INCREMENT_BID_PERCENTAGE,
      DURATION,
    ])) as NounsAuctionHouse;

    return nounsAuctionHouse.deployed();
  }

  beforeEach(async () => {
    [noundersDAO, nounsDAO, bidderA, bidderB] = await ethers.getSigners();
    nounsErc721 = await deployNounsErc721(noundersDAO);
    weth = await deployWeth(noundersDAO);
    await deploy(noundersDAO);

    await nounsErc721.setAuctionHouse(nounsAuctionHouse.address);
  });

  it('should revert if a second initialization is attempted', async () => {
    const tx = nounsAuctionHouse.initialize(
      nounsErc721.address,
      nounsDAO.address,
      noundersDAO.address,
      weth.address,
      TIME_BUFFER,
      RESERVE_PRICE,
      MIN_INCREMENT_BID_PERCENTAGE,
      DURATION,
    );
    await expect(tx).to.be.revertedWith(
      'Initializable: contract is already initialized',
    );
  });

  it('should allow the noundersDAO to unpause the contract and create the first auction', async () => {
    const tx = await nounsAuctionHouse.unpause();
    await tx.wait();

    const auction = await nounsAuctionHouse.auction();
    await expect(auction.startTime.toNumber()).to.be.greaterThan(0);
  });

  it('should revert if a user creates a bid for an inactive auction', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { nounId } = await nounsAuctionHouse.auction();
    const tx = nounsAuctionHouse.connect(bidderA).createBid(nounId.add(1), {
      value: RESERVE_PRICE,
    });

    await expect(tx).to.be.revertedWith('Noun not up for auction');
  });

  it('should revert if a user creates a bid for an expired auction', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    const { nounId } = await nounsAuctionHouse.auction();
    const tx = nounsAuctionHouse.connect(bidderA).createBid(nounId, {
      value: RESERVE_PRICE,
    });

    await expect(tx).to.be.revertedWith('Auction expired');
  });

  it('should revert if a user creates a bid with an amount below the reserve price', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { nounId } = await nounsAuctionHouse.auction();
    const tx = nounsAuctionHouse.connect(bidderA).createBid(nounId, {
      value: RESERVE_PRICE - 1,
    });

    await expect(tx).to.be.revertedWith('Must send at least reservePrice');
  });

  it('should revert if a user creates a bid less than the min bid increment percentage', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { nounId } = await nounsAuctionHouse.auction();
    await nounsAuctionHouse.connect(bidderA).createBid(nounId, {
      value: RESERVE_PRICE * 50,
    });
    const tx = nounsAuctionHouse.connect(bidderB).createBid(nounId, {
      value: RESERVE_PRICE * 51,
    });

    await expect(tx).to.be.revertedWith(
      'Must send more than last bid by minBidIncrementPercentage amount',
    );
  });

  it('should refund the previous bidder when the following user creates a bid', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { nounId } = await nounsAuctionHouse.auction();
    await nounsAuctionHouse.connect(bidderA).createBid(nounId, {
      value: RESERVE_PRICE,
    });

    const bidderAPostBidBalance = await bidderA.getBalance();
    await nounsAuctionHouse.connect(bidderB).createBid(nounId, {
      value: RESERVE_PRICE * 2,
    });
    const bidderAPostRefundBalance = await bidderA.getBalance();

    expect(bidderAPostRefundBalance).to.equal(
      bidderAPostBidBalance.add(RESERVE_PRICE),
    );
  });

  it('should emit an `AuctionBid` event on a successful bid', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { nounId } = await nounsAuctionHouse.auction();
    const tx = nounsAuctionHouse.connect(bidderA).createBid(nounId, {
      value: RESERVE_PRICE,
    });

    await expect(tx)
      .to.emit(nounsAuctionHouse, 'AuctionBid')
      .withArgs(nounId, bidderA.address, RESERVE_PRICE, true, false);
  });

  it('should emit an `AuctionExtended` event if the auction end time is within the time buffer', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { nounId, endTime } = await nounsAuctionHouse.auction();

    await ethers.provider.send('evm_setNextBlockTimestamp', [
      endTime.sub(60 * 5).toNumber(),
    ]); // Subtract 5 mins from current end time

    const tx = nounsAuctionHouse.connect(bidderA).createBid(nounId, {
      value: RESERVE_PRICE,
    });

    await expect(tx)
      .to.emit(nounsAuctionHouse, 'AuctionExtended')
      .withArgs(nounId, endTime.add(60 * 10));
  });

  it('should revert if auction settlement is attempted while the auction is still active', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { nounId } = await nounsAuctionHouse.auction();

    await nounsAuctionHouse.connect(bidderA).createBid(nounId, {
      value: RESERVE_PRICE,
    });
    const tx = nounsAuctionHouse
      .connect(bidderA)
      .settleCurrentAndCreateNewAuction();

    await expect(tx).to.be.revertedWith("Auction hasn't completed");
  });

  it('should emit `AuctionSettled` and `AuctionCreated` events if all conditions are met', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { nounId } = await nounsAuctionHouse.auction();

    await nounsAuctionHouse.connect(bidderA).createBid(nounId, {
      value: RESERVE_PRICE,
    });

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours
    const tx = nounsAuctionHouse
      .connect(bidderA)
      .settleCurrentAndCreateNewAuction();

    await Promise.all([
      expect(tx)
        .to.emit(nounsAuctionHouse, 'AuctionSettled')
        .withArgs(nounId, bidderA.address, RESERVE_PRICE),
      expect(tx)
        .to.emit(nounsAuctionHouse, 'AuctionCreated')
        .withArgs(nounId.add(1)),
    ]);
  });

  it('should not create a new auction if the auction house is paused and unpaused while an auction is ongoing', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    await (await nounsAuctionHouse.pause()).wait();

    await (await nounsAuctionHouse.unpause()).wait();

    const { nounId } = await nounsAuctionHouse.auction();

    expect(nounId).to.equal(0);
  });

  it('should create a new auction if the auction house is paused and unpaused after an auction is settled', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { nounId } = await nounsAuctionHouse.auction();

    await nounsAuctionHouse.connect(bidderA).createBid(nounId, {
      value: RESERVE_PRICE,
    });

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    await (await nounsAuctionHouse.pause()).wait();

    const settleTx = nounsAuctionHouse.connect(bidderA).settleAuction();

    await expect(settleTx)
      .to.emit(nounsAuctionHouse, 'AuctionSettled')
      .withArgs(nounId, bidderA.address, RESERVE_PRICE);

    const unpauseTx = nounsAuctionHouse.unpause();
    await expect(unpauseTx)
      .to.emit(nounsAuctionHouse, 'AuctionCreated')
      .withArgs(nounId.add(1));
  });

  it('should burn a Noun on auction settlement if no bids are received', async () => {
    await (await nounsAuctionHouse.unpause()).wait();

    const { nounId } = await nounsAuctionHouse.auction();

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    const tx = nounsAuctionHouse
      .connect(bidderA)
      .settleCurrentAndCreateNewAuction();

    await expect(tx)
      .to.emit(nounsAuctionHouse, 'AuctionSettled')
      .withArgs(nounId, '0x0000000000000000000000000000000000000000', 0);
  });
});
