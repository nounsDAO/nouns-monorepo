import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import hardhat from 'hardhat';

const { ethers } = hardhat;

import { BigNumber as EthersBN } from 'ethers';

import {
  deployNounsToken,
  getSigners,
  TestSigners,
  setTotalSupply,
  propose,
  deployGovernorV3WithV3Proxy,
  populateDescriptorV2,
} from '../utils';

import { mineBlock } from '../utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  NounsToken,
  NounsDescriptorV3__factory as NounsDescriptorV3Factory,
  NounsDAOLogicV4,
} from '../../typechain';

chai.use(solidity);
const { expect } = chai;

let snapshotId: number;

let token: NounsToken;
let deployer: SignerWithAddress;
let account0: SignerWithAddress;
let account1: SignerWithAddress;
let account2: SignerWithAddress;
let signers: TestSigners;

let gov: INounsDAOLogic;
let proposalId: EthersBN;

async function reset() {
  if (snapshotId) {
    await ethers.provider.send('evm_revert', [snapshotId]);
    snapshotId = await ethers.provider.send('evm_snapshot', []);
    return;
  }
  token = await deployNounsToken(signers.deployer);

  await populateDescriptorV2(
    NounsDescriptorV3Factory.connect(await token.descriptor(), signers.deployer),
  );

  await setTotalSupply(token, 10);

  gov = await deployGovernorV3WithV3Proxy(deployer, token.address);
  snapshotId = await ethers.provider.send('evm_snapshot', []);
}

describe('NounsDAOV2#castVote/2', () => {
  before(async () => {
    signers = await getSigners();
    deployer = signers.deployer;
    account0 = signers.account0;
    account1 = signers.account1;
    account2 = signers.account2;
  });

  describe('We must revert if:', () => {
    before(async () => {
      await reset();
      proposalId = await propose(gov, deployer);
    });

    it("There does not exist a proposal with matching proposal id where the current block number is between the proposal's start block (exclusive) and end block (inclusive)", async () => {
      await expect(gov.castVote(proposalId, 1)).revertedWith(
        'NounsDAO::castVoteInternal: voting is closed',
      );
    });

    it('Such proposal already has an entry in its voters set matching the sender', async () => {
      await mineBlock();
      await mineBlock();

      await token.transferFrom(deployer.address, account0.address, 0);
      await token.transferFrom(deployer.address, account1.address, 1);

      await gov.connect(account0).castVote(proposalId, 1);

      await gov.connect(account1).castVoteWithReason(proposalId, 1, '');

      await expect(gov.connect(account0).castVote(proposalId, 1)).revertedWith(
        'NounsDAO::castVoteDuringVotingPeriodInternal: voter already voted',
      );
    });
  });

  describe('Otherwise', () => {
    it("we add the sender to the proposal's voters set", async () => {
      const voteReceipt1 = await gov.getReceipt(proposalId, account2.address);
      expect(voteReceipt1.hasVoted).to.equal(false);

      await gov.connect(account2).castVote(proposalId, 1);
      const voteReceipt2 = await gov.getReceipt(proposalId, account2.address);
      expect(voteReceipt2.hasVoted).to.equal(true);
    });

    describe("and we take the balance returned by GetPriorVotes for the given sender and the proposal's start block, which may be zero,", () => {
      let actor: SignerWithAddress; // an account that will propose, receive tokens, delegate to self, and vote on own proposal

      before(reset);

      it('and we add that ForVotes', async () => {
        actor = account0;

        await token.transferFrom(deployer.address, actor.address, 0);
        await token.transferFrom(deployer.address, actor.address, 1);
        proposalId = await propose(gov, actor);

        const beforeFors = (await gov.proposals(proposalId)).forVotes;
        await mineBlock();
        await gov.connect(actor).castVote(proposalId, 1);

        const afterFors = (await gov.proposals(proposalId)).forVotes;

        const balance = (await token.balanceOf(actor.address)).toString();

        expect(afterFors).to.equal(beforeFors.add(balance));
      });

      it("or AgainstVotes corresponding to the caller's support flag.", async () => {
        actor = account1;
        await token.transferFrom(deployer.address, actor.address, 2);
        await token.transferFrom(deployer.address, actor.address, 3);

        proposalId = await propose(gov, actor);

        const beforeAgainst = (await gov.proposals(proposalId)).againstVotes;

        await mineBlock();
        await gov.connect(actor).castVote(proposalId, 0);

        const afterAgainst = (await gov.proposals(proposalId)).againstVotes;

        const balance = (await token.balanceOf(actor.address)).toString();

        expect(afterAgainst).to.equal(beforeAgainst.add(balance));
      });
    });
  });
});
