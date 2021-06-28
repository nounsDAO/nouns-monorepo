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
  advanceBlocks,
  blockNumber
} from '../utils/Ethereum'

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  NounsErc721,
  GovernorNDelegator,
  GovernorNDelegator__factory,
  GovernorNDelegate,
  GovernorNDelegate__factory,
  Timelock,
  Timelock__factory
} from '../../../typechain';



chai.use(solidity);
const { expect } = chai;


// const {
//   address,
//   etherMantissa,
//   encodeParameters,
//   mineBlock,
//   unlockedAccount,
//   mergeInterface
// } = require('../../Utils/Ethereum');
// const EIP712 = require('../../Utils/EIP712');
// const BigNumber = require('bignumber.js');
// const chalk = require('chalk');

// async function enfranchise(comp, actor, amount) {
//   await send(comp, 'transfer', [actor, etherMantissa(amount)]);
//   await send(comp, 'delegate', [actor], { from: actor });
// }


function votes(n: number|string){
  return ethers.utils.parseUnits(String(n),'ether')
}

async function reset(): Promise<void> {

  // Deploy Delegate
  const {address: govDelegateAddress } = await new GovernorNDelegate__factory(deployer).deploy()

  // Deploy Timelock
  const {address: timelockAddress} = await new Timelock__factory(deployer).deploy(govDelegateAddress, timelockDelay)

  // Deploy Nouns token
  token = await deployNounsErc721()
  mintNouns = MintNouns(token)

  // Deploy Delegator
  const {address: govDelegatorAddress} = await new GovernorNDelegator__factory(deployer).deploy(timelockAddress, token.address, timelockAddress, govDelegateAddress, 5760, 1, proposalThresholdBPS, quorumVotesBPS)

  // Cast Delegator as Delegate
  gov = GovernorNDelegate__factory.connect(govDelegatorAddress, deployer)
}

async function propose(proposer: SignerWithAddress){
  targets = [account0.address];
  values = ["0"];
  signatures = ["getBalanceOf(address)"];
  callDatas = [encodeParameters(['address'], [account0.address])];

  await gov.connect(proposer).propose(targets, values, signatures, callDatas, "do nothing");
  proposalId = await gov.latestProposalIds(proposer.address);
}

let token: NounsErc721;
let deployer: SignerWithAddress;
let account0: SignerWithAddress;
let account1: SignerWithAddress;
let account2: SignerWithAddress;
let signers: TestSigners;

let gov: GovernorNDelegate;
const timelockDelay = 172800 // 2 days

const proposalThresholdBPS = 500 // 5%
const quorumVotesBPS = 1000 // 10%

let targets: string[];
let values: string[];
let signatures: string[];
let callDatas: string[];
let proposalId: EthersBN;
let mintNouns: (amount: number) => Promise<void>;


// async function propose(proposer: SignerWithAddress){
//   targets = [account0.address];
//   values = ["0"];
//   signatures = ["getBalanceOf(address)"];
//   callDatas = [encodeParameters(['address'], [account0.address])];

//   await gov.connect(proposer).propose(targets, values, signatures, callDatas, "do nothing");
//   proposalId = await gov.latestProposalIds(proposer.address);
// }

describe("GovernorN#inflationHandling", () => {

  before(async () => {
    signers = await getSigners();
    deployer = signers.deployer;
    account0 = signers.account0;
    account1 = signers.account1;
    account2 = signers.account2;

    targets = [account0.address];
    values = ["0"];
    signatures = ["getBalanceOf(address)"];
    callDatas = [encodeParameters(['address'], [account0.address])];

    await reset()

  });

  it('set parameters correctly', async ()=>{
     expect(await gov.proposalThresholdBPS()).to.equal(proposalThresholdBPS)
     expect(await gov.quorumVotesBPS()).to.equal(quorumVotesBPS)
  })

  it('returns quorum votes and proposal threshold based on Noun total supply', async () => {
    // Total Supply = 40
    await mintNouns(40)

    // 5% of 40 = 2
    expect(await gov.proposalThreshold()).to.equal(votes('2'))
    // 10% of 40 = 4
    expect(await gov.quorumVotes()).to.equal(votes('4'))
  })

  it('rejects if proposing below threshold', async () => {
    // account0 has 1 token, requires 3
    await token.transferFrom(deployer.address, account0.address, 0);
    await mineBlock()
    await expect(gov.connect(account0).propose(targets, values, signatures, callDatas, "do nothing")).revertedWith("GovernorN::propose: proposer votes below proposal threshold");
  })
  it('allows proposing if above threshold', async () => {
    // account0 has 3 token, requires 3
    await token.transferFrom(deployer.address, account0.address, 1);
    await token.transferFrom(deployer.address, account0.address, 2);

    // account1 has 3 tokens
    await token.transferFrom(deployer.address, account1.address, 3);
    await token.transferFrom(deployer.address, account1.address, 4);
    await token.transferFrom(deployer.address, account1.address, 5);

    // account2 has 5 tokens
    await token.transferFrom(deployer.address, account2.address, 6);
    await token.transferFrom(deployer.address, account2.address, 7);
    await token.transferFrom(deployer.address, account2.address, 8);
    await token.transferFrom(deployer.address, account2.address, 9);
    await token.transferFrom(deployer.address, account2.address, 10);

    await mineBlock()
    await propose(account0)
  })

  it('sets proposal attributes correctly', async () => {
    const proposal = await gov.proposals(proposalId);
    expect(proposal.proposalThreshold).to.equal(votes(2))
    expect(proposal.quorumVotes).to.equal(votes(4))
  })

  it('returns updated quorum votes and proposal threshold when total supply changes', async () => {
    // Total Supply = 80
    await mintNouns(40)

    // 5% of 80 = 4
    expect(await gov.proposalThreshold()).to.equal(votes('4'))
    // 10% of 80 = 8
    expect(await gov.quorumVotes()).to.equal(votes('8'))
  })

  it('rejects proposals that were previously above proposal threshold, but due to increasing supply are now below', async () => {

    // account1 has 3 tokens, but requires 5 to pass new proposal threshold when totalSupply = 80 and threshold = 5%
    await expect(gov.connect(account1).propose(targets, values, signatures, callDatas, "do nothing")).revertedWith("GovernorN::propose: proposer votes below proposal threshold");
  })

  it('does not change previous proposal attributes when total supply changes', async () =>{
    const proposal = await gov.proposals(proposalId);
    expect(proposal.proposalThreshold).to.equal(votes(2))
    expect(proposal.quorumVotes).to.equal(votes(4))
  })

  it('updates for/against votes correctly', async () => {
    // Accounts voting for = 5 votes
    // forVotes should be greater than quorumVotes
    await gov.connect(account0).castVote(proposalId,1) // 3
    await gov.connect(account1).castVote(proposalId,1) // 3

    await gov.connect(account2).castVote(proposalId,0) // 5

    const proposal = await gov.proposals(proposalId);
    expect(proposal.forVotes).to.equal(votes(6))
    expect(proposal.againstVotes).to.equal(votes(5))
  })

  it('succeeds when for votes > quorumVotes and againstVotes', async () => {
    await advanceBlocks(5760)
    proposal = await gov.proposals(proposalId);
    const state = await gov.state(proposalId)
    expect(state).to.equal(4)
  })

});