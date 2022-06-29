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
import { constants } from 'ethers';

chai.use(solidity);
const { expect } = chai;

describe('NounDelegatorFactoryModule', () => {
  let deployer: SignerWithAddress;
  let unauthorized: SignerWithAddress;
  let safe: Safe;
  let nounsToken: NounsToken;
  let delegatorImplementation: NounDelegator;
  let delegatorFactoryModule: NounDelegatorFactoryModule;
  let snapshotId: number;

  const NULL_BYTES = '0x';

  const createDelegator = async (nounIds = [0], wait = true) => {
    const tx: SafeTransactionDataPartial = {
      to: delegatorFactoryModule.address,
      data: delegatorFactoryModule.interface.encodeFunctionData('createDelegator', [
        { owner: deployer.address, nounIds },
      ]),
      value: '0',
    };
    const safeTx = await safe.createTransaction(tx);
    const { transactionResponse } = await safe.executeTransaction(safeTx);

    if (wait) {
      await transactionResponse?.wait();
    }
    return transactionResponse;
  };

  const createDelegators = async (delegatorNounIds = [[0], [1]], wait = true) => {
    const tx: SafeTransactionDataPartial = {
      to: delegatorFactoryModule.address,
      data: delegatorFactoryModule.interface.encodeFunctionData('createDelegators', [
        delegatorNounIds.map(nounIds => ({ owner: deployer.address, nounIds })),
      ]),
      value: '0',
    };
    const safeTx = await safe.createTransaction(tx);
    const { transactionResponse } = await safe.executeTransaction(safeTx);

    if (wait) {
      await transactionResponse?.wait();
    }
    return transactionResponse;
  };

  before(async () => {
    [deployer, unauthorized] = await ethers.getSigners();

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
    await (await nounsToken.transferFrom(deployer.address, safe.getAddress(), 1)).wait();

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

  it('should not allow `NounDelegatorFactoryModule.setup` to be called twice', async () => {
    const tx = delegatorFactoryModule.connect(unauthorized).setUp(NULL_BYTES);
    await expect(tx).to.be.revertedWith('Initializable: contract is already initialized');
  });

  it('should not allow an unauthorized address to create a delegator contract', async () => {
    const tx = delegatorFactoryModule.connect(unauthorized).createDelegator({
      owner: deployer.address,
      nounIds: [0],
    });
    await expect(tx).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('should not allow an unauthorized address to create many delegator contracts', async () => {
    const tx = delegatorFactoryModule.connect(unauthorized).createDelegators([
      {
        owner: deployer.address,
        nounIds: [0],
      },
      { owner: deployer.address, nounIds: [1] },
    ]);
    await expect(tx).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('should allow the safe to create a delegator contract', async () => {
    await createDelegator();

    const delegator = await delegatorFactoryModule.delegators(0);
    const delegatorBalance = await nounsToken.balanceOf(delegator);

    expect(delegator).to.not.equal(constants.AddressZero);
    expect(delegatorBalance).to.equal(1);
  });

  it('should allow the safe to create many delegator contracts', async () => {
    await createDelegators();

    const delegator1 = await delegatorFactoryModule.delegators(0);
    const delegator2 = await delegatorFactoryModule.delegators(1);
    const delegator1Balance = await nounsToken.balanceOf(delegator1);
    const delegator2Balance = await nounsToken.balanceOf(delegator2);

    expect(delegator1).to.not.equal(constants.AddressZero);
    expect(delegator2).to.not.equal(constants.AddressZero);
    expect(delegator1Balance).to.equal(1);
    expect(delegator2Balance).to.equal(1);
  });

  it('should not allow `NounDelegator.initialize` to be called twice', async () => {
    const tx = delegatorFactoryModule.connect(unauthorized).setUp(NULL_BYTES);
    await expect(tx).to.be.revertedWith('Initializable: contract is already initialized');
  });

  it('should not allow an unauthorized address to delegate Noun votes to a delegatee', async () => {
    await createDelegator();

    const address = await delegatorFactoryModule.delegators(0);
    const delegator = NounDelegatorFactory.connect(address, unauthorized);

    const tx = delegator.delegate(unauthorized.address);
    await expect(tx).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('should not allow an unauthorized address to withdraw a Noun to the Gnosis Safe', async () => {
    await createDelegator();

    const address = await delegatorFactoryModule.delegators(0);
    const delegator = NounDelegatorFactory.connect(address, unauthorized);

    const tx = delegator.withdraw(0);
    await expect(tx).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('should not allow an unauthorized address to emergency withdraw all Nouns', async () => {
    await createDelegator();

    const address = await delegatorFactoryModule.delegators(0);
    const delegator = NounDelegatorFactory.connect(address, unauthorized);

    const tx = delegator.emergencyWithdrawAll();
    await expect(tx).to.be.revertedWith('Sender is not the safe');
  });

  it('should allow the owner to delegate Noun votes to a delegatee', async () => {
    await createDelegator();

    const address = await delegatorFactoryModule.delegators(0);
    const delegator = NounDelegatorFactory.connect(address, deployer);

    const tx = await delegator.delegate(unauthorized.address);
    await tx.wait();

    const delegatee = await nounsToken.delegates(delegator.address);
    expect(delegatee).to.equal(unauthorized.address);
  });

  it('should allow the owner to withdraw a Noun to the Gnosis Safe', async () => {
    await createDelegator();

    const address = await delegatorFactoryModule.delegators(0);
    const delegator = NounDelegatorFactory.connect(address, deployer);
    const initialSafeBalance = await nounsToken.balanceOf(safe.getAddress());

    let delegatorBalance = await nounsToken.balanceOf(address);

    expect(delegatorBalance).to.equal(1);

    const tx = await delegator.withdraw(0);
    await tx.wait();

    delegatorBalance = await nounsToken.balanceOf(address);

    const currentSafeBalance = await nounsToken.balanceOf(safe.getAddress());

    expect(delegatorBalance).to.equal(0);
    expect(currentSafeBalance).to.equal(initialSafeBalance.add(1));
  });

  it('should allow the Gnosis Safe to emergency withdraw all Nouns', async () => {
    await createDelegator();

    const address = await delegatorFactoryModule.delegators(0);
    const delegator = NounDelegatorFactory.connect(address, deployer);
    const initialSafeBalance = await nounsToken.balanceOf(safe.getAddress());

    let delegatorBalance = await nounsToken.balanceOf(address);

    expect(delegatorBalance).to.equal(1);

    const tx: SafeTransactionDataPartial = {
      to: address,
      data: delegator.interface.encodeFunctionData('emergencyWithdrawAll'),
      value: '0',
    };
    const safeTx = await safe.createTransaction(tx);
    const { transactionResponse } = await safe.executeTransaction(safeTx);
    await transactionResponse?.wait();

    delegatorBalance = await nounsToken.balanceOf(address);

    const currentSafeBalance = await nounsToken.balanceOf(safe.getAddress());

    expect(delegatorBalance).to.equal(0);
    expect(currentSafeBalance).to.equal(initialSafeBalance.add(1));
  });
});
