import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import hardhat from 'hardhat';

const { ethers } = hardhat

import { BigNumber as EthersBN } from 'ethers';

import {
  deployNounsERC721,
  getSigners,
  TestSigners,
  setTotalSupply,
  populateDescriptor
} from '../../utils';

import {
  mineBlock,
  address,
  encodeParameters,
  advanceBlocks,
  blockTimestamp,
  setNextBlockTimestamp
} from '../utils/Ethereum'

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  NounsErc721,
  NounsDescriptor__factory,
  GovernorNDelegator,
  GovernorNDelegator__factory,
  GovernorNDelegate,
  GovernorNDelegate__factory,
  Timelock,
  Timelock__factory
} from '../../../typechain';

chai.use(solidity);
const { expect } = chai;

async function expectState(proposalId: number|EthersBN, expectedState: any){
  const states: string[] = [
    "Pending",
    "Active",
    "Canceled",
    "Defeated",
    "Succeeded",
    "Queued",
    "Expired",
    "Executed",
    "Vetoed"
  ]
  const actualState = states[await gov.state(proposalId)]
  expect(actualState).to.equal(expectedState);
}

function votes(n: number|string){
  return ethers.utils.parseUnits(String(n),'ether')
}

async function reset(): Promise<void> {
  // nonce 0: Deploy Timelock
  // nonce 1: Deploy GovernorNDelegate
  // nonce 2: Deploy nftDescriptorLibraryFactory
  // nonce 3: Deploy NounsDescriptor
  // nonce 4: Deploy NounsSeeder
  // nonce 5: Deploy NounsERC721
  // nonce 6: Deploy GovernorNDelegator
  // nonce 7+: populate Descriptor


  vetoer = deployer

  const govDelegatorAddress = ethers.utils.getContractAddress({
    from: deployer.address,
    nonce: await deployer.getTransactionCount() + 6
  })

  // Deploy Timelock with pre-computed Delegator address
  timelock = await new Timelock__factory(deployer).deploy(govDelegatorAddress, timelockDelay)
  const timelockAddress = timelock.address

  // Deploy Delegate
  const {address: govDelegateAddress } = await new GovernorNDelegate__factory(deployer).deploy()

  // Deploy Nouns token
  token = await deployNounsERC721(deployer)

  // Deploy Delegator
  await new GovernorNDelegator__factory(deployer).deploy(timelockAddress, token.address, vetoer.address, timelockAddress, govDelegateAddress, 5760, 1, proposalThresholdBPS, quorumVotesBPS)

  // Cast Delegator as Delegate
  gov = GovernorNDelegate__factory.connect(govDelegatorAddress, deployer)

  await populateDescriptor(NounsDescriptor__factory.connect(await token.descriptor(), deployer));

}

async function propose(proposer: SignerWithAddress, mint: boolean = true){
  if (mint) {
    await setTotalSupply(token, 1)
    if (proposer.address !== deployer.address){
      await token.transferFrom(deployer.address, proposer.address, 0);
    }
  }
  await mineBlock()
  targets = [account0.address];
  values = ["0"];
  signatures = ["getBalanceOf(address)"];
  callDatas = [encodeParameters(['address'], [account0.address])];

  await gov.connect(proposer).propose(targets, values, signatures, callDatas, "do nothing");
  proposalId = await gov.latestProposalIds(proposer.address);
}

let snapshotId: number;

let token: NounsErc721;
let deployer: SignerWithAddress;
let vetoer: SignerWithAddress;
let account0: SignerWithAddress;
let account1: SignerWithAddress;
let account2: SignerWithAddress;
let signers: TestSigners;

let gov: GovernorNDelegate;
let timelock: Timelock;
const timelockDelay = 172800 // 2 days

const proposalThresholdBPS = 500 // 5%
const quorumVotesBPS = 1000 // 10%

let targets: string[];
let values: string[];
let signatures: string[];
let callDatas: string[];
let proposalId: EthersBN;
let mintNouns: (amount: number) => Promise<void>;

describe("GovernorN#vetoing", () => {

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

  it('sets parameters correctly', async ()=>{
     expect(await gov.vetoer()).to.equal(vetoer.address)
  })

  it('rejects setting a new vetoer when sender is not vetoer', async () => {
    await expect(gov.connect(account0)._setVetoer(account1.address)).revertedWith('GovernorN:_setVetoer: vetoer only')
  })

  it('allows setting a new vetoer when sender is vetoer', async () => {
    const oldVetoer = vetoer
    vetoer = account2
    await gov.connect(oldVetoer)._setVetoer(vetoer.address)
    expect(await gov.vetoer()).to.equal(vetoer.address)
  })

  it('only vetoer can veto', async () => {
    await propose(account0)
    await expect(gov.veto(proposalId)).revertedWith("GovernorN::veto: only vetoer")
  })

  it('burns veto power correctly', async () => {
     // vetoer is still set
    expect(await gov.vetoer()).to.equal(vetoer.address);
    await expect(gov._burnVetoPower()).revertedWith("GovernorN:_burnVetoPower: vetoer only")
    // burn
    await gov.connect(vetoer)._burnVetoPower()
    expect(await gov.vetoer()).to.equal(address(0));
    await expect(gov.connect(vetoer).veto(proposalId)).revertedWith("GovernorN::veto: veto power burned")
  })

  describe('vetoing works correctly for proposal state', async () => {
    before(reset)
    beforeEach(async () => {
      snapshotId = await ethers.provider.send('evm_snapshot', []);
    });

    afterEach(async () => {
      await ethers.provider.send('evm_revert', [snapshotId]);
    });
    it('Pending', async () => {
      await propose(account0)
      await expectState(proposalId, "Pending")
      await gov.veto(proposalId)
      await expectState(proposalId, "Vetoed")
    })
    it('Active', async () => {
      await propose(account0)
      await mineBlock()
      await mineBlock()
      await expectState(proposalId, "Active")
      await gov.veto(proposalId)
      await expectState(proposalId, "Vetoed")
    })
    it('Canceled', async () => {
      await propose(account0)
      await mineBlock()
      await mineBlock()
      await expectState(proposalId, "Active")
      await gov.connect(account0).cancel(proposalId)
      await expectState(proposalId, "Canceled")
      await gov.veto(proposalId)
      await expectState(proposalId, "Vetoed")
    })
    it('Defeated', async () => {
      await setTotalSupply(token, 3)
      await token.transferFrom(deployer.address, account0.address, 0)
      await token.transferFrom(deployer.address, account1.address, 1)
      await token.transferFrom(deployer.address, account1.address, 2)
      await propose(account0,false)
      await mineBlock()
      await mineBlock()
      await expectState(proposalId, "Active")
      // account0 with 1 vote casts for vote
      await gov.connect(account0).castVote(proposalId,1)
      // account1 with 2 votes casts against vote
      await gov.connect(account1).castVote(proposalId,0)
      await advanceBlocks(5780)
      await expectState(proposalId, "Defeated")
      await gov.veto(proposalId)
      await expectState(proposalId, "Vetoed")
    })
    it('Succeeded', async () => {
      await setTotalSupply(token, 3)
      await token.transferFrom(deployer.address, account0.address, 0)
      await token.transferFrom(deployer.address, account1.address, 1)
      await token.transferFrom(deployer.address, account1.address, 2)
      await propose(account0,false)
      await mineBlock()
      await mineBlock()
      await expectState(proposalId, "Active")
      // account0 with 1 vote casts against vote
      await gov.connect(account0).castVote(proposalId,0)
      // account1 with 2 votes casts for vote
      await gov.connect(account1).castVote(proposalId,1)
      await advanceBlocks(5780)
      await expectState(proposalId, "Succeeded")
      await gov.veto(proposalId)
      await expectState(proposalId, "Vetoed")
    })
    it('Queued', async () => {
      await propose(account0)
      await mineBlock()
      await mineBlock()
      await expectState(proposalId, "Active")
      await gov.connect(account0).castVote(proposalId,1)
      await advanceBlocks(5780)
      await gov.queue(proposalId);
      await expectState(proposalId, "Queued")
      await gov.veto(proposalId)
      await expectState(proposalId, "Vetoed")
    })
    it('Expired', async () => {
      await propose(account0)
      await mineBlock()
      await mineBlock()
      await expectState(proposalId, "Active")
      await gov.connect(account0).castVote(proposalId,1)
      await advanceBlocks(5780)
      await gov.queue(proposalId);
      const proposal = await gov.proposals(proposalId)
      await setNextBlockTimestamp(proposal.eta.toNumber() + (await timelock.GRACE_PERIOD()).toNumber() + 1)
      await expectState(proposalId, "Expired")
      await gov.veto(proposalId)
      await expectState(proposalId, "Vetoed")
    })
    it('Executed', async () => {
      await propose(account0)
      await mineBlock()
      await mineBlock()
      await expectState(proposalId, "Active")
      await gov.connect(account0).castVote(proposalId,1)
      await advanceBlocks(5780)
      await gov.queue(proposalId);
      const proposal = await gov.proposals(proposalId)
      await setNextBlockTimestamp(proposal.eta.toNumber() + 1)
      await gov.execute(proposalId);
      await expectState(proposalId, "Executed")
      await expect(gov.veto(proposalId)).revertedWith("GovernorN::veto: cannot veto executed proposal")
    })
    it('Vetoed', async () => {
      await propose(account0)
      await expectState(proposalId, "Pending")
      await gov.veto(proposalId)
      await expectState(proposalId, "Vetoed")
      await gov.veto(proposalId)
      await expectState(proposalId, "Vetoed")
    })
  })

});