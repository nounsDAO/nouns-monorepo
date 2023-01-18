import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { constants } from 'ethers';
import { ethers, upgrades } from 'hardhat';
import {
  MaliciousBidder__factory as MaliciousBidderFactory,
  N00unsAuctionHouse,
  N00unsDescriptorV2__factory as N00unsDescriptorV2Factory,
  N00unsToken,
  WETH,
} from '../typechain';
import { deployN00unsToken, deployWeth, populateDescriptorV2 } from './utils';

chai.use(solidity);
const { expect } = chai;

describe('N00unsAuctionHouse', () => {
  let n00unsAuctionHouse: N00unsAuctionHouse;
  let n00unsToken: N00unsToken;
  let weth: WETH;
  let deployer: SignerWithAddress;
  let n00undersDAO: SignerWithAddress;
  let bidderA: SignerWithAddress;
  let bidderB: SignerWithAddress;
  let snapshotId: number;

  const TIME_BUFFER = 15 * 60;
  const RESERVE_PRICE = 2;
  const MIN_INCREMENT_BID_PERCENTAGE = 5;
  const DURATION = 60 * 60 * 24;

  async function deploy(deployer?: SignerWithAddress) {
    const auctionHouseFactory = await ethers.getContractFactory('N00unsAuctionHouse', deployer);
    return upgrades.deployProxy(auctionHouseFactory, [
      n00unsToken.address,
      weth.address,
      TIME_BUFFER,
      RESERVE_PRICE,
      MIN_INCREMENT_BID_PERCENTAGE,
      DURATION,
    ]) as Promise<N00unsAuctionHouse>;
  }

  before(async () => {
    [deployer, n00undersDAO, bidderA, bidderB] = await ethers.getSigners();

    n00unsToken = await deployN00unsToken(deployer, n00undersDAO.address, deployer.address);
    weth = await deployWeth(deployer);
    n00unsAuctionHouse = await deploy(deployer);

    const descriptor = await n00unsToken.descriptor();

    await populateDescriptorV2(N00unsDescriptorV2Factory.connect(descriptor, deployer));

    await n00unsToken.setMinter(n00unsAuctionHouse.address);
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('should revert if a second initialization is attempted', async () => {
    const tx = n00unsAuctionHouse.initialize(
      n00unsToken.address,
      weth.address,
      TIME_BUFFER,
      RESERVE_PRICE,
      MIN_INCREMENT_BID_PERCENTAGE,
      DURATION,
    );
    await expect(tx).to.be.revertedWith('Initializable: contract is already initialized');
  });

  it('should allow the n00undersDAO to unpause the contract and create the first auction', async () => {
    const tx = await n00unsAuctionHouse.unpause();
    await tx.wait();

    const auction = await n00unsAuctionHouse.auction();
    expect(auction.startTime.toNumber()).to.be.greaterThan(0);
  });

  it('should revert if a user creates a bid for an inactive auction', async () => {
    await (await n00unsAuctionHouse.unpause()).wait();

    const { n00unId } = await n00unsAuctionHouse.auction();
    const tx = n00unsAuctionHouse.connect(bidderA).createBid(n00unId.add(1), {
      value: RESERVE_PRICE,
    });

    await expect(tx).to.be.revertedWith('N00un not up for auction');
  });

  it('should revert if a user creates a bid for an expired auction', async () => {
    await (await n00unsAuctionHouse.unpause()).wait();

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    const { n00unId } = await n00unsAuctionHouse.auction();
    const tx = n00unsAuctionHouse.connect(bidderA).createBid(n00unId, {
      value: RESERVE_PRICE,
    });

    await expect(tx).to.be.revertedWith('Auction expired');
  });

  it('should revert if a user creates a bid with an amount below the reserve price', async () => {
    await (await n00unsAuctionHouse.unpause()).wait();

    const { n00unId } = await n00unsAuctionHouse.auction();
    const tx = n00unsAuctionHouse.connect(bidderA).createBid(n00unId, {
      value: RESERVE_PRICE - 1,
    });

    await expect(tx).to.be.revertedWith('Must send at least reservePrice');
  });

  it('should revert if a user creates a bid less than the min bid increment percentage', async () => {
    await (await n00unsAuctionHouse.unpause()).wait();

    const { n00unId } = await n00unsAuctionHouse.auction();
    await n00unsAuctionHouse.connect(bidderA).createBid(n00unId, {
      value: RESERVE_PRICE * 50,
    });
    const tx = n00unsAuctionHouse.connect(bidderB).createBid(n00unId, {
      value: RESERVE_PRICE * 51,
    });

    await expect(tx).to.be.revertedWith(
      'Must send more than last bid by minBidIncrementPercentage amount',
    );
  });

  it('should refund the previous bidder when the following user creates a bid', async () => {
    await (await n00unsAuctionHouse.unpause()).wait();

    const { n00unId } = await n00unsAuctionHouse.auction();
    await n00unsAuctionHouse.connect(bidderA).createBid(n00unId, {
      value: RESERVE_PRICE,
    });

    const bidderAPostBidBalance = await bidderA.getBalance();
    await n00unsAuctionHouse.connect(bidderB).createBid(n00unId, {
      value: RESERVE_PRICE * 2,
    });
    const bidderAPostRefundBalance = await bidderA.getBalance();

    expect(bidderAPostRefundBalance).to.equal(bidderAPostBidBalance.add(RESERVE_PRICE));
  });

  it('should cap the maximum bid griefing cost at 30K gas + the cost to wrap and transfer WETH', async () => {
    await (await n00unsAuctionHouse.unpause()).wait();

    const { n00unId } = await n00unsAuctionHouse.auction();

    const maliciousBidderFactory = new MaliciousBidderFactory(bidderA);
    const maliciousBidder = await maliciousBidderFactory.deploy();

    const maliciousBid = await maliciousBidder
      .connect(bidderA)
      .bid(n00unsAuctionHouse.address, n00unId, {
        value: RESERVE_PRICE,
      });
    await maliciousBid.wait();

    const tx = await n00unsAuctionHouse.connect(bidderB).createBid(n00unId, {
      value: RESERVE_PRICE * 2,
      gasLimit: 1_000_000,
    });
    const result = await tx.wait();

    expect(result.gasUsed.toNumber()).to.be.lessThan(200_000);
    expect(await weth.balanceOf(maliciousBidder.address)).to.equal(RESERVE_PRICE);
  });

  it('should emit an `AuctionBid` event on a successful bid', async () => {
    await (await n00unsAuctionHouse.unpause()).wait();

    const { n00unId } = await n00unsAuctionHouse.auction();
    const tx = n00unsAuctionHouse.connect(bidderA).createBid(n00unId, {
      value: RESERVE_PRICE,
    });

    await expect(tx)
      .to.emit(n00unsAuctionHouse, 'AuctionBid')
      .withArgs(n00unId, bidderA.address, RESERVE_PRICE, false);
  });

  it('should emit an `AuctionExtended` event if the auction end time is within the time buffer', async () => {
    await (await n00unsAuctionHouse.unpause()).wait();

    const { n00unId, endTime } = await n00unsAuctionHouse.auction();

    await ethers.provider.send('evm_setNextBlockTimestamp', [endTime.sub(60 * 5).toNumber()]); // Subtract 5 mins from current end time

    const tx = n00unsAuctionHouse.connect(bidderA).createBid(n00unId, {
      value: RESERVE_PRICE,
    });

    await expect(tx)
      .to.emit(n00unsAuctionHouse, 'AuctionExtended')
      .withArgs(n00unId, endTime.add(60 * 10));
  });

  it('should revert if auction settlement is attempted while the auction is still active', async () => {
    await (await n00unsAuctionHouse.unpause()).wait();

    const { n00unId } = await n00unsAuctionHouse.auction();

    await n00unsAuctionHouse.connect(bidderA).createBid(n00unId, {
      value: RESERVE_PRICE,
    });
    const tx = n00unsAuctionHouse.connect(bidderA).settleCurrentAndCreateNewAuction();

    await expect(tx).to.be.revertedWith("Auction hasn't completed");
  });

  it('should emit `AuctionSettled` and `AuctionCreated` events if all conditions are met', async () => {
    await (await n00unsAuctionHouse.unpause()).wait();

    const { n00unId } = await n00unsAuctionHouse.auction();

    await n00unsAuctionHouse.connect(bidderA).createBid(n00unId, {
      value: RESERVE_PRICE,
    });

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours
    const tx = await n00unsAuctionHouse.connect(bidderA).settleCurrentAndCreateNewAuction();

    const receipt = await tx.wait();
    const { timestamp } = await ethers.provider.getBlock(receipt.blockHash);

    const settledEvent = receipt.events?.find(e => e.event === 'AuctionSettled');
    const createdEvent = receipt.events?.find(e => e.event === 'AuctionCreated');

    expect(settledEvent?.args?.n00unId).to.equal(n00unId);
    expect(settledEvent?.args?.winner).to.equal(bidderA.address);
    expect(settledEvent?.args?.amount).to.equal(RESERVE_PRICE);

    expect(createdEvent?.args?.n00unId).to.equal(n00unId.add(1));
    expect(createdEvent?.args?.startTime).to.equal(timestamp);
    expect(createdEvent?.args?.endTime).to.equal(timestamp + DURATION);
  });

  it('should not create a new auction if the auction house is paused and unpaused while an auction is ongoing', async () => {
    await (await n00unsAuctionHouse.unpause()).wait();

    await (await n00unsAuctionHouse.pause()).wait();

    await (await n00unsAuctionHouse.unpause()).wait();

    const { n00unId } = await n00unsAuctionHouse.auction();

    expect(n00unId).to.equal(1);
  });

  it('should create a new auction if the auction house is paused and unpaused after an auction is settled', async () => {
    await (await n00unsAuctionHouse.unpause()).wait();

    const { n00unId } = await n00unsAuctionHouse.auction();

    await n00unsAuctionHouse.connect(bidderA).createBid(n00unId, {
      value: RESERVE_PRICE,
    });

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    await (await n00unsAuctionHouse.pause()).wait();

    const settleTx = n00unsAuctionHouse.connect(bidderA).settleAuction();

    await expect(settleTx)
      .to.emit(n00unsAuctionHouse, 'AuctionSettled')
      .withArgs(n00unId, bidderA.address, RESERVE_PRICE);

    const unpauseTx = await n00unsAuctionHouse.unpause();
    const receipt = await unpauseTx.wait();
    const { timestamp } = await ethers.provider.getBlock(receipt.blockHash);

    const createdEvent = receipt.events?.find(e => e.event === 'AuctionCreated');

    expect(createdEvent?.args?.n00unId).to.equal(n00unId.add(1));
    expect(createdEvent?.args?.startTime).to.equal(timestamp);
    expect(createdEvent?.args?.endTime).to.equal(timestamp + DURATION);
  });

  it('should settle the current auction and pause the contract if the minter is updated while the auction house is unpaused', async () => {
    await (await n00unsAuctionHouse.unpause()).wait();

    const { n00unId } = await n00unsAuctionHouse.auction();

    await n00unsAuctionHouse.connect(bidderA).createBid(n00unId, {
      value: RESERVE_PRICE,
    });

    await n00unsToken.setMinter(constants.AddressZero);

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    const settleTx = n00unsAuctionHouse.connect(bidderA).settleCurrentAndCreateNewAuction();

    await expect(settleTx)
      .to.emit(n00unsAuctionHouse, 'AuctionSettled')
      .withArgs(n00unId, bidderA.address, RESERVE_PRICE);

    const paused = await n00unsAuctionHouse.paused();

    expect(paused).to.equal(true);
  });

  it('should burn a N00un on auction settlement if no bids are received', async () => {
    await (await n00unsAuctionHouse.unpause()).wait();

    const { n00unId } = await n00unsAuctionHouse.auction();

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 25]); // Add 25 hours

    const tx = n00unsAuctionHouse.connect(bidderA).settleCurrentAndCreateNewAuction();

    await expect(tx)
      .to.emit(n00unsAuctionHouse, 'AuctionSettled')
      .withArgs(n00unId, '0x0000000000000000000000000000000000000000', 0);
  });
});
