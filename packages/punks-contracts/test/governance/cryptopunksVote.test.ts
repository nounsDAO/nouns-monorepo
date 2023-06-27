import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';
import {
  CryptopunksMock,
  WrappedPunkMock,
  CryptopunksVote,
} from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  deployCryptopunksVote,
  getSigners,
  TestSigners,
  minerStart,
  minerStop,
  mineBlock,
  chainId,
  address,
} from '../utils';

chai.use(solidity);
const { expect } = chai;

describe('CryptopunksVote', () => {
  let snapshotId: number;
  let cryptopunks: CryptopunksMock;
  let wrappedPunk: WrappedPunkMock;
  let cryptopunksVote: CryptopunksVote;
  let account0: SignerWithAddress;
  let account1: SignerWithAddress;
  let account2: SignerWithAddress;
  let deployer: SignerWithAddress;

  const Domain = (name: string, version: string, chainId: number, verifyingContract: string) => ({
    name,
    version,
    chainId,
    verifyingContract,
  });

  let domain: { name: string; version: string; chainId: number; verifyingContract: string };

  const Types = {
    Delegation: [
      { name: 'delegatee', type: 'address' },
      { name: 'punkIndex', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'expiry', type: 'uint256' },
    ],
  };
  const TypesBatch = {
    DelegationBatch: [
      { name: 'delegatee', type: 'address' },
      { name: 'punkIndexes', type: 'uint256[]' },
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

    ({cryptopunks, wrappedPunk, cryptopunksVote} = await deployCryptopunksVote(deployer));

    domain = Domain('CryptopunksVote', '1.0', await chainId(), cryptopunksVote.address);
  });

  describe('delegateBySig', () => {
    beforeEach(async () => {
      snapshotId = await ethers.provider.send('evm_snapshot', []);
      await cryptopunks.mint(account0.address);
    });

    afterEach(async () => {
      await ethers.provider.send('evm_revert', [snapshotId]);
    });

    it('reverts if the signatory is invalid', async () => {
      const delegatee = account1.address,
        punkIndex = 0,
        nonce = 0,
        expiry = 10e9;
      const signature = await account1._signTypedData(domain, Types, { delegatee, punkIndex, nonce, expiry });
      const { v, r, s } = ethers.utils.splitSignature(signature);
      await expect(
        cryptopunksVote.connect(deployer).delegateBySig(delegatee, punkIndex, nonce, expiry, v, r, s),
      ).to.be.revertedWith('CryptopunksVote: illegal delegation');
    });

    it('reverts if the nonce is bad ', async () => {
      const delegatee = account1.address,
        punkIndex = 0,
        nonce = 1,
        expiry = 10e9;
      const signature = await account0._signTypedData(domain, Types, { delegatee, punkIndex, nonce, expiry });
      const { v, r, s } = ethers.utils.splitSignature(signature);
      await expect(cryptopunksVote.connect(deployer).delegateBySig(delegatee, punkIndex, nonce, expiry, v, r, s)).to.be.revertedWith(
        'CryptopunksVote: invalid nonce',
      );
    });

    it('reverts if the signature has expired', async () => {
      const delegatee = account1.address,
        punkIndex = 0,
        nonce = 0,
        expiry = 0;
      const signature = await account0._signTypedData(domain, Types, { delegatee, punkIndex, nonce, expiry });
      const { v, r, s } = ethers.utils.splitSignature(signature);
      await expect(cryptopunksVote.connect(deployer).delegateBySig(delegatee, punkIndex, nonce, expiry, v, r, s)).to.be.revertedWith(
        'CryptopunksVote: signature expired',
      );
    });

    it('delegates on behalf of the signatory', async () => {
      const delegatee = account1.address,
        punkIndex = 0,
        nonce = 0,
        expiry = 10e9;
      const signature = await account0._signTypedData(domain, Types, { delegatee, punkIndex, nonce, expiry });
      const { v, r, s } = ethers.utils.splitSignature(signature);

      expect(await cryptopunksVote.delegates(0)).to.equal(address(0));

      // gasLimit because of hardhat
      await cryptopunksVote.connect(deployer).delegateBySig(delegatee, punkIndex, nonce, expiry, v, r, s, { gasLimit:180000 });

      expect(await cryptopunksVote.delegates(0)).to.equal(account1.address);
    });

    it('reverts if the signatory is invalid (batch)', async () => {
      const delegatee = account1.address,
        punkIndexes = [0],
        nonce = 0,
        expiry = 10e9;
      const signature = await account1._signTypedData(domain, TypesBatch, { delegatee, punkIndexes, nonce, expiry });
      const { v, r, s } = ethers.utils.splitSignature(signature);
      await expect(
        cryptopunksVote.connect(deployer).delegateBatchBySig(delegatee, punkIndexes, nonce, expiry, v, r, s),
      ).to.be.revertedWith('CryptopunksVote: illegal delegation');
    });

    it('reverts if the nonce is bad (batch)', async () => {
      const delegatee = account1.address,
        punkIndexes = [0],
        nonce = 1,
        expiry = 10e9;
      const signature = await account0._signTypedData(domain, TypesBatch, { delegatee, punkIndexes, nonce, expiry });
      const { v, r, s } = ethers.utils.splitSignature(signature);
      await expect(cryptopunksVote.connect(deployer).delegateBatchBySig(delegatee, punkIndexes, nonce, expiry, v, r, s)).to.be.revertedWith(
        'CryptopunksVote: invalid nonce',
      );
    });

    it('reverts if the signature has expired (batch)', async () => {
      const delegatee = account1.address,
        punkIndexes = [0],
        nonce = 0,
        expiry = 0;
      const signature = await account0._signTypedData(domain, TypesBatch, { delegatee, punkIndexes, nonce, expiry });
      const { v, r, s } = ethers.utils.splitSignature(signature);
      await expect(cryptopunksVote.connect(deployer).delegateBatchBySig(delegatee, punkIndexes, nonce, expiry, v, r, s)).to.be.revertedWith(
        'CryptopunksVote: signature expired',
      );
    });

    it('a batch delegate call changes delegations', async () => {
      await cryptopunks.mint(account0.address);
      await cryptopunks.mint(account0.address);
      await cryptopunks.mint(account0.address);

      const delegatee = account1.address,
        punkIndexes = [1, 2, 3],
        nonce = 0,
        expiry = 10e9;
      const signature = await account0._signTypedData(domain, TypesBatch, { delegatee, punkIndexes, nonce, expiry });
      const { v, r, s } = ethers.utils.splitSignature(signature);
      // gasLimit because of hardhat
      await cryptopunksVote.connect(deployer).delegateBatchBySig(delegatee, punkIndexes, nonce, expiry, v, r, s, { gasLimit:360000 });

      expect(
        await cryptopunksVote.delegatesBatch([1,2,3])
      ).to.be.deep.equal(
        [account1.address, account1.address, account1.address]
      );
      expect(await cryptopunksVote.delegates(1)).to.equal(account1.address);
      expect(await cryptopunksVote.delegates(2)).to.equal(account1.address);
      expect(await cryptopunksVote.delegates(3)).to.equal(account1.address);
    });

    it('cannot delegate a punk 10_000', async () => {
      const delegatee = account1.address,
        punkIndex = 10000,
        nonce = 0,
        expiry = 10e9;
      const signature = await account0._signTypedData(domain, Types, { delegatee, punkIndex, nonce, expiry });
      const { v, r, s } = ethers.utils.splitSignature(signature);

      expect(await cryptopunksVote.delegates(0)).to.equal(address(0));

      // gasLimit because of hardhat
      const tx = cryptopunksVote.connect(deployer).delegateBySig(delegatee, punkIndex, nonce, expiry, v, r, s, { gasLimit:180000 });

      await expect(tx).to.be.revertedWith('CryptopunksVote: invalid punkIndex');
    });
  });

  describe('delegate', () => {
    beforeEach(async () => {
      snapshotId = await ethers.provider.send('evm_snapshot', []);
      await cryptopunks.mint(deployer.address);
    });

    afterEach(async () => {
      await ethers.provider.send('evm_revert', [snapshotId]);
    });

    it('a delegate call emits DelegateChanged', async () => {
      const tx = cryptopunksVote.connect(deployer).delegate(deployer.address, 0);
      await expect(tx)
        .to.emit(cryptopunksVote, 'DelegateChanged')
        .withArgs(deployer.address, address(0), deployer.address, 0);
    });

    it('two delegate calls emit DelegateChanged', async () => {
      const tx1 = cryptopunksVote.connect(deployer).delegate(deployer.address, 0);
      await expect(tx1)
        .to.emit(cryptopunksVote, 'DelegateChanged')
        .withArgs(deployer.address, address(0), deployer.address, 0);
      const tx2 = cryptopunksVote.connect(deployer).delegate(account0.address, 0);
      await expect(tx2)
        .to.emit(cryptopunksVote, 'DelegateChanged')
        .withArgs(deployer.address, deployer.address, account0.address, 0);
    });

    it('three delegate calls emit DelegateChanged', async () => {
      const tx1 = cryptopunksVote.connect(deployer).delegate(deployer.address, 0);
      await expect(tx1)
        .to.emit(cryptopunksVote, 'DelegateChanged')
        .withArgs(deployer.address, address(0), deployer.address, 0);
      const tx2 = cryptopunksVote.connect(deployer).delegate(account0.address, 0);
      await expect(tx2)
        .to.emit(cryptopunksVote, 'DelegateChanged')
        .withArgs(deployer.address, deployer.address, account0.address, 0);
      const tx3 = cryptopunksVote.connect(account0).delegate(account1.address, 0);
      await expect(tx3)
        .to.emit(cryptopunksVote, 'DelegateChanged')
        .withArgs(account0.address, account0.address, account1.address, 0);
    });

    it('a delegate call emits DelegateVotesChanged', async () => {
      const tx = cryptopunksVote.connect(deployer).delegate(deployer.address, 0);
      await expect(tx)
        .to.emit(cryptopunksVote, 'DelegateVotesChanged')
        .withArgs(deployer.address, 0, 1);
    });

    it('three delegate calls emit DelegateVotesChanged', async () => {
      await cryptopunks.mint(deployer.address)

      const tx1 = cryptopunksVote.connect(deployer).delegate(deployer.address, 0);
      await expect(tx1)
        .to.emit(cryptopunksVote, 'DelegateVotesChanged')
        .withArgs(deployer.address, 0, 1);
      const tx2 = cryptopunksVote.connect(deployer).delegate(deployer.address, 1);
      await expect(tx2)
        .to.emit(cryptopunksVote, 'DelegateVotesChanged')
        .withArgs(deployer.address, 1, 2);
      const tx3 = cryptopunksVote.connect(deployer).delegate(account0.address, 0);
      await expect(tx3)
        .to.emit(cryptopunksVote, 'DelegateVotesChanged')
        .withArgs(deployer.address, 2, 1);
      await expect(tx3)
        .to.emit(cryptopunksVote, 'DelegateVotesChanged')
        .withArgs(account0.address, 0, 1);
    });

    it('two delegate calls in a single block emit DelegateVotesChanged', async () => {
      await cryptopunks.mint(deployer.address)

      await minerStop();

      const tx1 = await cryptopunksVote.connect(deployer).delegate(deployer.address, 0);
      const tx2 = await cryptopunksVote.connect(deployer).delegate(deployer.address, 1);

      await mineBlock();
      await minerStart();

      await expect(tx1)
        .to.emit(cryptopunksVote, 'DelegateVotesChanged')
        .withArgs(deployer.address, 0, 1);
      await expect(tx2)
        .to.emit(cryptopunksVote, 'DelegateVotesChanged')
        .withArgs(deployer.address, 1, 2);
      expect(await cryptopunksVote.numCheckpoints(deployer.address)).to.equal(1);
    });

    it('a batch delegate call changes delegations', async () => {
      await cryptopunks.mint(deployer.address);
      await cryptopunks.mint(deployer.address);

      await cryptopunksVote.connect(deployer).delegateBatch(account1.address, [0, 1, 2]);

      expect(
        await cryptopunksVote.delegatesBatch([0,1,2])
      ).to.be.deep.equal(
        [account1.address, account1.address, account1.address]
      );
      expect(await cryptopunksVote.delegates(0)).to.equal(account1.address);
      expect(await cryptopunksVote.delegates(1)).to.equal(account1.address);
      expect(await cryptopunksVote.delegates(2)).to.equal(account1.address);
    });

    it('cannot delegate a punk 10_000', async () => {
      const tx = cryptopunksVote.connect(deployer).delegate(deployer.address, 10000);
      await expect(tx).to.be.revertedWith('CryptopunksVote: invalid punkIndex');
    });
  });

  describe('wrappedPunk', () => {
    beforeEach(async () => {
      snapshotId = await ethers.provider.send('evm_snapshot', []);
      await cryptopunks.mint(deployer.address);
      await wrappedPunk.registerProxy();
      const proxyAddress = await wrappedPunk.proxyInfo(deployer.address);
      await cryptopunks.connect(deployer).transferPunk(proxyAddress, 0);
      await wrappedPunk.mint(0);
    });

    afterEach(async () => {
      await ethers.provider.send('evm_revert', [snapshotId]);
    });

    it('cannot delegate a wrapped punk without permission', async () => {
      const tx = cryptopunksVote.connect(account0).delegate(account1.address, 0);
      await expect(tx).to.be.revertedWith('CryptopunksVote: illegal delegation');
    });

    it('can delegate a wrapped punk', async () => {
      await cryptopunksVote.connect(deployer).delegate(deployer.address, 0);
      expect(await cryptopunksVote.delegates(0)).to.equal(deployer.address);
    });

    it('transitive delegation', async () => {
      await cryptopunksVote.connect(deployer).delegate(account0.address, 0);
      await cryptopunksVote.connect(account0).delegate(account1.address, 0);
      expect(await cryptopunksVote.delegates(0)).to.equal(account1.address);
    });

    it('can delegate a wrapped punk with an approval', async () => {
      await wrappedPunk.approve(account0.address, 0);
      await cryptopunksVote.connect(account0).delegate(account1.address, 0);
      expect(await cryptopunksVote.delegates(0)).to.equal(account1.address);
    });

    it('can delegate a wrapped punk with an operator', async () => {
      await wrappedPunk.setApprovalForAll(account0.address, true);
      await cryptopunksVote.connect(account0).delegate(account1.address, 0);
      expect(await cryptopunksVote.delegates(0)).to.equal(account1.address);
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
      await cryptopunks.mint(deployer.address)
      await cryptopunks.mint(deployer.address)
      await cryptopunks.mint(deployer.address)

      // Give account0.address tokens
      await cryptopunks.connect(deployer).transferPunk(account0.address, 0);
      await cryptopunks.connect(deployer).transferPunk(account0.address, 1);

      expect(await cryptopunksVote.numCheckpoints(account1.address)).to.equal(0);

      const t1 = await cryptopunksVote.connect(account0).delegate(account1.address, 0);
      expect(await cryptopunksVote.numCheckpoints(account1.address)).to.equal(1);
      await cryptopunks.connect(account0).transferPunk(account2.address, 0);
      expect(await cryptopunksVote.numCheckpoints(account1.address)).to.equal(1);
      const t2 = await cryptopunksVote.connect(account2).delegate(account2.address, 0);
      expect(await cryptopunksVote.numCheckpoints(account1.address)).to.equal(2);

      await cryptopunks.connect(account0).transferPunk(account2.address, 1);
      expect(await cryptopunksVote.numCheckpoints(account1.address)).to.equal(2);
      const t3 = await cryptopunksVote.connect(account2).delegate(account1.address, 1);
      expect(await cryptopunksVote.numCheckpoints(account1.address)).to.equal(3);

      await cryptopunks.connect(deployer).transferPunk(account0.address, 2);
      const t4 = await cryptopunksVote.connect(account2).delegate(account0.address, 1);
      expect(await cryptopunksVote.numCheckpoints(account1.address)).to.equal(4);

      const checkpoint0 = await cryptopunksVote.checkpoints(account1.address, 0);
      expect(checkpoint0.fromBlock).to.equal(t1.blockNumber);
      expect(checkpoint0.votes.toString(), '2');

      const checkpoint1 = await cryptopunksVote.checkpoints(account1.address, 1);
      expect(checkpoint1.fromBlock).to.equal(t2.blockNumber);
      expect(checkpoint1.votes.toString(), '1');

      const checkpoint2 = await cryptopunksVote.checkpoints(account1.address, 2);
      expect(checkpoint2.fromBlock).to.equal(t3.blockNumber);
      expect(checkpoint2.votes.toString(), '0');

      const checkpoint3 = await cryptopunksVote.checkpoints(account1.address, 3);
      expect(checkpoint3.fromBlock).to.equal(t4.blockNumber);
      expect(checkpoint3.votes.toString(), '1');
    });

    it('does not add more than one checkpoint in a block', async () => {
      await cryptopunks.mint(deployer.address)
      await cryptopunks.mint(deployer.address)
      await cryptopunks.mint(deployer.address)
      await cryptopunks.mint(deployer.address)

      // Give account0.address tokens
      await cryptopunks.connect(deployer).transferPunk(account0.address, 0);
      await cryptopunks.connect(deployer).transferPunk(account0.address, 1);
      await cryptopunks.connect(deployer).transferPunk(account0.address, 2);

      expect(await cryptopunksVote.numCheckpoints(account1.address)).to.equal(0);

      await minerStop();

      const tx1 = await cryptopunksVote.connect(account0).delegate(account1.address, 0); // delegate 1 vote
      await cryptopunksVote.connect(account0).delegate(account1.address, 1); // delegate 1 vote
      await cryptopunksVote.connect(account0).delegate(account1.address, 2); // delegate 1 vote
      const tx2 = await cryptopunks.connect(account0).transferPunk(account2.address, 0); // transfer 1 vote
      const tx3 = await cryptopunks.connect(account0).transferPunk(account2.address, 1); // transfer 1 vote
      await cryptopunksVote.connect(account2).delegate(account2.address, 0); // delegate 1 vote
      await cryptopunksVote.connect(account2).delegate(account2.address, 1); // delegate 1 vote

      await mineBlock();
      const receipt1 = await tx1.wait();
      await tx2.wait();
      await tx3.wait();

      await minerStart();

      expect(await cryptopunksVote.numCheckpoints(account1.address)).to.equal(1);

      const checkpoint0 = await cryptopunksVote.checkpoints(account1.address, 0);
      expect(checkpoint0.fromBlock).to.equal(receipt1.blockNumber);
      expect(checkpoint0.votes.toString(), '1');

      let checkpoint1 = await cryptopunksVote.checkpoints(account1.address, 1);
      expect(checkpoint1.fromBlock).to.equal(0);
      expect(checkpoint1.votes.toString(), '0');

      const checkpoint2 = await cryptopunksVote.checkpoints(account1.address, 2);
      expect(checkpoint2.fromBlock).to.equal(0);
      expect(checkpoint2.votes.toString(), '0');

      await cryptopunks.connect(deployer).transferPunk(account0.address, 3);
      const tx4 = await cryptopunksVote.connect(account0).delegate(account1.address, 3); // delegate 1 vote

      expect(await cryptopunksVote.numCheckpoints(account1.address)).to.equal(2);

      checkpoint1 = await cryptopunksVote.checkpoints(account1.address, 1);
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
      await expect(cryptopunksVote.getPriorVotes(account1.address, 5e10)).to.be.revertedWith(
        'CryptopunksVote: not yet determined',
      );
    });

    it('returns 0 if there are no checkpoints', async () => {
      expect(await cryptopunksVote.getPriorVotes(account1.address, 0)).to.equal(0);
    });

    it('returns the latest block if >= last checkpoint block', async () => {
      await cryptopunks.mint(deployer.address)
      const t1 = await (await cryptopunksVote.connect(deployer).delegate(account1.address, 0)).wait();
      await mineBlock();
      await mineBlock();

      expect(await cryptopunksVote.getPriorVotes(account1.address, t1.blockNumber)).to.equal(1);
      expect(await cryptopunksVote.getPriorVotes(account1.address, t1.blockNumber + 1)).to.equal(1);
    });

    it('returns zero if < first checkpoint block', async () => {
      await mineBlock();
      await cryptopunks.mint(deployer.address)
      const t1 = await (await cryptopunksVote.connect(deployer).delegate(account1.address, 0)).wait();
      await mineBlock();
      await mineBlock();

      expect(await cryptopunksVote.getPriorVotes(account1.address, t1.blockNumber - 1)).to.equal(0);
      expect(await cryptopunksVote.getPriorVotes(account1.address, t1.blockNumber + 1)).to.equal(1);
    });

    it('generally returns the voting balance at the appropriate checkpoint', async () => {
      await cryptopunks.mint(deployer.address)
      await cryptopunks.mint(deployer.address)
      await cryptopunks.mint(deployer.address)
      const t1 = await (await cryptopunksVote.connect(deployer).delegate(account1.address, 0)).wait();
      await (await cryptopunksVote.connect(deployer).delegate(account1.address, 1)).wait();
      await (await cryptopunksVote.connect(deployer).delegate(account1.address, 2)).wait();
      await mineBlock();
      await mineBlock();

      // deployer -> account0.address id 1
      const t2 = await (
        await cryptopunks.connect(deployer).transferPunk(account0.address, 0)
      ).wait();
      await (await cryptopunksVote.connect(account0).delegate(account0.address, 0)).wait();
      await mineBlock();
      await mineBlock();

      // deployer -> account0.address id 2
      const t3 = await (
        await cryptopunks.connect(deployer).transferPunk(account0.address, 1)
      ).wait();
      await (await cryptopunksVote.connect(account0).delegate(account0.address, 1)).wait();
      await mineBlock();
      await mineBlock();

      // account0.address -> deployer id 1
      const t4 = await (
        await cryptopunks.connect(account0).transferPunk(account1.address, 0)
      ).wait();
      await (await cryptopunksVote.connect(account1).delegate(account1.address, 0)).wait();
      await mineBlock();
      await mineBlock();

      expect(await cryptopunksVote.getPriorVotes(account1.address, t1.blockNumber - 1)).to.equal(0);
      expect(await cryptopunksVote.getPriorVotes(account1.address, t1.blockNumber)).to.equal(1);
      expect(await cryptopunksVote.getPriorVotes(account1.address, t1.blockNumber + 2)).to.equal(3);
      expect(await cryptopunksVote.getPriorVotes(account1.address, t2.blockNumber)).to.equal(3);
      expect(await cryptopunksVote.getPriorVotes(account1.address, t2.blockNumber + 1)).to.equal(2);
      expect(await cryptopunksVote.getPriorVotes(account1.address, t3.blockNumber)).to.equal(2);
      expect(await cryptopunksVote.getPriorVotes(account1.address, t3.blockNumber + 1)).to.equal(1);
      expect(await cryptopunksVote.getPriorVotes(account1.address, t4.blockNumber)).to.equal(1);
      expect(await cryptopunksVote.getPriorVotes(account1.address, t4.blockNumber + 1)).to.equal(2);
    });
    it('never delegates to address(0)', async () => {
      await cryptopunks.mint(deployer.address)

      // Delegate from Deployer -> Account1
      await (await cryptopunksVote.connect(deployer).delegate(account1.address, 0)).wait();
      await mineBlock();
      await mineBlock();

      expect(await cryptopunksVote.getCurrentVotes(address(0))).to.equal(1); // it is the total supply
      expect(await cryptopunksVote.getCurrentVotes(deployer.address)).to.equal(0);
      expect(await cryptopunksVote.getCurrentVotes(account1.address)).to.equal(1);

      await expect(cryptopunksVote.connect(deployer).delegate(address(0), 0)).to.be.revertedWith(
        'CryptopunksVote: invalid delegatee',
      );
    });
  });
});
