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
} from '../../utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  NounsToken,
  NounsDescriptor__factory as NounsDescriptorFactory,
  NounsDaoLogicV2,
} from '../../../typechain';
import { MAX_QUORUM_VOTES_BPS, MIN_QUORUM_VOTES_BPS } from '../../constants';

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

describe('NounsDAO#quorumConfig', () => {
  before(async () => {
    signers = await getSigners();
    deployer = signers.deployer;
    account0 = signers.account0;

    await setupWithV2();
  });

  describe('_setMinQuorumVotesBPS', async () => {
    it('reverts when sender is not admin', async () => {
      await expect(gov.connect(account0)._setMinQuorumVotesBPS(234)).to.be.revertedWith(
        'NounsDAO::_setMinQuorumVotesBPS: admin only',
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

    it('reverts given input above max BPs', async () => {
      await expect(gov._setMinQuorumVotesBPS(1901)).to.be.revertedWith(
        'NounsDAO::_setMinQuorumVotesBPS: min quorum votes bps greater than max',
      );
    });

    it('sets value and emits event', async () => {
      const tx = await gov._setMinQuorumVotesBPS(234);

      expect(await gov.minQuorumVotesBPS()).to.equal(234);
      await expect(tx).to.emit(gov, 'MinQuorumVotesBPSSet').withArgs(MIN_QUORUM_VOTES_BPS, 234);
    });
  });

  describe('_setMaxQuorumVotesBPS', async () => {
    it('reverts when sender is not admin', async () => {
      await expect(gov.connect(account0)._setMaxQuorumVotesBPS(2345)).to.be.revertedWith(
        'NounsDAO::_setMaxQuorumVotesBPS: admin only',
      );
    });

    it('reverts when input below min quorum', async () => {
      await expect(gov._setMaxQuorumVotesBPS(199)).to.be.revertedWith(
        'NounsDAO::_setMaxQuorumVotesBPS: invalid max quorum votes bps',
      );
    });

    it('reverts when input above upper bound', async () => {
      await expect(gov._setMaxQuorumVotesBPS(4001)).to.be.revertedWith(
        'NounsDAO::_setMaxQuorumVotesBPS: invalid max quorum votes bps',
      );
    });

    it('sets value and emits event', async () => {
      const tx = await gov._setMaxQuorumVotesBPS(2345);

      expect(await gov.maxQuorumVotesBPS()).to.equal(2345);
      await expect(tx).to.emit(gov, 'MaxQuorumVotesBPSSet').withArgs(MAX_QUORUM_VOTES_BPS, 2345);
    });
  });
});
