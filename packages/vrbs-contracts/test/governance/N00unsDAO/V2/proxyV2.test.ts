import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import {
  deployN00unsToken,
  getSigners,
  TestSigners,
  setTotalSupply,
  blockNumber,
  deployGovernorV2WithV2Proxy,
  populateDescriptorV2,
} from '../../../utils';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  N00unsToken,
  N00unsDescriptorV2__factory as N00unsDescriptorV2Factory,
  N00unsDAOLogicV2,
} from '../../../../typechain';
import { MAX_QUORUM_VOTES_BPS, MIN_QUORUM_VOTES_BPS } from '../../../constants';

chai.use(solidity);
const { expect } = chai;

let token: N00unsToken;
let deployer: SignerWithAddress;
let signers: TestSigners;

let govV2: N00unsDAOLogicV2;

async function setup() {
  token = await deployN00unsToken(signers.deployer);

  await populateDescriptorV2(
    N00unsDescriptorV2Factory.connect(await token.descriptor(), signers.deployer),
  );

  await setTotalSupply(token, 100);
}

describe('N00unsDAOProxyV2', () => {
  before(async () => {
    signers = await getSigners();
    deployer = signers.deployer;

    await setup();
  });

  it('Deploys successfully', async () => {
    govV2 = await deployGovernorV2WithV2Proxy(
      deployer,
      token.address,
      deployer.address,
      deployer.address,
      5760,
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
    expect(await govV2.votingPeriod()).to.equal(5760);
    expect(await govV2.timelock()).to.equal(deployer.address);
  });

  it('Sets quorum params as expected', async () => {
    const params = await govV2.getDynamicQuorumParamsAt(await blockNumber());
    expect(params.quorumCoefficient).to.equal(3);
  });
});
