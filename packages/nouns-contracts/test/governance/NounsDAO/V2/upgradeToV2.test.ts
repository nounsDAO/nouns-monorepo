import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import {
  deployNounsToken,
  getSigners,
  TestSigners,
  setTotalSupply,
  advanceBlocks,
  propStateToString,
  deployGovernorV1,
  deployGovernorV2,
  propose,
  blockNumber,
  populateDescriptorV2,
} from '../../../utils';
import { mineBlock } from '../../../utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  NounsToken,
  NounsDescriptorV2__factory as NounsDescriptorV2Factory,
  NounsDAOLogicV1,
  NounsDAOLogicV1__factory as NounsDaoLogicV1Factory,
  NounsDAOLogicV2,
  NounsDAOLogicV2__factory as NounsDaoLogicV2Factory,
} from '../../../../typechain';
import { MAX_QUORUM_VOTES_BPS, MIN_QUORUM_VOTES_BPS } from '../../../constants';

chai.use(solidity);
const { expect } = chai;

const V1_QUORUM_BPS = 100;

let token: NounsToken;
let deployer: SignerWithAddress;
let account0: SignerWithAddress;
let account1: SignerWithAddress;
let account2: SignerWithAddress;
let signers: TestSigners;

let govProxyAddress: string;
let govV1: NounsDAOLogicV1;
let govV2: NounsDAOLogicV2;

async function setupWithV1() {
  token = await deployNounsToken(signers.deployer);

  await populateDescriptorV2(
    NounsDescriptorV2Factory.connect(await token.descriptor(), signers.deployer),
  );

  await setTotalSupply(token, 100);

  ({ address: govProxyAddress } = await deployGovernorV1(deployer, token.address, V1_QUORUM_BPS));
}

describe('NounsDAO upgrade to V2', () => {
  before(async () => {
    signers = await getSigners();
    deployer = signers.deployer;
    account0 = signers.account0;
    account1 = signers.account1;
    account2 = signers.account2;

    await setupWithV1();

    govV1 = NounsDaoLogicV1Factory.connect(govProxyAddress, deployer);
    govV2 = NounsDaoLogicV2Factory.connect(govProxyAddress, deployer);
  });

  it('Simulate some proposals in V1', async () => {
    await token.connect(deployer).transferFrom(deployer.address, account0.address, 0);
    await token.connect(deployer).transferFrom(deployer.address, account1.address, 1);

    // Prop 1
    await propose(govV1, account0);
    await mineBlock();
    await govV1.connect(account0).castVote(1, 1);
    await advanceBlocks(2000);

    // Prop 2
    await propose(govV1, account1);
    await advanceBlocks(2);

    // Prop 3
    await propose(govV1, account0);
    await advanceBlocks(2);
  });

  it('and upgrade to V2', async () => {
    await deployGovernorV2(deployer, govProxyAddress);
  });

  it('and V2 returns default quorum params with V1 value', async () => {
    const quorumParams = await govV2.getDynamicQuorumParamsAt(await blockNumber());

    expect(quorumParams.minQuorumVotesBPS).to.equal(V1_QUORUM_BPS);
    expect(quorumParams.maxQuorumVotesBPS).to.equal(V1_QUORUM_BPS);
    expect(quorumParams.quorumCoefficient).to.equal(0);
  });

  it('and V2 config set', async () => {
    await govV2._setDynamicQuorumParams(MIN_QUORUM_VOTES_BPS, MAX_QUORUM_VOTES_BPS, 0);

    const quorumParams = await govV2.getDynamicQuorumParamsAt(await blockNumber());

    expect(quorumParams.minQuorumVotesBPS).to.equal(MIN_QUORUM_VOTES_BPS);
    expect(quorumParams.maxQuorumVotesBPS).to.equal(MAX_QUORUM_VOTES_BPS);
  });

  it('and V1 proposalCount stayed the same, meaning the storage slot below the rename is good', async () => {
    expect(await govV2.proposalCount()).to.equal(3);
  });

  it('and V1 Props have the same quorumVotes', async () => {
    expect(await govV2.quorumVotes(3)).to.equal(1);
  });

  it('and V2 props have a different quorum', async () => {
    await token.connect(deployer).transferFrom(deployer.address, account2.address, 3);
    const propId = await propose(govV2, account2);

    expect(await govV2.quorumVotes(propId)).to.equal(2);
  });

  it('and V1 and V2 props reach their end state as expected', async () => {
    await govV2.connect(account0).castVote(3, 1);
    // Prop 4 will fail because it's using the new and higher quorum
    await govV2.connect(account1).castVote(4, 1);

    await advanceBlocks(2000);

    expect(propStateToString(await govV2.state(1)), '1').to.equal('Succeeded');
    expect(propStateToString(await govV2.state(2)), '2').to.equal('Defeated');
    expect(propStateToString(await govV2.state(3)), '3').to.equal('Succeeded');
    expect(propStateToString(await govV2.state(4)), '4').to.equal('Defeated');
  });
});
