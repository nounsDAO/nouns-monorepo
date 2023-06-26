import { useContractCall, useContractFunction, useEthers } from '@usedapp/core';
import { BigNumber as EthersBN, ethers, utils } from 'ethers';
import { NTokenABI, NTokenFactory } from '@nouns/contracts';
import config, { cache, cacheKey, CHAIN_ID } from '../config';
import { useQuery } from '@apollo/client';
import { seedsQuery } from './subgraph';
import { useEffect } from 'react';

interface NToken {
  name: string;
  description: string;
  image: string;
}

export interface Accessory {
  accType: number;
  accId: number;
}
export interface ISeed {
  punkType: number;
  skinTone: number;
  accessories: Array<Accessory>;
}

export enum NTokenContractFunction {
  delegateVotes = 'votesToDelegate',
}

const abi = new utils.Interface(NTokenABI);
const seedCacheKey = cacheKey(cache.seed, CHAIN_ID, config.addresses.nToken);

const isSeedValid = (seed: Record<string, any> | undefined) => {
  return true
  // const expectedKeys = ['background', 'body', 'accessory', 'head', 'glasses'];
  // const hasExpectedKeys = expectedKeys.every(key => (seed || {}).hasOwnProperty(key));
  // const hasValidValues = Object.values(seed || {}).some(v => v !== 0);
  // return hasExpectedKeys && hasValidValues;
};

export const useNToken = (punkId: EthersBN) => {
  const [punk] =
    useContractCall<[string]>({
      abi,
      address: config.addresses.nToken,
      method: 'dataURI',
      args: [punkId],
    }) || [];

  if (!punk) {
    return;
  }

  const punkImgData = punk.split(';base64,').pop() as string;
  const json: NToken = JSON.parse(atob(punkImgData));

  return json;
};

const seedArrayToObject = (seeds: (ISeed & { id: string; accessory_ids: string[]; accessory_types: string[] })[]) => {
  return seeds.reduce<Record<string, ISeed>>((acc, seed) => {
    acc[seed.id] = {
      punkType: Number(seed.punkType),
      skinTone: Number(seed.skinTone),
      accessories: Array.from({ length: seed.accessory_ids.length }).map((_, i) => ({
        accType: Number(seed.accessory_types[i]),
        accId: Number(seed.accessory_ids[i]),
      })),
    };
    return acc;
  }, {});
};

const useNSeeds = () => {
  const cache = localStorage.getItem(seedCacheKey);
  const cachedSeeds = cache ? JSON.parse(cache) : undefined;
  const { data } = useQuery(seedsQuery(), {
    // skip: !!cachedSeeds,
  });

  useEffect(() => {
    if (!cachedSeeds && data?.seeds?.length) {
      localStorage.setItem(seedCacheKey, JSON.stringify(seedArrayToObject(data.seeds)));
    }
  }, [data, cachedSeeds]);

  return data;
};

export const useNSeed = (punkId: EthersBN) => {
  const seeds = useNSeeds();
  const seed = seeds?.[punkId.toString()];
  // prettier-ignore
  const request = seed ? false : {
    abi,
    address: config.addresses.nToken,
    method: 'getPunk',
    args: [punkId],
  };
  let response: any = useContractCall<ISeed>(request);
  if (response) {
    response = response[0]
    const seedCache = localStorage.getItem(seedCacheKey);
    if (seedCache && isSeedValid(response)) {
      const updatedSeedCache = JSON.stringify({
        ...JSON.parse(seedCache),
        [punkId.toString()]: {
          punkType: response.punkType,
          skineTone: response.skinTone,
          accessories: response.accessories
        },
      });
      localStorage.setItem(seedCacheKey, updatedSeedCache);
    }
    return response;
  }
  return seed;
};

export const useUserVotes = (): number | undefined => {
  const { account } = useEthers();
  const accountVotes = useAccountVotes(account ?? ethers.constants.AddressZero) ?? 0;
  const cryptopunksVotes = useCryptopunksVotes(account ?? ethers.constants.AddressZero) ?? 0;

  return account ? accountVotes + cryptopunksVotes : 0;
};

export const useAccountVotes = (account?: string): number | undefined => {
  const [votes] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.nToken,
      method: 'getCurrentVotes',
      args: [account],
    }) || [];
  return votes?.toNumber();
};

export const useCryptopunksVotes = (account?: string): number | undefined => {
  const [votes] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.cryptopunksVote,
      method: 'getCurrentVotes',
      args: [account],
    }) || [];
  return votes?.toNumber();
};

export const useUserDelegatee = (): string | undefined => {
  const { account } = useEthers();
  const [delegate] =
    useContractCall<[string]>({
      abi,
      address: config.addresses.nToken,
      method: 'delegates',
      args: [account],
    }) || [];
  return delegate;
};

export const useUserVotesAsOfBlock = (block: number | undefined): number | undefined => {
  const { account } = useEthers();

  // Check for available votes
  const [votes] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.nToken,
      method: 'getPriorVotes',
      args: [account, block],
    }) || [];
  return votes?.toNumber();
};

export const useDelegateVotes = () => {
  const nToken = new NTokenFactory().attach(config.addresses.nToken);

  const { send, state } = useContractFunction(nToken, 'delegate');

  return { send, state };
};

export const useNTokenBalance = (address: string): number | undefined => {
  const [tokenBalance] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.nToken,
      method: 'balanceOf',
      args: [address],
    }) || [];
  return tokenBalance?.toNumber();
};

export const useUserNTokenBalance = (): number | undefined => {
  const { account } = useEthers();

  const [tokenBalance] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.nToken,
      method: 'balanceOf',
      args: [account],
    }) || [];
  return tokenBalance?.toNumber();
};
