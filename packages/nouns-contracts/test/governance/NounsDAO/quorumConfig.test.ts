import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import hardhat from 'hardhat';
import {
  deployNounsToken,
  getSigners,
  TestSigners,
  setTotalSupply,
  populateDescriptor,
  deployGovernorV2,
  deployGovernorV1,
  blockNumber,
} from '../../utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  NounsToken,
  NounsDescriptor__factory as NounsDescriptorFactory,
  NounsDaoLogicV2,
} from '../../../typechain';
import { MAX_QUORUM_VOTES_BPS, MIN_QUORUM_VOTES_BPS } from '../../constants';
import { parseUnits } from 'ethers/lib/utils';
import { BigNumberish } from 'ethers';

chai.use(solidity);
const { expect } = chai;

let token: NounsToken;
let deployer: SignerWithAddress;
let account0: SignerWithAddress;
let signers: TestSigners;
let gov: NounsDaoLogicV2;

async function setupWithV2() {
  token = await deployNounsToken(signers.deployer);

  await populateDescriptor(
    NounsDescriptorFactory.connect(await token.descriptor(), signers.deployer),
  );

  await setTotalSupply(token, 100);

  const { address: govProxyAddress } = await deployGovernorV1(deployer, token.address);
  gov = await deployGovernorV2(deployer, govProxyAddress);
}

describe('NounsDAO#_setDynamicQuorumParams', () => {
  before(async () => {
    signers = await getSigners();
    deployer = signers.deployer;
    account0 = signers.account0;

    await setupWithV2();
  });

  it('reverts when sender is not admin', async () => {
    await expect(
      gov.connect(account0)._setDynamicQuorumParams({
        minQuorumVotesBPS: 0,
        maxQuorumVotesBPS: 0,
        quorumVotesBPSOffset: 0,
        quorumPolynomCoefs: [0, 0],
      }),
    ).to.be.revertedWith('NounsDAO::_setDynamicQuorumParams: admin only');
  });

  it('reverts given minQuorum input below lower bound', async () => {
    await expect(
      gov._setDynamicQuorumParams({
        minQuorumVotesBPS: 199,
        maxQuorumVotesBPS: 0,
        quorumVotesBPSOffset: 0,
        quorumPolynomCoefs: [0, 0],
      }),
    ).to.be.revertedWith('NounsDAO::_setDynamicQuorumParams: invalid min quorum votes bps');
  });

  it('reverts given minQuorum input above upper bound', async () => {
    await expect(
      gov._setDynamicQuorumParams({
        minQuorumVotesBPS: 2001,
        maxQuorumVotesBPS: 0,
        quorumVotesBPSOffset: 0,
        quorumPolynomCoefs: [0, 0],
      }),
    ).to.be.revertedWith('NounsDAO::_setDynamicQuorumParams: invalid min quorum votes bps');
  });

  it('reverts given minQuorum input above maxQuorum BPs', async () => {
    await expect(
      gov._setDynamicQuorumParams({
        minQuorumVotesBPS: 202,
        maxQuorumVotesBPS: 201,
        quorumVotesBPSOffset: 0,
        quorumPolynomCoefs: [0, 0],
      }),
    ).to.be.revertedWith(
      'NounsDAO::_setDynamicQuorumParams: min quorum votes bps greater than max',
    );
  });

  it('reverts when maxQuorum input above upper bound', async () => {
    await expect(
      gov._setDynamicQuorumParams({
        minQuorumVotesBPS: 200,
        maxQuorumVotesBPS: 4001,
        quorumVotesBPSOffset: 0,
        quorumPolynomCoefs: [0, 0],
      }),
    ).to.be.revertedWith('NounsDAO::_setDynamicQuorumParams: invalid max quorum votes bps');
  });

  it('sets value and emits event', async () => {
    const quorumPolynomCoefs: [BigNumberish, BigNumberish] = [
      parseUnits('1', 18),
      parseUnits('0.001'),
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
});
