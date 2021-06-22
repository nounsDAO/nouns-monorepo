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
  encodeParameters
  // chainId
} from '../utils/Ethereum'

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  NounsErc721,
  GovernorBravoDelegator,
  GovernorBravoDelegateHarness,
  GovernorBravoDelegateHarness__factory
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


async function deployGovernor(
  deployer: SignerWithAddress,
  tokenAddress: string,
): Promise<GovernorBravoDelegateHarness> {
  const {address: govDelegateAddress } = await new GovernorBravoDelegateHarness__factory(deployer).deploy()
  const params = [address(0), tokenAddress, deployer.address, govDelegateAddress, 17280, 1, "1"]

  const {address: _govDelegatorAddress} = await (
    await ethers.getContractFactory('GovernorBravoDelegator', deployer)
  ).deploy(...params)

  return GovernorBravoDelegateHarness__factory.connect(_govDelegatorAddress, deployer)
}

let token: NounsErc721;
let deployer: SignerWithAddress;
let account0: SignerWithAddress;
let account1: SignerWithAddress;
let account2: SignerWithAddress;
let signers: TestSigners;

let gov: GovernorBravoDelegateHarness;
let targets: string[];
let values: string[];
let signatures: string[];
let callDatas: string[];
let proposalId: EthersBN;
let mintNouns: (amount: number) => Promise<void>;


async function reset(){

  token = await deployNounsErc721()

  mintNouns = MintNouns(token)

  await mintNouns(10)

  gov = await deployGovernor(deployer, token.address)

  // Not sure why but have to access `_initiate()` this way
  await gov.functions["_initiate()"]();
}

async function propose(proposer: SignerWithAddress){
  targets = [account0.address];
  values = ["0"];
  signatures = ["getBalanceOf(address)"];
  callDatas = [encodeParameters(['address'], [account0.address])];

  await gov.connect(proposer).propose(targets, values, signatures, callDatas, "do nothing");
  proposalId = await gov.latestProposalIds(proposer.address);
}

describe("governorBravo#castVote/2", () => {

  before(async () => {
    signers = await getSigners();
    deployer = signers.deployer;
    account0 = signers.account0;
    account1 = signers.account1;
    account2 = signers.account2;
  })

  describe("We must revert if:", () => {

    before(()=>reset().then(()=>propose(deployer)))

    it("There does not exist a proposal with matching proposal id where the current block number is between the proposal's start block (exclusive) and end block (inclusive)", async () => {
      await expect(
        gov.castVote(proposalId, 1)
      ).revertedWith("GovernorBravo::castVoteInternal: voting is closed");
    });

    it("Such proposal already has an entry in its voters set matching the sender", async () => {
      await mineBlock();
      await mineBlock();

      await token.transferFrom(deployer.address, account0.address, 0);
      await token.transferFrom(deployer.address, account1.address, 1);

      await gov.connect(account0).castVote(proposalId, 1);

      await gov.connect(account1).castVoteWithReason(proposalId, 1, "");

      await expect(
        gov.connect(account0).castVote(proposalId, 1)
      ).revertedWith("GovernorBravo::castVoteInternal: voter already voted");
    });
  });

  describe("Otherwise", () => {
    it("we add the sender to the proposal's voters set", async () => {
        const voteReceipt1 = await gov.getReceipt(proposalId, account2.address)
        expect(voteReceipt1.hasVoted).to.equal(false)

        await gov.connect(account2).castVote(proposalId, 1);
        const voteReceipt2 = await gov.getReceipt(proposalId, account2.address)
        expect(voteReceipt2.hasVoted).to.equal(true)
    });

    describe("and we take the balance returned by GetPriorVotes for the given sender and the proposal's start block, which may be zero,", () => {
      let actor: SignerWithAddress; // an account that will propose, receive tokens, delegate to self, and vote on own proposal

      before(reset)

      it("and we add that ForVotes", async () => {
        actor = account0

        await token.transferFrom(deployer.address, actor.address, 0);
        await token.transferFrom(deployer.address, actor.address, 1);
        await propose(actor)

        let beforeFors = (await gov.proposals(proposalId)).forVotes;
        await mineBlock();
        await gov.connect(actor).castVote(proposalId, 1);

        let afterFors = (await gov.proposals(proposalId)).forVotes;

        expect(afterFors).to.equal(beforeFors.add(await token.balanceOf(actor.address)));
      })

      it("or AgainstVotes corresponding to the caller's support flag.", async () => {
        actor = account1
        await token.transferFrom(deployer.address, actor.address, 2);
        await token.transferFrom(deployer.address, actor.address, 3);

        await propose(actor)

        let beforeAgainst = (await gov.proposals(proposalId)).againstVotes;

        await mineBlock();
        await gov.connect(actor).castVote(proposalId, 0);

        let afterAgainst = (await gov.proposals(proposalId)).againstVotes;

        expect(afterAgainst).to.equal(beforeAgainst.add(await token.balanceOf(actor.address)));

      });
    });

    // describe('castVoteBySig', () => {
    //   const Domain = (gov) => ({
    //     name: 'Compound Governor Bravo',
    //     chainId: 1, // await web3.eth.net.getId(); See: https://github.com/trufflesuite/ganache-core/issues/515
    //     verifyingContract: gov._address
    //   });
    //   const Types = {
    //     Ballot: [
    //       { name: 'proposalId', type: 'uint256' },
    //       { name: 'support', type: 'uint8' },
    //     ]
    //   };

    //   it('reverts if the signatory is invalid', async () => {
    //     await expect(send(gov, 'castVoteBySig', [proposalId, 0, 0, '0xbad', '0xbad'])).rejects.toRevert("revert GovernorBravo::castVoteBySig: invalid signature");
    //   });

    //   it('casts vote on behalf of the signatory', async () => {
    //     await enfranchise(comp, a1, 400001);
    //     await send(gov, 'propose', [targets, values, signatures, callDatas, "do nothing"], { from: a1 });
    //     proposalId = await call(gov, 'latestProposalIds', [a1]);;

    //     const { v, r, s } = EIP712.sign(Domain(gov), 'Ballot', { proposalId, support: 1 }, Types, unlockedAccount(a1).secretKey);

    //     let beforeFors = (await call(gov, 'proposals', [proposalId])).forVotes;
    //     await mineBlock();
    //     const tx = await send(gov, 'castVoteBySig', [proposalId, 1, v, r, s]);
    //     expect(tx.gasUsed < 80000);

    //     let afterFors = (await call(gov, 'proposals', [proposalId])).forVotes;
    //     expect(new BigNumber(afterFors)).toEqual(new BigNumber(beforeFors).plus(etherMantissa(400001)));
    //   });
    // });

    //  it("receipt uses two loads", async () => {
    //   let actor = accounts[2];
    //   let actor2 = accounts[3];
    //   await enfranchise(comp, actor, 400001);
    //   await enfranchise(comp, actor2, 400001);
    //   await send(gov, 'propose', [targets, values, signatures, callDatas, "do nothing"], { from: actor });
    //   proposalId = await call(gov, 'latestProposalIds', [actor]);

    //   await mineBlock();
    //   await mineBlock();
    //   await send(gov, 'castVote', [proposalId, 1], { from: actor });
    //   await send(gov, 'castVote', [proposalId, 0], { from: actor2 });

    //   let trxReceipt = await send(gov, 'getReceipt', [proposalId, actor]);
    //   let trxReceipt2 = await send(gov, 'getReceipt', [proposalId, actor2]);

    //   let govDelegateAddress = '000000000000000000000000' + govDelegate._address.toString().toLowerCase().substring(2);

    //   await saddle.trace(trxReceipt, {
    //     constants: {
    //       "account": actor
    //     },
    //     preFilter: ({op}) => op === 'SLOAD',
    //     postFilter: ({source}) => !source || source.includes('receipts'),
    //     execLog: (log) => {
    //       let [output] = log.outputs;
    //       let votes = "000000000000000000000000000000000000000054b419003bdf81640000";
    //       let voted = "01";
    //       let support = "01";

    //       if(log.depth == 0) {
    //         expect(output).toEqual(
    //           `${govDelegateAddress}`
    //         );
    //       }
    //       else {
    //         expect(output).toEqual(
    //           `${votes}${support}${voted}`
    //         );
    //       }
    //     },
    //     exec: (logs) => {
    //       expect(logs[logs.length - 1]["depth"]).toEqual(1); // last log is depth 1 (two SLOADS)
    //     }
    //   });

    //   await saddle.trace(trxReceipt2, {
    //     constants: {
    //       "account": actor2
    //     },
    //     preFilter: ({op}) => op === 'SLOAD',
    //     postFilter: ({source}) => !source || source.includes('receipts'),
    //     execLog: (log) => {
    //       let [output] = log.outputs;
    //       let votes = "0000000000000000000000000000000000000000a968320077bf02c80000";
    //       let voted = "01";
    //       let support = "00";

    //       if(log.depth == 0) {
    //         expect(output).toEqual(
    //           `${govDelegateAddress}`
    //         );
    //       }
    //       else {
    //         expect(output).toEqual(
    //           `${votes}${support}${voted}`
    //         );
    //       }
    //     },
    //     exec: (logs) => {
    //       expect(logs[logs.length - 1]["depth"]).toEqual(1); // last log is depth 1 (two SLOADS)
    //     }
    //   });
    // });
  });
});