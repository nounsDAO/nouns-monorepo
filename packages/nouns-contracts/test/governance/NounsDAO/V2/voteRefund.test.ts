import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { BigNumber, ContractReceipt } from 'ethers';
import { ethers } from 'hardhat';
import {
  NounsDAOLogicV2,
  NounsDAOLogicV2__factory,
  NounsDescriptorV2__factory,
  NounsToken,
  Voter__factory,
} from '../../../../typechain';
import { MaliciousVoter__factory } from '../../../../typechain/factories/contracts/test/MaliciousVoter__factory';
import {
  address,
  advanceBlocks,
  deployGovernorV2WithV2Proxy,
  deployNounsToken,
  encodeParameters,
  getSigners,
  populateDescriptorV2,
  setNextBlockBaseFee,
  TestSigners,
} from '../../../utils';

chai.use(solidity);
const { expect } = chai;

const realLongReason =
  "Judge: The defense may proceed. Roark: Your Honor, I shall call no witnesses. This will be my testimony and my summation. Judge: Take the oath. Court Clerk: Do you swear to tell the truth, the whole truth, and nothing but the truth, so help you God? Roark: I do. Thousands of years ago, the first man discovered how to make fire. He was probably burned at the stake he had taught his brothers to light, but he left them a gift they had not conceived, and he lifted darkness off the earth. Throughout the centuries, there were men who took first steps down new roads, armed with nothing but their own vision. The great creators -- the thinkers, the artists, the scientists, the inventors -- stood alone against the men of their time. Every new thought was opposed; every new invention was denounced. But the men of unborrowed vision went ahead. They fought, they suffered, and they paid. But they won. No creator was prompted by a desire to please his brothers. His brothers hated the gift he offered. His truth was his only motive. His work was his only goal. His work -- not those who used it. His creation -- not the benefits others derived from it -- the creation which gave form to his truth. He held his truth above all things and against all men. He went ahead whether others agreed with him or not, with his integrity as his only banner. He served nothing and no one. He lived for himself. And only by living for himself was he able to achieve the things which are the glory of mankind. Such is the nature of achievement. Man cannot survive except through his mind. He comes on earth unarmed. His brain is his only weapon. But the mind is an attribute of the individual. There is no such thing as a collective brain. The man who thinks must think and act on his own. The reasoning mind cannot work under any form of compulsion. It cannot be subordinated to the needs, opinions, or wishes of others. It is not an object of sacrifice. The creator stands on his own judgment; the parasite follows the opinions of others. The creator thinks; the parasite copies. The creator produces; the parasite loots. The creator's concern is the conquest of nature; the parasite's concern is the conquest of men. The creator requires independence. He neither serves nor rules. He deals with men by free exchange and voluntary choice. The parasite seeks power. He wants to bind all men together in common action and common slavery. He claims that man is only a tool for the use of others -- that he must think as they think, act as they act, and live in selfless, joyless servitude to any need but his own. Look at history: Everything we have, every great achievement has come from the independent work of some independent mind. Every horror and destruction came from attempts to force men into a herd of brainless, soulless robots -- without personal rights, without person ambition, without will, hope, or dignity. It is an ancient conflict. It has another name: \"The individual against the collective.\" Our country, the noblest country in the history of men, was based on the principle of individualism, the principle of man's \"inalienable rights.\" It was a country where a man was free to seek his own happiness, to gain and produce, not to give up and renounce; to prosper, not to starve; to achieve, not to plunder; to hold as his highest possession a sense of his personal value, and as his highest virtue his self-respect. Look at the results. That is what the collectivists are now asking you to destroy, as much of the earth has been destroyed. I am an architect. I know what is to come by the principle on which it is built. We are approaching a world in which I cannot permit myself to live. My ideas are my property. They were taken from me by force, by breach of contract. No appeal was left to me. It was believed that my work belonged to others, to do with as they pleased. They had a claim upon me without my consent -- that it was my duty to serve them without choice or reward. Now you know why a dynamited Courtland. I designed Courtland. I made it possible. I destroyed it. I agreed to design it for the purpose of it seeing built as I wished. That was the price I set for my work. I was not paid. My building was disfigured at the whim of others who took all the benefits of my work and gave me nothing in return. I came here to say that I do not recognize anyone's right to one minute of my life, nor to any part of my energy, nor to any achievement of mine -- no matter who makes the claim! It had to be said: The world is perishing from an orgy of self-sacrificing. I came here to be heard in the name of every man of independence still left in the world. I wanted to state my terms. I do not care to work or live on any others. My terms are: A man's RIGHT to exist for his own sake.";
const LONG_REASON = realLongReason + realLongReason;
const REFUND_ERROR_MARGIN = ethers.utils.parseEther('0.00015');
const MAX_PRIORITY_FEE_CAP = ethers.utils.parseUnits('2', 'gwei');
const DEFAULT_GAS_OPTIONS = { maxPriorityFeePerGas: MAX_PRIORITY_FEE_CAP };
const MAX_REFUND_GAS_USED = BigNumber.from(200_000);
const MAX_REFUND_BASE_FEE = ethers.utils.parseUnits('200', 'gwei');

let deployer: SignerWithAddress;
let user: SignerWithAddress;
let user2: SignerWithAddress;
let signers: TestSigners;
let gov: NounsDAOLogicV2;
let token: NounsToken;
let snapshotId: number;

describe('Vote Refund', () => {
  before(async () => {
    signers = await getSigners();
    deployer = signers.deployer;
    user = signers.account0;
    user2 = signers.account1;

    token = await deployNounsToken(deployer);
    const descriptor = NounsDescriptorV2__factory.connect(await token.descriptor(), deployer);
    await populateDescriptorV2(descriptor);

    await token.connect(deployer).mint();
    await token.connect(deployer).transferFrom(deployer.address, user.address, 0);
    await token.connect(deployer).transferFrom(deployer.address, user.address, 1);

    await advanceBlocks(1);

    gov = await deployGovernorV2WithV2Proxy(deployer, token.address);
    await submitProposal(user);
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  describe('castRefundableVote', () => {
    it('refunds users with votes', async () => {
      await fundGov();
      const balanceBefore = await user.getBalance();
      const tx = await gov.connect(user).castRefundableVote(1, 1, DEFAULT_GAS_OPTIONS);
      const r = await tx.wait();
      const balanceDiff = balanceBefore.sub(await user.getBalance());

      expect(r.gasUsed).to.be.gt(0);
      expect(balanceDiff).to.be.closeTo(BigNumber.from(0), REFUND_ERROR_MARGIN);
      expectRefundEvent(r, user, await txCostInEth(r));
      await expect(tx).to.emit(gov, 'VoteCast').withArgs(user.address, BigNumber.from(1), 1, 2, '');
    });

    it('does not refund users with no votes', async () => {
      await fundGov();
      const balanceBefore = await user2.getBalance();

      const tx = await gov.connect(user2).castRefundableVote(1, 1, DEFAULT_GAS_OPTIONS);
      const r = await tx.wait();

      expect(r.gasUsed).to.be.gt(0);
      const balanceDiff = balanceBefore.sub(await user2.getBalance());
      expect(balanceDiff).to.be.eq(await txCostInEth(r));
      await expect(tx).to.changeEtherBalance(gov, 0);
    });

    it('caps refund', async () => {
      await fundGov();
      const balanceBefore = await user.getBalance();

      const tx = await gov.connect(user).castRefundableVote(1, 1, {
        maxPriorityFeePerGas: ethers.utils.parseUnits('80', 'gwei'),
      });
      const r = await tx.wait();

      expect(r.gasUsed).to.be.gt(0);
      const balanceDiff = balanceBefore.sub(await user.getBalance());
      expect(balanceDiff).to.be.closeTo(
        await expectedPriorityFeeCappedDiff(r),
        REFUND_ERROR_MARGIN,
      );
    });

    it('does not refund when DAO balance is zero', async () => {
      expect(await ethers.provider.getBalance(gov.address)).to.eq(0);
      const balanceBefore = await user.getBalance();
      const tx = await gov.connect(user).castRefundableVote(1, 1, DEFAULT_GAS_OPTIONS);
      const r = await tx.wait();

      expect(r.gasUsed).to.be.gt(0);
      const balanceDiff = balanceBefore.sub(await user.getBalance());
      expect(balanceDiff).to.be.eq(await txCostInEth(r));
    });

    it('provides partial refund given insufficient balance', async () => {
      await fundGov('0.00001');
      const govBalance = ethers.utils.parseEther('0.00001');
      expect(await ethers.provider.getBalance(gov.address)).to.eq(govBalance);
      const balanceBefore = await user.getBalance();

      const tx = await gov.connect(user).castRefundableVote(1, 1, DEFAULT_GAS_OPTIONS);
      const r = await tx.wait();

      expect(r.gasUsed).to.be.gt(0);
      const expectedDiff = (await txCostInEth(r)).sub(govBalance);
      const balanceDiff = balanceBefore.sub(await user.getBalance());
      expect(balanceDiff).to.eq(expectedDiff);
    });

    it('malicious voter trying reentrance does not get refunded', async () => {
      const voter = await new MaliciousVoter__factory(deployer).deploy(gov.address, 2, 1, false);
      await token.connect(user).transferFrom(user.address, voter.address, 0);
      await token.connect(user).transferFrom(user.address, user2.address, 1);
      await advanceBlocks(1);
      await submitProposal(user2);
      const balanceBefore = await user.getBalance();

      const tx = await voter.connect(user).castVote(DEFAULT_GAS_OPTIONS);
      const r = await tx.wait();

      const balanceDiff = balanceBefore.sub(await user.getBalance());
      expect(balanceDiff).to.be.eq(await txCostInEth(r));
      await expect(tx).to.changeEtherBalance(gov, 0);
    });
  });

  describe('castRefundableVoteWithReason', () => {
    it('refunds users with votes', async () => {
      await fundGov();
      const balanceBefore = await user.getBalance();
      const tx = await gov
        .connect(user)
        .castRefundableVoteWithReason(1, 1, 'some reason', DEFAULT_GAS_OPTIONS);
      const r = await tx.wait();
      const balanceDiff = balanceBefore.sub(await user.getBalance());

      expect(r.gasUsed).to.be.gt(0);
      expect(balanceDiff).to.be.closeTo(BigNumber.from(0), REFUND_ERROR_MARGIN);

      expectRefundEvent(r, user, await txCostInEth(r));
      await expect(tx)
        .to.emit(gov, 'VoteCast')
        .withArgs(user.address, BigNumber.from(1), 1, 2, 'some reason');
    });

    it('does not refund users with no votes', async () => {
      await fundGov();
      const balanceBefore = await user2.getBalance();

      const tx = await gov
        .connect(user2)
        .castRefundableVoteWithReason(1, 1, 'some reason', DEFAULT_GAS_OPTIONS);
      const r = await tx.wait();

      expect(r.gasUsed).to.be.gt(0);
      const balanceDiff = balanceBefore.sub(await user2.getBalance());
      expect(balanceDiff).to.be.eq(await txCostInEth(r));
      await expect(tx).to.changeEtherBalance(gov, 0);
    });

    it('caps refund priority fee', async () => {
      await fundGov();
      const balanceBefore = await user.getBalance();

      const tx = await gov.connect(user).castRefundableVoteWithReason(1, 1, 'some reason', {
        maxPriorityFeePerGas: ethers.utils.parseUnits('80', 'gwei'),
      });
      const r = await tx.wait();

      expect(r.gasUsed).to.be.gt(0);
      const balanceDiff = balanceBefore.sub(await user.getBalance());
      expect(balanceDiff).to.be.closeTo(
        await expectedPriorityFeeCappedDiff(r),
        REFUND_ERROR_MARGIN,
      );
    });

    it('caps gasUsed', async () => {
      await fundGov();
      const balanceBefore = await user.getBalance();
      const tx = await gov
        .connect(user)
        .castRefundableVoteWithReason(1, 1, LONG_REASON, DEFAULT_GAS_OPTIONS);
      const r = await tx.wait();
      const balanceDiff = balanceBefore.sub(await user.getBalance());

      expect(r.gasUsed).to.be.gt(0);
      expect(balanceDiff).to.be.closeTo(await expectedGasUsedCappedDiff(r), REFUND_ERROR_MARGIN);

      expectRefundEvent(r, user, MAX_REFUND_GAS_USED.mul(await latestBasePlusMaxPriority()));
      await expect(tx)
        .to.emit(gov, 'VoteCast')
        .withArgs(user.address, BigNumber.from(1), 1, 2, LONG_REASON);
    });

    it('caps basefee [ @skip-on-coverage ]', async () => {
      await fundGov();
      await setNextBlockBaseFee(MAX_REFUND_BASE_FEE.mul(2));
      const balanceBefore = await user.getBalance();
      const tx = await gov
        .connect(user)
        .castRefundableVoteWithReason(1, 1, 'some reason', DEFAULT_GAS_OPTIONS);
      const r = await tx.wait();
      const balanceDiff = balanceBefore.sub(await user.getBalance());

      expect(r.gasUsed).to.be.gt(0);
      expect(balanceDiff).to.be.closeTo(await expectedBaseFeeCappedDiff(r), REFUND_ERROR_MARGIN);

      expectRefundEvent(r, user, r.gasUsed.mul(MAX_REFUND_BASE_FEE.add(MAX_PRIORITY_FEE_CAP)));
      await expect(tx)
        .to.emit(gov, 'VoteCast')
        .withArgs(user.address, BigNumber.from(1), 1, 2, 'some reason');
    });

    it('does not refund when DAO balance is zero', async () => {
      expect(await ethers.provider.getBalance(gov.address)).to.eq(0);
      const balanceBefore = await user.getBalance();
      const tx = await gov
        .connect(user)
        .castRefundableVoteWithReason(1, 1, 'some reason', DEFAULT_GAS_OPTIONS);
      const r = await tx.wait();

      expect(r.gasUsed).to.be.gt(0);
      const balanceDiff = balanceBefore.sub(await user.getBalance());
      expect(balanceDiff).to.be.eq(await txCostInEth(r));
    });

    it('provides partial refund given insufficient balance', async () => {
      await fundGov('0.00001');
      const govBalance = ethers.utils.parseEther('0.00001');
      expect(await ethers.provider.getBalance(gov.address)).to.eq(govBalance);
      const balanceBefore = await user.getBalance();

      const tx = await gov
        .connect(user)
        .castRefundableVoteWithReason(1, 1, 'some reason', DEFAULT_GAS_OPTIONS);
      const r = await tx.wait();

      expect(r.gasUsed).to.be.gt(0);
      const expectedDiff = (await txCostInEth(r)).sub(govBalance);
      const balanceDiff = balanceBefore.sub(await user.getBalance());
      expect(balanceDiff).to.eq(expectedDiff);
    });

    it('malicious voter trying reentrance does not get refunded', async () => {
      const voter = await new MaliciousVoter__factory(deployer).deploy(gov.address, 2, 1, true);
      await token.connect(user).transferFrom(user.address, voter.address, 0);
      await token.connect(user).transferFrom(user.address, user2.address, 1);
      await advanceBlocks(1);
      await submitProposal(user2);
      const balanceBefore = await user.getBalance();

      const tx = await voter.connect(user).castVote(DEFAULT_GAS_OPTIONS);
      const r = await tx.wait();

      const balanceDiff = balanceBefore.sub(await user.getBalance());
      expect(balanceDiff).to.be.eq(await txCostInEth(r));
      await expect(tx).to.changeEtherBalance(gov, 0);
    });

    it('refunds EOA user when voting via a smart contract (tx.origin)', async () => {
      await fundGov();

      const voter = await new Voter__factory(deployer).deploy(gov.address, 2, 1, true);
      await token.connect(user).transferFrom(user.address, voter.address, 0);
      await token.connect(user).transferFrom(user.address, user2.address, 1);
      await advanceBlocks(1);
      await submitProposal(user2);

      const balanceBefore = await user.getBalance();
      const tx = await voter.connect(user).castVote(DEFAULT_GAS_OPTIONS);
      const r = await tx.wait();
      const balanceDiff = balanceBefore.sub(await user.getBalance());

      expect(r.gasUsed).to.be.gt(0);
      expect(balanceDiff).to.be.closeTo(BigNumber.from(0), REFUND_ERROR_MARGIN);

      expectRefundEvent(r, user, await txCostInEth(r));
      await expect(tx)
        .to.emit(gov, 'VoteCast')
        .withArgs(voter.address, BigNumber.from(2), 1, 1, 'some reason');
    });
  });

  async function expectedPriorityFeeCappedDiff(r: ContractReceipt): Promise<BigNumber> {
    const expectedRefund = await txCostInEth(r);
    const txGrossCost = r.gasUsed.mul(r.effectiveGasPrice);
    return txGrossCost.sub(expectedRefund);
  }

  async function expectedGasUsedCappedDiff(r: ContractReceipt): Promise<BigNumber> {
    const gasPrice = await latestBasePlusMaxPriority();
    const expectedRefund = MAX_REFUND_GAS_USED.mul(gasPrice);
    const txGrossCost = r.gasUsed.mul(gasPrice);
    return txGrossCost.sub(expectedRefund);
  }

  async function expectedBaseFeeCappedDiff(r: ContractReceipt): Promise<BigNumber> {
    const expectedRefund = r.gasUsed.mul(MAX_REFUND_BASE_FEE.add(MAX_PRIORITY_FEE_CAP));
    const txGrossCost = r.gasUsed.mul(await latestBasePlusMaxPriority());
    return txGrossCost.sub(expectedRefund);
  }

  async function txCostInEth(r: ContractReceipt): Promise<BigNumber> {
    return r.gasUsed.mul(await latestBasePlusMaxPriority());
  }

  async function latestBasePlusMaxPriority(): Promise<BigNumber> {
    const block = await ethers.provider.getBlock('latest');
    return block.baseFeePerGas!.add(MAX_PRIORITY_FEE_CAP);
  }

  async function fundGov(ethAmount: string = '100') {
    await deployer.sendTransaction({ to: gov.address, value: ethers.utils.parseEther(ethAmount) });
  }

  function expectRefundEvent(r: ContractReceipt, u: SignerWithAddress, expectedCost: BigNumber) {
    // Not using expect emit because it doesn't support the `closeTo` matcher
    // Using longer event parsing because r.events doesn't work when using the Voter contract
    // to simulate multisig usage; events are returned undefined
    const daoInterface = NounsDAOLogicV2__factory.createInterface();
    const eventId = ethers.utils.id('RefundableVote(address,uint256,bool)');
    const filtered = r.logs.filter(l => l.topics[0] === eventId);
    const parsed = filtered.map(e => {
      return daoInterface.parseLog(e);
    });

    expect(parsed.length).to.equal(1);
    const refundEvent = parsed[0];
    expect(refundEvent).to.not.be.undefined;
    expect(refundEvent!.args!.voter).to.equal(u.address);
    expect(refundEvent!.args!.refundSent).to.be.true;
    expect(refundEvent!.args!.refundAmount).to.be.closeTo(expectedCost, REFUND_ERROR_MARGIN);
  }

  async function submitProposal(u: SignerWithAddress) {
    await gov
      .connect(u)
      .propose(
        [address(0)],
        ['0'],
        ['getBalanceOf(address)'],
        [encodeParameters(['address'], [address(0)])],
        '',
      );

    await advanceBlocks(2);
  }
});
