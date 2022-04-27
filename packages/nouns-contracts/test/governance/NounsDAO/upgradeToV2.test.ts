import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import hardhat from 'hardhat';
const { ethers } = hardhat;
import {
  deployNounsToken,
  getSigners,
  TestSigners,
  setTotalSupply,
  populateDescriptor,
  advanceBlocks,
  propStateToString,
} from '../../utils';
import { mineBlock, address, encodeParameters } from '../../utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  NounsToken,
  NounsDescriptor__factory as NounsDescriptorFactory,
  NounsDaoLogicV1Harness,
  NounsDaoLogicV1Harness__factory as NounsDaoLogicV1HarnessFactory,
  NounsDaoLogicV2Harness,
  NounsDaoLogicV2Harness__factory as NounsDaoLogicV2HarnessFactory,
  NounsDaoProxy__factory as NounsDaoProxyFactory,
} from '../../../typechain';

chai.use(solidity);
const { expect } = chai;

const V1_QUORUM_BPS = 200;
const MIN_QUORUM_VOTES_BPS = 100;
const MAX_QUORUM_VOTES_BPS = 6000;

async function deployGovernorV1(
  deployer: SignerWithAddress,
  tokenAddress: string,
): Promise<NounsDaoLogicV1Harness> {
  const { address: govDelegateAddress } = await new NounsDaoLogicV1HarnessFactory(
    deployer,
  ).deploy();
  const params = [
    address(0),
    tokenAddress,
    deployer.address,
    deployer.address,
    govDelegateAddress,
    1728,
    1,
    1,
    V1_QUORUM_BPS,
  ];

  const { address: _govDelegatorAddress } = await (
    await ethers.getContractFactory('NounsDAOProxy', deployer)
  ).deploy(...params);

  return NounsDaoLogicV1HarnessFactory.connect(_govDelegatorAddress, deployer);
}

async function deployGovernorV2(
  deployer: SignerWithAddress,
  tokenAddress: string,
  proxyAddress: string,
): Promise<NounsDaoLogicV2Harness> {
  const v2LogicContract = await new NounsDaoLogicV2HarnessFactory(deployer).deploy();
  const proxy = NounsDaoProxyFactory.connect(proxyAddress, deployer);
  await proxy._setImplementation(v2LogicContract.address);

  const govV2 = NounsDaoLogicV2HarnessFactory.connect(proxyAddress, deployer);

  await govV2.initialize(
    address(0),
    tokenAddress,
    deployer.address,
    1728,
    1,
    1,
    MIN_QUORUM_VOTES_BPS,
    MAX_QUORUM_VOTES_BPS,
    [0, 0, 0, 0],
  );

  return govV2;
}

let token: NounsToken;
let deployer: SignerWithAddress;
let account0: SignerWithAddress;
let account1: SignerWithAddress;
let account2: SignerWithAddress;
let signers: TestSigners;

let govProxyAddress: string;
let govV1: NounsDaoLogicV1Harness;
let govV2: NounsDaoLogicV2Harness;

async function setupWithV1() {
  token = await deployNounsToken(signers.deployer);

  await populateDescriptor(
    NounsDescriptorFactory.connect(await token.descriptor(), signers.deployer),
  );

  await setTotalSupply(token, 100);

  ({ address: govProxyAddress } = await deployGovernorV1(deployer, token.address));
}

async function proposeV1(proposer: SignerWithAddress) {
  const targets = [account0.address];
  const values = ['0'];
  const signatures = ['getBalanceOf(address)'];
  const callDatas = [encodeParameters(['address'], [account0.address])];

  await govV1.connect(proposer).propose(targets, values, signatures, callDatas, 'do nothing');
  return await govV1.latestProposalIds(proposer.address);
}

async function proposeV2(proposer: SignerWithAddress) {
  const targets = [account0.address];
  const values = ['0'];
  const signatures = ['getBalanceOf(address)'];
  const callDatas = [encodeParameters(['address'], [account0.address])];

  await govV2.connect(proposer).propose(targets, values, signatures, callDatas, 'do nothing');
  return await govV2.latestProposalIds(proposer.address);
}

describe('NounsDAO upgrade to V2', () => {
  before(async () => {
    signers = await getSigners();
    deployer = signers.deployer;
    account0 = signers.account0;
    account1 = signers.account1;
    account2 = signers.account2;

    await setupWithV1();

    govV1 = NounsDaoLogicV1HarnessFactory.connect(govProxyAddress, deployer);
    govV2 = NounsDaoLogicV2HarnessFactory.connect(govProxyAddress, deployer);
  });

  it('Simulate some proposals in V1', async () => {
    const govV1 = NounsDaoLogicV1HarnessFactory.connect(govProxyAddress, deployer);

    await token.connect(deployer).transferFrom(deployer.address, account0.address, 0);
    await token.connect(deployer).transferFrom(deployer.address, account1.address, 1);

    // Prop 1
    await proposeV1(account0);
    await mineBlock();
    await govV1.connect(account0).castVote(1, 1);
    await govV1.connect(account1).castVote(1, 1);
    await advanceBlocks(2000);

    // Prop 2
    await proposeV1(account1);
    await advanceBlocks(2);

    // Prop 3
    await proposeV1(account0);
    await advanceBlocks(2);
  });

  it('Upgrade to V2', async () => {
    await deployGovernorV2(deployer, token.address, govProxyAddress);
  });

  it('V2 config set', async () => {
    expect(await govV2.minQuorumVotesBPS()).to.equal(MIN_QUORUM_VOTES_BPS);
    expect(await govV2.maxQuorumVotesBPS()).to.equal(MAX_QUORUM_VOTES_BPS);
  });

  it('V1 proposalCount stayed the same, meaning the storage slot below the rename is good', async () => {
    expect(await govV2.proposalCount()).to.equal(3);
  });

  it('V1 Props have the same quorumVotes', async () => {
    expect((await govV2.proposals(3)).minQuorumVotes).to.equal(2);
  });

  it('V2 props have a different quorum', async () => {
    await token.connect(deployer).transferFrom(deployer.address, account2.address, 2);
    const propId = await proposeV2(account2);

    expect((await govV2.proposals(propId)).minQuorumVotes).to.equal(1);
  });

  it('V1 and V2 props reach their end state as expected', async () => {
    await govV2.connect(account0).castVote(3, 1);
    await govV2.connect(account1).castVote(3, 1);

    await advanceBlocks(2000);

    expect(propStateToString(await govV2.state(1))).to.equal('Succeeded');
    expect(propStateToString(await govV2.state(2))).to.equal('Defeated');
    expect(propStateToString(await govV2.state(3))).to.equal('Succeeded');
    expect(propStateToString(await govV2.state(4))).to.equal('Defeated');
  });
});
