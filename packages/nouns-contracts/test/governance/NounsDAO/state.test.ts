import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import hardhat from 'hardhat';

const { ethers } = hardhat;

import { BigNumber as EthersBN } from 'ethers';

import {
  deployNToken,
  getSigners,
  TestSigners,
  setTotalSupply,
  populateDescriptorV2,
  populateSeeder,
} from '../../utils';

import {
  mineBlock,
  address,
  encodeParameters,
  freezeTime,
  advanceBlocks,
  setNextBlockTimestamp,
} from '../../utils';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import {
  NToken,
  NDescriptorV2__factory as NDescriptorV2Factory,
  NSeeder__factory as NSeederFactory,
  NDAOExecutorHarness,
  NDAOExecutorHarness__factory as NDaoExecutorHarnessFactory,
  NDAOImmutable,
  NDAOImmutable__factory as NDaoImmutableFactory,
} from '../../../typechain';

chai.use(solidity);
const { expect } = chai;

const states: string[] = [
  'Pending',
  'Active',
  'Canceled',
  'Defeated',
  'Succeeded',
  'Queued',
  'Expired',
  'Executed',
];

let token: NToken;
let deployer: SignerWithAddress;
let account0: SignerWithAddress;
let account1: SignerWithAddress;
let signers: TestSigners;

let gov: NDAOImmutable;
let timelock: NDAOExecutorHarness;
let delay: number;

let targets: string[];
let values: string[];
let signatures: string[];
let callDatas: string[];
let proposalId: EthersBN;

let snapshotId: number;

async function expectState(proposalId: number | EthersBN, expectedState: string) {
  const actualState = states[await gov.state(proposalId)];
  expect(actualState).to.equal(expectedState);
}

async function makeProposal(
  proposer: SignerWithAddress = deployer,
  mintAmount = 5,
  transferAmount = 0,
  transferTo: SignerWithAddress = proposer,
  proposalThresholdBPS = 1,
) {
  await setTotalSupply(token, mintAmount);

  delay = 4 * 24 * 60 * 60;

  timelock = await new NDaoExecutorHarnessFactory(deployer).deploy(deployer.address, delay);

  gov = await new NDaoImmutableFactory(deployer).deploy(
    timelock.address,
    token.address,
    address(0),
    deployer.address,
    1728,
    1,
    proposalThresholdBPS,
    1,
  );

  await timelock.harnessSetAdmin(gov.address);

  targets = [deployer.address];
  values = ['0'];
  signatures = ['getBalanceOf(address)'];
  callDatas = [encodeParameters(['address'], [deployer.address])];

  for (let i = 0; transferAmount > 0; i++) {
    await token.transferFrom(deployer.address, transferTo.address, i);
    transferAmount--;
  }

  await gov.connect(proposer).propose(targets, values, signatures, callDatas, 'do nothing');
  proposalId = await gov.latestProposalIds(proposer.address);
}

describe('NDAO#state/1', () => {
  before(async () => {
    await freezeTime(100);
    signers = await getSigners();
    deployer = signers.deployer;
    account0 = signers.account0;
    account1 = signers.account1;

    token = await deployNToken(signers.deployer);

    await populateDescriptorV2(
      NDescriptorV2Factory.connect(await token.descriptor(), signers.deployer),
    );

    await populateSeeder(
      NSeederFactory.connect(await token.seeder(), signers.deployer),
    );
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('Invalid for proposal not found', async () => {
    await makeProposal();
    await expect(gov.state(5)).revertedWith('NDAO::state: invalid proposal id');
  });

  it('Pending', async () => {
    await makeProposal();
    await expectState(proposalId, 'Pending');
  });

  it('Active', async () => {
    await makeProposal();
    await expectState(proposalId, 'Pending');

    // mine blocks passed voting delay; voting delay is 1 block, have to wait 2 blocks
    await mineBlock();
    await mineBlock();

    await expectState(proposalId, 'Active');
  });

  it('Canceled', async () => {
    // set proposalThresholdBPS to 10% (1 token) so proposalThreshold is > 0
    await makeProposal(account0, 10, 2, account0, 1000);
    await gov.proposals(proposalId);

    // send away the delegates
    await token.connect(account0).delegate(deployer.address);

    await mineBlock();
    await mineBlock();

    await gov.cancel(proposalId);

    await expectState(proposalId, 'Canceled');
  });

  it('Defeated by running out of time', async () => {
    await makeProposal();
    // travel to end block
    await advanceBlocks(2000);

    await expectState(proposalId, 'Defeated');
  });

  it('Defeated by voting against', async () => {
    await makeProposal(deployer, 5, 3, account0);

    // pass the waiting period of 1 block
    await mineBlock();

    // cast 2 votes for
    await gov.connect(deployer).castVote(proposalId, 1);

    // cast 3 votes against
    await gov.connect(account0).castVote(proposalId, 0);

    // travel to end block
    await advanceBlocks(2000);
    await expectState(proposalId, 'Defeated');
  });

  it('Succeeded', async () => {
    // deployer mints 5, sends 2 to account0, account0 proposes,
    await makeProposal(account0, 5, 2);
    await mineBlock();

    // cast 3 votes for
    await gov.connect(deployer).castVote(proposalId, 1);

    // cast 2 votes against
    await gov.connect(account0).castVote(proposalId, 0);

    await advanceBlocks(2000);

    await expectState(proposalId, 'Succeeded');
  });

  it('Cannot queue if defeated', async () => {
    await makeProposal();
    await advanceBlocks(2000);

    await expectState(proposalId, 'Defeated');

    await expect(gov.queue(proposalId)).revertedWith(
      'queue: proposal can only be queued if it is succeeded',
    );
  });

  it('Cannot queue if canceled', async () => {
    await makeProposal();
    await gov.cancel(proposalId);

    await expectState(proposalId, 'Canceled');

    await expect(gov.queue(proposalId)).revertedWith(
      'queue: proposal can only be queued if it is succeeded',
    );
  });

  it('Queued', async () => {
    await makeProposal();
    await mineBlock();

    await gov.connect(deployer).castVote(proposalId, 1);

    await expect(gov.queue(proposalId)).revertedWith(
      'queue: proposal can only be queued if it is succeeded',
    );

    await advanceBlocks(2000);

    // anyone can queue
    await gov.connect(account0).queue(proposalId);

    await expectState(proposalId, 'Queued');
  });

  it('Expired', async () => {
    await makeProposal();
    await mineBlock();

    await gov.connect(deployer).castVote(proposalId, 1);

    await advanceBlocks(2000);

    await gov.connect(account0).queue(proposalId);
    const gracePeriod = await timelock.GRACE_PERIOD();
    const { eta } = await gov.proposals(proposalId);

    // 1 second before grace period, still Queued
    await setNextBlockTimestamp(eta.add(gracePeriod).sub(1).toNumber());

    await expectState(proposalId, 'Queued');

    // Mining at graceperiod
    await setNextBlockTimestamp(eta.add(gracePeriod).toNumber());

    await expectState(proposalId, 'Expired');
  });

  it('Executed, only after queued', async () => {
    await makeProposal();
    await mineBlock();

    await gov.connect(deployer).castVote(proposalId, 1);

    await expect(gov.execute(proposalId)).revertedWith(
      'execute: proposal can only be executed if it is queued',
    );

    await advanceBlocks(2000);

    await expect(gov.execute(proposalId)).revertedWith(
      'execute: proposal can only be executed if it is queued',
    );

    await gov.connect(account0).queue(proposalId);

    const gracePeriod = await timelock.GRACE_PERIOD();
    const { eta } = await gov.proposals(proposalId);

    await setNextBlockTimestamp(eta.add(gracePeriod).sub(2).toNumber());

    await expectState(proposalId, 'Queued');

    // the execute call can happen 1 second before the grace period expires
    await setNextBlockTimestamp(eta.add(gracePeriod).sub(1).toNumber(), false);

    await gov.connect(account1).execute(proposalId);

    await expectState(proposalId, 'Executed');

    // still executed even though would be expired
    await setNextBlockTimestamp(eta.add(gracePeriod).toNumber());

    await expectState(proposalId, 'Executed');
  });
});
