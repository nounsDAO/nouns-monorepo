import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { constants } from 'ethers';
import { ethers, upgrades } from 'hardhat';
import {
  MaliciousBidder__factory as MaliciousBidderFactory,
  NAuctionHouse,
  NDescriptorV2__factory as NDescriptorV2Factory,
  NToken,
  WETH,
} from '../typechain';
import { deployNToken, deployWeth, populateDescriptorV2 } from './utils';

chai.use(solidity);
const { expect } = chai;

describe('NAuctionHouse', () => {
  let nAuctionHouse: NAuctionHouse;
  let nToken: NToken;
  let weth: WETH;
  let deployer: SignerWithAddress;
  let noundersDAO: SignerWithAddress;
  let bidderA: SignerWithAddress;
  let bidderB: SignerWithAddress;
  let snapshotId: number;

  const TIME_BUFFER = 15 * 60;
  const RESERVE_PRICE = 2;
  const MIN_INCREMENT_BID_PERCENTAGE = 5;
  const DURATION = 60 * 60 * 24;

  async function deploy(deployer?: SignerWithAddress) {
    const auctionHouseFactory = await ethers.getContractFactory('NAuctionHouse', deployer);
    return upgrades.deployProxy(auctionHouseFactory, [
      nToken.address,
      weth.address,
      TIME_BUFFER,
      RESERVE_PRICE,
      MIN_INCREMENT_BID_PERCENTAGE,
      DURATION,
    ]) as Promise<NAuctionHouse>;
  }

  before(async () => {
    [deployer, noundersDAO, bidderA, bidderB] = await ethers.getSigners();

    nToken = await deployNToken(deployer, noundersDAO.address, deployer.address);
    weth = await deployWeth(deployer);
    nAuctionHouse = await deploy(deployer);

    const descriptor = await nToken.descriptor();

    await populateDescriptorV2(NDescriptorV2Factory.connect(descriptor, deployer));

    await nToken.setMinter(nAuctionHouse.address);
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('should revert if a second initialization is attempted', async () => {
    const tx = nAuctionHouse.initialize(
      nToken.address,
      weth.address,
      TIME_BUFFER,
      RESERVE_PRICE,
      MIN_INCREMENT_BID_PERCENTAGE,
      DURATION,
    );
    await expect(tx).to.be.revertedWith('Initializable: contract is already initialized');
  });

  it('should allow the noundersDAO to unpause the contract and create the first auction', async () => {
    const tx = await nAuctionHouse.unpause();
    await tx.wait();

    const auction = await nAuctionHouse.auction();
    expect(auction.startTime.toNumber()).to.be.greaterThan(0);
  });

  it('should revert if a user creates a bid for an inactive auction', async () => {
    await (await nAuctionHouse.unpause()).wait();

    const { tokenId } = await nAuctionHouse.auction();
    const tx = nAuctionHouse.connect(bidderA).createBid(tokenId.add(1), {
      value: RESERVE_PRICE,
    });

    await expect(tx).to.be.revertedWith('Noun not up for auction');
  });

  it('should revert if a user creates a bid for an expired auction', async () => {
    await (await nAuctionHouse.unpause()).wait();

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    const { tokenId } = await nAuctionHouse.auction();
    const tx = nAuctionHouse.connect(bidderA).createBid(tokenId, {
      value: RESERVE_PRICE,
    });

    await expect(tx).to.be.revertedWith('Auction expired');
  });

  it('should revert if a user creates a bid with an amount below the reserve price', async () => {
    await (await nAuctionHouse.unpause()).wait();

    const { tokenId } = await nAuctionHouse.auction();
    const tx = nAuctionHouse.connect(bidderA).createBid(tokenId, {
      value: RESERVE_PRICE - 1,
    });

    await expect(tx).to.be.revertedWith('Must send at least reservePrice');
  });

  it('should revert if a user creates a bid less than the min bid increment percentage', async () => {
    await (await nAuctionHouse.unpause()).wait();

    const { tokenId } = await nAuctionHouse.auction();
    await nAuctionHouse.connect(bidderA).createBid(tokenId, {
      value: RESERVE_PRICE * 50,
    });
    const tx = nAuctionHouse.connect(bidderB).createBid(tokenId, {
      value: RESERVE_PRICE * 51,
    });

    await expect(tx).to.be.revertedWith(
      'Must send more than last bid by minBidIncrementPercentage amount',
    );
  });

  it('should refund the previous bidder when the following user creates a bid', async () => {
    await (await nAuctionHouse.unpause()).wait();

    const { tokenId } = await nAuctionHouse.auction();
    await nAuctionHouse.connect(bidderA).createBid(tokenId, {
      value: RESERVE_PRICE,
    });

    const bidderAPostBidBalance = await bidderA.getBalance();
    await nAuctionHouse.connect(bidderB).createBid(tokenId, {
      value: RESERVE_PRICE * 2,
    });
    const bidderAPostRefundBalance = await bidderA.getBalance();

    expect(bidderAPostRefundBalance).to.equal(bidderAPostBidBalance.add(RESERVE_PRICE));
  });

  it('should cap the maximum bid griefing cost at 30K gas + the cost to wrap and transfer WETH', async () => {
    await (await nAuctionHouse.unpause()).wait();

    const { tokenId } = await nAuctionHouse.auction();

    const maliciousBidderFactory = new MaliciousBidderFactory(bidderA);
    const maliciousBidder = await maliciousBidderFactory.deploy();

    const maliciousBid = await maliciousBidder
      .connect(bidderA)
      .bid(nAuctionHouse.address, tokenId, {
        value: RESERVE_PRICE,
      });
    await maliciousBid.wait();

    const tx = await nAuctionHouse.connect(bidderB).createBid(tokenId, {
      value: RESERVE_PRICE * 2,
      gasLimit: 1_000_000,
    });
    const result = await tx.wait();

    expect(result.gasUsed.toNumber()).to.be.lessThan(200_000);
    expect(await weth.balanceOf(maliciousBidder.address)).to.equal(RESERVE_PRICE);
  });

  it('should emit an `AuctionBid` event on a successful bid', async () => {
    await (await nAuctionHouse.unpause()).wait();

    const { tokenId } = await nAuctionHouse.auction();
    const tx = nAuctionHouse.connect(bidderA).createBid(tokenId, {
      value: RESERVE_PRICE,
    });

    await expect(tx)
      .to.emit(nAuctionHouse, 'AuctionBid')
      .withArgs(tokenId, bidderA.address, RESERVE_PRICE, false);
  });

  it('should emit an `AuctionExtended` event if the auction end time is within the time buffer', async () => {
    await (await nAuctionHouse.unpause()).wait();

    const { tokenId, endTime } = await nAuctionHouse.auction();

    await ethers.provider.send('evm_setNextBlockTimestamp', [endTime.sub(60 * 5).toNumber()]); // Subtract 5 mins from current end time

    const tx = nAuctionHouse.connect(bidderA).createBid(tokenId, {
      value: RESERVE_PRICE,
    });

    await expect(tx)
      .to.emit(nAuctionHouse, 'AuctionExtended')
      .withArgs(tokenId, endTime.add(60 * 10));
  });

  it('should revert if auction settlement is attempted while the auction is still active', async () => {
    await (await nAuctionHouse.unpause()).wait();

    const { tokenId } = await nAuctionHouse.auction();

    await nAuctionHouse.connect(bidderA).createBid(tokenId, {
      value: RESERVE_PRICE,
    });
    const tx = nAuctionHouse.connect(bidderA).settleCurrentAndCreateNewAuction();

    await expect(tx).to.be.revertedWith("Auction hasn't completed");
  });

  it('should emit `AuctionSettled` and `AuctionCreated` events if all conditions are met', async () => {
    await (await nAuctionHouse.unpause()).wait();

    const { tokenId } = await nAuctionHouse.auction();

    await nAuctionHouse.connect(bidderA).createBid(tokenId, {
      value: RESERVE_PRICE,
    });

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours
    const tx = await nAuctionHouse.connect(bidderA).settleCurrentAndCreateNewAuction();

    const receipt = await tx.wait();
    const { timestamp } = await ethers.provider.getBlock(receipt.blockHash);

    const settledEvent = receipt.events?.find(e => e.event === 'AuctionSettled');
    const createdEvent = receipt.events?.find(e => e.event === 'AuctionCreated');

    expect(settledEvent?.args?.tokenId).to.equal(tokenId);
    expect(settledEvent?.args?.winner).to.equal(bidderA.address);
    expect(settledEvent?.args?.amount).to.equal(RESERVE_PRICE);

    expect(createdEvent?.args?.tokenId).to.equal(tokenId.add(1));
    expect(createdEvent?.args?.startTime).to.equal(timestamp);
    expect(createdEvent?.args?.endTime).to.equal(timestamp + DURATION);
  });

  it('should not create a new auction if the auction house is paused and unpaused while an auction is ongoing', async () => {
    await (await nAuctionHouse.unpause()).wait();

    await (await nAuctionHouse.pause()).wait();

    await (await nAuctionHouse.unpause()).wait();

    const { tokenId } = await nAuctionHouse.auction();

    expect(tokenId).to.equal(1);
  });

  it('should create a new auction if the auction house is paused and unpaused after an auction is settled', async () => {
    await (await nAuctionHouse.unpause()).wait();

    const { tokenId } = await nAuctionHouse.auction();

    await nAuctionHouse.connect(bidderA).createBid(tokenId, {
      value: RESERVE_PRICE,
    });

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    await (await nAuctionHouse.pause()).wait();

    const settleTx = nAuctionHouse.connect(bidderA).settleAuction();

    await expect(settleTx)
      .to.emit(nAuctionHouse, 'AuctionSettled')
      .withArgs(tokenId, bidderA.address, RESERVE_PRICE);

    const unpauseTx = await nAuctionHouse.unpause();
    const receipt = await unpauseTx.wait();
    const { timestamp } = await ethers.provider.getBlock(receipt.blockHash);

    const createdEvent = receipt.events?.find(e => e.event === 'AuctionCreated');

    expect(createdEvent?.args?.tokenId).to.equal(tokenId.add(1));
    expect(createdEvent?.args?.startTime).to.equal(timestamp);
    expect(createdEvent?.args?.endTime).to.equal(timestamp + DURATION);
  });

  it('should settle the current auction and pause the contract if the minter is updated while the auction house is unpaused', async () => {
    await (await nAuctionHouse.unpause()).wait();

    const { tokenId } = await nAuctionHouse.auction();

    await nAuctionHouse.connect(bidderA).createBid(tokenId, {
      value: RESERVE_PRICE,
    });

    await nToken.setMinter(constants.AddressZero);

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    const settleTx = nAuctionHouse.connect(bidderA).settleCurrentAndCreateNewAuction();

    await expect(settleTx)
      .to.emit(nAuctionHouse, 'AuctionSettled')
      .withArgs(tokenId, bidderA.address, RESERVE_PRICE);

    const paused = await nAuctionHouse.paused();

    expect(paused).to.equal(true);
  });

  it('should burn a Noun on auction settlement if no bids are received', async () => {
    await (await nAuctionHouse.unpause()).wait();

    const { tokenId } = await nAuctionHouse.auction();

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    const tx = nAuctionHouse.connect(bidderA).settleCurrentAndCreateNewAuction();

    await expect(tx)
      .to.emit(nAuctionHouse, 'AuctionSettled')
      .withArgs(tokenId, '0x0000000000000000000000000000000000000000', 0);
  });
});
