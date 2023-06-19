import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  Descriptor,
  Descriptor__factory as DescriptorFactory,
  DescriptorV2,
  VrbsDescriptorV2__factory as VrbsDescriptorV2Factory,
  VrbsToken,
  VrbsToken__factory as VrbsTokenFactory,
  Seeder,
  Seeder__factory as SeederFactory,
  WETH,
  WETH__factory as WethFactory,
  DAOLogicV1,
  VrbsDAOLogicV1Harness__factory as VrbsDaoLogicV1HarnessFactory,
  DAOLogicV2,
  DAOLogicV2__factory as DaoLogicV2Factory,
  VrbsDAOProxy__factory as VrbsDaoProxyFactory,
  VrbsDAOLogicV1Harness,
  VrbsDAOProxyV2__factory as VrbsDaoProxyV2Factory,
  VrbsArt__factory as VrbsArtFactory,
  SVGRenderer__factory as SVGRendererFactory,
  VrbsDAOExecutor__factory as VrbsDaoExecutorFactory,
  DAOLogicV1__factory as DaoLogicV1Factory,
  DAOExecutor,
  Inflator__factory,
  DAOStorageV2,
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

export const deployVrbsDescriptor = async (
  deployer?: SignerWithAddress,
): Promise<Descriptor> => {
  const signer = deployer || (await getSigners()).deployer;
  const nftDescriptorLibraryFactory = await ethers.getContractFactory('NFTDescriptor', signer);
  const nftDescriptorLibrary = await nftDescriptorLibraryFactory.deploy();
  const DescriptorFactory = new DescriptorFactory(
    {
      'contracts/libs/NFTDescriptor.sol:NFTDescriptor': nftDescriptorLibrary.address,
    },
    signer,
  );

  return DescriptorFactory.deploy();
};

export const deployVrbsDescriptorV2 = async (
  deployer?: SignerWithAddress,
): Promise<DescriptorV2> => {
  const signer = deployer || (await getSigners()).deployer;
  const nftDescriptorLibraryFactory = await ethers.getContractFactory('NFTDescriptorV2', signer);
  const nftDescriptorLibrary = await nftDescriptorLibraryFactory.deploy();
  const DescriptorFactory = new VrbsDescriptorV2Factory(
    {
      'contracts/libs/NFTDescriptorV2.sol:NFTDescriptorV2': nftDescriptorLibrary.address,
    },
    signer,
  );

  const renderer = await new SVGRendererFactory(signer).deploy();
  const descriptor = await DescriptorFactory.deploy(
    ethers.constants.AddressZero,
    renderer.address,
  );

  const inflator = await new Inflator__factory(signer).deploy();

  const art = await new VrbsArtFactory(signer).deploy(descriptor.address, inflator.address);
  await descriptor.setArt(art.address);

  return descriptor;
};

export const deployVrbsSeeder = async (deployer?: SignerWithAddress): Promise<Seeder> => {
  const factory = new SeederFactory(deployer || (await getSigners()).deployer);

  return factory.deploy();
};

export const deployVrbsToken = async (
  deployer?: SignerWithAddress,
  vrbsDAO?: string,
  minter?: string,
  descriptor?: string,
  seeder?: string,
  proxyRegistryAddress?: string,
): Promise<VrbsToken> => {
  const signer = deployer || (await getSigners()).deployer;
  const factory = new VrbsTokenFactory(signer);

  return factory.deploy(
    vrbsDAO || signer.address,
    minter || signer.address,
    descriptor || (await deployVrbsDescriptorV2(signer)).address,
    seeder || (await deployVrbsSeeder(signer)).address,
    proxyRegistryAddress || address(0),
  );
};

export const deployWeth = async (deployer?: SignerWithAddress): Promise<WETH> => {
  const factory = new WethFactory(deployer || (await getSigners()).deployer);

  return factory.deploy();
};

export const populateDescriptor = async (vrbsDescriptor: Descriptor): Promise<void> => {
  const { bgcolors, palette, images } = ImageData;
  const { bodies, accessories, heads, glasses } = images;

  // Split up head and accessory population due to high gas usage
  await Promise.all([
    vrbsDescriptor.addManyBackgrounds(bgcolors),
    vrbsDescriptor.addManyColorsToPalette(0, palette),
    vrbsDescriptor.addManyBodies(bodies.map(({ data }) => data)),
    chunkArray(accessories, 10).map(chunk =>
      vrbsDescriptor.addManyAccessories(chunk.map(({ data }) => data)),
    ),
    chunkArray(heads, 10).map(chunk =>
      vrbsDescriptor.addManyHeads(chunk.map(({ data }) => data)),
    ),
    vrbsDescriptor.addManyGlasses(glasses.map(({ data }) => data)),
  ]);
};

export const populateDescriptorV2 = async (vrbsDescriptor: DescriptorV2): Promise<void> => {
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

  await vrbsDescriptor.addManyBackgrounds(bgcolors);
  await vrbsDescriptor.setPalette(0, `0x000000${palette.join('')}`);
  await vrbsDescriptor.addBodies(bodiesCompressed, bodiesLength, bodiesCount);
  await vrbsDescriptor.addAccessories(accessoriesCompressed, accessoriesLength, accessoriesCount);
  await vrbsDescriptor.addHeads(headsCompressed, headsLength, headsCount);
  await vrbsDescriptor.addGlasses(glassesCompressed, glassesLength, glassesCount);
};

export const deployGovAndToken = async (
  deployer: SignerWithAddress,
  timelockDelay: number,
  proposalThresholdBPS: number,
  quorumVotesBPS: number,
  vetoer?: string,
): Promise<{ token: VrbsToken; gov: DAOLogicV1; timelock: DAOExecutor }> => {
  // nonce 0: Deploy DAOExecutor
  // nonce 1: Deploy DAOLogicV1
  // nonce 2: Deploy nftDescriptorLibraryFactory
  // nonce 3: Deploy SVGRenderer
  // nonce 4: Deploy Descriptor
  // nonce 5: Deploy Inflator
  // nonce 6: Deploy Art
  // nonce 7: Descriptor.setArt
  // nonce 8: Deploy Seeder
  // nonce 9: Deploy VrbsToken
  // nonce 10: Deploy DAOProxy
  // nonce 11+: populate Descriptor

  const govDelegatorAddress = ethers.utils.getContractAddress({
    from: deployer.address,
    nonce: (await deployer.getTransactionCount()) + 10,
  });

  // Deploy DAOExecutor with pre-computed Delegator address
  const timelock = await new VrbsDaoExecutorFactory(deployer).deploy(
    govDelegatorAddress,
    timelockDelay,
  );

  // Deploy Delegate
  const { address: govDelegateAddress } = await new DaoLogicV1Factory(deployer).deploy();
  // Deploy Vrbs token
  const token = await deployVrbsToken(deployer);

  // Deploy Delegator
  await new VrbsDaoProxyFactory(deployer).deploy(
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
  const gov = DaoLogicV1Factory.connect(govDelegatorAddress, deployer);

  await populateDescriptorV2(VrbsDescriptorV2Factory.connect(await token.descriptor(), deployer));

  return { token, gov, timelock };
};

export const deployGovV2AndToken = async (
  deployer: SignerWithAddress,
  timelockDelay: number,
  proposalThresholdBPS: number,
  quorumParams: DAOStorageV2.DynamicQuorumParamsStruct,
  vetoer?: string,
): Promise<{ token: VrbsToken; gov: DAOLogicV2; timelock: DAOExecutor }> => {
  const govDelegatorAddress = ethers.utils.getContractAddress({
    from: deployer.address,
    nonce: (await deployer.getTransactionCount()) + 10,
  });

  // Deploy DAOExecutor with pre-computed Delegator address
  const timelock = await new VrbsDaoExecutorFactory(deployer).deploy(
    govDelegatorAddress,
    timelockDelay,
  );

  // Deploy Delegate
  const { address: govDelegateAddress } = await new DaoLogicV2Factory(deployer).deploy();
  // Deploy Vrbs token
  const token = await deployVrbsToken(deployer);

  // Deploy Delegator
  await new VrbsDaoProxyV2Factory(deployer).deploy(
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
  const gov = DaoLogicV2Factory.connect(govDelegatorAddress, deployer);

  await populateDescriptorV2(VrbsDescriptorV2Factory.connect(await token.descriptor(), deployer));

  return { token, gov, timelock };
};

/**
 * Return a function used to mint `amount` Vrbs on the provided `token`
 * @param token The Vrbs ERC721 token
 * @param amount The number of Vrbs to mint
 */
export const MintVrbs = (
  token: VrbsToken,
  burnVrbsTokens = true,
): ((amount: number) => Promise<void>) => {
  return async (amount: number): Promise<void> => {
    for (let i = 0; i < amount; i++) {
      await token.mint();
    }
    if (!burnVrbsTokens) return;

    await setTotalSupply(token, amount);
  };
};

/**
 * Mints or burns tokens to target a total supply. Due to Vrbs' rewards tokens may be burned and tokenIds will not be sequential
 */
export const setTotalSupply = async (token: VrbsToken, newTotalSupply: number): Promise<void> => {
  const totalSupply = (await token.totalSupply()).toNumber();

  if (totalSupply < newTotalSupply) {
    for (let i = 0; i < newTotalSupply - totalSupply; i++) {
      await token.mint();
    }
    // If Vrbder's reward tokens were minted totalSupply will be more than expected, so run setTotalSupply again to burn extra tokens
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
): Promise<VrbsDAOLogicV1Harness> => {
  const { address: govDelegateAddress } = await new VrbsDaoLogicV1HarnessFactory(
    deployer,
  ).deploy();
  const params: Parameters<VrbsDaoProxyFactory['deploy']> = [
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
    await ethers.getContractFactory('DAOProxy', deployer)
  ).deploy(...params);

  return VrbsDaoLogicV1HarnessFactory.connect(_govDelegatorAddress, deployer);
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
): Promise<DAOLogicV2> => {
  const v2LogicContract = await new DaoLogicV2Factory(deployer).deploy();

  const proxy = await new VrbsDaoProxyV2Factory(deployer).deploy(
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

  return DaoLogicV2Factory.connect(proxy.address, deployer);
};

export const deployGovernorV2 = async (
  deployer: SignerWithAddress,
  proxyAddress: string,
): Promise<DAOLogicV2> => {
  const v2LogicContract = await new DaoLogicV2Factory(deployer).deploy();
  const proxy = VrbsDaoProxyFactory.connect(proxyAddress, deployer);
  await proxy._setImplementation(v2LogicContract.address);

  const govV2 = DaoLogicV2Factory.connect(proxyAddress, deployer);
  return govV2;
};

export const deployGovernorV2AndSetQuorumParams = async (
  deployer: SignerWithAddress,
  proxyAddress: string,
): Promise<DAOLogicV2> => {
  const govV2 = await deployGovernorV2(deployer, proxyAddress);
  await govV2._setDynamicQuorumParams(MIN_QUORUM_VOTES_BPS, MAX_QUORUM_VOTES_BPS, 0);

  return govV2;
};

export const propose = async (
  gov: DAOLogicV1 | DAOLogicV2,
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
