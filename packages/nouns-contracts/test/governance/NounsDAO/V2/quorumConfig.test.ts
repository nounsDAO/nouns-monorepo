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
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  NounsToken,
  NounsDescriptor__factory as NounsDescriptorFactory,
  NounsDaoLogicV2,
} from '../../../../typechain';
import { parseUnits } from 'ethers/lib/utils';
import { BigNumberish } from 'ethers';

chai.use(solidity);
const { expect } = chai;
const { ethers } = hardhat;

let token: NounsToken;
let deployer: SignerWithAddress;
let account0: SignerWithAddress;
let signers: TestSigners;
let gov: NounsDaoLogicV2;
let snapshotId: number;

interface DynamicQuorumParams {
  minQuorumVotesBPS: BigNumberish;
  maxQuorumVotesBPS: BigNumberish;
  quorumVotesBPSOffset: BigNumberish;
  quorumPolynomCoefs: [BigNumberish, BigNumberish];
}

async function setupWithV2() {
  token = await deployNounsToken(signers.deployer);

  await populateDescriptor(
    NounsDescriptorFactory.connect(await token.descriptor(), signers.deployer),
  );

  await setTotalSupply(token, 100);

  const { address: govProxyAddress } = await deployGovernorV1(deployer, token.address);
  gov = await deployGovernorV2(deployer, govProxyAddress);
}

describe('NounsDAOV2#_setDynamicQuorumParams', () => {
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

  describe('allowed values', () => {
    it('reverts given no config', async () => {
      const block = await blockNumber();
      await expect(gov.getDynamicQuorumParamsAt(block)).to.be.revertedWith(
        'NoDynamicQuorumParamsFound()',
      );
    });

    it('reverts when sender is not admin', async () => {
      await expect(
        gov.connect(account0)._setDynamicQuorumParams({
          minQuorumVotesBPS: 0,
          maxQuorumVotesBPS: 0,
          quorumVotesBPSOffset: 0,
          quorumPolynomCoefs: [0, 0],
        }),
      ).to.be.revertedWith('UnauthorizedAdminOnly()');
    });

    it('reverts given minQuorum input below lower bound', async () => {
      await expect(
        gov._setDynamicQuorumParams({
          minQuorumVotesBPS: 199,
          maxQuorumVotesBPS: 0,
          quorumVotesBPSOffset: 0,
          quorumPolynomCoefs: [0, 0],
        }),
      ).to.be.revertedWith('InvalidMinQuorumVotesBPS()');
    });

    it('reverts given minQuorum input above upper bound', async () => {
      await expect(
        gov._setDynamicQuorumParams({
          minQuorumVotesBPS: 2001,
          maxQuorumVotesBPS: 0,
          quorumVotesBPSOffset: 0,
          quorumPolynomCoefs: [0, 0],
        }),
      ).to.be.revertedWith('InvalidMinQuorumVotesBPS()');
    });

    it('reverts given minQuorum input above maxQuorum BPs', async () => {
      await expect(
        gov._setDynamicQuorumParams({
          minQuorumVotesBPS: 202,
          maxQuorumVotesBPS: 201,
          quorumVotesBPSOffset: 0,
          quorumPolynomCoefs: [0, 0],
        }),
      ).to.be.revertedWith('InvalidMinQuorumAboveMaxQuorumVotesBPS()');
    });

    it('reverts when maxQuorum input above upper bound', async () => {
      await expect(
        gov._setDynamicQuorumParams({
          minQuorumVotesBPS: 200,
          maxQuorumVotesBPS: 4001,
          quorumVotesBPSOffset: 0,
          quorumPolynomCoefs: [0, 0],
        }),
      ).to.be.revertedWith('InvalidMaxQuorumVotesBPS()');
    });
  });

  it('sets value and emits event', async () => {
    const quorumPolynomCoefs: [BigNumberish, BigNumberish] = [
      parseUnits('1', 6),
      parseUnits('0.001', 6),
    ];
    const tx = await gov._setDynamicQuorumParams({
      minQuorumVotesBPS: 200,
      maxQuorumVotesBPS: 4000,
      quorumVotesBPSOffset: 123,
      quorumPolynomCoefs,
    });

    const actualParams = await gov.getDynamicQuorumParamsAt(await blockNumber());
    expect(actualParams.minQuorumVotesBPS).to.equal(200);
    expect(actualParams.maxQuorumVotesBPS).to.equal(4000);
    expect(actualParams.quorumVotesBPSOffset).to.equal(123);
    expect(actualParams.quorumPolynomCoefs[0]).to.equal(quorumPolynomCoefs[0]);
    expect(actualParams.quorumPolynomCoefs[1]).to.equal(quorumPolynomCoefs[1]);

    await expect(tx)
      .to.emit(gov, 'DynamicQuorumParamsSet')
      .withArgs(200, 4000, 123, quorumPolynomCoefs);
  });

  describe('quorum params checkpointing', () => {
    let blockNum1: number;
    let blockNum2: number;
    let blockNum3: number;

    const params1: DynamicQuorumParams = {
      minQuorumVotesBPS: 201,
      maxQuorumVotesBPS: 3001,
      quorumVotesBPSOffset: 301,
      quorumPolynomCoefs: [1, 1],
    };
    const params2: DynamicQuorumParams = {
      minQuorumVotesBPS: 202,
      maxQuorumVotesBPS: 3002,
      quorumVotesBPSOffset: 302,
      quorumPolynomCoefs: [2, 2],
    };
    const params3: DynamicQuorumParams = {
      minQuorumVotesBPS: 203,
      maxQuorumVotesBPS: 3003,
      quorumVotesBPSOffset: 303,
      quorumPolynomCoefs: [3, 3],
    };

    before(async () => {
      await advanceBlocks(10);
      await gov._setDynamicQuorumParams(params1);
      blockNum1 = await blockNumber();

      await advanceBlocks(10);
      await gov._setDynamicQuorumParams(params2);
      blockNum2 = await blockNumber();

      await advanceBlocks(10);
      await gov._setDynamicQuorumParams(params3);
      blockNum3 = await blockNumber();
    });

    it('reads correct values for exact block number', async () => {
      expectEqualParams(await gov.getDynamicQuorumParamsAt(blockNum1), params1);
      expectEqualParams(await gov.getDynamicQuorumParamsAt(blockNum2), params2);
      expectEqualParams(await gov.getDynamicQuorumParamsAt(blockNum3), params3);
    });

    it('reverts if block number too low', async () => {
      await expect(gov.getDynamicQuorumParamsAt(blockNum1 - 1)).to.be.revertedWith(
        'NoDynamicQuorumParamsFound()',
      );
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
      quorumVotesBPSOffset: 300,
      quorumPolynomCoefs: [1, 1],
    };

    beforeEach(async () => {
      await gov._setDynamicQuorumParams(baseParams);
    });

    it('_setMinQuorumVotesBPS works', async () => {
      await gov._setMinQuorumVotesBPS(222);
      const params = await gov.getDynamicQuorumParamsAt(await blockNumber());

      expect(params.minQuorumVotesBPS).to.equal(222);
    });

    it('_setMinQuorumVotesBPS reverts when sender is not admin', async () => {
      await expect(gov.connect(account0)._setMinQuorumVotesBPS(222)).to.be.revertedWith(
        'UnauthorizedAdminOnly()',
      );
    });

    it('_setMaxQuorumVotesBPS works', async () => {
      await gov._setMaxQuorumVotesBPS(3333);
      const params = await gov.getDynamicQuorumParamsAt(await blockNumber());

      expect(params.maxQuorumVotesBPS).to.equal(3333);
    });

    it('_setMaxQuorumVotesBPS reverts when sender is not admin', async () => {
      await expect(gov.connect(account0)._setMaxQuorumVotesBPS(3333)).to.be.revertedWith(
        'UnauthorizedAdminOnly()',
      );
    });

    it('_setQuorumVotesBPSOffset works', async () => {
      await gov._setQuorumVotesBPSOffset(321);
      const params = await gov.getDynamicQuorumParamsAt(await blockNumber());

      expect(params.quorumVotesBPSOffset).to.equal(321);
    });

    it('_setQuorumVotesBPSOffset reverts when sender is not admin', async () => {
      await expect(gov.connect(account0)._setQuorumVotesBPSOffset(321)).to.be.revertedWith(
        'UnauthorizedAdminOnly()',
      );
    });

    it('_setQuorumPolynomCoefs works', async () => {
      await gov._setQuorumPolynomCoefs([2, 3]);
      const params = await gov.getDynamicQuorumParamsAt(await blockNumber());

      expect(params.quorumPolynomCoefs[0]).to.equal(2);
      expect(params.quorumPolynomCoefs[1]).to.equal(3);
    });

    it('_setQuorumPolynomCoefs reverts when sender is not admin', async () => {
      await expect(gov.connect(account0)._setQuorumPolynomCoefs([2, 3])).to.be.revertedWith(
        'UnauthorizedAdminOnly()',
      );
    });
  });

  function expectEqualParams(p1: DynamicQuorumParams, p2: DynamicQuorumParams) {
    expect(p1.maxQuorumVotesBPS).to.equal(p2.maxQuorumVotesBPS);
    expect(p1.minQuorumVotesBPS).to.equal(p2.minQuorumVotesBPS);
    expect(p1.quorumVotesBPSOffset).to.equal(p2.quorumVotesBPSOffset);
    expect(p1.quorumPolynomCoefs[0]).to.equal(p2.quorumPolynomCoefs[0]);
    expect(p1.quorumPolynomCoefs[1]).to.equal(p2.quorumPolynomCoefs[1]);
  }
});
