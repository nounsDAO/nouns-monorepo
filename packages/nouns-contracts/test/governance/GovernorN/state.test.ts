import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import hardhat from 'hardhat';

const { ethers } = hardhat

import { BigNumber as EthersBN } from 'ethers';

import {
  deployNounsErc721,
  getSigners,
  TestSigners,
  MintNouns,
} from '../../utils';

import {
  mineBlock,
  address,
  encodeParameters,
  freezeTime,
  advanceBlocks,
  blockNumber,
  increaseTime,
  setNextBlockTimestamp
} from '../utils/Ethereum'

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import {
  NounsErc721,
  TimelockHarness,
  TimelockHarness__factory,
  GovernorNImmutable,
  GovernorNImmutable__factory
} from '../../../typechain';


chai.use(solidity);
const { expect } = chai;

const states: string[] = [
  "Pending",
  "Active",
  "Canceled",
  "Defeated",
  "Succeeded",
  "Queued",
  "Expired",
  "Executed"
]

let token: NounsErc721;
let deployer: SignerWithAddress;
let account0: SignerWithAddress;
let account1: SignerWithAddress;
let account2: SignerWithAddress;
let signers: TestSigners;

let gov: GovernorNImmutable;
let timelock: TimelockHarness;
let delay: number;

let targets: string[];
let values: string[];
let signatures: string[];
let callDatas: string[];
let proposalId: EthersBN;

let mintNouns: (amount: number) => Promise<void>;

async function expectState(proposalId: number|EthersBN, expectedState: any){
  const actualState = states[await gov.state(proposalId)]
  expect(actualState).to.equal(expectedState);
}

async function reset(proposer: SignerWithAddress = deployer, mintAmount: number = 5,transferAmount: number = 0, transferTo: SignerWithAddress = proposer){

  token = await deployNounsErc721()

  mintNouns = MintNouns(token)

  await mintNouns(mintAmount)

  delay = 4 * 24 * 60 * 60

  timelock = await new TimelockHarness__factory(deployer).deploy(deployer.address, delay);

  gov = await new GovernorNImmutable__factory(deployer).deploy(timelock.address, token.address, deployer.address, 1728, 1, 1, 1)

  await gov.functions["_initiate()"]()
  await timelock.harnessSetAdmin(gov.address)

  targets = [deployer.address];
  values = ["0"];
  signatures = ["getBalanceOf(address)"]
  callDatas = [encodeParameters(['address'], [deployer.address])];

  for (let i=0; i<transferAmount; i++){
    await token.transferFrom(deployer.address, transferTo.address, i);
  }

  await gov.connect(proposer).propose(targets, values, signatures, callDatas, "do nothing");
  proposalId = await gov.latestProposalIds(proposer.address);
}

describe('GovernorN#state/1', () => {

  before(async () => {
    await freezeTime(100);
    signers = await getSigners();
    deployer = signers.deployer;
    account0 = signers.account0;
    account1 = signers.account1;
    account2 = signers.account2;
  });

  it("Invalid for proposal not found", async () => {
    await reset()
    await expect(
      gov.state(5)
    ).revertedWith("GovernorN::state: invalid proposal id");
  })

  it("Pending", async () => {
    await reset()
    expectState(proposalId,"Pending");
  })

  it("Active", async () => {
    await reset()
    expectState(proposalId,"Pending");

    // mine blocks passed voting delay; voting delay is 1 block, have to wait 2 blocks
    await mineBlock()
    await mineBlock()

    expectState(proposalId,"Active");
  })

  it("Canceled", async () => {
    await reset(account0, 5, 2)

    // send away the delegates
    await token.connect(account0).delegate(deployer.address)

    await gov.cancel(proposalId)

    expectState(proposalId,"Canceled");
  })

  it("Defeated by running out of time", async () => {
    await reset()
    // travel to end block
    await advanceBlocks(2000)

    expectState(proposalId, "Defeated")
  })

  it("Defeated by voting against", async () => {
    await reset(deployer, 5, 3, account0)

    // pass the waiting period of 1 block
    await mineBlock()

    // cast 2 votes for
    await gov.connect(deployer).castVote(proposalId, 1);

    // cast 3 votes against
    await gov.connect(account0).castVote(proposalId, 0);

    // travel to end block
    await advanceBlocks(2000)
    expectState(proposalId, "Defeated")
  })

  it("Succeeded", async () => {
    // deployer mints 5, sends 2 to account0, account0 proposes,
    await reset(account0, 5, 2)
    await mineBlock()

    // cast 3 votes for
    await gov.connect(deployer).castVote(proposalId, 1);

    // cast 2 votes against
    await gov.connect(account0).castVote(proposalId, 0);

    await advanceBlocks(2000)

    expectState(proposalId, "Succeeded")
  })

  it('Cannot queue if defeated', async () => {
    await reset()
    await advanceBlocks(2000)

    expectState(proposalId, "Defeated")

    await expect(
      gov.queue(proposalId)
    ).revertedWith("queue: proposal can only be queued if it is succeeded");
  })

  it('Cannot queue if canceled', async () => {
    await reset()
    await gov.cancel(proposalId)

    expectState(proposalId, "Canceled")

    await expect(
      gov.queue(proposalId)
    ).revertedWith("queue: proposal can only be queued if it is succeeded");
  })

  it("Queued", async () => {
    await reset()
    await mineBlock()

    await gov.connect(deployer).castVote(proposalId, 1);

    await expect(
      gov.queue(proposalId)
    ).revertedWith("queue: proposal can only be queued if it is succeeded");

    await advanceBlocks(2000)

    // anyone can queue
    await gov.connect(account0).queue(proposalId);

    expectState(proposalId, "Queued")
  })

  it("Expired", async () => {
    await reset()
    await mineBlock()

    await gov.connect(deployer).castVote(proposalId, 1);

    await advanceBlocks(2000)

    await gov.connect(account0).queue(proposalId);
    let gracePeriod = await timelock.GRACE_PERIOD()
    let {eta} = await gov.proposals(proposalId);

    // 1 second before grace period, still Queued
    await setNextBlockTimestamp(eta.add(gracePeriod).sub(1).toNumber())

    expectState(proposalId, "Queued")

    // Mining at graceperiod
    await setNextBlockTimestamp(eta.add(gracePeriod).toNumber())

    expectState(proposalId, "Expired")
  })

  it("Executed, only after queued", async () => {
    await reset()
    await mineBlock()

    await gov.connect(deployer).castVote(proposalId, 1);

    await expect(
      gov.execute(proposalId)
    ).revertedWith("execute: proposal can only be executed if it is queued");

    await advanceBlocks(2000)

    await expect(
      gov.execute(proposalId)
    ).revertedWith("execute: proposal can only be executed if it is queued");

    await gov.connect(account0).queue(proposalId);

    let gracePeriod = await timelock.GRACE_PERIOD()
    let {eta} = await gov.proposals(proposalId);

    await setNextBlockTimestamp(eta.add(gracePeriod).sub(2).toNumber())

    expectState(proposalId, "Queued")

    // the execute call can happen 1 second before the grace period expires
    await setNextBlockTimestamp(eta.add(gracePeriod).sub(1).toNumber(), false)

    await gov.connect(account1).execute(proposalId);

    expectState(proposalId, "Executed")

    // still executed even though would be expired
    await setNextBlockTimestamp(eta.add(gracePeriod).toNumber())

    expectState(proposalId, "Executed")
  })

})