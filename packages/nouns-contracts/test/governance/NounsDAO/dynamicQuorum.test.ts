import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { parseUnits } from 'ethers/lib/utils';
import hardhat from 'hardhat';
import {
  NounsDaoLogicV1Harness__factory as NounsDaoLogicV1HarnessFactory,
  NounsDaoLogicV2Harness,
  NounsDaoLogicV2Harness__factory as NounsDaoLogicV2HarnessFactory,
} from '../../../typechain';
import { getSigners, TestSigners } from '../../utils';

chai.use(solidity);
const { expect } = chai;

const { ethers } = hardhat;

let deployer: SignerWithAddress;
let signers: TestSigners;
let gov: NounsDaoLogicV2Harness;

async function deployGovernorV2(deployer: SignerWithAddress): Promise<NounsDaoLogicV2Harness> {
  return await new NounsDaoLogicV2HarnessFactory(deployer).deploy();
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
      quorumPolynomCoefs: [0, 0],
      quorumVotesBPSOffset: 500,
    });

    expect(quorumVotes).to.equal(20);
  });

  describe('Linear function', async () => {
    it('stays flat before the offset value', async () => {
      const quorumVotes = await gov.dynamicQuorumVotes(6, 200, {
        minQuorumVotesBPS: 1000,
        maxQuorumVotesBPS: 4000,
        quorumPolynomCoefs: [parseUnits('1', 6), 0],
        quorumVotesBPSOffset: 500,
      });

      expect(quorumVotes).to.equal(20);
    });

    it('increases linearly past the offset value', async () => {
      const quorumVotes = await gov.dynamicQuorumVotes(18, 200, {
        minQuorumVotesBPS: 1000,
        maxQuorumVotesBPS: 4000,
        quorumPolynomCoefs: [parseUnits('1', 6), 0],
        quorumVotesBPSOffset: 500,
      });

      expect(quorumVotes).to.equal(28);
    });
  });

  describe('Quadratic function', async () => {
    it('increases quadratically', async () => {
      const quorumVotes = await gov.dynamicQuorumVotes(26, 200, {
        minQuorumVotesBPS: 1000,
        maxQuorumVotesBPS: 4000,
        quorumPolynomCoefs: [0, parseUnits('0.001', 6)],
        quorumVotesBPSOffset: 500,
      });

      expect(quorumVotes).to.equal(32);
    });
  });

  describe('Max required quorum', async () => {
    it('caps the quorum by the max value', async () => {
      let quorumVotes = await gov.dynamicQuorumVotes(50, 200, {
        minQuorumVotesBPS: 1000,
        maxQuorumVotesBPS: 10000,
        quorumPolynomCoefs: [parseUnits('0.3', 6), parseUnits('0.001', 6)],
        quorumVotesBPSOffset: 500,
      });

      expect(quorumVotes).to.equal(112);

      quorumVotes = await gov.dynamicQuorumVotes(50, 200, {
        minQuorumVotesBPS: 1000,
        maxQuorumVotesBPS: 4000,
        quorumPolynomCoefs: [parseUnits('0.3', 6), parseUnits('0.001', 6)],
        quorumVotesBPSOffset: 500,
      });

      expect(quorumVotes).to.equal(80);
    });
  });
});
