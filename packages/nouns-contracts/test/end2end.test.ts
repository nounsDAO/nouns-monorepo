import chai from 'chai';
import { ethers, upgrades } from 'hardhat';
import { BigNumber as EthersBN } from 'ethers';
import { solidity } from 'ethereum-waffle';

import {
  WETH,
  NounsBRToken,
  NounsBRAuctionHouse,
  NounsBRAuctionHouse__factory as NounsBRAuctionHouseFactory,
  NounsBRDescriptorV2,
  NounsBRDescriptorV2__factory as NounsBRDescriptorV2Factory,
  NounsBRDAOProxy__factory as NounsBRDaoProxyFactory,
  NounsBRDAOLogicV1,
  NounsBRDAOLogicV1__factory as NounsBRDaoLogicV1Factory,
  NounsBRDAOExecutor,
  NounsBRDAOExecutor__factory as NounsBRDaoExecutorFactory,
} from '../typechain';

import {
  deployNounsBRToken,
  deployWeth,
  populateDescriptorV2,
  address,
  encodeParameters,
  advanceBlocks,
  blockTimestamp,
  setNextBlockTimestamp,
} from './utils';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);
const { expect } = chai;

let nounsbrToken: NounsBRToken;
let nounsbrAuctionHouse: NounsBRAuctionHouse;
let descriptor: NounsBRDescriptorV2;
let weth: WETH;
let gov: NounsBRDAOLogicV1;
let timelock: NounsBRDAOExecutor;

let deployer: SignerWithAddress;
let wethDeployer: SignerWithAddress;
let bidderA: SignerWithAddress;
let noundersbrDAO: SignerWithAddress;

// Governance Config
const TIME_LOCK_DELAY = 172_800; // 2 days
const PROPOSAL_THRESHOLD_BPS = 500; // 5%
const QUORUM_VOTES_BPS = 1_000; // 10%
const VOTING_PERIOD = 5_760; // About 24 hours with 15s blocks
const VOTING_DELAY = 1; // 1 block

// Proposal Config
const targets: string[] = [];
const values: string[] = [];
const signatures: string[] = [];
const callDatas: string[] = [];

let proposalId: EthersBN;

// Auction House Config
const TIME_BUFFER = 15 * 60;
const RESERVE_PRICE = 2;
const MIN_INCREMENT_BID_PERCENTAGE = 5;
const DURATION = 60 * 60 * 24;

async function deploy() {
  [deployer, bidderA, wethDeployer, noundersbrDAO] = await ethers.getSigners();

  // Deployed by another account to simulate real network

  weth = await deployWeth(wethDeployer);

  // nonce 2: Deploy AuctionHouse
  // nonce 3: Deploy nftDescriptorLibraryFactory
  // nonce 4: Deploy NounsBRDescriptor
  // nonce 5: Deploy NounsBRSeeder
  // nonce 6: Deploy NounsBRToken
  // nonce 0: Deploy NounsBRDAOExecutor
  // nonce 1: Deploy NounsBRDAOLogicV1
  // nonce 7: Deploy NounsBRDAOProxy
  // nonce ++: populate Descriptor
  // nonce ++: set ownable contracts owner to timelock

  // 1. DEPLOY NounsBR token
  nounsbrToken = await deployNounsBRToken(
    deployer,
    noundersbrDAO.address,
    deployer.address, // do not know minter/auction house yet
  );

  // 2a. DEPLOY AuctionHouse
  const auctionHouseFactory = await ethers.getContractFactory('NounsBRAuctionHouse', deployer);
  const nounsbrAuctionHouseProxy = await upgrades.deployProxy(auctionHouseFactory, [
    nounsbrToken.address,
    weth.address,
    TIME_BUFFER,
    RESERVE_PRICE,
    MIN_INCREMENT_BID_PERCENTAGE,
    DURATION,
  ]);

  // 2b. CAST proxy as AuctionHouse
  nounsbrAuctionHouse = NounsBRAuctionHouseFactory.connect(nounsbrAuctionHouseProxy.address, deployer);

  // 3. SET MINTER
  await nounsbrToken.setMinter(nounsbrAuctionHouse.address);

  // 4. POPULATE body parts
  descriptor = NounsBRDescriptorV2Factory.connect(await nounsbrToken.descriptor(), deployer);

  await populateDescriptorV2(descriptor);

  // 5a. CALCULATE Gov Delegate, takes place after 2 transactions
  const calculatedGovDelegatorAddress = ethers.utils.getContractAddress({
    from: deployer.address,
    nonce: (await deployer.getTransactionCount()) + 2,
  });

  // 5b. DEPLOY NounsBRDAOExecutor with pre-computed Delegator address
  timelock = await new NounsBRDaoExecutorFactory(deployer).deploy(
    calculatedGovDelegatorAddress,
    TIME_LOCK_DELAY,
  );

  // 6. DEPLOY Delegate
  const govDelegate = await new NounsBRDaoLogicV1Factory(deployer).deploy();

  // 7a. DEPLOY Delegator
  const nounsbrDAOProxy = await new NounsBRDaoProxyFactory(deployer).deploy(
    timelock.address,
    nounsbrToken.address,
    noundersbrDAO.address, // NoundersBRBRDAO is vetoer
    timelock.address,
    govDelegate.address,
    VOTING_PERIOD,
    VOTING_DELAY,
    PROPOSAL_THRESHOLD_BPS,
    QUORUM_VOTES_BPS,
  );

  expect(calculatedGovDelegatorAddress).to.equal(nounsbrDAOProxy.address);

  // 7b. CAST Delegator as Delegate
  gov = NounsBRDaoLogicV1Factory.connect(nounsbrDAOProxy.address, deployer);

  // 8. SET NounsBR owner to NounsBRDAOExecutor
  await nounsbrToken.transferOwnership(timelock.address);
  // 9. SET Descriptor owner to NounsBRDAOExecutor
  await descriptor.transferOwnership(timelock.address);

  // 10. UNPAUSE auction and kick off first mint
  await nounsbrAuctionHouse.unpause();

  // 11. SET Auction House owner to NounsBRDAOExecutor
  await nounsbrAuctionHouse.transferOwnership(timelock.address);
}

describe('End to End test with deployment, auction, proposing, voting, executing', async () => {
  before(deploy);

  it('sets all starting params correctly', async () => {
    expect(await nounsbrToken.owner()).to.equal(timelock.address);
    expect(await descriptor.owner()).to.equal(timelock.address);
    expect(await nounsbrAuctionHouse.owner()).to.equal(timelock.address);

    expect(await nounsbrToken.minter()).to.equal(nounsbrAuctionHouse.address);
    expect(await nounsbrToken.noundersbrDAO()).to.equal(noundersbrDAO.address);

    expect(await gov.admin()).to.equal(timelock.address);
    expect(await timelock.admin()).to.equal(gov.address);
    expect(await gov.timelock()).to.equal(timelock.address);

    expect(await gov.vetoer()).to.equal(noundersbrDAO.address);

    expect(await nounsbrToken.totalSupply()).to.equal(EthersBN.from('2'));

    expect(await nounsbrToken.ownerOf(0)).to.equal(noundersbrDAO.address);
    expect(await nounsbrToken.ownerOf(1)).to.equal(nounsbrAuctionHouse.address);

    expect((await nounsbrAuctionHouse.auction()).nounbrId).to.equal(EthersBN.from('1'));
  });

  it('allows bidding, settling, and transferring ETH correctly', async () => {
    await nounsbrAuctionHouse.connect(bidderA).createBid(1, { value: RESERVE_PRICE });
    await setNextBlockTimestamp(Number(await blockTimestamp('latest')) + DURATION);
    await nounsbrAuctionHouse.settleCurrentAndCreateNewAuction();

    expect(await nounsbrToken.ownerOf(1)).to.equal(bidderA.address);
    expect(await ethers.provider.getBalance(timelock.address)).to.equal(RESERVE_PRICE);
  });

  it('allows proposing, voting, queuing', async () => {
    const description = 'Set nounsbrToken minter to address(1) and transfer treasury to address(2)';

    // Action 1. Execute nounsbrToken.setMinter(address(1))
    targets.push(nounsbrToken.address);
    values.push('0');
    signatures.push('setMinter(address)');
    callDatas.push(encodeParameters(['address'], [address(1)]));

    // Action 2. Execute transfer RESERVE_PRICE to address(2)
    targets.push(address(2));
    values.push(String(RESERVE_PRICE));
    signatures.push('');
    callDatas.push('0x');

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
    const { eta } = await gov.proposals(proposalId);
    await setNextBlockTimestamp(eta.toNumber(), false);
    await gov.execute(proposalId);

    // Successfully executed Action 1
    expect(await nounsbrToken.minter()).to.equal(address(1));

    // Successfully executed Action 2
    expect(await ethers.provider.getBalance(address(2))).to.equal(RESERVE_PRICE);
  });

  it('does not allow NounsBRDAO to accept funds', async () => {
    let error1;

    // NounsBRDAO does not accept value without calldata
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

    // NounsBRDAO does not accept value with calldata
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

  it('allows NounsBRDAOExecutor to receive funds', async () => {
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
