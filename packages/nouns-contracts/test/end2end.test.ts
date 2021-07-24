import chai from 'chai';
import { ethers, upgrades } from 'hardhat';
import { BigNumber as EthersBN } from 'ethers';
import { solidity } from 'ethereum-waffle';

import {
  Weth,
  NounsErc721,
  NounsAuctionHouse,
  NounsAuctionHouse__factory,
  NounsDescriptor,
  NounsDescriptor__factory,
  GovernorNDelegator,
  GovernorNDelegator__factory,
  GovernorNDelegate,
  GovernorNDelegate__factory,
  Timelock,
  Timelock__factory,
} from '../typechain';

import {
  deployNounsERC721,
  deployWeth,
  getSigners,
  TestSigners,
  populateDescriptor,
  mineBlock,
  address,
  encodeParameters,
  advanceBlocks,
  blockNumber,
  blockTimestamp,
  setNextBlockTimestamp,
} from './utils';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);
const { expect } = chai;

let nounsErc721: NounsErc721;
let nounsAuctionHouse: NounsAuctionHouse;
let descriptor: NounsDescriptor;
let weth: Weth;
let gov: GovernorNDelegate;
let timelock: Timelock;

let deployer: SignerWithAddress;
let wethDeployer: SignerWithAddress;
let bidderA: SignerWithAddress;
let noundersDAO: SignerWithAddress;

// Governance Config
const TIME_LOCK_DELAY = 172_800; // 2 days
const PROPOSAL_THRESHOLD_BPS = 500; // 5%
const QUORUM_VOTES_BPS = 1_000; // 10%
const VOTING_PERIOD = 5_760; // About 24 hours with 15s blocks
const VOTING_DELAY = 1; // 1 block

// Proposal Config
let targets: string[] = [];
let values: string[] = [];
let signatures: string[] = [];
let callDatas: string[] = [];
let proposalId: EthersBN;
let proposal;

// Auction House Config
const TIME_BUFFER = 15 * 60;
const RESERVE_PRICE = 2;
const MIN_INCREMENT_BID_PERCENTAGE = 5;
const DURATION = 60 * 60 * 24;

async function deploy() {
  [deployer, bidderA, wethDeployer, noundersDAO] = await ethers.getSigners();

  // Deployed by another account to simulate real network

  weth = await deployWeth(wethDeployer);

  // nonce 2: Deploy AuctionHouse
  // nonce 3: Deploy nftDescriptorLibraryFactory
  // nonce 4: Deploy NounsDescriptor
  // nonce 5: Deploy NounsSeeder
  // nonce 6: Deploy NounsERC721
  // nonce 0: Deploy Timelock
  // nonce 1: Deploy GovernorNDelegate
  // nonce 7: Deploy GovernorNDelegator
  // nonce ++: populate Descriptor
  // nonce ++: set ownable contracts owner to timelock

  // 1. DEPLOY Nouns token
  nounsErc721 = await deployNounsERC721(
    deployer,
    noundersDAO.address,
    deployer.address, // do not know minter/auction house yet
  );

  // 2a. DEPLOY AuctionHouse
  const auctionHouseFactory = await ethers.getContractFactory('NounsAuctionHouse', deployer);
  const nounsAuctionHouseProxy = await upgrades.deployProxy(auctionHouseFactory, [
    nounsErc721.address,
    weth.address,
    TIME_BUFFER,
    RESERVE_PRICE,
    MIN_INCREMENT_BID_PERCENTAGE,
    DURATION,
  ]);

  // 2b. CAST proxy as AuctionHouse
  nounsAuctionHouse = NounsAuctionHouse__factory.connect(nounsAuctionHouseProxy.address, deployer);

  // 3. SET MINTER
  await nounsErc721.setMinter(nounsAuctionHouse.address);

  // 4. POPULATE body parts
  descriptor = NounsDescriptor__factory.connect(await nounsErc721.descriptor(), deployer);

  await populateDescriptor(descriptor);

  // 5a. CALCULATE Gov Delegate, takes place after 2 transactions
  const calculatedGovDelegatorAddress = ethers.utils.getContractAddress({
    from: deployer.address,
    nonce: (await deployer.getTransactionCount()) + 2,
  });

  // 5b. DEPLOY Timelock with pre-computed Delegator address
  timelock = await new Timelock__factory(deployer).deploy(
    calculatedGovDelegatorAddress,
    TIME_LOCK_DELAY,
  );

  // 6. DEPLOY Delegate
  const govDelegate = await new GovernorNDelegate__factory(deployer).deploy();

  // 7a. DEPLOY Delegator
  const governorNDelegator = await new GovernorNDelegator__factory(deployer).deploy(
    timelock.address,
    nounsErc721.address,
    noundersDAO.address, // NoundersDAO is vetoer
    timelock.address,
    govDelegate.address,
    VOTING_PERIOD,
    VOTING_DELAY,
    PROPOSAL_THRESHOLD_BPS,
    QUORUM_VOTES_BPS,
  );

  expect(calculatedGovDelegatorAddress).to.equal(governorNDelegator.address);

  // 7b. CAST Delegator as Delegate
  gov = GovernorNDelegate__factory.connect(governorNDelegator.address, deployer);

  // 8. SET Nouns owner to Timelock
  await nounsErc721.transferOwnership(timelock.address);
  // 9. SET Descriptor owner to Timelock
  await descriptor.transferOwnership(timelock.address);

  // 10. UNPAUSE auction and kick off first mint
  await nounsAuctionHouse.unpause();

  // 11. SET Auction House owner to Timelock
  await nounsAuctionHouse.transferOwnership(timelock.address);
}

describe('End to End test with deployment, auction, proposing, voting, executing', async () => {
  before(deploy);

  it('sets all starting params correctly', async () => {
    expect(await nounsErc721.owner()).to.equal(timelock.address);
    expect(await descriptor.owner()).to.equal(timelock.address);
    expect(await nounsAuctionHouse.owner()).to.equal(timelock.address);

    expect(await nounsErc721.minter()).to.equal(nounsAuctionHouse.address);
    expect(await nounsErc721.noundersDAO()).to.equal(noundersDAO.address);

    expect(await gov.admin()).to.equal(timelock.address);
    expect(await timelock.admin()).to.equal(gov.address);
    expect(await gov.timelock()).to.equal(timelock.address);

    expect(await gov.vetoer()).to.equal(noundersDAO.address);

    expect(await nounsErc721.totalSupply()).to.equal(EthersBN.from('2'));

    expect(await nounsErc721.ownerOf(0)).to.equal(noundersDAO.address);
    expect(await nounsErc721.ownerOf(1)).to.equal(nounsAuctionHouse.address);

    expect((await nounsAuctionHouse.auction()).nounId).to.equal(EthersBN.from('1'));
  });

  it('allows bidding, settling, and transferring ETH correctly', async () => {
    await nounsAuctionHouse.connect(bidderA).createBid(1, { value: RESERVE_PRICE });
    await setNextBlockTimestamp(Number(await blockTimestamp('latest')) + DURATION);
    await nounsAuctionHouse.settleCurrentAndCreateNewAuction();

    expect(await nounsErc721.ownerOf(1)).to.equal(bidderA.address);
    expect(await ethers.provider.getBalance(timelock.address)).to.equal(RESERVE_PRICE);
  });

  it('allows proposing, voting, queuing', async () => {
    const description = 'Set nounsErc721 minter to address(1) and transfer treasury to address(2)';

    // Action 1. Execute nounsErc721.setMinter(address(1))
    targets.push(nounsErc721.address);
    values.push('0');
    signatures.push('setMinter(address)');
    callDatas.push(encodeParameters(['address'], [address(1)]));

    // Action 2. Execute transfer RESERVE_PRICE to address(2)
    targets.push(address(2));
    values.push(String(RESERVE_PRICE));
    signatures.push('');
    callDatas.push('0x');
    // callDatas.push(encodeParameters(['bytes'], ['0x']))
    // console.log(callDatas, callDatas[0].length)

    await gov.connect(bidderA).propose(targets, values, signatures, callDatas, description);

    proposalId = await gov.latestProposalIds(bidderA.address);

    // Wait for VOTING_DELAY
    await advanceBlocks(VOTING_DELAY + 1);

    // cast vote for proposal
    await gov.connect(bidderA).castVote(proposalId, 1);

    await advanceBlocks(VOTING_PERIOD);

    await gov.connect(bidderA).queue(proposalId);

    // Queued state
    expect(await gov.state(proposalId)).to.equal(5);
  });

  it('executes proposal transactions correctly', async () => {
    let gracePeriod = await timelock.GRACE_PERIOD();
    let { eta } = await gov.proposals(proposalId);
    await setNextBlockTimestamp(eta.toNumber(), false);
    await gov.execute(proposalId);

    // Successfully executed Action 1
    expect(await nounsErc721.minter()).to.equal(address(1));

    // Successfully executed Action 2
    expect(await ethers.provider.getBalance(address(2))).to.equal(RESERVE_PRICE);
  });

  it('does not allow GovernorN to accept funds', async () => {
    let error1;

    // GovernorN does not accept value without calldata
    try {
      await bidderA.sendTransaction({
        to: gov.address,
        value: 10,
      });
    } catch (e) {
      error1 = e;
    }

    expect(error1);

    let error2;

    // GovernorN does not accept value with calldata
    try {
      await bidderA.sendTransaction({
        data: '0xb6b55f250000000000000000000000000000000000000000000000000000000000000001',
        to: gov.address,
        value: 10,
      });
    } catch (e) {
      error2 = e;
    }

    expect(error2);
  });

  it('allows Timelock to receive funds', async () => {
    // test receive()
    await bidderA.sendTransaction({
      to: timelock.address,
      value: 10,
    });

    expect(await ethers.provider.getBalance(timelock.address)).to.equal(10);

    // test fallback() calls deposit(uint) which is not implemented
    await bidderA.sendTransaction({
      data: '0xb6b55f250000000000000000000000000000000000000000000000000000000000000001',
      to: timelock.address,
      value: 10,
    });

    expect(await ethers.provider.getBalance(timelock.address)).to.equal(20);
  });
});
