import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import hardhat from 'hardhat';

const { ethers } = hardhat;

import { BigNumber as EthersBN } from 'ethers';

import {
  getSigners,
  TestSigners,
  setTotalSupply,
  populateDescriptorV2,
  deployGovAndToken,
} from '../../utils';

import { mineBlock, address, encodeParameters, advanceBlocks } from '../../utils';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  NounsToken,
  NounsDescriptor__factory as NounsDescriptorFactory,
  NounsDAOProxy__factory as NounsDaoProxyFactory,
  NounsDAOLogicV1,
  NounsDAOLogicV1__factory as NounsDaoLogicV1Factory,
  NounsDAOExecutor__factory as NounsDaoExecutorFactory,
} from '../../../typechain';

chai.use(solidity);
const { expect } = chai;

async function propose(proposer: SignerWithAddress) {
  targets = [account0.address];
  values = ['0'];
  signatures = ['getBalanceOf(address)'];
  callDatas = [encodeParameters(['address'], [account0.address])];

  await gov.connect(proposer).propose(targets, values, signatures, callDatas, 'do nothing');
  proposalId = await gov.latestProposalIds(proposer.address);
}

let token: NounsToken;
let deployer: SignerWithAddress;
let account0: SignerWithAddress;
let account1: SignerWithAddress;
let account2: SignerWithAddress;
let signers: TestSigners;

let gov: NounsDAOLogicV1;
const timelockDelay = 172800; // 2 days

const proposalThresholdBPS = 678; // 6.78%
const quorumVotesBPS = 1100; // 11%

let targets: string[];
let values: string[];
let signatures: string[];
let callDatas: string[];
let proposalId: EthersBN;

describe('NounsDAO#inflationHandling', () => {
  before(async () => {
    signers = await getSigners();
    deployer = signers.deployer;
    account0 = signers.account0;
    account1 = signers.account1;
    account2 = signers.account2;

    targets = [account0.address];
    values = ['0'];
    signatures = ['getBalanceOf(address)'];
    callDatas = [encodeParameters(['address'], [account0.address])];

    ({ token, gov } = await deployGovAndToken(
      deployer,
      timelockDelay,
      proposalThresholdBPS,
      quorumVotesBPS,
    ));
  });

  it('set parameters correctly', async () => {
    expect(await gov.proposalThresholdBPS()).to.equal(proposalThresholdBPS);
    expect(await gov.quorumVotesBPS()).to.equal(quorumVotesBPS);
  });

  it('returns quorum votes and proposal threshold based on Noun total supply', async () => {
    // Total Supply = 40
    await setTotalSupply(token, 40);

    await mineBlock();

    // 6.78% of 40 = 2.712, floored to 2
    expect(await gov.proposalThreshold()).to.equal(2);
    // 11% of 40 = 4.4, floored to 4
    expect(await gov.quorumVotes()).to.equal(4);
  });

  it('rejects if proposing below threshold', async () => {
    // account0 has 1 token, requires 3
    await token.transferFrom(deployer.address, account0.address, 0);
    await mineBlock();
    await expect(
      gov.connect(account0).propose(targets, values, signatures, callDatas, 'do nothing'),
    ).revertedWith('NounsDAO::propose: proposer votes below proposal threshold');
  });
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

    await mineBlock();
    await propose(account0);
  });

  it('sets proposal attributes correctly', async () => {
    const proposal = await gov.proposals(proposalId);
    expect(proposal.proposalThreshold).to.equal(2);
    expect(proposal.quorumVotes).to.equal(4);
  });

  it('returns updated quorum votes and proposal threshold when total supply changes', async () => {
    // Total Supply = 80
    await setTotalSupply(token, 80);

    // 6.78% of 80 = 5.424, floored to 5
    expect(await gov.proposalThreshold()).to.equal(5);
    // 11% of 80 = 8.88, floored to 8
    expect(await gov.quorumVotes()).to.equal(8);
  });

  it('rejects proposals that were previously above proposal threshold, but due to increasing supply are now below', async () => {
    // account1 has 3 tokens, but requires 5 to pass new proposal threshold when totalSupply = 80 and threshold = 5%
    await expect(
      gov.connect(account1).propose(targets, values, signatures, callDatas, 'do nothing'),
    ).revertedWith('NounsDAO::propose: proposer votes below proposal threshold');
  });

  it('does not change previous proposal attributes when total supply changes', async () => {
    const proposal = await gov.proposals(proposalId);
    expect(proposal.proposalThreshold).to.equal(2);
    expect(proposal.quorumVotes).to.equal(4);
  });

  it('updates for/against votes correctly', async () => {
    // Accounts voting for = 5 votes
    // forVotes should be greater than quorumVotes
    await gov.connect(account0).castVote(proposalId, 1); // 3
    await gov.connect(account1).castVote(proposalId, 1); // 3

    await gov.connect(account2).castVote(proposalId, 0); // 5

    const proposal = await gov.proposals(proposalId);
    expect(proposal.forVotes).to.equal(6);
    expect(proposal.againstVotes).to.equal(5);
  });

  it('succeeds when for forVotes > quorumVotes and againstVotes', async () => {
    await advanceBlocks(5760);
    const state = await gov.state(proposalId);
    expect(state).to.equal(4);
  });
});
