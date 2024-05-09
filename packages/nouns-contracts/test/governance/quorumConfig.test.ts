import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import hardhat from 'hardhat';
import {
  deployNounsToken,
  getSigners,
  TestSigners,
  setTotalSupply,
  blockNumber,
  advanceBlocks,
  populateDescriptorV2,
  deployGovernorV3WithV3Proxy,
} from '../utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  NounsToken,
  NounsDescriptorV2__factory as NounsDescriptorV2Factory,
  INounsDAOLogic,
  NounsDAOLogicV4__factory,
} from '../../typechain';
import { parseUnits } from 'ethers/lib/utils';
import { DynamicQuorumParams } from '../types';

chai.use(solidity);
const { expect } = chai;
const { ethers } = hardhat;

let token: NounsToken;
let deployer: SignerWithAddress;
let account0: SignerWithAddress;
let signers: TestSigners;
let gov: INounsDAOLogic;
let snapshotId: number;

const V1_QUORUM_BPS = 201;

async function setup() {
  token = await deployNounsToken(signers.deployer);

  await populateDescriptorV2(
    NounsDescriptorV2Factory.connect(await token.descriptor(), signers.deployer),
  );

  await setTotalSupply(token, 100);

  gov = await deployGovernorV3WithV3Proxy(deployer, token.address);
}

describe('NounsDAO#_setDynamicQuorumParams', () => {
  before(async () => {
    signers = await getSigners();
    deployer = signers.deployer;
    account0 = signers.account0;

    await setup();
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  describe('allowed values', () => {
    it('reverts when sender is not admin [ @skip-on-coverage ]', async () => {
      await expect(gov.connect(account0)._setDynamicQuorumParams(0, 0, 0)).to.be.revertedWith(
        'AdminOnly()',
      );
    });

    it('reverts given minQuorum input below lower bound [ @skip-on-coverage ]', async () => {
      await expect(gov._setDynamicQuorumParams(199, 0, 0)).to.be.revertedWith(
        'InvalidMinQuorumVotesBPS()',
      );
    });

    it('reverts given minQuorum input above upper bound [ @skip-on-coverage ]', async () => {
      await expect(gov._setDynamicQuorumParams(2001, 0, 0)).to.be.revertedWith(
        'InvalidMinQuorumVotesBPS()',
      );
    });

    it('reverts given minQuorum input above maxQuorum BPs [ @skip-on-coverage ]', async () => {
      await expect(gov._setDynamicQuorumParams(202, 201, 0)).to.be.revertedWith(
        'MinQuorumBPSGreaterThanMaxQuorumBPS()',
      );
    });

    it('reverts when maxQuorum input above upper bound [ @skip-on-coverage ]', async () => {
      await expect(gov._setDynamicQuorumParams(200, 6001, 0)).to.be.revertedWith(
        'InvalidMaxQuorumVotesBPS()',
      );
    });
  });

  it('given existing prior config, sets value and emits event', async () => {
    await gov._setDynamicQuorumParams(200, 2000, parseUnits('1', 6));

    const quorumCoefficient = parseUnits('11', 6);

    const tx = await gov._setDynamicQuorumParams(222, 2222, quorumCoefficient);

    const actualParams = await gov.getDynamicQuorumParamsAt(await blockNumber());
    expect(actualParams.minQuorumVotesBPS).to.equal(222);
    expect(actualParams.maxQuorumVotesBPS).to.equal(2222);
    expect(actualParams.quorumCoefficient).to.equal(quorumCoefficient);

    let govWithEvents = NounsDAOLogicV4__factory.connect(gov.address, gov.signer);

    await expect(tx).to.emit(govWithEvents, 'MinQuorumVotesBPSSet').withArgs(200, 222);
    await expect(tx).to.emit(govWithEvents, 'MaxQuorumVotesBPSSet').withArgs(2000, 2222);

    await expect(tx)
      .to.emit(govWithEvents, 'QuorumCoefficientSet')
      .withArgs(parseUnits('1', 6), quorumCoefficient);
  });

  describe('quorum params checkpointing', () => {
    let blockNum1: number;
    let blockNum2: number;
    let blockNum3: number;

    const params1: DynamicQuorumParams = {
      minQuorumVotesBPS: 201,
      maxQuorumVotesBPS: 3001,
      quorumCoefficient: 1,
    };
    const params2: DynamicQuorumParams = {
      minQuorumVotesBPS: 202,
      maxQuorumVotesBPS: 3002,
      quorumCoefficient: 2,
    };
    const params3: DynamicQuorumParams = {
      minQuorumVotesBPS: 203,
      maxQuorumVotesBPS: 3003,
      quorumCoefficient: 3,
    };

    before(async () => {
      await advanceBlocks(10);
      await gov._setDynamicQuorumParams(
        params1.minQuorumVotesBPS,
        params1.maxQuorumVotesBPS,
        params1.quorumCoefficient,
      );
      blockNum1 = await blockNumber();

      await advanceBlocks(10);
      await gov._setDynamicQuorumParams(
        params2.minQuorumVotesBPS,
        params2.maxQuorumVotesBPS,
        params2.quorumCoefficient,
      );
      blockNum2 = await blockNumber();

      await advanceBlocks(10);
      await gov._setDynamicQuorumParams(
        params3.minQuorumVotesBPS,
        params3.maxQuorumVotesBPS,
        params3.quorumCoefficient,
      );
      blockNum3 = await blockNumber();
    });

    it('reads correct values for exact block number', async () => {
      expectEqualParams(await gov.getDynamicQuorumParamsAt(blockNum1), params1);
      expectEqualParams(await gov.getDynamicQuorumParamsAt(blockNum2), params2);
      expectEqualParams(await gov.getDynamicQuorumParamsAt(blockNum3), params3);
    });

    it('reads correct values in between block numbers', async () => {
      expectEqualParams(await gov.getDynamicQuorumParamsAt(blockNum1 + 5), params1);
      expectEqualParams(await gov.getDynamicQuorumParamsAt(blockNum2 + 5), params2);
    });

    it('reads latest values if block number higher than latest checkpoint', async () => {
      expectEqualParams(await gov.getDynamicQuorumParamsAt(blockNum3 + 300), params3);
    });
  });

  describe('individual setters', () => {
    const baseParams: DynamicQuorumParams = {
      minQuorumVotesBPS: 200,
      maxQuorumVotesBPS: 3000,
      quorumCoefficient: 1,
    };

    beforeEach(async () => {
      await gov._setDynamicQuorumParams(
        baseParams.minQuorumVotesBPS,
        baseParams.maxQuorumVotesBPS,
        baseParams.quorumCoefficient,
      );
    });

    describe('_setMinQuorumVotesBPS', () => {
      it('works and emits', async () => {
        const tx = await gov._setMinQuorumVotesBPS(222);
        const params = await gov.getDynamicQuorumParamsAt(await blockNumber());

        expect(params.minQuorumVotesBPS).to.equal(222);
        let govWithEvents = NounsDAOLogicV4__factory.connect(gov.address, gov.signer);
        await expect(tx).to.emit(govWithEvents, 'MinQuorumVotesBPSSet').withArgs(200, 222);
      });

      it('reverts when sender is not admin [ @skip-on-coverage ]', async () => {
        await expect(gov.connect(account0)._setMinQuorumVotesBPS(222)).to.be.revertedWith(
          'AdminOnly()',
        );
      });

      it('reverts given input below lower bound', async () => {
        await expect(gov._setMinQuorumVotesBPS(199)).to.be.revertedWith(
          'NounsDAO::_setMinQuorumVotesBPS: invalid min quorum votes bps',
        );
      });

      it('reverts given input above upper bound', async () => {
        await expect(gov._setMinQuorumVotesBPS(2001)).to.be.revertedWith(
          'NounsDAO::_setMinQuorumVotesBPS: invalid min quorum votes bps',
        );
      });

      it('reverts given input above max value', async () => {
        await gov._setMaxQuorumVotesBPS(1998);

        await expect(gov._setMinQuorumVotesBPS(1999)).to.be.revertedWith(
          'NounsDAO::_setMinQuorumVotesBPS: min quorum votes bps greater than max',
        );
      });
    });

    describe('_setMaxQuorumVotesBPS', () => {
      it('works and emits', async () => {
        const tx = await gov._setMaxQuorumVotesBPS(3333);
        const params = await gov.getDynamicQuorumParamsAt(await blockNumber());

        expect(params.maxQuorumVotesBPS).to.equal(3333);
        let govWithEvents = NounsDAOLogicV4__factory.connect(gov.address, gov.signer);
        await expect(tx).to.emit(govWithEvents, 'MaxQuorumVotesBPSSet').withArgs(3000, 3333);
      });

      it('reverts when sender is not admin [ @skip-on-coverage ]', async () => {
        await expect(gov.connect(account0)._setMaxQuorumVotesBPS(3333)).to.be.revertedWith(
          'AdminOnly()',
        );
      });

      it('reverts given input above upper bound', async () => {
        await expect(gov._setMaxQuorumVotesBPS(6001)).to.be.revertedWith(
          'NounsDAO::_setMaxQuorumVotesBPS: invalid max quorum votes bps',
        );
      });

      it('reverts given input less than min param', async () => {
        await expect(gov._setMaxQuorumVotesBPS(199)).to.be.revertedWith(
          'NounsDAO::_setMaxQuorumVotesBPS: min quorum votes bps greater than max',
        );
      });
    });

    describe('_setQuorumCoefficient', () => {
      it('works and emits', async () => {
        const tx = await gov._setQuorumCoefficient(111);
        const params = await gov.getDynamicQuorumParamsAt(await blockNumber());

        expect(params.quorumCoefficient).to.equal(111);
        let govWithEvents = NounsDAOLogicV4__factory.connect(gov.address, gov.signer);
        await expect(tx).to.emit(govWithEvents, 'QuorumCoefficientSet').withArgs(1, 111);
      });

      it('reverts when sender is not admin [ @skip-on-coverage ]', async () => {
        await expect(gov.connect(account0)._setQuorumCoefficient(111)).to.be.revertedWith(
          'AdminOnly()',
        );
      });
    });
  });

  function expectEqualParams(p1: DynamicQuorumParams, p2: DynamicQuorumParams) {
    expect(p1.maxQuorumVotesBPS).to.equal(p2.maxQuorumVotesBPS);
    expect(p1.minQuorumVotesBPS).to.equal(p2.minQuorumVotesBPS);
    expect(p1.quorumCoefficient).to.equal(p2.quorumCoefficient);
  }
});
