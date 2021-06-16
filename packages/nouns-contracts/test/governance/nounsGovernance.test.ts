import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';
import { NounsErc721 } from '../../typechain';
import {
  deployNounsErc721,
  getSigners,
  TestSigners,
  MintNouns,
  minerStart,
  minerStop,
  mineBlock,
  address,
  chainId
} from '../utils';
chai.use(solidity);
const { expect } = chai;

describe('Nouns Governance', () => {
  let token: NounsErc721;
  let signers: TestSigners
  let mintNouns: (amount: number) => Promise<void>;
  let tokenCallFromGuy: NounsErc721;
  let tokenCallFromDeployer: NounsErc721;
  let guy: string;
  let a1: string;
  let a2: string;
  let deployer: string;
  const Domain = (name: string, verifyingContract: string, chainId: number) => ({ name, chainId, verifyingContract });
  let domain: any;
  const Types = {
    Delegation: [
      { name: 'delegatee', type: 'address' },
      { name: 'nonce', type: 'uint256' },
      { name: 'expiry', type: 'uint256' }
    ]
  };

  beforeEach(async () => {
    signers = await getSigners();
    token = await deployNounsErc721();
    domain = Domain('Nouns', token.address, await chainId())
    mintNouns = MintNouns(token);
    tokenCallFromGuy = token.connect(signers.account0);
    tokenCallFromDeployer = token;
    guy = signers.account0.address;
    a1 = signers.account1.address;
    a2 = signers.account2.address;
    deployer = signers.deployer.address;
  });


  describe('delegateBySig', () => {
    it('reverts if the signatory is invalid', async () => {
      const delegatee = signers.account1.address, nonce = 0, expiry = 0;
      const badhex = "0xbad0000000000000000000000000000000000000000000000000000000000000";
      await expect(token.delegateBySig(delegatee, nonce, expiry, 0, badhex, badhex)).to.be.revertedWith("ERC721Governance::delegateBySig: invalid signature");
    });

    it('reverts if the nonce is bad ', async () => {
      const delegatee = signers.account1.address, nonce = 1, expiry = 0;
      const signature = await signers.account0._signTypedData(domain, Types, { delegatee, nonce, expiry });
      const {v, r, s } = ethers.utils.splitSignature(signature)
      await expect(token.delegateBySig(delegatee, nonce, expiry, v, r, s)).to.be.revertedWith("ERC721Governance::delegateBySig: invalid nonce");
    });

    it('reverts if the signature has expired', async () => {
      const delegatee = signers.account1.address, nonce = 0, expiry = 0;
      const signature = await signers.account0._signTypedData(domain, Types, { delegatee, nonce, expiry });
      const {v, r, s } = ethers.utils.splitSignature(signature)
      await expect(token.delegateBySig(delegatee, nonce, expiry, v, r, s)).to.be.revertedWith("ERC721Governance::delegateBySig: signature expired");
    });

    it('delegates on behalf of the signatory', async () => {
      const delegatee = signers.account1.address, nonce = 0, expiry = 10e9;
      const signature = await signers.account0._signTypedData(domain, Types, { delegatee, nonce, expiry });
      const {v, r, s } = ethers.utils.splitSignature(signature)

      expect(await token.delegates(signers.account0.address)).to.equal(signers.account0.address)

      const tx = await (await token.delegateBySig(delegatee, nonce, expiry, v, r, s)).wait()

      expect(tx.gasUsed.toNumber() < 80000);
      expect(await token.delegates(signers.account0.address)).to.equal(signers.account1.address)

    });
  });

  describe('numCheckpoints', () => {
    it('returns the number of checkpoints for a delegate', async () => {
      await mintNouns(3);

      // Give guy tokens
      await tokenCallFromDeployer.transferFrom(deployer, guy, 0);
      await tokenCallFromDeployer.transferFrom(deployer, guy, 1);

      expect(await token.numCheckpoints(a1)).to.equal(0);

      const t1 = await tokenCallFromGuy.delegate(a1);
      expect(await token.numCheckpoints(a1)).to.equal(1);
      const t2 = await tokenCallFromGuy.transferFrom(guy, a2, 0);
      expect(await token.numCheckpoints(a1)).to.equal(2);


      const t3 = await tokenCallFromGuy.transferFrom(guy, a2, 1);
      expect(await token.numCheckpoints(a1)).to.equal(3);


      const t4 = await tokenCallFromDeployer.transferFrom(deployer, guy, 2);
      expect(await token.numCheckpoints(a1)).to.equal(4);

      const checkpoint0 = await token.checkpoints(a1, 0);
      expect(checkpoint0.fromBlock).to.equal(t1.blockNumber);
      expect(checkpoint0.votes.toString(),'2');

      const checkpoint1 = await token.checkpoints(a1, 1);
      expect(checkpoint1.fromBlock).to.equal(t2.blockNumber);
      expect(checkpoint1.votes.toString(),'1');

      const checkpoint2 = await token.checkpoints(a1, 2);
      expect(checkpoint2.fromBlock).to.equal(t3.blockNumber);
      expect(checkpoint2.votes.toString(),'0');

      const checkpoint3 = await token.checkpoints(a1, 3);
      expect(checkpoint3.fromBlock).to.equal(t4.blockNumber);
      expect(checkpoint3.votes.toString(),'1');

    });

    it('does not add more than one checkpoint in a block', async () => {
      await mintNouns(4)

      // Give guy tokens
      await tokenCallFromDeployer.transferFrom(deployer, guy, 0);
      await tokenCallFromDeployer.transferFrom(deployer, guy, 1);
      await tokenCallFromDeployer.transferFrom(deployer, guy, 2);

      expect(await token.numCheckpoints(a1)).to.equal(0);

      await minerStop();

      const tx1 = await tokenCallFromGuy.delegate(a1); // delegate 3 votes
      const tx2 = await tokenCallFromGuy.transferFrom(guy, a2, 0); // transfer 1 vote
      const tx3 = await tokenCallFromGuy.transferFrom(guy, a2, 1); // transfer 1 vote

      await mineBlock();
      const receipt1 = await tx1.wait();
      const receipt2 = await tx2.wait();
      const receipt3 = await tx3.wait();

      await minerStart();

      expect(await token.numCheckpoints(a1)).to.equal(1);

      const checkpoint0 = await token.checkpoints(a1, 0);
      expect(checkpoint0.fromBlock).to.equal(receipt1.blockNumber);
      expect(checkpoint0.votes.toString(),'1');

      let checkpoint1 = await token.checkpoints(a1, 1);
      expect(checkpoint1.fromBlock).to.equal(0);
      expect(checkpoint1.votes.toString(),'0');

      const checkpoint2 = await token.checkpoints(a1, 2);
      expect(checkpoint2.fromBlock).to.equal(0);
      expect(checkpoint2.votes.toString(),'0');

      const tx4 = await tokenCallFromDeployer.transferFrom(deployer, guy, 3);
      expect(await token.numCheckpoints(a1)).to.equal(2);

      checkpoint1 = await token.checkpoints(a1, 1);
      expect(checkpoint1.fromBlock).to.equal(tx4.blockNumber);
      expect(checkpoint1.votes.toString(),'1');
    });
  });

  describe('getPriorVotes', () => {
    it('reverts if block number >= current block', async () => {
      await expect(token.getPriorVotes(a1, 5e10)).to.be.revertedWith("ERC721Governance::getPriorVotes: not yet determined");
    });

    it('returns 0 if there are no checkpoints', async () => {
      expect(await token.getPriorVotes(a1, 0)).to.equal(0);
    });

    it('returns the latest block if >= last checkpoint block', async () => {
      await mintNouns(1)
      const t1 = await (await tokenCallFromDeployer.delegate(a1)).wait()
      await mineBlock();
      await mineBlock();

      expect(await token.getPriorVotes(a1, t1.blockNumber)).to.equal(1);
      expect(await token.getPriorVotes(a1, t1.blockNumber+1)).to.equal(1);
    });

    it('returns zero if < first checkpoint block', async () => {
      await mineBlock();
      await mintNouns(1)
      const t1 = await (await tokenCallFromDeployer.delegate(a1)).wait()
      await mineBlock();
      await mineBlock();

      expect(await token.getPriorVotes(a1, t1.blockNumber-1)).to.equal(0);
      expect(await token.getPriorVotes(a1, t1.blockNumber+1)).to.equal(1);
    });

    it('generally returns the voting balance at the appropriate checkpoint', async () => {
      await mintNouns(3)
      const t1 = await (await tokenCallFromDeployer.delegate(a1)).wait()
      await mineBlock();
      await mineBlock();

      const t2 = await (await tokenCallFromDeployer.transferFrom(deployer, guy, 0)).wait()
      await mineBlock();
      await mineBlock();

      const t3 = await (await tokenCallFromDeployer.transferFrom(deployer, guy, 1)).wait()
      await mineBlock();
      await mineBlock();

      const t4 = await (await tokenCallFromGuy.transferFrom(guy, deployer, 0)).wait()
      await mineBlock();
      await mineBlock();

      expect(await token.getPriorVotes(a1, t1.blockNumber-1)).to.equal(0);
      expect(await token.getPriorVotes(a1, t1.blockNumber)).to.equal(3);
      expect(await token.getPriorVotes(a1, t1.blockNumber+1)).to.equal(3);
      expect(await token.getPriorVotes(a1, t2.blockNumber)).to.equal(2);
      expect(await token.getPriorVotes(a1, t2.blockNumber+1)).to.equal(2);
      expect(await token.getPriorVotes(a1, t3.blockNumber)).to.equal(1);
      expect(await token.getPriorVotes(a1, t3.blockNumber+1)).to.equal(1);
      expect(await token.getPriorVotes(a1, t4.blockNumber)).to.equal(2);
      expect(await token.getPriorVotes(a1, t4.blockNumber+1)).to.equal(2);
    });
  });
});
