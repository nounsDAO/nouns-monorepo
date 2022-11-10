import { useContractCall, useContractFunction, useEthers } from '@usedapp/core';
import { BigNumber as EthersBN, ethers, utils } from 'ethers';
import { NounsBRTokenABI, NounsBRTokenFactory } from '@nounsbr/contracts';
import config, { cache, cacheKey, CHAIN_ID } from '../config';
import { useQuery } from '@apollo/client';
import { seedsQuery } from './subgraph';
import { useEffect } from 'react';

interface NounBRToken {
  name: string;
  description: string;
  image: string;
}

export interface INounBRSeed {
  accessory: number;
  background: number;
  body: number;
  glasses: number;
  head: number;
}

export enum NounsBRTokenContractFunction {
  delegateVotes = 'votesToDelegate',
}

const abi = new utils.Interface(NounsBRTokenABI);
const seedCacheKey = cacheKey(cache.seed, CHAIN_ID, config.addresses.nounsbrToken);

const isSeedValid = (seed: Record<string, any> | undefined) => {
  const expectedKeys = ['background', 'body', 'accessory', 'head', 'glasses'];
  const hasExpectedKeys = expectedKeys.every(key => (seed || {}).hasOwnProperty(key));
  const hasValidValues = Object.values(seed || {}).some(v => v !== 0);
  return hasExpectedKeys && hasValidValues;
};

export const useNounBRToken = (nounbrId: EthersBN) => {
  const [nounbr] =
    useContractCall<[string]>({
      abi,
      address: config.addresses.nounsbrToken,
      method: 'dataURI',
      args: [nounbrId],
    }) || [];

  if (!nounbr) {
    return;
  }

  const nounbrImgData = nounbr.split(';base64,').pop() as string;
  const json: NounBRToken = JSON.parse(atob(nounbrImgData));

  return json;
};

const seedArrayToObject = (seeds: (INounBRSeed & { id: string })[]) => {
  return seeds.reduce<Record<string, INounBRSeed>>((acc, seed) => {
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

const useNounBRSeeds = () => {
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

export const useNounBRSeed = (nounbrId: EthersBN) => {
  const seeds = useNounBRSeeds();
  const seed = seeds?.[nounbrId.toString()];
  // prettier-ignore
  const request = seed ? false : {
    abi,
    address: config.addresses.nounsbrToken,
    method: 'seeds',
    args: [nounbrId],
  };
  const response = useContractCall<INounBRSeed>(request);
  if (response) {
    const seedCache = localStorage.getItem(seedCacheKey);
    if (seedCache && isSeedValid(response)) {
      const updatedSeedCache = JSON.stringify({
        ...JSON.parse(seedCache),
        [nounbrId.toString()]: {
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
      address: config.addresses.nounsbrToken,
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
      address: config.addresses.nounsbrToken,
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
      address: config.addresses.nounsbrToken,
      method: 'getPriorVotes',
      args: [account, block],
    }) || [];
  return votes?.toNumber();
};

export const useDelegateVotes = () => {
  const nounsbrToken = new NounsBRTokenFactory().attach(config.addresses.nounsbrToken);

  const { send, state } = useContractFunction(nounsbrToken, 'delegate');

  return { send, state };
};

export const useNounBRTokenBalance = (address: string): number | undefined => {
  const [tokenBalance] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.nounsbrToken,
      method: 'balanceOf',
      args: [address],
    }) || [];
  return tokenBalance?.toNumber();
};

export const useUserNounBRTokenBalance = (): number | undefined => {
  const { account } = useEthers();

  const [tokenBalance] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.nounsbrToken,
      method: 'balanceOf',
      args: [account],
    }) || [];
  return tokenBalance?.toNumber();
};
