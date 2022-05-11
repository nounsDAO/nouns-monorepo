import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { parseUnits } from 'ethers/lib/utils';
import {
  NounsDaoLogicV2,
  NounsDaoLogicV2__factory as NounsDaoLogicV2Factory,
} from '../../../../typechain';
import { DynamicQuorumParams } from '../../../types';
import { getSigners, TestSigners } from '../../../utils';

chai.use(solidity);
const { expect } = chai;

let deployer: SignerWithAddress;
let signers: TestSigners;
let gov: NounsDaoLogicV2;

async function deployGovernorV2(deployer: SignerWithAddress): Promise<NounsDaoLogicV2> {
  return await new NounsDaoLogicV2Factory(deployer).deploy();
}

describe('Dynamic Quorum', () => {
  before(async () => {
    signers = await getSigners();
    deployer = signers.deployer;
    gov = await deployGovernorV2(deployer);
  });

  it('coefs all zeroes', async () => {
    const quorumVotes = await gov.dynamicQuorumVotes(12, 200, {
      minQuorumVotesBPS: 1000,
      maxQuorumVotesBPS: 4000,
      quorumVotesBPSOffset: 500,
      quorumLinearCoefficient: 0,
      quorumQuadraticCoefficient: 0,
    });

    expect(quorumVotes).to.equal(20);
  });

  describe('Linear function', async () => {
    it('stays flat before the offset value', async () => {
      const quorumVotes = await gov.dynamicQuorumVotes(6, 200, {
        minQuorumVotesBPS: 1000,
        maxQuorumVotesBPS: 4000,
        quorumVotesBPSOffset: 500,
        quorumLinearCoefficient: parseUnits('1', 6),
        quorumQuadraticCoefficient: 0,
      });

      expect(quorumVotes).to.equal(20);
    });

    it('increases linearly past the offset value', async () => {
      const quorumVotes = await gov.dynamicQuorumVotes(18, 200, {
        minQuorumVotesBPS: 1000,
        maxQuorumVotesBPS: 4000,
        quorumVotesBPSOffset: 500,
        quorumLinearCoefficient: parseUnits('1', 6),
        quorumQuadraticCoefficient: 0,
      });

      expect(quorumVotes).to.equal(28);
    });
  });

  describe('Quadratic function', async () => {
    it('increases quadratically', async () => {
      const quorumVotes = await gov.dynamicQuorumVotes(26, 200, {
        minQuorumVotesBPS: 1000,
        maxQuorumVotesBPS: 4000,
        quorumVotesBPSOffset: 500,
        quorumLinearCoefficient: 0,
        quorumQuadraticCoefficient: parseUnits('0.001', 6),
      });

      expect(quorumVotes).to.equal(32);
    });

    it('uses both coefs', async () => {
      const params: DynamicQuorumParams = {
        minQuorumVotesBPS: 1000,
        maxQuorumVotesBPS: 4000,
        quorumVotesBPSOffset: 500,
        quorumLinearCoefficient: parseUnits('0.3', 6),
        quorumQuadraticCoefficient: parseUnits('0.001', 6),
      };

      expect(await gov.dynamicQuorumVotes(10, 200, params)).to.equal(20);
      expect(await gov.dynamicQuorumVotes(20, 200, params)).to.equal(28);
      expect(await gov.dynamicQuorumVotes(30, 200, params)).to.equal(46);
      expect(await gov.dynamicQuorumVotes(40, 200, params)).to.equal(74);
      expect(await gov.dynamicQuorumVotes(50, 200, params)).to.equal(80);
      expect(await gov.dynamicQuorumVotes(80, 200, params)).to.equal(80);
    });
  });

  describe('Max required quorum', async () => {
    it('caps the quorum by the max value', async () => {
      let quorumVotes = await gov.dynamicQuorumVotes(50, 200, {
        minQuorumVotesBPS: 1000,
        maxQuorumVotesBPS: 10000,
        quorumVotesBPSOffset: 500,
        quorumLinearCoefficient: parseUnits('0.3', 6),
        quorumQuadraticCoefficient: parseUnits('0.001', 6),
      });

      expect(quorumVotes).to.equal(112);

      quorumVotes = await gov.dynamicQuorumVotes(50, 200, {
        minQuorumVotesBPS: 1000,
        maxQuorumVotesBPS: 4000,
        quorumVotesBPSOffset: 500,
        quorumLinearCoefficient: parseUnits('0.3', 6),
        quorumQuadraticCoefficient: parseUnits('0.001', 6),
      });

      expect(quorumVotes).to.equal(80);
    });
  });
});
