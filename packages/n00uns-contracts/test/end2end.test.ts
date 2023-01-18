import chai from 'chai';
import { ethers, upgrades } from 'hardhat';
import { BigNumber as EthersBN } from 'ethers';
import { solidity } from 'ethereum-waffle';

import {
  WETH,
  N00unsToken,
  N00unsAuctionHouse,
  N00unsAuctionHouse__factory as N00unsAuctionHouseFactory,
  N00unsDescriptorV2,
  N00unsDescriptorV2__factory as N00unsDescriptorV2Factory,
  N00unsDAOProxy__factory as N00unsDaoProxyFactory,
  N00unsDAOLogicV1,
  N00unsDAOLogicV1__factory as N00unsDaoLogicV1Factory,
  N00unsDAOExecutor,
  N00unsDAOExecutor__factory as N00unsDaoExecutorFactory,
} from '../typechain';

import {
  deployN00unsToken,
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

let n00unsToken: N00unsToken;
let n00unsAuctionHouse: N00unsAuctionHouse;
let descriptor: N00unsDescriptorV2;
let weth: WETH;
let gov: N00unsDAOLogicV1;
let timelock: N00unsDAOExecutor;

let deployer: SignerWithAddress;
let wethDeployer: SignerWithAddress;
let bidderA: SignerWithAddress;
let n00undersDAO: SignerWithAddress;

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
  [deployer, bidderA, wethDeployer, n00undersDAO] = await ethers.getSigners();

  // Deployed by another account to simulate real network

  weth = await deployWeth(wethDeployer);

  // nonce 2: Deploy AuctionHouse
  // nonce 3: Deploy nftDescriptorLibraryFactory
  // nonce 4: Deploy N00unsDescriptor
  // nonce 5: Deploy N00unsSeeder
  // nonce 6: Deploy N00unsToken
  // nonce 0: Deploy N00unsDAOExecutor
  // nonce 1: Deploy N00unsDAOLogicV1
  // nonce 7: Deploy N00unsDAOProxy
  // nonce ++: populate Descriptor
  // nonce ++: set ownable contracts owner to timelock

  // 1. DEPLOY N00uns token
  n00unsToken = await deployN00unsToken(
    deployer,
    n00undersDAO.address,
    deployer.address, // do not know minter/auction house yet
  );

  // 2a. DEPLOY AuctionHouse
  const auctionHouseFactory = await ethers.getContractFactory('N00unsAuctionHouse', deployer);
  const n00unsAuctionHouseProxy = await upgrades.deployProxy(auctionHouseFactory, [
    n00unsToken.address,
    weth.address,
    TIME_BUFFER,
    RESERVE_PRICE,
    MIN_INCREMENT_BID_PERCENTAGE,
    DURATION,
  ]);

  // 2b. CAST proxy as AuctionHouse
  n00unsAuctionHouse = N00unsAuctionHouseFactory.connect(n00unsAuctionHouseProxy.address, deployer);

  // 3. SET MINTER
  await n00unsToken.setMinter(n00unsAuctionHouse.address);

  // 4. POPULATE body parts
  descriptor = N00unsDescriptorV2Factory.connect(await n00unsToken.descriptor(), deployer);

  await populateDescriptorV2(descriptor);

  // 5a. CALCULATE Gov Delegate, takes place after 2 transactions
  const calculatedGovDelegatorAddress = ethers.utils.getContractAddress({
    from: deployer.address,
    nonce: (await deployer.getTransactionCount()) + 2,
  });

  // 5b. DEPLOY N00unsDAOExecutor with pre-computed Delegator address
  timelock = await new N00unsDaoExecutorFactory(deployer).deploy(
    calculatedGovDelegatorAddress,
    TIME_LOCK_DELAY,
  );

  // 6. DEPLOY Delegate
  const govDelegate = await new N00unsDaoLogicV1Factory(deployer).deploy();

  // 7a. DEPLOY Delegator
  const n00unsDAOProxy = await new N00unsDaoProxyFactory(deployer).deploy(
    timelock.address,
    n00unsToken.address,
    n00undersDAO.address, // N00undersDAO is vetoer
    timelock.address,
    govDelegate.address,
    VOTING_PERIOD,
    VOTING_DELAY,
    PROPOSAL_THRESHOLD_BPS,
    QUORUM_VOTES_BPS,
  );

  expect(calculatedGovDelegatorAddress).to.equal(n00unsDAOProxy.address);

  // 7b. CAST Delegator as Delegate
  gov = N00unsDaoLogicV1Factory.connect(n00unsDAOProxy.address, deployer);

  // 8. SET N00uns owner to N00unsDAOExecutor
  await n00unsToken.transferOwnership(timelock.address);
  // 9. SET Descriptor owner to N00unsDAOExecutor
  await descriptor.transferOwnership(timelock.address);

  // 10. UNPAUSE auction and kick off first mint
  await n00unsAuctionHouse.unpause();

  // 11. SET Auction House owner to N00unsDAOExecutor
  await n00unsAuctionHouse.transferOwnership(timelock.address);
}

describe('End to End test with deployment, auction, proposing, voting, executing', async () => {
  before(deploy);

  it('sets all starting params correctly', async () => {
    expect(await n00unsToken.owner()).to.equal(timelock.address);
    expect(await descriptor.owner()).to.equal(timelock.address);
    expect(await n00unsAuctionHouse.owner()).to.equal(timelock.address);

    expect(await n00unsToken.minter()).to.equal(n00unsAuctionHouse.address);
    expect(await n00unsToken.n00undersDAO()).to.equal(n00undersDAO.address);

    expect(await gov.admin()).to.equal(timelock.address);
    expect(await timelock.admin()).to.equal(gov.address);
    expect(await gov.timelock()).to.equal(timelock.address);

    expect(await gov.vetoer()).to.equal(n00undersDAO.address);

    expect(await n00unsToken.totalSupply()).to.equal(EthersBN.from('2'));

    expect(await n00unsToken.ownerOf(0)).to.equal(n00undersDAO.address);
    expect(await n00unsToken.ownerOf(1)).to.equal(n00unsAuctionHouse.address);

    expect((await n00unsAuctionHouse.auction()).n00unId).to.equal(EthersBN.from('1'));
  });

  it('allows bidding, settling, and transferring ETH correctly', async () => {
    await n00unsAuctionHouse.connect(bidderA).createBid(1, { value: RESERVE_PRICE });
    await setNextBlockTimestamp(Number(await blockTimestamp('latest')) + DURATION);
    await n00unsAuctionHouse.settleCurrentAndCreateNewAuction();

    expect(await n00unsToken.ownerOf(1)).to.equal(bidderA.address);
    expect(await ethers.provider.getBalance(timelock.address)).to.equal(RESERVE_PRICE);
  });

  it('allows proposing, voting, queuing', async () => {
    const description = 'Set n00unsToken minter to address(1) and transfer treasury to address(2)';

    // Action 1. Execute n00unsToken.setMinter(address(1))
    targets.push(n00unsToken.address);
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
    expect(await n00unsToken.minter()).to.equal(address(1));

    // Successfully executed Action 2
    expect(await ethers.provider.getBalance(address(2))).to.equal(RESERVE_PRICE);
  });

  it('does not allow N00unsDAO to accept funds', async () => {
    let error1;

    // N00unsDAO does not accept value without calldata
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

    // N00unsDAO does not accept value with calldata
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

  it('allows N00unsDAOExecutor to receive funds', async () => {
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
