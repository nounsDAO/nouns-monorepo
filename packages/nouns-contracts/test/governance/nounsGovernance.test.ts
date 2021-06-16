// const {
//   address,
//   minerStart,
//   minerStop,
//   unlockedAccount,
//   mineBlock
// } = require('../Utils/Ethereum');
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { NounsErc721 } from '../../typechain';
import { deployNounsErc721, getSigners, TestSigners, MintNouns, minerStart, minerStop, mineBlock } from '../utils';
import hardhat from 'hardhat';
chai.use(solidity);
const { expect } = chai;


/*
You can change the mining behavior on runtime using two RPC methods: evm_setAutomine and evm_setIntervalMining. For example, to disable automining:

await network.provider.send("evm_setAutomine", [false])
And to enable interval mining:

await network.provider.send("evm_setIntervalMining", [5000])
*/

// const EIP712 = require('../Utils/EIP712');

describe('Nouns Governance', () => {
  let token: NounsErc721;
  let mintNouns: (amount: number) => Promise<void>;
  let tokenCallFromGuy: NounsErc721;
  let tokenCallFromDeployer: NounsErc721;
  let guy: string;
  let a1: string;
  let a2: string;
  let deployer: string;

  beforeEach(async () => {
    const signers: TestSigners = await getSigners();
    token = await deployNounsErc721();
    mintNouns = MintNouns(token);
    tokenCallFromGuy = token.connect(signers.account0);
    tokenCallFromDeployer = token;
    guy = signers.account0.address;
    a1 = signers.account1.address;
    a2 = signers.account2.address;
    deployer = signers.deployer.address;
  });


  // describe('delegateBySig', () => {
  //   const Domain = (token) => ({ name, chainId, verifyingContract: token._address });
  //   const Types = {
  //     Delegation: [
  //       { name: 'delegatee', type: 'address' },
  //       { name: 'nonce', type: 'uint256' },
  //       { name: 'expiry', type: 'uint256' }
  //     ]
  //   };

  //   it('reverts if the signatory is invalid', async () => {
  //     const delegatee = root, nonce = 0, expiry = 0;
  //     await expect(send(token, 'delegateBySig', [delegatee, nonce, expiry, 0, '0xbad', '0xbad'])).rejects.toRevert("revert Comp::delegateBySig: invalid signature");
  //   });

  //   it('reverts if the nonce is bad ', async () => {
  //     const delegatee = root, nonce = 1, expiry = 0;
  //     const { v, r, s } = EIP712.sign(Domain(token), 'Delegation', { delegatee, nonce, expiry }, Types, unlockedAccount(a1).secretKey);
  //     await expect(send(token, 'delegateBySig', [delegatee, nonce, expiry, v, r, s])).rejects.toRevert("revert Comp::delegateBySig: invalid nonce");
  //   });

  //   it('reverts if the signature has expired', async () => {
  //     const delegatee = root, nonce = 0, expiry = 0;
  //     const { v, r, s } = EIP712.sign(Domain(token), 'Delegation', { delegatee, nonce, expiry }, Types, unlockedAccount(a1).secretKey);
  //     await expect(send(token, 'delegateBySig', [delegatee, nonce, expiry, v, r, s])).rejects.toRevert("revert Comp::delegateBySig: signature expired");
  //   });

  //   it('delegates on behalf of the signatory', async () => {
  //     const delegatee = root, nonce = 0, expiry = 10e9;
  //     const { v, r, s } = EIP712.sign(Domain(token), 'Delegation', { delegatee, nonce, expiry }, Types, unlockedAccount(a1).secretKey);
  //     expect(await call(token, 'delegates', [a1])).toEqual(address(0));
  //     const tx = await send(token, 'delegateBySig', [delegatee, nonce, expiry, v, r, s]);
  //     expect(tx.gasUsed < 80000);
  //     expect(await call(token, 'delegates', [a1])).toEqual(root);
  //   });
  // });

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

  // describe('getPriorVotes', () => {
  //   it('reverts if block number >= current block', async () => {
  //     await expect(call(token, 'getPriorVotes', [a1, 5e10])).rejects.toRevert("revert Comp::getPriorVotes: not yet determined");
  //   });

  //   it('returns 0 if there are no checkpoints', async () => {
  //     expect(await call(token, 'getPriorVotes', [a1, 0])).toEqual('0');
  //   });

  //   it('returns the latest block if >= last checkpoint block', async () => {
  //     const t1 = await send(token, 'delegate', [a1], { from: root });
  //     await mineBlock();
  //     await mineBlock();

  //     expect(await call(token, 'getPriorVotes', [a1, t1.blockNumber])).toEqual('10000000000000000000000000');
  //     expect(await call(token, 'getPriorVotes', [a1, t1.blockNumber + 1])).toEqual('10000000000000000000000000');
  //   });

  //   it('returns zero if < first checkpoint block', async () => {
  //     await mineBlock();
  //     const t1 = await send(token, 'delegate', [a1], { from: root });
  //     await mineBlock();
  //     await mineBlock();

  //     expect(await call(token, 'getPriorVotes', [a1, t1.blockNumber - 1])).toEqual('0');
  //     expect(await call(token, 'getPriorVotes', [a1, t1.blockNumber + 1])).toEqual('10000000000000000000000000');
  //   });

  //   it('generally returns the voting balance at the appropriate checkpoint', async () => {
  //     const t1 = await send(token, 'delegate', [a1], { from: root });
  //     await mineBlock();
  //     await mineBlock();
  //     const t2 = await send(token, 'transfer', [a2, 10], { from: root });
  //     await mineBlock();
  //     await mineBlock();
  //     const t3 = await send(token, 'transfer', [a2, 10], { from: root });
  //     await mineBlock();
  //     await mineBlock();
  //     const t4 = await send(token, 'transfer', [root, 20], { from: a2 });
  //     await mineBlock();
  //     await mineBlock();

  //     expect(await call(token, 'getPriorVotes', [a1, t1.blockNumber - 1])).toEqual('0');
  //     expect(await call(token, 'getPriorVotes', [a1, t1.blockNumber])).toEqual('10000000000000000000000000');
  //     expect(await call(token, 'getPriorVotes', [a1, t1.blockNumber + 1])).toEqual('10000000000000000000000000');
  //     expect(await call(token, 'getPriorVotes', [a1, t2.blockNumber])).toEqual('9999999999999999999999990');
  //     expect(await call(token, 'getPriorVotes', [a1, t2.blockNumber + 1])).toEqual('9999999999999999999999990');
  //     expect(await call(token, 'getPriorVotes', [a1, t3.blockNumber])).toEqual('9999999999999999999999980');
  //     expect(await call(token, 'getPriorVotes', [a1, t3.blockNumber + 1])).toEqual('9999999999999999999999980');
  //     expect(await call(token, 'getPriorVotes', [a1, t4.blockNumber])).toEqual('10000000000000000000000000');
  //     expect(await call(token, 'getPriorVotes', [a1, t4.blockNumber + 1])).toEqual('10000000000000000000000000');
  //   });
  // });
});
