import chai from 'chai';
import { ethers, upgrades } from 'hardhat';
import { solidity } from 'ethereum-waffle';
import { BigNumber as EthersBN, BigNumberish, Signer } from 'ethers';
import {
  Weth,
  NounsToken,
  NounsAuctionHouse,
  NounsAuctionHouse__factory as NounsAuctionHouseFactory,
  NounsDescriptor,
  NounsDescriptor__factory as NounsDescriptorFactory,
  NounsDaoProxy__factory as NounsDaoProxyFactory,
  NounsDaoLogicV1,
  NounsDaoLogicV1__factory as NounsDaoLogicV1Factory,
  NounsDaoExecutor,
  NounsDaoExecutor__factory as NounsDaoExecutorFactory,
  NounsDaoLogicV2__factory as NounsDaoLogicV2Factory,
  NounsDaoProxy,
  NounsDaoLogicV2,
} from '../../../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  deployNounsToken,
  deployWeth,
  populateDescriptor,
  address,
  encodeParameters,
  advanceBlocks,
  blockTimestamp,
  setNextBlockTimestamp,
  blockNumber,
} from '../../../utils';
import { parseUnits } from 'ethers/lib/utils';

chai.use(solidity);
const { expect } = chai;

let nounsToken: NounsToken;
let nounsAuctionHouse: NounsAuctionHouse;
let descriptor: NounsDescriptor;
let weth: Weth;
let gov: NounsDaoLogicV1;
let timelock: NounsDaoExecutor;

let deployer: SignerWithAddress;
let wethDeployer: SignerWithAddress;
let noundersDAO: SignerWithAddress;
let bidders: SignerWithAddress[];

// Governance Config
const TIME_LOCK_DELAY = 172_800; // 2 days
const PROPOSAL_THRESHOLD_BPS = 500; // 5%
const QUORUM_VOTES_BPS = 2_000; // 20%
const VOTING_PERIOD = 5_760; // About 24 hours with 15s blocks
const VOTING_DELAY = 1; // 1 block

// Proposal Config
const targets: string[] = [];
const values: string[] = [];
const signatures: string[] = [];
const callDatas: string[] = [];

let proposalId1: BigNumberish;
let proposalId2: BigNumberish;
let snapshotId: number;
let daoLogicV2: NounsDaoLogicV2;

//Dynamic quorum config
const minQuorumVotesBPS = 1000; // 10%
const maxQuorumVotesBPS = 4000; // 40%
const quorumVotesBPSOffset = 0;
const quorumLinearCoefficient = parseUnits('0.3', 6);
const quorumQuadraticCoefficient = parseUnits('0.001', 6);

// Auction House Config
const TIME_BUFFER = 15 * 60;
const RESERVE_PRICE = 2;
const MIN_INCREMENT_BID_PERCENTAGE = 5;
const DURATION = 60 * 60 * 24;

async function deployV1() {
  [deployer, wethDeployer, noundersDAO, ...bidders] = await ethers.getSigners();

  // Deployed by another account to simulate real network

  weth = await deployWeth(wethDeployer);

  // nonce 2: Deploy AuctionHouse
  // nonce 3: Deploy nftDescriptorLibraryFactory
  // nonce 4: Deploy NounsDescriptor
  // nonce 5: Deploy NounsSeeder
  // nonce 6: Deploy NounsToken
  // nonce 0: Deploy NounsDAOExecutor
  // nonce 1: Deploy NounsDAOLogicV1
  // nonce 7: Deploy NounsDAOProxy
  // nonce ++: populate Descriptor
  // nonce ++: set ownable contracts owner to timelock

  // 1. DEPLOY Nouns token
  nounsToken = await deployNounsToken(
    deployer,
    noundersDAO.address,
    deployer.address, // do not know minter/auction house yet
  );

  // 2a. DEPLOY AuctionHouse
  const auctionHouseFactory = await ethers.getContractFactory('NounsAuctionHouse', deployer);
  const nounsAuctionHouseProxy = await upgrades.deployProxy(auctionHouseFactory, [
    nounsToken.address,
    weth.address,
    TIME_BUFFER,
    RESERVE_PRICE,
    MIN_INCREMENT_BID_PERCENTAGE,
    DURATION,
  ]);

  // 2b. CAST proxy as AuctionHouse
  nounsAuctionHouse = NounsAuctionHouseFactory.connect(nounsAuctionHouseProxy.address, deployer);

  // 3. SET MINTER
  await nounsToken.setMinter(nounsAuctionHouse.address);

  // 4. POPULATE body parts
  descriptor = NounsDescriptorFactory.connect(await nounsToken.descriptor(), deployer);

  await populateDescriptor(descriptor);

  // 5a. CALCULATE Gov Delegate, takes place after 2 transactions
  const calculatedGovDelegatorAddress = ethers.utils.getContractAddress({
    from: deployer.address,
    nonce: (await deployer.getTransactionCount()) + 2,
  });

  // 5b. DEPLOY NounsDAOExecutor with pre-computed Delegator address
  timelock = await new NounsDaoExecutorFactory(deployer).deploy(
    calculatedGovDelegatorAddress,
    TIME_LOCK_DELAY,
  );

  // 6. DEPLOY Delegate
  const govDelegate = await new NounsDaoLogicV1Factory(deployer).deploy();

  // 7a. DEPLOY Delegator
  const nounsDAOProxy = await new NounsDaoProxyFactory(deployer).deploy(
    timelock.address,
    nounsToken.address,
    noundersDAO.address, // NoundersDAO is vetoer
    timelock.address,
    govDelegate.address,
    VOTING_PERIOD,
    VOTING_DELAY,
    PROPOSAL_THRESHOLD_BPS,
    QUORUM_VOTES_BPS,
  );

  expect(calculatedGovDelegatorAddress).to.equal(nounsDAOProxy.address);

  // 7b. CAST Delegator as Delegate
  gov = NounsDaoLogicV1Factory.connect(nounsDAOProxy.address, deployer);

  // 8. SET Nouns owner to NounsDAOExecutor
  await nounsToken.transferOwnership(timelock.address);
  // 9. SET Descriptor owner to NounsDAOExecutor
  await descriptor.transferOwnership(timelock.address);

  // 10. UNPAUSE auction and kick off first mint
  await nounsAuctionHouse.unpause();

  // 11. SET Auction House owner to NounsDAOExecutor
  await nounsAuctionHouse.transferOwnership(timelock.address);
}

async function runSeveralAuctions() {
  for (let i = 0; i < 9; i++) {
    await nounsAuctionHouse.connect(bidders[i]).createBid(i + 1, { value: RESERVE_PRICE });
    await setNextBlockTimestamp(Number(await blockTimestamp('latest')) + DURATION);
    await nounsAuctionHouse.settleCurrentAndCreateNewAuction();
  }
}

async function createProposal(proposer: SignerWithAddress) {
  const targets = [address(2)];
  const values = [String(RESERVE_PRICE)];
  const signatures = [''];
  const callDatas = ['0x'];

  await gov.connect(proposer).propose(targets, values, signatures, callDatas, 'proposal');

  return await gov.latestProposalIds(proposer.address);
}

async function createUpgradeToV2AndSetDynamicQuorumProposal(proposer: SignerWithAddress) {
  daoLogicV2 = await new NounsDaoLogicV2Factory(deployer).deploy();

  const targets = [gov.address];
  const values = [0];
  const signatures = ['_setImplementation(address)'];
  const callDatas = [encodeParameters(['address'], [daoLogicV2.address])];

  targets.push(gov.address);
  values.push(0);
  signatures.push('_setDynamicQuorumParams(uint16,uint16,uint16,uint32,uint32)');
  callDatas.push(
    encodeParameters(
      ['uint16', 'uint16', 'uint16', 'uint32', 'uint32'],
      [
        minQuorumVotesBPS,
        maxQuorumVotesBPS,
        quorumVotesBPSOffset,
        quorumLinearCoefficient,
        quorumQuadraticCoefficient,
      ],
    ),
  );

  await gov.connect(proposer).propose(targets, values, signatures, callDatas, '');
  const proposalId = await gov.latestProposalIds(proposer.address);
  return proposalId;
}

async function createSetDynamicQuorumParamsProposal(
  proposer: SignerWithAddress,
  quorumLinearCoefficient: BigNumberish,
  quorumQuadraticCoefficient: BigNumberish,
) {
  const targets = [gov.address];
  const values = [0];
  const signatures = ['_setDynamicQuorumParams(uint16,uint16,uint16,uint32,uint32)'];
  const callDatas = [
    encodeParameters(
      ['uint16', 'uint16', 'uint16', 'uint32', 'uint32'],
      [
        minQuorumVotesBPS,
        maxQuorumVotesBPS,
        quorumVotesBPSOffset,
        quorumLinearCoefficient,
        quorumQuadraticCoefficient,
      ],
    ),
  ];

  await gov.connect(proposer).propose(targets, values, signatures, callDatas, '');
  const proposalId = await gov.latestProposalIds(proposer.address);
  return proposalId;
}

async function proposeUpgradeToV2AndSetDynamicQuorum(proposer: SignerWithAddress) {
  const proposalId = await createUpgradeToV2AndSetDynamicQuorumProposal(proposer);

  await advanceBlocks(VOTING_DELAY + 1);

  await gov.connect(bidders[0]).castVote(proposalId, 1);
  await gov.connect(bidders[1]).castVote(proposalId, 1);

  await advanceBlocks(VOTING_PERIOD);

  await gov.connect(bidders[0]).queue(proposalId);

  // Queued state
  expect(await gov.state(proposalId)).to.equal(5);

  return proposalId;
}

async function executeQueuedProposal(proposalId: BigNumberish) {
  const { eta } = await gov.proposals(proposalId);
  await setNextBlockTimestamp(eta.toNumber(), false);
  await gov.execute(proposalId);
}

describe('V2 end to end tests', async () => {
  describe('Deploy V1 and create a proposal', async () => {
    before(async () => {
      await deployV1();
      await runSeveralAuctions();
      proposalId1 = await createProposal(bidders[0]);
    });

    beforeEach(async () => {
      snapshotId = await ethers.provider.send('evm_snapshot', []);
    });

    afterEach(async () => {
      await ethers.provider.send('evm_revert', [snapshotId]);
    });

    it('requires minimum quorum to pass a proposal', async () => {
      await advanceBlocks(VOTING_DELAY + 1);

      await gov.connect(bidders[0]).castVote(proposalId1, 1);

      await advanceBlocks(VOTING_PERIOD);

      await expect(gov.connect(bidders[0]).queue(proposalId1)).to.be.revertedWith(
        'NounsDAO::queue: proposal can only be queued if it is succeeded',
      );
    });

    it('passes with enough for-votes', async () => {
      await advanceBlocks(VOTING_DELAY + 1);

      await gov.connect(bidders[0]).castVote(proposalId1, 1);
      await gov.connect(bidders[1]).castVote(proposalId1, 1);

      await advanceBlocks(VOTING_PERIOD);

      await gov.connect(bidders[0]).queue(proposalId1);

      // Queued state
      expect(await gov.state(proposalId1)).to.equal(5);
    });
  });

  let upgradeToV2ProposalId: BigNumberish;

  describe('then the logic upgrades to V2 and dynamic quorum is set', async () => {
    beforeEach(async () => {
      snapshotId = await ethers.provider.send('evm_snapshot', []);
    });

    afterEach(async () => {
      await ethers.provider.send('evm_revert', [snapshotId]);
    });

    it('correctly upgrades and set dynamic quorum params', async () => {
      upgradeToV2ProposalId = await proposeUpgradeToV2AndSetDynamicQuorum(bidders[1]);

      await executeQueuedProposal(upgradeToV2ProposalId);

      await advanceBlocks(1);

      expect(await NounsDaoProxyFactory.connect(gov.address, deployer).implementation()).to.equal(
        daoLogicV2.address,
      );

      const govV2 = NounsDaoLogicV2Factory.connect(gov.address, deployer);
      const params = await govV2.getDynamicQuorumParamsAt(await blockNumber());
      expect(params.minQuorumVotesBPS).to.equal(minQuorumVotesBPS);
      expect(params.maxQuorumVotesBPS).to.equal(maxQuorumVotesBPS);
      expect(params.quorumVotesBPSOffset).to.equal(quorumVotesBPSOffset);
      expect(params.quorumLinearCoefficient).to.equal(quorumLinearCoefficient);
      expect(params.quorumQuadraticCoefficient).to.equal(quorumQuadraticCoefficient);
    });
  });

  describe('upgrading to V2 while a V1 proposal is in progress', async () => {
    beforeEach(async () => {
      snapshotId = await ethers.provider.send('evm_snapshot', []);
    });

    afterEach(async () => {
      await ethers.provider.send('evm_revert', [snapshotId]);
    });

    it('proposal from V1 still passes, even with against votes, dynamic quorum is not affecting it', async () => {
      upgradeToV2ProposalId = await createUpgradeToV2AndSetDynamicQuorumProposal(bidders[1]);

      await advanceBlocks(VOTING_DELAY + 1);

      // Votes for upgrade prop
      await gov.connect(bidders[0]).castVote(upgradeToV2ProposalId, 1);
      await gov.connect(bidders[1]).castVote(upgradeToV2ProposalId, 1);

      // Votes for Prop1
      // Against votes
      await gov.connect(bidders[0]).castVote(proposalId1, 0);
      await gov.connect(bidders[1]).castVote(proposalId1, 0);

      // For votes
      await gov.connect(bidders[2]).castVote(proposalId1, 1);
      await gov.connect(bidders[3]).castVote(proposalId1, 1);
      await gov.connect(bidders[4]).castVote(proposalId1, 1);

      await advanceBlocks(VOTING_PERIOD);

      await gov.connect(bidders[0]).queue(upgradeToV2ProposalId);

      await executeQueuedProposal(upgradeToV2ProposalId);

      // Succeeded
      expect(await gov.state(proposalId1)).to.equal(4);
    });
  });

  describe('then a new proposal (V2) is created', async () => {
    before(async () => {
      upgradeToV2ProposalId = await proposeUpgradeToV2AndSetDynamicQuorum(bidders[1]);
      await executeQueuedProposal(upgradeToV2ProposalId);

      proposalId2 = await createProposal(bidders[0]);
    });

    beforeEach(async () => {
      snapshotId = await ethers.provider.send('evm_snapshot', []);
    });

    afterEach(async () => {
      await ethers.provider.send('evm_revert', [snapshotId]);
    });

    it('does not pass because of dynamic quorum', async () => {
      await advanceBlocks(VOTING_DELAY + 1);

      // Against votes
      await gov.connect(bidders[0]).castVote(proposalId2, 0);
      await gov.connect(bidders[1]).castVote(proposalId2, 0);

      // For votes
      await gov.connect(bidders[2]).castVote(proposalId2, 1);
      await gov.connect(bidders[3]).castVote(proposalId2, 1);
      await gov.connect(bidders[4]).castVote(proposalId2, 1);

      await advanceBlocks(VOTING_PERIOD);

      // Defeated
      expect(await gov.state(proposalId2)).to.equal(3);
    });

    it('passes if has enough for-votes', async () => {
      await advanceBlocks(VOTING_DELAY + 1);

      // Against votes
      await gov.connect(bidders[0]).castVote(proposalId2, 0);
      await gov.connect(bidders[1]).castVote(proposalId2, 0);

      // For votes
      await gov.connect(bidders[2]).castVote(proposalId2, 1);
      await gov.connect(bidders[3]).castVote(proposalId2, 1);
      await gov.connect(bidders[4]).castVote(proposalId2, 1);
      await gov.connect(bidders[5]).castVote(proposalId2, 1);

      await advanceBlocks(VOTING_PERIOD);

      // Succeeded
      expect(await gov.state(proposalId2)).to.equal(4);
    });
  });

  describe('dynamic quorum config changes again', async () => {
    let proposalId4: BigNumberish;
    let proposalId5: BigNumberish;

    before(async () => {
      proposalId4 = await createSetDynamicQuorumParamsProposal(
        bidders[2],
        parseUnits('1', 6),
        parseUnits('0.001', 6),
      );
    });

    beforeEach(async () => {
      snapshotId = await ethers.provider.send('evm_snapshot', []);
    });

    afterEach(async () => {
      await ethers.provider.send('evm_revert', [snapshotId]);
    });

    it('need to pass the new quorum requirements', async () => {
      await advanceBlocks(VOTING_DELAY + 1);
      // Votes to pass update params proposal
      await gov.connect(bidders[0]).castVote(proposalId4, 1);
      await gov.connect(bidders[1]).castVote(proposalId4, 1);

      await advanceBlocks(VOTING_PERIOD);

      await gov.connect(bidders[0]).queue(proposalId4);
      await executeQueuedProposal(proposalId4);

      // new proposal
      proposalId5 = await createProposal(bidders[3]);
      await advanceBlocks(VOTING_DELAY + 1);

      // 1 against vote now requires 3 for votes so proposal won't pass
      await gov.connect(bidders[0]).castVote(proposalId5, 0);
      await gov.connect(bidders[1]).castVote(proposalId5, 1);
      await gov.connect(bidders[2]).castVote(proposalId5, 1);
      await advanceBlocks(VOTING_PERIOD);

      // Defeated
      expect(await gov.state(proposalId5)).to.equal(3);
    });

    it('does not affect the already created proposal', async () => {
      // create proposal before the update proposal executes
      proposalId5 = await createProposal(bidders[3]);
      await advanceBlocks(VOTING_DELAY + 1);

      // Votes to pass update params proposal
      await gov.connect(bidders[0]).castVote(proposalId4, 1);
      await gov.connect(bidders[1]).castVote(proposalId4, 1);

      // 2 votes are enough to win 1 against vote for proposal before the update
      await gov.connect(bidders[0]).castVote(proposalId5, 0);
      await gov.connect(bidders[1]).castVote(proposalId5, 1);
      await gov.connect(bidders[2]).castVote(proposalId5, 1);

      await advanceBlocks(VOTING_PERIOD);

      await gov.connect(bidders[0]).queue(proposalId4);
      await executeQueuedProposal(proposalId4);

      // Succeeded
      expect(await gov.state(proposalId5)).to.equal(4);
    });
  });
});
