import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';
import {
  NounsToken,
  NounsDescriptorV2__factory as NounsDescriptorV2Factory,
} from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  deployNounsToken,
  getSigners,
  TestSigners,
  setTotalSupply,
  populateDescriptorV2,
  minerStart,
  minerStop,
  mineBlock,
  chainId,
  address,
} from '../utils';

chai.use(solidity);
const { expect } = chai;

describe('Nouns Governance', () => {
  let snapshotId: number;
  let token: NounsToken;
  let tokenCallFromGuy: NounsToken;
  let tokenCallFromDeployer: NounsToken;
  let account0: SignerWithAddress;
  let account1: SignerWithAddress;
  let account2: SignerWithAddress;
  let deployer: SignerWithAddress;

  const ONE = 1;
  const TWO = 2;
  const THREE = 3;

  const Domain = (name: string, verifyingContract: string, chainId: number) => ({
    name,
    chainId,
    verifyingContract,
  });

  let domain: { name: string; verifyingContract: string; chainId: number };

  const Types = {
    Delegation: [
      { name: 'delegatee', type: 'address' },
      { name: 'nonce', type: 'uint256' },
      { name: 'expiry', type: 'uint256' },
    ],
  };

  before(async () => {
    const signers: TestSigners = await getSigners();

    account0 = signers.account0;
    account1 = signers.account1;
    account2 = signers.account2;
    deployer = signers.deployer;

    token = await deployNounsToken(signers.deployer);

    await populateDescriptorV2(
      NounsDescriptorV2Factory.connect(await token.descriptor(), signers.deployer),
    );

    domain = Domain('Nouns', token.address, await chainId());

    tokenCallFromGuy = token.connect(signers.account0);
    tokenCallFromDeployer = token;
  });

  describe('delegateBySig', () => {
    beforeEach(async () => {
      snapshotId = await ethers.provider.send('evm_snapshot', []);
    });

    afterEach(async () => {
      await ethers.provider.send('evm_revert', [snapshotId]);
    });
    it('reverts if the signatory is invalid', async () => {
      const delegatee = account1.address,
        nonce = 0,
        expiry = 0;
      const badhex = '0xbad0000000000000000000000000000000000000000000000000000000000000';
      await expect(
        token.delegateBySig(delegatee, nonce, expiry, 0, badhex, badhex),
      ).to.be.revertedWith('ERC721Checkpointable::delegateBySig: invalid signature');
    });

    it('reverts if the nonce is bad ', async () => {
      const delegatee = account1.address,
        nonce = 1,
        expiry = 0;
      const signature = await account0._signTypedData(domain, Types, { delegatee, nonce, expiry });
      const { v, r, s } = ethers.utils.splitSignature(signature);
      await expect(token.delegateBySig(delegatee, nonce, expiry, v, r, s)).to.be.revertedWith(
        'ERC721Checkpointable::delegateBySig: invalid nonce',
      );
    });

    it('reverts if the signature has expired', async () => {
      const delegatee = account1.address,
        nonce = 0,
        expiry = 0;
      const signature = await account0._signTypedData(domain, Types, { delegatee, nonce, expiry });
      const { v, r, s } = ethers.utils.splitSignature(signature);
      await expect(token.delegateBySig(delegatee, nonce, expiry, v, r, s)).to.be.revertedWith(
        'ERC721Checkpointable::delegateBySig: signature expired',
      );
    });

    it('delegates on behalf of the signatory', async () => {
      const delegatee = account1.address,
        nonce = 0,
        expiry = 10e9;
      const signature = await account0._signTypedData(domain, Types, { delegatee, nonce, expiry });
      const { v, r, s } = ethers.utils.splitSignature(signature);

      expect(await token.delegates(account0.address)).to.equal(account0.address);

      const tx = await (await token.delegateBySig(delegatee, nonce, expiry, v, r, s)).wait();

      expect(tx.gasUsed.toNumber() < 80000);
      expect(await token.delegates(account0.address)).to.equal(account1.address);
    });
  });

  describe('numCheckpoints', () => {
    beforeEach(async () => {
      snapshotId = await ethers.provider.send('evm_snapshot', []);
    });

    afterEach(async () => {
      await ethers.provider.send('evm_revert', [snapshotId]);
    });

    it('returns the number of checkpoints for a delegate', async () => {
      await setTotalSupply(token, 3);

      // Give account0.address tokens
      await tokenCallFromDeployer.transferFrom(deployer.address, account0.address, 0);
      await tokenCallFromDeployer.transferFrom(deployer.address, account0.address, 1);

      expect(await token.numCheckpoints(account1.address)).to.equal(0);

      const t1 = await tokenCallFromGuy.delegate(account1.address);
      expect(await token.numCheckpoints(account1.address)).to.equal(1);
      const t2 = await tokenCallFromGuy.transferFrom(account0.address, account2.address, 0);
      expect(await token.numCheckpoints(account1.address)).to.equal(2);

      const t3 = await tokenCallFromGuy.transferFrom(account0.address, account2.address, 1);
      expect(await token.numCheckpoints(account1.address)).to.equal(3);

      const t4 = await tokenCallFromDeployer.transferFrom(deployer.address, account0.address, 2);
      expect(await token.numCheckpoints(account1.address)).to.equal(4);

      const checkpoint0 = await token.checkpoints(account1.address, 0);
      expect(checkpoint0.fromBlock).to.equal(t1.blockNumber);
      expect(checkpoint0.votes.toString(), '2');

      const checkpoint1 = await token.checkpoints(account1.address, 1);
      expect(checkpoint1.fromBlock).to.equal(t2.blockNumber);
      expect(checkpoint1.votes.toString(), '1');

      const checkpoint2 = await token.checkpoints(account1.address, 2);
      expect(checkpoint2.fromBlock).to.equal(t3.blockNumber);
      expect(checkpoint2.votes.toString(), '0');

      const checkpoint3 = await token.checkpoints(account1.address, 3);
      expect(checkpoint3.fromBlock).to.equal(t4.blockNumber);
      expect(checkpoint3.votes.toString(), '1');
    });

    it('does not add more than one checkpoint in a block', async () => {
      await setTotalSupply(token, 4);

      // Give account0.address tokens
      await tokenCallFromDeployer.transferFrom(deployer.address, account0.address, 0);
      await tokenCallFromDeployer.transferFrom(deployer.address, account0.address, 1);
      await tokenCallFromDeployer.transferFrom(deployer.address, account0.address, 2);

      expect(await token.numCheckpoints(account1.address)).to.equal(0);

      await minerStop();

      const tx1 = await tokenCallFromGuy.delegate(account1.address); // delegate 3 votes
      const tx2 = await tokenCallFromGuy.transferFrom(account0.address, account2.address, 0); // transfer 1 vote
      const tx3 = await tokenCallFromGuy.transferFrom(account0.address, account2.address, 1); // transfer 1 vote

      await mineBlock();
      const receipt1 = await tx1.wait();
      await tx2.wait();
      await tx3.wait();

      await minerStart();

      expect(await token.numCheckpoints(account1.address)).to.equal(1);

      const checkpoint0 = await token.checkpoints(account1.address, 0);
      expect(checkpoint0.fromBlock).to.equal(receipt1.blockNumber);
      expect(checkpoint0.votes.toString(), '1');

      let checkpoint1 = await token.checkpoints(account1.address, 1);
      expect(checkpoint1.fromBlock).to.equal(0);
      expect(checkpoint1.votes.toString(), '0');

      const checkpoint2 = await token.checkpoints(account1.address, 2);
      expect(checkpoint2.fromBlock).to.equal(0);
      expect(checkpoint2.votes.toString(), '0');

      const tx4 = await tokenCallFromDeployer.transferFrom(deployer.address, account0.address, 3);
      expect(await token.numCheckpoints(account1.address)).to.equal(2);

      checkpoint1 = await token.checkpoints(account1.address, 1);
      expect(checkpoint1.fromBlock).to.equal(tx4.blockNumber);
      expect(checkpoint1.votes.toString(), '1');
    });
  });

  describe('getPriorVotes', () => {
    beforeEach(async () => {
      snapshotId = await ethers.provider.send('evm_snapshot', []);
    });

    afterEach(async () => {
      await ethers.provider.send('evm_revert', [snapshotId]);
    });

    it('reverts if block number >= current block', async () => {
      await expect(token.getPriorVotes(account1.address, 5e10)).to.be.revertedWith(
        'ERC721Checkpointable::getPriorVotes: not yet determined',
      );
    });

    it('returns 0 if there are no checkpoints', async () => {
      expect(await token.getPriorVotes(account1.address, 0)).to.equal(0);
    });

    it('returns the latest block if >= last checkpoint block', async () => {
      await setTotalSupply(token, 1);
      const t1 = await (await tokenCallFromDeployer.delegate(account1.address)).wait();
      await mineBlock();
      await mineBlock();

      expect(await token.getPriorVotes(account1.address, t1.blockNumber)).to.equal(ONE);
      expect(await token.getPriorVotes(account1.address, t1.blockNumber + 1)).to.equal(ONE);
    });

    it('returns zero if < first checkpoint block', async () => {
      await mineBlock();
      await setTotalSupply(token, 1);
      const t1 = await (await tokenCallFromDeployer.delegate(account1.address)).wait();
      await mineBlock();
      await mineBlock();

      expect(await token.getPriorVotes(account1.address, t1.blockNumber - 1)).to.equal(0);
      expect(await token.getPriorVotes(account1.address, t1.blockNumber + 1)).to.equal(ONE);
    });

    it('generally returns the voting balance at the appropriate checkpoint', async () => {
      await setTotalSupply(token, 3);
      const t1 = await (await tokenCallFromDeployer.delegate(account1.address)).wait();
      await mineBlock();
      await mineBlock();

      // deployer -> account0.address id 1
      const t2 = await (
        await tokenCallFromDeployer.transferFrom(deployer.address, account0.address, 0)
      ).wait();
      await mineBlock();
      await mineBlock();

      // deployer -> account0.address id 2
      const t3 = await (
        await tokenCallFromDeployer.transferFrom(deployer.address, account0.address, 1)
      ).wait();
      await mineBlock();
      await mineBlock();

      // account0.address -> deployer id 1
      const t4 = await (
        await tokenCallFromGuy.transferFrom(account0.address, deployer.address, 0)
      ).wait();
      await mineBlock();
      await mineBlock();

      expect(await token.getPriorVotes(account1.address, t1.blockNumber - 1)).to.equal(0);
      expect(await token.getPriorVotes(account1.address, t1.blockNumber)).to.equal(THREE);
      expect(await token.getPriorVotes(account1.address, t1.blockNumber + 1)).to.equal(THREE);
      expect(await token.getPriorVotes(account1.address, t2.blockNumber)).to.equal(TWO);
      expect(await token.getPriorVotes(account1.address, t2.blockNumber + 1)).to.equal(TWO);
      expect(await token.getPriorVotes(account1.address, t3.blockNumber)).to.equal(ONE);
      expect(await token.getPriorVotes(account1.address, t3.blockNumber + 1)).to.equal(ONE);
      expect(await token.getPriorVotes(account1.address, t4.blockNumber)).to.equal(TWO);
      expect(await token.getPriorVotes(account1.address, t4.blockNumber + 1)).to.equal(TWO);
    });
    it('never delegates to address(0)', async () => {
      await setTotalSupply(token, 1);

      // Delegate from Deployer -> Account1
      await (await tokenCallFromDeployer.delegate(account1.address)).wait();
      await mineBlock();
      await mineBlock();

      expect(await token.getCurrentVotes(address(0))).to.equal(0);
      expect(await token.getCurrentVotes(deployer.address)).to.equal(0);
      expect(await token.getCurrentVotes(account1.address)).to.equal(ONE);

      // Delegate from Deployer -> Address(0), which should assign back to deployer
      await (await tokenCallFromDeployer.delegate(address(0))).wait();
      await mineBlock();
      await mineBlock();

      expect(await token.getCurrentVotes(address(0))).to.equal(0);
      expect(await token.getCurrentVotes(deployer.address)).to.equal(ONE);
      expect(await token.getCurrentVotes(account1.address)).to.equal(0);

      // Delegate from Deployer -> Account1
      await (await tokenCallFromDeployer.delegate(account1.address)).wait();
      await mineBlock();
      await mineBlock();

      expect(await token.getCurrentVotes(address(0))).to.equal(0);
      expect(await token.getCurrentVotes(deployer.address)).to.equal(0);
      expect(await token.getCurrentVotes(account1.address)).to.equal(ONE);

      // Transfer from Deployer -> Account2
      await (
        await tokenCallFromDeployer.transferFrom(deployer.address, account2.address, 0)
      ).wait();
      await mineBlock();
      await mineBlock();

      expect(await token.getCurrentVotes(address(0))).to.equal(0);
      expect(await token.getCurrentVotes(deployer.address)).to.equal(0);
      expect(await token.getCurrentVotes(account1.address)).to.equal(0);
      expect(await token.getCurrentVotes(account2.address)).to.equal(ONE);
    });
  });
});
