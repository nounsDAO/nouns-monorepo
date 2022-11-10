import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  NounsBRDescriptor,
  NounsBRDescriptor__factory as NounsBRDescriptorFactory,
  NounsBRDescriptorV2,
  NounsBRDescriptorV2__factory as NounsBRDescriptorV2Factory,
  NounsBRToken,
  NounsBRToken__factory as NounsBRTokenFactory,
  NounsBRSeeder,
  NounsBRSeeder__factory as NounsBRSeederFactory,
  WETH,
  WETH__factory as WethFactory,
  NounsBRDAOLogicV1,
  NounsBRDAOLogicV1Harness__factory as NounsBRDaoLogicV1HarnessFactory,
  NounsBRDAOLogicV2,
  NounsBRDAOLogicV2__factory as NounsBRDaoLogicV2Factory,
  NounsBRDAOProxy__factory as NounsBRDaoProxyFactory,
  NounsBRDAOLogicV1Harness,
  NounsBRDAOProxyV2__factory as NounsBRDaoProxyV2Factory,
  NounsBRArt__factory as NounsBRArtFactory,
  SVGRenderer__factory as SVGRendererFactory,
  NounsBRDAOExecutor__factory as NounsBRDaoExecutorFactory,
  NounsBRDAOLogicV1__factory as NounsBRDaoLogicV1Factory,
  NounsBRDAOExecutor,
  Inflator__factory,
  NounsBRDAOStorageV2,
} from '../typechain';
import ImageData from '../files/image-data-v1.json';
import ImageDataV2 from '../files/image-data-v2.json';
import { Block } from '@ethersproject/abstract-provider';
import { deflateRawSync } from 'zlib';
import { chunkArray } from '../utils';
import { MAX_QUORUM_VOTES_BPS, MIN_QUORUM_VOTES_BPS } from './constants';
import { DynamicQuorumParams } from './types';
import { BigNumber } from 'ethers';

export type TestSigners = {
  deployer: SignerWithAddress;
  account0: SignerWithAddress;
  account1: SignerWithAddress;
  account2: SignerWithAddress;
};

export const getSigners = async (): Promise<TestSigners> => {
  const [deployer, account0, account1, account2] = await ethers.getSigners();
  return {
    deployer,
    account0,
    account1,
    account2,
  };
};

export const deployNounsBRDescriptor = async (
  deployer?: SignerWithAddress,
): Promise<NounsBRDescriptor> => {
  const signer = deployer || (await getSigners()).deployer;
  const nftDescriptorLibraryFactory = await ethers.getContractFactory('NFTDescriptor', signer);
  const nftDescriptorLibrary = await nftDescriptorLibraryFactory.deploy();
  const nounsbrDescriptorFactory = new NounsBRDescriptorFactory(
    {
      'contracts/libs/NFTDescriptor.sol:NFTDescriptor': nftDescriptorLibrary.address,
    },
    signer,
  );

  return nounsbrDescriptorFactory.deploy();
};

export const deployNounsBRDescriptorV2 = async (
  deployer?: SignerWithAddress,
): Promise<NounsBRDescriptorV2> => {
  const signer = deployer || (await getSigners()).deployer;
  const nftDescriptorLibraryFactory = await ethers.getContractFactory('NFTDescriptorV2', signer);
  const nftDescriptorLibrary = await nftDescriptorLibraryFactory.deploy();
  const nounsbrDescriptorFactory = new NounsBRDescriptorV2Factory(
    {
      'contracts/libs/NFTDescriptorV2.sol:NFTDescriptorV2': nftDescriptorLibrary.address,
    },
    signer,
  );

  const renderer = await new SVGRendererFactory(signer).deploy();
  const descriptor = await nounsbrDescriptorFactory.deploy(
    ethers.constants.AddressZero,
    renderer.address,
  );

  const inflator = await new Inflator__factory(signer).deploy();

  const art = await new NounsBRArtFactory(signer).deploy(descriptor.address, inflator.address);
  await descriptor.setArt(art.address);

  return descriptor;
};

export const deployNounsBRSeeder = async (deployer?: SignerWithAddress): Promise<NounsBRSeeder> => {
  const factory = new NounsBRSeederFactory(deployer || (await getSigners()).deployer);

  return factory.deploy();
};

export const deployNounsBRToken = async (
  deployer?: SignerWithAddress,
  noundersbrDAO?: string,
  minter?: string,
  descriptor?: string,
  seeder?: string,
  proxyRegistryAddress?: string,
): Promise<NounsBRToken> => {
  const signer = deployer || (await getSigners()).deployer;
  const factory = new NounsBRTokenFactory(signer);

  return factory.deploy(
    noundersbrDAO || signer.address,
    minter || signer.address,
    descriptor || (await deployNounsBRDescriptorV2(signer)).address,
    seeder || (await deployNounsBRSeeder(signer)).address,
    proxyRegistryAddress || address(0),
  );
};

export const deployWeth = async (deployer?: SignerWithAddress): Promise<WETH> => {
  const factory = new WethFactory(deployer || (await getSigners()).deployer);

  return factory.deploy();
};

export const populateDescriptor = async (nounsbrDescriptor: NounsBRDescriptor): Promise<void> => {
  const { bgcolors, palette, images } = ImageData;
  const { bodies, accessories, heads, glasses } = images;

  // Split up head and accessory population due to high gas usage
  await Promise.all([
    nounsbrDescriptor.addManyBackgrounds(bgcolors),
    nounsbrDescriptor.addManyColorsToPalette(0, palette),
    nounsbrDescriptor.addManyBodies(bodies.map(({ data }) => data)),
    chunkArray(accessories, 10).map(chunk =>
      nounsbrDescriptor.addManyAccessories(chunk.map(({ data }) => data)),
    ),
    chunkArray(heads, 10).map(chunk => nounsbrDescriptor.addManyHeads(chunk.map(({ data }) => data))),
    nounsbrDescriptor.addManyGlasses(glasses.map(({ data }) => data)),
  ]);
};

export const populateDescriptorV2 = async (nounsbrDescriptor: NounsBRDescriptorV2): Promise<void> => {
  const { bgcolors, palette, images } = ImageDataV2;
  const { bodies, accessories, heads, glasses } = images;

  const {
    encodedCompressed: bodiesCompressed,
    originalLength: bodiesLength,
    itemCount: bodiesCount,
  } = dataToDescriptorInput(bodies.map(({ data }) => data));
  const {
    encodedCompressed: accessoriesCompressed,
    originalLength: accessoriesLength,
    itemCount: accessoriesCount,
  } = dataToDescriptorInput(accessories.map(({ data }) => data));
  const {
    encodedCompressed: headsCompressed,
    originalLength: headsLength,
    itemCount: headsCount,
  } = dataToDescriptorInput(heads.map(({ data }) => data));
  const {
    encodedCompressed: glassesCompressed,
    originalLength: glassesLength,
    itemCount: glassesCount,
  } = dataToDescriptorInput(glasses.map(({ data }) => data));

  await nounsbrDescriptor.addManyBackgrounds(bgcolors);
  await nounsbrDescriptor.setPalette(0, `0x000000${palette.join('')}`);
  await nounsbrDescriptor.addBodies(bodiesCompressed, bodiesLength, bodiesCount);
  await nounsbrDescriptor.addAccessories(accessoriesCompressed, accessoriesLength, accessoriesCount);
  await nounsbrDescriptor.addHeads(headsCompressed, headsLength, headsCount);
  await nounsbrDescriptor.addGlasses(glassesCompressed, glassesLength, glassesCount);
};

export const deployGovAndToken = async (
  deployer: SignerWithAddress,
  timelockDelay: number,
  proposalThresholdBPS: number,
  quorumVotesBPS: number,
  vetoer?: string,
): Promise<{ token: NounsBRToken; gov: NounsBRDAOLogicV1; timelock: NounsBRDAOExecutor }> => {
  // nonce 0: Deploy NounsBRDAOExecutor
  // nonce 1: Deploy NounsBRDAOLogicV1
  // nonce 2: Deploy nftDescriptorLibraryFactory
  // nonce 3: Deploy SVGRenderer
  // nonce 4: Deploy NounsBRDescriptor
  // nonce 5: Deploy Inflator
  // nonce 6: Deploy NounsBRArt
  // nonce 7: NounsBRDescriptor.setArt
  // nonce 8: Deploy NounsBRSeeder
  // nonce 9: Deploy NounsBRToken
  // nonce 10: Deploy NounsBRDAOProxy
  // nonce 11+: populate Descriptor

  const govDelegatorAddress = ethers.utils.getContractAddress({
    from: deployer.address,
    nonce: (await deployer.getTransactionCount()) + 10,
  });

  // Deploy NounsBRDAOExecutor with pre-computed Delegator address
  const timelock = await new NounsBRDaoExecutorFactory(deployer).deploy(
    govDelegatorAddress,
    timelockDelay,
  );

  // Deploy Delegate
  const { address: govDelegateAddress } = await new NounsBRDaoLogicV1Factory(deployer).deploy();
  // Deploy NounsBR token
  const token = await deployNounsBRToken(deployer);

  // Deploy Delegator
  await new NounsBRDaoProxyFactory(deployer).deploy(
    timelock.address,
    token.address,
    vetoer || address(0),
    timelock.address,
    govDelegateAddress,
    5760,
    1,
    proposalThresholdBPS,
    quorumVotesBPS,
  );

  // Cast Delegator as Delegate
  const gov = NounsBRDaoLogicV1Factory.connect(govDelegatorAddress, deployer);

  await populateDescriptorV2(NounsBRDescriptorV2Factory.connect(await token.descriptor(), deployer));

  return { token, gov, timelock };
};

export const deployGovV2AndToken = async (
  deployer: SignerWithAddress,
  timelockDelay: number,
  proposalThresholdBPS: number,
  quorumParams: NounsBRDAOStorageV2.DynamicQuorumParamsStruct,
  vetoer?: string,
): Promise<{ token: NounsBRToken; gov: NounsBRDAOLogicV2; timelock: NounsBRDAOExecutor }> => {
  const govDelegatorAddress = ethers.utils.getContractAddress({
    from: deployer.address,
    nonce: (await deployer.getTransactionCount()) + 10,
  });

  // Deploy NounsBRDAOExecutor with pre-computed Delegator address
  const timelock = await new NounsBRDaoExecutorFactory(deployer).deploy(
    govDelegatorAddress,
    timelockDelay,
  );

  // Deploy Delegate
  const { address: govDelegateAddress } = await new NounsBRDaoLogicV2Factory(deployer).deploy();
  // Deploy NounsBR token
  const token = await deployNounsBRToken(deployer);

  // Deploy Delegator
  await new NounsBRDaoProxyV2Factory(deployer).deploy(
    timelock.address,
    token.address,
    vetoer || address(0),
    timelock.address,
    govDelegateAddress,
    5760,
    1,
    proposalThresholdBPS,
    quorumParams,
  );

  // Cast Delegator as Delegate
  const gov = NounsBRDaoLogicV2Factory.connect(govDelegatorAddress, deployer);

  await populateDescriptorV2(NounsBRDescriptorV2Factory.connect(await token.descriptor(), deployer));

  return { token, gov, timelock };
};

/**
 * Return a function used to mint `amount` NounsBR on the provided `token`
 * @param token The NounsBR ERC721 token
 * @param amount The number of NounsBR to mint
 */
export const MintNounsBR = (
  token: NounsBRToken,
  burnNoundersBRBRTokens = true,
): ((amount: number) => Promise<void>) => {
  return async (amount: number): Promise<void> => {
    for (let i = 0; i < amount; i++) {
      await token.mint();
    }
    if (!burnNoundersBRBRTokens) return;

    await setTotalSupply(token, amount);
  };
};

/**
 * Mints or burns tokens to target a total supply. Due to NoundersBRBR' rewards tokens may be burned and tokenIds will not be sequential
 */
export const setTotalSupply = async (token: NounsBRToken, newTotalSupply: number): Promise<void> => {
  const totalSupply = (await token.totalSupply()).toNumber();

  if (totalSupply < newTotalSupply) {
    for (let i = 0; i < newTotalSupply - totalSupply; i++) {
      await token.mint();
    }
    // If NounderBRBR's reward tokens were minted totalSupply will be more than expected, so run setTotalSupply again to burn extra tokens
    await setTotalSupply(token, newTotalSupply);
  }

  if (totalSupply > newTotalSupply) {
    for (let i = newTotalSupply; i < totalSupply; i++) {
      await token.burn(i);
    }
  }
};

// The following adapted from `https://github.com/compound-finance/compound-protocol/blob/master/tests/Utils/Ethereum.js`

const rpc = <T = unknown>({
  method,
  params,
}: {
  method: string;
  params?: unknown[];
}): Promise<T> => {
  return network.provider.send(method, params);
};

export const encodeParameters = (types: string[], values: unknown[]): string => {
  const abi = new ethers.utils.AbiCoder();
  return abi.encode(types, values);
};

export const blockByNumber = async (n: number | string): Promise<Block> => {
  return rpc({ method: 'eth_getBlockByNumber', params: [n, false] });
};

export const increaseTime = async (seconds: number): Promise<unknown> => {
  await rpc({ method: 'evm_increaseTime', params: [seconds] });
  return rpc({ method: 'evm_mine' });
};

export const freezeTime = async (seconds: number): Promise<unknown> => {
  await rpc({ method: 'evm_increaseTime', params: [-1 * seconds] });
  return rpc({ method: 'evm_mine' });
};

export const advanceBlocks = async (blocks: number): Promise<void> => {
  for (let i = 0; i < blocks; i++) {
    await mineBlock();
  }
};

export const blockNumber = async (parse = true): Promise<number> => {
  const result = await rpc<number>({ method: 'eth_blockNumber' });
  return parse ? parseInt(result.toString()) : result;
};

export const blockTimestamp = async (
  n: number | string,
  parse = true,
): Promise<number | string> => {
  const block = await blockByNumber(n);
  return parse ? parseInt(block.timestamp.toString()) : block.timestamp;
};

export const setNextBlockBaseFee = async (value: BigNumber): Promise<void> => {
  await network.provider.send('hardhat_setNextBlockBaseFeePerGas', [value.toHexString()]);
};

export const setNextBlockTimestamp = async (n: number, mine = true): Promise<void> => {
  await rpc({ method: 'evm_setNextBlockTimestamp', params: [n] });
  if (mine) await mineBlock();
};

export const minerStop = async (): Promise<void> => {
  await network.provider.send('evm_setAutomine', [false]);
  await network.provider.send('evm_setIntervalMining', [0]);
};

export const minerStart = async (): Promise<void> => {
  await network.provider.send('evm_setAutomine', [true]);
};

export const mineBlock = async (): Promise<void> => {
  await network.provider.send('evm_mine');
};

export const chainId = async (): Promise<number> => {
  return parseInt(await network.provider.send('eth_chainId'), 16);
};

export const address = (n: number): string => {
  return `0x${n.toString(16).padStart(40, '0')}`;
};

export const propStateToString = (stateInt: number): string => {
  const states: string[] = [
    'Pending',
    'Active',
    'Canceled',
    'Defeated',
    'Succeeded',
    'Queued',
    'Expired',
    'Executed',
    'Vetoed',
  ];
  return states[stateInt];
};

export const deployGovernorV1 = async (
  deployer: SignerWithAddress,
  tokenAddress: string,
  quorumVotesBPs: number = MIN_QUORUM_VOTES_BPS,
): Promise<NounsBRDAOLogicV1Harness> => {
  const { address: govDelegateAddress } = await new NounsBRDaoLogicV1HarnessFactory(
    deployer,
  ).deploy();
  const params: Parameters<NounsBRDaoProxyFactory['deploy']> = [
    address(0),
    tokenAddress,
    deployer.address,
    deployer.address,
    govDelegateAddress,
    1728,
    1,
    1,
    quorumVotesBPs,
  ];

  const { address: _govDelegatorAddress } = await (
    await ethers.getContractFactory('NounsBRDAOProxy', deployer)
  ).deploy(...params);

  return NounsBRDaoLogicV1HarnessFactory.connect(_govDelegatorAddress, deployer);
};

export const deployGovernorV2WithV2Proxy = async (
  deployer: SignerWithAddress,
  tokenAddress: string,
  timelockAddress?: string,
  vetoerAddress?: string,
  votingPeriod?: number,
  votingDelay?: number,
  proposalThresholdBPs?: number,
  dynamicQuorumParams?: DynamicQuorumParams,
): Promise<NounsBRDAOLogicV2> => {
  const v2LogicContract = await new NounsBRDaoLogicV2Factory(deployer).deploy();

  const proxy = await new NounsBRDaoProxyV2Factory(deployer).deploy(
    timelockAddress || deployer.address,
    tokenAddress,
    vetoerAddress || deployer.address,
    deployer.address,
    v2LogicContract.address,
    votingPeriod || 5760,
    votingDelay || 1,
    proposalThresholdBPs || 1,
    dynamicQuorumParams || {
      minQuorumVotesBPS: MIN_QUORUM_VOTES_BPS,
      maxQuorumVotesBPS: MAX_QUORUM_VOTES_BPS,
      quorumCoefficient: 0,
    },
  );

  return NounsBRDaoLogicV2Factory.connect(proxy.address, deployer);
};

export const deployGovernorV2 = async (
  deployer: SignerWithAddress,
  proxyAddress: string,
): Promise<NounsBRDAOLogicV2> => {
  const v2LogicContract = await new NounsBRDaoLogicV2Factory(deployer).deploy();
  const proxy = NounsBRDaoProxyFactory.connect(proxyAddress, deployer);
  await proxy._setImplementation(v2LogicContract.address);

  const govV2 = NounsBRDaoLogicV2Factory.connect(proxyAddress, deployer);
  return govV2;
};

export const deployGovernorV2AndSetQuorumParams = async (
  deployer: SignerWithAddress,
  proxyAddress: string,
): Promise<NounsBRDAOLogicV2> => {
  const govV2 = await deployGovernorV2(deployer, proxyAddress);
  await govV2._setDynamicQuorumParams(MIN_QUORUM_VOTES_BPS, MAX_QUORUM_VOTES_BPS, 0);

  return govV2;
};

export const propose = async (
  gov: NounsBRDAOLogicV1 | NounsBRDAOLogicV2,
  proposer: SignerWithAddress,
  stubPropUserAddress: string = address(0),
) => {
  const targets = [stubPropUserAddress];
  const values = ['0'];
  const signatures = ['getBalanceOf(address)'];
  const callDatas = [encodeParameters(['address'], [stubPropUserAddress])];

  await gov.connect(proposer).propose(targets, values, signatures, callDatas, 'do nothing');
  return await gov.latestProposalIds(proposer.address);
};

function dataToDescriptorInput(data: string[]): {
  encodedCompressed: string;
  originalLength: number;
  itemCount: number;
} {
  const abiEncoded = ethers.utils.defaultAbiCoder.encode(['bytes[]'], [data]);
  const encodedCompressed = `0x${deflateRawSync(
    Buffer.from(abiEncoded.substring(2), 'hex'),
  ).toString('hex')}`;

  const originalLength = abiEncoded.substring(2).length / 2;
  const itemCount = data.length;

  return {
    encodedCompressed,
    originalLength,
    itemCount,
  };
}
