import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';
import {
  NounDelegator,
  NounDelegatorFactoryModule,
  NounDelegator__factory as NounDelegatorFactory,
  NounDelegatorFactoryModule__factory as NounDelegatorFactoryModuleFactory,
  GnosisSafeMasterCopy__factory as GnosisSafeMasterCopyFactory,
  GnosisSafeProxyCreator__factory as GnosisSafeProxyCreatorFactory,
  GnosisSafeMultiSend__factory as GnosisSafeMultiSendFactory,
  NounsDescriptor__factory as NounsDescriptorFactory,
  NounsToken,
} from '../../../typechain';
import { deployNounsToken, populateDescriptor } from '../../utils';
import Safe, { ContractNetworksConfig, EthersAdapter, SafeFactory } from '@gnosis.pm/safe-core-sdk';
import { SafeTransactionDataPartial } from '@gnosis.pm/safe-core-sdk-types';

chai.use(solidity);
const { expect } = chai;

describe('NounDelegatorFactoryModule', () => {
  let deployer: SignerWithAddress;
  let safe: Safe;
  let nounsToken: NounsToken;
  let delegatorImplementation: NounDelegator;
  let delegatorFactoryModule: NounDelegatorFactoryModule;
  let snapshotId: number;

  before(async () => {
    [deployer] = await ethers.getSigners();

    // Deploy and setup Gnosis Safe
    const ethAdapter = new EthersAdapter({
      ethers,
      signer: deployer,
    });
    const id = await ethAdapter.getChainId();
    const multiSend = await new GnosisSafeMultiSendFactory(deployer).deploy();
    const masterCopy = await new GnosisSafeMasterCopyFactory(deployer).deploy();
    const proxyFactory = await new GnosisSafeProxyCreatorFactory(deployer).deploy();
    const contractNetworks: ContractNetworksConfig = {
      [id]: {
        multiSendAddress: multiSend.address,
        safeMasterCopyAddress: masterCopy.address,
        safeProxyFactoryAddress: proxyFactory.address,
      },
    };
    const safeFactory = await SafeFactory.create({ ethAdapter, contractNetworks });
    safe = await safeFactory.deploySafe({
      owners: [deployer.address],
      threshold: 1,
    });

    // Deploy and setup Nouns token contract
    nounsToken = await deployNounsToken(deployer, safe.getAddress());
    await populateDescriptor(
      NounsDescriptorFactory.connect(await nounsToken.descriptor(), deployer),
    );
    await (await nounsToken.mint()).wait();

    // Deploy and enable delegator module
    const delegatorImplementationFactory = new NounDelegatorFactory(deployer);
    delegatorImplementation = await delegatorImplementationFactory.deploy();
    const moduleFactory = new NounDelegatorFactoryModuleFactory(deployer);
    delegatorFactoryModule = await moduleFactory.deploy(
      safe.getAddress(),
      safe.getAddress(),
      safe.getAddress(),
      nounsToken.address,
      delegatorImplementation.address,
    );
    await safe.executeTransaction(await safe.getEnableModuleTx(delegatorFactoryModule.address));
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('should allow the safe to create a delegator contract', async () => {
    const tx: SafeTransactionDataPartial = {
      to: delegatorFactoryModule.address,
      data: delegatorFactoryModule.interface.encodeFunctionData('createDelegator', [
        { owner: deployer.address, nounIds: [0] },
      ]),
      value: '0',
    };
    const safeTx = await safe.createTransaction(tx);
    const response = await safe.executeTransaction(safeTx);

    expect(response.hash).to.be.a.string('0x');
  });
});
