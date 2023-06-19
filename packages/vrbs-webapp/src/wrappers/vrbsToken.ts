import { useContractCall, useContractFunction, useEthers } from '@usedapp/core';
import { BigNumber as EthersBN, ethers, utils } from 'ethers';
import { VrbsTokenABI, VrbsTokenFactory } from '@vrbs/contracts';
import config, { cache, cacheKey, CHAIN_ID } from '../config';
import { useQuery } from '@apollo/client';
import { seedsQuery } from './subgraph';
import { useEffect } from 'react';

interface VrbToken {
  name: string;
  description: string;
  image: string;
}

export interface IVrbSeed {
  accessory: number;
  background: number;
  body: number;
  glasses: number;
  head: number;
}

export enum VrbsTokenContractFunction {
  delegateVotes = 'votesToDelegate',
}

const abi = new utils.Interface(VrbsTokenABI);
const seedCacheKey = cacheKey(cache.seed, CHAIN_ID, config.addresses.vrbsToken);

const isSeedValid = (seed: Record<string, any> | undefined) => {
  const expectedKeys = ['background', 'body', 'accessory', 'head', 'glasses'];
  const hasExpectedKeys = expectedKeys.every(key => (seed || {}).hasOwnProperty(key));
  const hasValidValues = Object.values(seed || {}).some(v => v !== 0);
  return hasExpectedKeys && hasValidValues;
};

export const useVrbToken = (vrbId: EthersBN) => {
  const [vrb] =
    useContractCall<[string]>({
      abi,
      address: config.addresses.vrbsToken,
      method: 'dataURI',
      args: [vrbId],
    }) || [];

  if (!vrb) {
    return;
  }

  const vrbImgData = vrb.split(';base64,').pop() as string;
  const json: VrbToken = JSON.parse(atob(vrbImgData));

  return json;
};

const seedArrayToObject = (seeds: (IVrbSeed & { id: string })[]) => {
  return seeds.reduce<Record<string, IVrbSeed>>((acc, seed) => {
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

const useVrbSeeds = () => {
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

export const useVrbSeed = (vrbId: EthersBN): IVrbSeed => {
  const seeds = useVrbSeeds();
  const seed = seeds?.[vrbId.toString()];
  // prettier-ignore
  const request = seed ? false : {
    abi,
    address: config.addresses.vrbsToken,
    method: 'seeds',
    args: [vrbId],
  };
  const response = useContractCall<IVrbSeed>(request);
  if (response) {
    const seedCache = localStorage.getItem(seedCacheKey);
    if (seedCache && isSeedValid(response)) {
      const updatedSeedCache = JSON.stringify({
        ...JSON.parse(seedCache),
        [vrbId.toString()]: {
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
      address: config.addresses.vrbsToken,
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
      address: config.addresses.vrbsToken,
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
      address: config.addresses.vrbsToken,
      method: 'getPriorVotes',
      args: [account, block],
    }) || [];
  return votes?.toNumber();
};

export const useDelegateVotes = () => {
  const vrbsToken = new VrbsTokenFactory().attach(config.addresses.vrbsToken);

  const { send, state } = useContractFunction(vrbsToken as any, 'delegate');

  return { send, state };
};

export const useVrbTokenBalance = (address: string): number | undefined => {
  const [tokenBalance] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.vrbsToken,
      method: 'balanceOf',
      args: [address],
    }) || [];
  return tokenBalance?.toNumber();
};

export const useUserVrbTokenBalance = (): number | undefined => {
  const { account } = useEthers();

  const [tokenBalance] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.vrbsToken,
      method: 'balanceOf',
      args: [account],
    }) || [];
  return tokenBalance?.toNumber();
};
