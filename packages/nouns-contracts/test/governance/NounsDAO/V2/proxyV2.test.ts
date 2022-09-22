import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import {
  deployNounsToken,
  getSigners,
  TestSigners,
  setTotalSupply,
  blockNumber,
  deployGovernorV2WithV2Proxy,
  populateDescriptorV2,
} from '../../../utils';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  NounsToken,
  NounsDescriptorV2__factory as NounsDescriptorV2Factory,
  NounsDAOLogicV2,
} from '../../../../typechain';
import { MAX_QUORUM_VOTES_BPS, MIN_QUORUM_VOTES_BPS } from '../../../constants';

chai.use(solidity);
const { expect } = chai;

let token: NounsToken;
let deployer: SignerWithAddress;
let signers: TestSigners;

let govV2: NounsDAOLogicV2;

async function setup() {
  token = await deployNounsToken(signers.deployer);

  await populateDescriptorV2(
    NounsDescriptorV2Factory.connect(await token.descriptor(), signers.deployer),
  );

  await setTotalSupply(token, 100);
}

describe('NounsDAOProxyV2', () => {
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
