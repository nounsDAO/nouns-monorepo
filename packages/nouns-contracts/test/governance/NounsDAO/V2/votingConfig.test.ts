import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import hardhat from 'hardhat';
import {
  deployNounsToken,
  getSigners,
  TestSigners,
  setTotalSupply,
  populateDescriptor,
  deployGovernorV1,
  blockNumber,
  advanceBlocks,
  deployGovernorV2,
} from '../../../utils';
import {
  NounsToken,
  NounsDescriptor__factory as NounsDescriptorFactory,
  NounsDaoLogicV2,
} from '../../../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);
const { expect } = chai;
const { ethers } = hardhat;

let token: NounsToken;
let deployer: SignerWithAddress;
let signers: TestSigners;
let gov: NounsDaoLogicV2;
let snapshotId: number;
let account0: SignerWithAddress;
const initialVotingPeriod = 10000;
const initialVotingDelay = 100;

async function setupWithV2() {
  token = await deployNounsToken(signers.deployer);

  await populateDescriptor(
    NounsDescriptorFactory.connect(await token.descriptor(), signers.deployer),
  );

  await setTotalSupply(token, 100);

  const { address: govProxyAddress } = await deployGovernorV1(
    deployer,
    token.address,
    initialVotingPeriod,
    initialVotingDelay,
  );
  gov = await deployGovernorV2(deployer, govProxyAddress);
}

describe('NounsDAOV2#_setVotingPeriod & _setVotingDelay', () => {
  before(async () => {
    signers = await getSigners();
    deployer = signers.deployer;
    account0 = signers.account0;

    await setupWithV2();
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  describe('_setVotingPeriod', async () => {
    describe('allowed values', async () => {
      it('reverts when sender is not admin', async () => {
        await expect(gov.connect(account0)._setVotingPeriod(10000)).to.be.revertedWith(
          'NounsDAO::_setVotingPeriod: admin only',
        );
      });

      it('reverts if votingPeriod is below min value', async () => {
        await expect(gov._setVotingPeriod(5759)).to.be.revertedWith(
          'NounsDAO::_setVotingPeriod: invalid voting period',
        );

        // should not revert
        await gov._setVotingPeriod(5760);
      });

      it('reverts if votingPeriod is above max value', async () => {
        await expect(gov._setVotingPeriod(80641)).to.be.revertedWith(
          'NounsDAO::_setVotingPeriod: invalid voting period',
        );

        // should not revert
        await gov._setVotingPeriod(80640);
      });
    });

    it('reads the values after setting them', async () => {
      await gov._setVotingPeriod(10001);

      const params = await gov.getVotingParamsAt(await blockNumber());
      expect(params.votingPeriod).to.be.equal(10001);

      expect(await gov.getVotingPeriod()).to.be.equal(10001);
    });

    describe('events', async () => {
      it('emits events with previous value from V1', async () => {
        const tx = await gov._setVotingPeriod(10001);

        await expect(tx).to.emit(gov, 'VotingPeriodSet').withArgs(initialVotingPeriod, 10001);
      });

      it('emits events with previous value from V2', async () => {
        await gov._setVotingPeriod(10001);

        await advanceBlocks(10);

        const tx = await gov._setVotingPeriod(10011);

        await expect(tx).to.emit(gov, 'VotingPeriodSet').withArgs(10001, 10011);
      });
    });
  });

  describe('_setVotingDelay', async () => {
    describe('allowed values', async () => {
      it('reverts if votingDelay is below min value', async () => {
        await expect(gov._setVotingDelay(0)).to.be.revertedWith(
          'NounsDAO::_setVotingDelay: invalid voting delay',
        );

        // should not revert
        await gov._setVotingDelay(1);
      });

      it('reverts if votingDelay is above max value', async () => {
        await expect(gov._setVotingDelay(40321)).to.be.revertedWith(
          'NounsDAO::_setVotingDelay: invalid voting delay',
        );

        // should not revert
        await gov._setVotingDelay(40320);
      });
    });

    it('reads the values after setting them', async () => {
      await gov._setVotingDelay(10002);

      const params = await gov.getVotingParamsAt(await blockNumber());
      expect(params.votingDelay).to.be.equal(10002);

      expect(await gov.getVotingDelay()).to.be.equal(10002);
    });

    describe('events', async () => {
      it('emits events with previous value from V1', async () => {
        const tx = await gov._setVotingDelay(10002);

        await expect(tx).to.emit(gov, 'VotingDelaySet').withArgs(initialVotingDelay, 10002);
      });

      it('emits events with previous value from V2', async () => {
        await gov._setVotingDelay(10002);

        await advanceBlocks(10);

        const tx = await gov._setVotingDelay(10012);

        await expect(tx).to.emit(gov, 'VotingDelaySet').withArgs(10002, 10012);
      });
    });
  });
});
