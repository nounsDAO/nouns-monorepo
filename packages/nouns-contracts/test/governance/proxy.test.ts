import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import {
  deployNounsToken,
  getSigners,
  TestSigners,
  setTotalSupply,
  blockNumber,
  populateDescriptorV2,
  deployGovernorV3WithV3Proxy,
} from '../utils';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  NounsToken,
  NounsDescriptorV2__factory as NounsDescriptorV2Factory,
  NounsDAOLogicV4,
} from '../../typechain';
import { MAX_QUORUM_VOTES_BPS, MIN_QUORUM_VOTES_BPS } from '../constants';

chai.use(solidity);
const { expect } = chai;

let token: NounsToken;
let deployer: SignerWithAddress;
let signers: TestSigners;
let gov: NounsDAOLogicV4;

async function setup() {
  token = await deployNounsToken(signers.deployer);

  await populateDescriptorV2(
    NounsDescriptorV2Factory.connect(await token.descriptor(), signers.deployer),
  );

  await setTotalSupply(token, 100);
}

describe('NounsDAOProxyV3', () => {
  before(async () => {
    signers = await getSigners();
    deployer = signers.deployer;

    await setup();
  });

  it('Deploys successfully', async () => {
    gov = await deployGovernorV3WithV3Proxy(
      deployer,
      token.address,
      deployer.address,
      deployer.address,
      deployer.address,
      7200,
      1,
      1,
      {
        minQuorumVotesBPS: MIN_QUORUM_VOTES_BPS,
        maxQuorumVotesBPS: MAX_QUORUM_VOTES_BPS,
        quorumCoefficient: 3,
      },
    );
  });

  it('Sets some basic parameters as expected', async () => {
    expect(await gov.votingPeriod()).to.equal(7200);
    expect(await gov.timelock()).to.equal(deployer.address);
  });

  it('Sets quorum params as expected', async () => {
    const params = await gov.getDynamicQuorumParamsAt(await blockNumber());
    expect(params.quorumCoefficient).to.equal(3);
  });
});
