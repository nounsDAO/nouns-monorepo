import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  NDescriptor,
  NDescriptor__factory as NDescriptorFactory,
  NDescriptorV2,
  NDescriptorV2__factory as NDescriptorV2Factory,
  NToken,
  NToken__factory as NTokenFactory,
  CryptopunksMock,
  CryptopunksMock__factory as CryptopunksMockFactory,
  WrappedPunkMock,
  WrappedPunkMock__factory as WrappedPunkMockFactory,
  CryptopunksVote,
  CryptopunksVote__factory as CryptopunksVoteFactory,
  NSeeder,
  NSeeder__factory as NSeederFactory,
  WETH,
  WETH__factory as WethFactory,
  NArt__factory as NArtFactory,
  SVGRenderer__factory as SVGRendererFactory,
  NDAOExecutor__factory as NDaoExecutorFactory,
  NDAOLogicV1__factory as NDaoLogicV1Factory,
  NDAOProxy__factory as NDaoProxyFactory,
  NDAOLogicV1,
  NDAOExecutor,
  Inflator__factory,
} from '../typechain';
import ImageData from '../files/image-data-v1.json';
import ImageDataV2 from '../files/image-data-v2.json';
import probDoc from '../../punks-assets/src/config/probability.json'
import { Block } from '@ethersproject/abstract-provider';
import { deflateRawSync } from 'zlib';
import { chunkArray } from '../utils';

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

export const deployNDescriptor = async (
  deployer?: SignerWithAddress,
): Promise<NDescriptor> => {
  const signer = deployer || (await getSigners()).deployer;
  const nftDescriptorLibraryFactory = await ethers.getContractFactory('NFTDescriptor', signer);
  const nftDescriptorLibrary = await nftDescriptorLibraryFactory.deploy();
  const nounsDescriptorFactory = new NDescriptorFactory(
    {
      'contracts/libs/NFTDescriptor.sol:NFTDescriptor': nftDescriptorLibrary.address,
    },
    signer,
  );

  return nounsDescriptorFactory.deploy();
};

export const deployNDescriptorV2 = async (
  deployer?: SignerWithAddress,
): Promise<NDescriptorV2> => {
  const signer = deployer || (await getSigners()).deployer;
  const nftDescriptorLibraryFactory = await ethers.getContractFactory('NFTDescriptorV2', signer);
  const nftDescriptorLibrary = await nftDescriptorLibraryFactory.deploy();
  const nounsDescriptorFactory = new NDescriptorV2Factory(
    {
      'contracts/libs/NFTDescriptorV2.sol:NFTDescriptorV2': nftDescriptorLibrary.address,
    },
    signer,
  );

  const renderer = await new SVGRendererFactory(signer).deploy();
  const descriptor = await nounsDescriptorFactory.deploy(
    ethers.constants.AddressZero,
    renderer.address,
  );

  const inflator = await new Inflator__factory(signer).deploy();

  const art = await new NArtFactory(signer).deploy(descriptor.address, inflator.address);
  await descriptor.setArt(art.address);

  return descriptor;
};

export const deployNSeeder = async (deployer?: SignerWithAddress): Promise<NSeeder> => {
  const factory = new NSeederFactory(deployer || (await getSigners()).deployer);

  return factory.deploy();
};

export const deployNToken = async (
  deployer?: SignerWithAddress,
  noundersDAO?: string,
  minter?: string,
  descriptor?: string,
  seeder?: string,
): Promise<NToken> => {
  const signer = deployer || (await getSigners()).deployer;
  const factory = new NTokenFactory(signer);

  return factory.deploy(
    noundersDAO || signer.address,
    minter || signer.address,
    descriptor || (await deployNDescriptorV2(signer)).address,
    seeder || (await deployNSeeder(signer)).address,
  );
};

export const deployCryptopunksVote = async (
  deployer?: SignerWithAddress,
): Promise<{cryptopunks: CryptopunksMock, wrappedPunk: WrappedPunkMock, cryptopunksVote: CryptopunksVote}> => {
  const signer = deployer || (await getSigners()).deployer;

  const cryptopunksMockFactory = new CryptopunksMockFactory(signer);
  const wrappedPunkFactory = new WrappedPunkMockFactory(signer);
  const cryptopunksVoteFactory = new CryptopunksVoteFactory(signer);

  const cryptopunks = await cryptopunksMockFactory.deploy();
  const wrappedPunk = await wrappedPunkFactory.deploy(cryptopunks.address);
  const cryptopunksVote = await cryptopunksVoteFactory.deploy(cryptopunks.address, wrappedPunk.address);

  return {cryptopunks, wrappedPunk, cryptopunksVote};
};

export const deployWeth = async (deployer?: SignerWithAddress): Promise<WETH> => {
  const factory = new WethFactory(deployer || (await getSigners()).deployer);

  return factory.deploy();
};

export const populateDescriptor = async (nDescriptor: NDescriptor): Promise<void> => {
  const { /*bgcolors, */palette, images } = ImageDataV2;
  const { types, necks, cheekses, faces, beards, mouths, earses, hats, helmets, hairs, teeths, lipses, emotions, eyeses, glasseses, goggleses, noses } = images;

  // await nDescriptor.addManyBackgrounds(bgcolors);
  await nDescriptor.addManyColorsToPalette(0, palette);

  const options = { gasLimit: 30000000 };

  await nDescriptor.addManyPunkTypes(types.map(({ data }) => data));
  await nDescriptor.addManyNecks(necks.map(({ data }) => data));
  await nDescriptor.addManyCheekses(cheekses.map(({ data }) => data));
  await nDescriptor.addManyFaces(faces.map(({ data }) => data));
  await nDescriptor.addManyBeards(beards.map(({ data }) => data));
  await nDescriptor.addManyMouths(mouths.map(({ data }) => data));
  await nDescriptor.addManyEarses(earses.map(({ data }) => data));
  await nDescriptor.addManyHats(hats.map(({ data }) => data));
  await nDescriptor.addManyHelmets(helmets.map(({ data }) => data));
  await nDescriptor.addManyHairs(hairs.map(({ data }) => data));
  await nDescriptor.addManyTeeths(teeths.map(({ data }) => data));
  await nDescriptor.addManyLipses(lipses.map(({ data }) => data));
  await nDescriptor.addManyEmotions(emotions.map(({ data }) => data));
  await nDescriptor.addManyEyeses(eyeses.map(({ data }) => data));
  await nDescriptor.addManyGlasseses(glasseses.map(({ data }) => data));
  await nDescriptor.addManyGoggleses(goggleses.map(({ data }) => data));
  await nDescriptor.addManyNoses(noses.map(({ data }) => data));
};

export const populateDescriptorV2 = async (nDescriptor: NDescriptorV2): Promise<void> => {
  const { /*bgcolors, */palette, images } = ImageDataV2;
  const { types, necks, cheekses, faces, beards, mouths, earses, hats, helmets, hairs, teeths, lipses, emotions, eyeses, glasseses, goggleses, noses } = images;

  const typesPage = dataToDescriptorInput(types.map(({ data }) => data));
  const necksPage = dataToDescriptorInput(necks.map(({ data }) => data));
  const cheeksesPage = dataToDescriptorInput(cheekses.map(({ data }) => data));
  const facesPage = dataToDescriptorInput(faces.map(({ data }) => data));
  const beardsPage = dataToDescriptorInput(beards.map(({ data }) => data));
  const mouthsPage = dataToDescriptorInput(mouths.map(({ data }) => data));
  const earsesPage = dataToDescriptorInput(earses.map(({ data }) => data));
  const hatsPage = dataToDescriptorInput(hats.map(({ data }) => data));
  const helmetsPage = dataToDescriptorInput(helmets.map(({ data }) => data));
  const hairsPage = dataToDescriptorInput(hairs.map(({ data }) => data));
  const teethsPage = dataToDescriptorInput(teeths.map(({ data }) => data));
  const lipsesPage = dataToDescriptorInput(lipses.map(({ data }) => data));
  const emotionsPage = dataToDescriptorInput(emotions.map(({ data }) => data));
  const eyesesPage = dataToDescriptorInput(eyeses.map(({ data }) => data));
  const glassesesPage = dataToDescriptorInput(glasseses.map(({ data }) => data));
  const gogglesesPage = dataToDescriptorInput(goggleses.map(({ data }) => data));
  const nosesPage = dataToDescriptorInput(noses.map(({ data }) => data));

  // await nDescriptor.addManyBackgrounds(bgcolors);
  await nDescriptor.setPalette(0, `0x00000000${palette.join('')}`);

  const options = { gasLimit: 30000000 };

  await nDescriptor.addPunkTypes(
    typesPage.encodedCompressed,
    typesPage.originalLength,
    typesPage.itemCount,
    options,
  );
  await nDescriptor.addNecks(
    necksPage.encodedCompressed,
    necksPage.originalLength,
    necksPage.itemCount,
    options,
  );
  await nDescriptor.addCheekses(
    cheeksesPage.encodedCompressed,
    cheeksesPage.originalLength,
    cheeksesPage.itemCount,
    options,
  );
  await nDescriptor.addFaces(
    facesPage.encodedCompressed,
    facesPage.originalLength,
    facesPage.itemCount,
    options,
  );
  await nDescriptor.addBeards(
    beardsPage.encodedCompressed,
    beardsPage.originalLength,
    beardsPage.itemCount,
    options,
  );
  await nDescriptor.addMouths(
    mouthsPage.encodedCompressed,
    mouthsPage.originalLength,
    mouthsPage.itemCount,
    options,
  );
  await nDescriptor.addEarses(
    earsesPage.encodedCompressed,
    earsesPage.originalLength,
    earsesPage.itemCount,
    options,
  );
  await nDescriptor.addHats(
    hatsPage.encodedCompressed,
    hatsPage.originalLength,
    hatsPage.itemCount,
    options,
  );
  await nDescriptor.addHelmets(
    helmetsPage.encodedCompressed,
    helmetsPage.originalLength,
    helmetsPage.itemCount,
    options,
  );
  await nDescriptor.addHairs(
    hairsPage.encodedCompressed,
    hairsPage.originalLength,
    hairsPage.itemCount,
    options,
  );
  await nDescriptor.addTeeths(
    teethsPage.encodedCompressed,
    teethsPage.originalLength,
    teethsPage.itemCount,
    options,
  );
  await nDescriptor.addLipses(
    lipsesPage.encodedCompressed,
    lipsesPage.originalLength,
    lipsesPage.itemCount,
    options,
  );
  await nDescriptor.addEmotions(
    emotionsPage.encodedCompressed,
    emotionsPage.originalLength,
    emotionsPage.itemCount,
    options,
  );
  await nDescriptor.addEyeses(
    eyesesPage.encodedCompressed,
    eyesesPage.originalLength,
    eyesesPage.itemCount,
    options,
  );
  await nDescriptor.addGlasseses(
    glassesesPage.encodedCompressed,
    glassesesPage.originalLength,
    glassesesPage.itemCount,
    options,
  );
  await nDescriptor.addGoggleses(
    gogglesesPage.encodedCompressed,
    gogglesesPage.originalLength,
    gogglesesPage.itemCount,
    options,
  );
  await nDescriptor.addNoses(
    nosesPage.encodedCompressed,
    nosesPage.originalLength,
    nosesPage.itemCount,
    options,
  );
};

export const populateSeeder = async (nSeeder: NSeeder): Promise<void> => {
  const shortPunkType: any = {
    male: "m",
    female: "f",
    alien: "l",
    ape: "p",
    zombie: "z",
  }

  const typeProbabilities = Object.values(probDoc.probabilities)
    .map((probObj: any) => Math.floor(probObj.probability * 1000))
  const typeResponse = await (await nSeeder.setTypeProbability(typeProbabilities)).wait()

  let skinIdx = 0;
  for(let [type, probObj] of Object.entries(probDoc.probabilities)) {
    const skinProbabilities = probObj.skin
      .map((value: any) => Math.floor(value * 1000))
    const skinResponse = await (await nSeeder.setSkinProbability(skinIdx++, skinProbabilities)).wait()
  }

  let accCountIdx = 0;
  for(let [type, probObj] of Object.entries(probDoc.probabilities)) {
    const accCountProbabilities = probObj.accessory_count_probabbilities
      .map((value: any) => Math.floor(value * 1000))
    const skinResponse = await (await nSeeder.setAccCountProbability(accCountIdx++, accCountProbabilities)).wait()
  }

  const accTypeCount = Object.keys(probDoc.acc_types).length

  const accIdPerType = probDoc.types.map((punkType: string) =>
    Object.keys(probDoc.acc_types).map(type =>
      Object.values(probDoc.accessories).filter((item: any) => item.type == type)
        .map((item: any, idx: number) => [item.punk.split("").includes(shortPunkType[punkType]), idx])
        .filter((entry: any) => entry[0])
        .map((entry: any) => entry[1])
    )
  )
  const accWeightPerType = probDoc.types.map((punkType: string) =>
    Object.keys(probDoc.acc_types).map(type =>
      Object.values(probDoc.accessories).filter((item: any) => item.type == type)
        .map((item: any) => [item.punk.split("").includes(shortPunkType[punkType]), item.weight])
        .filter((entry: any) => entry[0])
        .map((entry: any) => entry[1])
    )
  )
  const accIdSetResponse = await (await nSeeder.setAccIdByType(accIdPerType, accWeightPerType)).wait()

  const accExclusion = Array()
  for (let i = 0 ; i < accTypeCount ; i ++) {
    accExclusion.push(1 << i)
  }
  probDoc.exclusive_groups.forEach( (group) => {
    const groupExclusion = group.reduce( (groupExclusion, accType) => {
      const accTypeIndex = Object.keys(probDoc.acc_types).indexOf(accType)
      if (accTypeIndex < 0) throw new Error(`Unknown type found in exclusive groups - ${accType}`)
      groupExclusion = groupExclusion | (1 << accTypeIndex)
      return groupExclusion
    }, 0)
    group.forEach( (accType) => {
      const accTypeIndex = Object.keys(probDoc.acc_types).indexOf(accType)
      if (accTypeIndex < 0) throw new Error(`Unknown type found in exclusive groups - ${accType}`)
      accExclusion[accTypeIndex] = accExclusion[accTypeIndex] | groupExclusion;
    })
  })
  const exclusionResponse = await (await nSeeder.setAccExclusion(accExclusion)).wait()
//
//   const exclusives = probDoc.exclusive_groups.reduce((prev: any, group: any, groupIndex: number) => {
//     group.forEach((item: any) => {
//       const typeIndex = Object.keys(probDoc.acc_types).indexOf(item)
//       if(typeIndex < 0) throw new Error(`Unknown type found in exclusive groups - ${item}`)
//       prev[typeIndex] = groupIndex
//     })
//     return prev
//   }, Array(accTypeCount).fill(-1))
//   let curExclusive = probDoc.exclusive_groups.length;
//   for(let i in exclusives)
//     if(exclusives[i] < 0)
//       exclusives[i] = curExclusive ++
//   const exclusiveResponse = await (await nSeeder.setExclusiveAcc(curExclusive, exclusives)).wait()
}

export const deployGovAndToken = async (
  deployer: SignerWithAddress,
  timelockDelay: number,
  proposalThresholdBPS: number,
  quorumVotesBPS: number,
  vetoer?: string,
): Promise<{ token: NToken; cryptopunks: CryptopunksMock; cryptopunksVote: CryptopunksVote; gov: NDAOLogicV1; timelock: NDAOExecutor }> => {
  // nonce 0: Deploy NDAOExecutor
  // nonce 1: Deploy NDAOLogicV1
  // nonce 2: Deploy nftDescriptorLibraryFactory
  // nonce 3: Deploy SVGRenderer
  // nonce 4: Deploy NDescriptor
  // nonce 5: Deploy Inflator
  // nonce 6: Deploy NArt
  // nonce 7: NDescriptor.setArt
  // nonce 8: Deploy NSeeder
  // nonce 9: Deploy NToken
  // nonce 10: Deploy OGCryptopunks
  // nonce 11: Deploy WrappedPunkMock
  // nonce 12: Deploy CryptopunksVote
  // nonce 13: Deploy NDAOProxy
  // nonce 14+: populate Descriptor

  const govDelegatorAddress = ethers.utils.getContractAddress({
    from: deployer.address,
    nonce: (await deployer.getTransactionCount()) + 13,
  });

  // Deploy NDAOExecutor with pre-computed Delegator address
  const timelock = await new NDaoExecutorFactory(deployer).deploy(
    govDelegatorAddress,
    timelockDelay,
  );

  // Deploy Delegate
  const { address: govDelegateAddress } = await new NDaoLogicV1Factory(deployer).deploy();
  // Deploy Nouns token
  const token = await deployNToken(deployer);

  const {cryptopunks, cryptopunksVote} = await deployCryptopunksVote(deployer);

  // Deploy Delegator
  await new NDaoProxyFactory(deployer).deploy(
    timelock.address,
    token.address,
    cryptopunksVote.address,
    vetoer || address(0),
    timelock.address,
    govDelegateAddress,
    5760,
    1,
    proposalThresholdBPS,
    quorumVotesBPS,
  );

  // Cast Delegator as Delegate
  const gov = NDaoLogicV1Factory.connect(govDelegatorAddress, deployer);

  await populateDescriptorV2(NDescriptorV2Factory.connect(await token.descriptor(), deployer));

  await populateSeeder(NSeederFactory.connect(await token.seeder(), deployer));

  return { token, cryptopunks, cryptopunksVote, gov, timelock };
};

/**
 * Return a function used to mint `amount` Nouns on the provided `token`
 * @param token The Nouns ERC721 token
 * @param amount The number of Nouns to mint
 */
export const MintNouns = (
  token: NToken,
  burnNoundersTokens = true,
): ((amount: number) => Promise<void>) => {
  return async (amount: number): Promise<void> => {
    for (let i = 0; i < amount; i++) {
      await token.mint();
    }
    if (!burnNoundersTokens) return;

    await setTotalSupply(token, amount);
  };
};

/**
 * Mints or burns tokens to target a total supply. Due to Nounders' rewards tokens may be burned and tokenIds will not be sequential
 */
export const setTotalSupply = async (token: NToken, newTotalSupply: number): Promise<void> => {
  const totalSupply = (await token.totalSupply()).toNumber();

  if (totalSupply < newTotalSupply) {
    for (let i = 0; i < newTotalSupply - totalSupply; i++) {
      await token.mint();
    }
    // If Nounder's reward tokens were minted totalSupply will be more than expected, so run setTotalSupply again to burn extra tokens
    await setTotalSupply(token, newTotalSupply);
  }

  if (totalSupply > newTotalSupply) {
    for (let i = newTotalSupply; i < totalSupply; i++) {
      await token.burn(10_000 + i);
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
