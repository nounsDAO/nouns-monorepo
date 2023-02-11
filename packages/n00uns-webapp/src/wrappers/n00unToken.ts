import { useContractCall, useContractFunction, useEthers } from '@usedapp/core';
import { BigNumber as EthersBN, ethers, utils } from 'ethers';
import { N00unsTokenABI, N00unsTokenFactory } from '@n00uns/contracts';
import config, { cache, cacheKey, CHAIN_ID } from '../config';
import { useQuery } from '@apollo/client';
import { seedsQuery } from './subgraph';
import { useEffect } from 'react';

interface N00unToken {
  name: string;
  description: string;
  image: string;
}

export interface IN00unSeed {
  accessory: number;
  background: number;
  body: number;
  glasses: number;
  head: number;
}

export enum N00unsTokenContractFunction {
  delegateVotes = 'votesToDelegate',
}

const abi = new utils.Interface(N00unsTokenABI);
const seedCacheKey = cacheKey(cache.seed, CHAIN_ID, config.addresses.n00unsToken);

const isSeedValid = (seed: Record<string, any> | undefined) => {
  const expectedKeys = ['background', 'body', 'accessory', 'head', 'glasses'];
  const hasExpectedKeys = expectedKeys.every(key => (seed || {}).hasOwnProperty(key));
  const hasValidValues = Object.values(seed || {}).some(v => v !== 0);
  return hasExpectedKeys && hasValidValues;
};

export const useN00unToken = (n00unId: EthersBN) => {
  const [n00un] =
    useContractCall<[string]>({
      abi,
      address: config.addresses.n00unsToken,
      method: 'dataURI',
      args: [n00unId],
    }) || [];

  if (!n00un) {
    return;
  }

  const n00unImgData = n00un.split(';base64,').pop() as string;
  const json: N00unToken = JSON.parse(atob(n00unImgData));

  return json;
};

const seedArrayToObject = (seeds: (IN00unSeed & { id: string })[]) => {
  return seeds.reduce<Record<string, IN00unSeed>>((acc, seed) => {
    acc[seed.id] = {
      background: Number(seed.background),
      body: Number(seed.body),
      accessory: Number(seed.accessory),
      head: Number(seed.head),
      glasses: Number(seed.glasses),
    };
    return acc;
  }, {});
};

const useN00unSeeds = () => {
  const cache = localStorage.getItem(seedCacheKey);
  const cachedSeeds = cache ? JSON.parse(cache) : undefined;
  const { data } = useQuery(seedsQuery(), {
    skip: !!cachedSeeds,
  });

  useEffect(() => {
    if (!cachedSeeds && data?.seeds?.length) {
      localStorage.setItem(seedCacheKey, JSON.stringify(seedArrayToObject(data.seeds)));
    }
  }, [data, cachedSeeds]);

  return cachedSeeds;
};

export const useN00unSeed = (n00unId: EthersBN): IN00unSeed => {
  const seeds = useN00unSeeds();
  const seed = seeds?.[n00unId.toString()];
  // prettier-ignore
  const request = seed ? false : {
    abi,
    address: config.addresses.n00unsToken,
    method: 'seeds',
    args: [n00unId],
  };
  const response = useContractCall<IN00unSeed>(request);
  if (response) {
    const seedCache = localStorage.getItem(seedCacheKey);
    if (seedCache && isSeedValid(response)) {
      const updatedSeedCache = JSON.stringify({
        ...JSON.parse(seedCache),
        [n00unId.toString()]: {
          accessory: response.accessory,
          background: response.background,
          body: response.body,
          glasses: response.glasses,
          head: response.head,
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
  return useAccountVotes(account ?? ethers.constants.AddressZero);
};

export const useAccountVotes = (account?: string): number | undefined => {
  const [votes] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.n00unsToken,
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
      address: config.addresses.n00unsToken,
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
      address: config.addresses.n00unsToken,
      method: 'getPriorVotes',
      args: [account, block],
    }) || [];
  return votes?.toNumber();
};

export const useDelegateVotes = () => {
  const n00unsToken = new N00unsTokenFactory().attach(config.addresses.n00unsToken);

  const { send, state } = useContractFunction(n00unsToken as any, 'delegate');

  return { send, state };
};

export const useN00unTokenBalance = (address: string): number | undefined => {
  const [tokenBalance] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.n00unsToken,
      method: 'balanceOf',
      args: [address],
    }) || [];
  return tokenBalance?.toNumber();
};

export const useUserN00unTokenBalance = (): number | undefined => {
  const { account } = useEthers();

  const [tokenBalance] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.n00unsToken,
      method: 'balanceOf',
      args: [account],
    }) || [];
  return tokenBalance?.toNumber();
};
