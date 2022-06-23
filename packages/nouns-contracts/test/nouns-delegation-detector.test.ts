import chai from 'chai';
import { ethers, network } from 'hardhat';
import { solidity } from 'ethereum-waffle';
chai.use(solidity);
const { expect } = chai;
import {
  NounsDelegateDetector,
  NounsDelegateDetector__factory as NounsDelegateDetectorFactory,
  NounsToken,
  NounsToken__factory as NounsTokenFactory,
} from '../typechain';

let detector: NounsDelegateDetector;
let nounsToken: NounsToken;

const OWNER_SELF_DELEGATE = '0x91dCCAA260CC4616E1a6e6b693DB7207C5E42937'; // apenoun.eth is an owner and self-delegates
const OWNER_DELEGATEE = '0x9646E0F7544B8eE3649e7aC77eef0Cf5B53B748A'; // illiquidjpeg.eth is an owner and delegates to nouncil.eth
const OWNER_AND_DELEGATE = '0x4754b7e3DEde42D71d6c92978f25F306176EC7e9'; // 0x475...C7e9 is an owner, self-delegates, and has votes delegated to it by other accounts
const OWNER_DELEGATEE_AND_DELEGATE = '0x2573c60a6d127755aa2dc85e342f7da2378a0cc5'; // mock case: 0x257...0cc5 is an owner, delegates votes to another account, and has been delegated votes
const NON_OWNER_NON_DELEGATE = '0x0000000000000000000000000000000000000001'; // not an owner, has not been delegated votes
const NON_OWNER_DELEGATE = '0xcc2688350d29623e2a0844cc8885f9050f0f6ed5'; // nouncil.eth is not an owner, has been delegated votes

async function networkReset() {
  await network.provider.request({
    method: 'hardhat_reset',
    params: [
      {
        forking: {
          jsonRpcUrl: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_PROJECT_ID}`,
          blockNumber: 15008110, // Jun-22-2022 02:44:19 PM +UTC
        },
      },
    ],
  });
}

async function impersonateAccount(address: string) {
  await network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [address],
  });
}

async function stopImpersonatingAccount(address: string) {
  await network.provider.request({
    method: 'hardhat_stopImpersonatingAccount',
    params: [address],
  });
}

async function mockDelegate(from: string, to: string) {
  const signer = await ethers.provider.getSigner(from);
  await impersonateAccount(from);
  await nounsToken.connect(signer).delegate(to);
  await stopImpersonatingAccount(from);
}

describe('Nouns Delegate Detector', async () => {
  before(async () => {
    await networkReset();
    const [deployer] = await ethers.getSigners();
    const factory = new NounsDelegateDetectorFactory(deployer);
    detector = await factory.deploy();
    nounsToken = NounsTokenFactory.connect(await detector.nouns(), deployer);
  });

  describe('account is not an owner', () => {
    it('reports correctly when no votes have been delegated', async () => {
      const balance = await nounsToken.balanceOf(NON_OWNER_NON_DELEGATE);
      expect(balance).to.eq(0); // is not an owner

      const delegatedVotes = await detector.balanceOf(NON_OWNER_NON_DELEGATE);
      expect(delegatedVotes).to.eq(0); // has no delegated votes
    });

    it('reports correctly when votes have been delegated', async () => {
      const balance = await nounsToken.balanceOf(NON_OWNER_DELEGATE);
      expect(balance).to.eq(0); // is not an owner

      const delegatedVotes = await detector.balanceOf(NON_OWNER_DELEGATE);
      expect(delegatedVotes).to.gt(0); // has delegated votes
    });

    it('reports correctly when no votes have been delegated and the account has a delegation record', async () => {
      // creates a delegation record for this non-owner account
      await mockDelegate(NON_OWNER_NON_DELEGATE, '0x0000000000000000000000000000000000000002');

      const balance = await nounsToken.balanceOf(NON_OWNER_NON_DELEGATE);
      expect(balance).to.eq(0); // is not an owner

      const delegatedVotes = await detector.balanceOf(NON_OWNER_NON_DELEGATE);
      expect(delegatedVotes).to.eq(0); // has no delegated votes
    });
  });

  describe('account is an owner', () => {
    it('reports correctly when self-delegating', async () => {
      const balance = await nounsToken.balanceOf(OWNER_SELF_DELEGATE);
      expect(balance).to.gt(0); // is an owner

      const delegatedVotes = await detector.balanceOf(OWNER_SELF_DELEGATE);
      expect(delegatedVotes).to.eq(0); // has no delegated votes
    });

    it('reports correctly when delegating to another account', async () => {
      const balance = await nounsToken.balanceOf(OWNER_DELEGATEE);
      expect(balance).to.gt(0); // is an owner

      const delegatedVotes = await detector.balanceOf(OWNER_DELEGATEE);
      expect(delegatedVotes).to.eq(0); // has no delegated votes
    });

    it('reports correctly when self-delegating and has been delegated additional votes', async () => {
      const balance = await nounsToken.balanceOf(OWNER_AND_DELEGATE);
      expect(balance).to.gt(0); // is an owner

      const delegatedVotes = await detector.balanceOf(OWNER_AND_DELEGATE);
      expect(delegatedVotes).to.gt(0); // has delegated votes
    });

    it('reports correctly when delegating to another account and has been delegated votes', async () => {
      // Owner1 delegates away their votes
      await mockDelegate(
        OWNER_DELEGATEE_AND_DELEGATE,
        '0x0000000000000000000000000000000000000002',
      );
      // Owner2 delegates its votes to Owner1
      await mockDelegate(OWNER_SELF_DELEGATE, OWNER_DELEGATEE_AND_DELEGATE);

      const balance = await nounsToken.balanceOf(OWNER_DELEGATEE_AND_DELEGATE);
      expect(balance).to.gt(0); // is an owner

      const delegatedVotes = await detector.balanceOf(OWNER_DELEGATEE_AND_DELEGATE);
      expect(delegatedVotes).to.gt(0); // has delegated votes
    });
  });
});
