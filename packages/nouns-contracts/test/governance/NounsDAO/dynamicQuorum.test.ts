import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { parseUnits } from 'ethers/lib/utils';
import hardhat from 'hardhat';
import {
  NounsToken,
  NounsDescriptor__factory as NounsDescriptorFactory,
  NounsDaoLogicV1Harness,
  NounsDaoLogicV1Harness__factory as NounsDaoLogicV1HarnessFactory,
  NounsDaoLogicV2Harness,
  NounsDaoLogicV2Harness__factory as NounsDaoLogicV2HarnessFactory,
  NounsDaoProxy__factory as NounsDaoProxyFactory,
} from '../../../typechain';
import {
  address,
  deployNounsToken,
  getSigners,
  populateDescriptor,
  setTotalSupply,
  TestSigners,
} from '../../utils';

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
    const quorumVotes = await gov.dynamicQuorumVotes(12, {
      totalSupply: 200,
      minQuorumVotesBPS: 1000,
      maxQuorumVotesBPS: 5000,
      quorumPolynomCoefs: [0, 0, 0, 0],
    });

    expect(quorumVotes).to.equal(20);
  });

  describe('Linear function', async () => {
    it('increases linearly', async () => {
      const quorumVotes = await gov.dynamicQuorumVotes(12, {
        totalSupply: 200,
        minQuorumVotesBPS: 1000,
        maxQuorumVotesBPS: 5000,
        quorumPolynomCoefs: [0, parseUnits('1', 18), 0, 0],
      });

      expect(quorumVotes).to.equal(32);
    });
  });

  describe('Quadratic function', async () => {
    it('increases quadratically', async () => {
      const quorumVotes = await gov.dynamicQuorumVotes(20, {
        totalSupply: 200,
        minQuorumVotesBPS: 1000,
        maxQuorumVotesBPS: 5000,
        quorumPolynomCoefs: [0, 0, parseUnits('0.001'), 0],
      });

      ethers.utils.parseEther;

      expect(quorumVotes).to.equal(40);
    });
  });
});
