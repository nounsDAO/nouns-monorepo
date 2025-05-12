import type { Delegate, EscrowedNoun, Noun, Seed } from '@/subgraphs';
import type { Address } from '@/utils/types';

import { useEffect } from 'react';

import { useQuery } from '@apollo/client';
import { zeroAddress } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';

import {
  useReadNounsTokenBalanceOf,
  useReadNounsTokenDataUri,
  useReadNounsTokenDelegates,
  useReadNounsTokenGetCurrentVotes,
  useReadNounsTokenGetPriorVotes,
  useReadNounsTokenIsApprovedForAll,
  useReadNounsTokenSeeds,
  useReadNounsTokenTotalSupply,
  useSimulateNounsTokenApprove,
  useSimulateNounsTokenSetApprovalForAll,
  useWriteNounsTokenDelegate,
} from '@/contracts';

import config, { cache, cacheKey, CHAIN_ID } from '../config';

import {
  accountEscrowedNounsQuery,
  delegateNounsAtBlockQuery,
  ownedNounsQuery,
  seedsQuery,
} from './subgraph';

interface NounToken {
  name: string;
  description: string;
  image: string;
}

export interface INounSeed {
  accessory: number;
  background: number;
  body: number;
  glasses: number;
  head: number;
}

const seedCacheKey = cacheKey(cache.seed, CHAIN_ID, config.addresses.nounsToken);
const isSeedValid = (seed: INounSeed | Record<string, never> | undefined) => {
  const expectedKeys = ['background', 'body', 'accessory', 'head', 'glasses'];
  const hasExpectedKeys = expectedKeys.every(key => (seed || {}).hasOwnProperty(key));
  const hasValidValues = Object.values(seed || {}).some(v => v !== 0);
  return hasExpectedKeys && hasValidValues;
};

export const useNounToken = (nounId: bigint) => {
  const { data: noun } = useReadNounsTokenDataUri({
    args: [nounId],
  });

  if (!noun) {
    return;
  }

  const nounImgData = (noun as string).split(';base64,').pop() as string;
  const json: NounToken = JSON.parse(atob(nounImgData));

  return json;
};

const seedArrayToObject = (seeds: (INounSeed & { id: string })[]) => {
  return seeds.reduce<Record<string, INounSeed>>((acc, seed) => {
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

const useNounSeeds = () => {
  const cache = localStorage.getItem(seedCacheKey);
  const cachedSeeds = cache ? JSON.parse(cache) : undefined;
  const { data } = useQuery<{ seeds: Seed[] }>(seedsQuery(), {
    skip: !!cachedSeeds,
  });

  useEffect(() => {
    if (!cachedSeeds && data?.seeds?.length) {
      const transformedSeeds = data.seeds.map(seed => ({
        ...seed,
        accessory: Number(seed.accessory),
        background: Number(seed.background),
        body: Number(seed.body),
        glasses: Number(seed.glasses),
        head: Number(seed.head),
        id: seed.id,
      }));
      localStorage.setItem(seedCacheKey, JSON.stringify(seedArrayToObject(transformedSeeds)));
    }
  }, [data, cachedSeeds]);

  return cachedSeeds;
};

export const useNounSeed = (nounId: bigint): INounSeed => {
  const seeds = useNounSeeds();
  const seed = seeds?.[nounId.toString()];

  const { data: response } = useReadNounsTokenSeeds({
    args: [nounId],
    query: { enabled: !seed },
  });

  if (response) {
    const [background, body, accessory, head, glasses] = response;
    const seedData = { background, body, accessory, head, glasses };
    const seedCache = localStorage.getItem(seedCacheKey);
    if (seedCache && isSeedValid(seedData)) {
      const updatedSeedCache = JSON.stringify({
        ...JSON.parse(seedCache),
        [nounId.toString()]: {
          accessory: seedData.accessory,
          background: seedData.background,
          body: seedData.body,
          glasses: seedData.glasses,
          head: seedData.head,
        },
      });
      localStorage.setItem(seedCacheKey, updatedSeedCache);
    }
    return seedData;
  }
  return seed;
};

export const useUserVotes = (): number | undefined => {
  const { address } = useAccount();
  return useAccountVotes(address ?? zeroAddress);
};

export const useAccountVotes = (account?: Address): number | undefined => {
  const { data: votes } = useReadNounsTokenGetCurrentVotes({
    args: account ? [account] : undefined,
  });

  return votes ? Number(votes as bigint) : undefined;
};

export const useUserDelegatee = (): string | undefined => {
  const { address } = useAccount();
  const { data: delegate } = useReadNounsTokenDelegates({
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return delegate as string | undefined;
};

export const useUserVotesAsOfBlock = (block: number | undefined): number | undefined => {
  const { address } = useAccount();
  // Check for available votes
  const { data: votes } = useReadNounsTokenGetPriorVotes({
    args: address && block !== undefined ? [address, BigInt(block)] : undefined,
    query: { enabled: !!address && block !== undefined },
  });

  return votes ? Number(votes as bigint) : undefined;
};

export const useDelegateVotes = () => {
  const {
    writeContract: delegateVotes,
    data: hash,
    isPending: isLoading,
    isSuccess,
    isError,
    error: errorMessage,
  } = useWriteNounsTokenDelegate();

  let status = 'None';
  if (isLoading) {
    status = 'Mining';
  } else if (isSuccess) {
    status = 'Success';
  } else if (isError) {
    status = 'Fail';
  }

  const delegateState = {
    status,
    errorMessage,
    transaction: { hash },
  };

  return {
    delegateVotes,
    delegateState,
  };
};

export const useNounTokenBalance = (address: Address): number | undefined => {
  const { data: tokenBalance } = useReadNounsTokenBalanceOf({
    args: [address],
  });

  return tokenBalance ? Number(tokenBalance as bigint) : undefined;
};

export const useUserNounTokenBalance = (): number | undefined => {
  const { address } = useAccount();

  const { data: tokenBalance } = useReadNounsTokenBalanceOf({
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return tokenBalance ? Number(tokenBalance as bigint) : undefined;
};

export const useTotalSupply = (): number | undefined => {
  const { data: totalSupply } = useReadNounsTokenTotalSupply();

  return totalSupply ? Number(totalSupply as bigint) : undefined;
};

export const useUserOwnedNounIds = (pollInterval: number) => {
  const { address } = useAccount();
  const { loading, data, error, refetch } = useQuery<{ nouns: Noun[] }>(
    ownedNounsQuery(address?.toLowerCase() ?? ''),
    {
      pollInterval: pollInterval,
    },
  );
  const userOwnedNouns: number[] = data?.nouns?.map(noun => Number(noun.id)) || [];
  return { loading, data: userOwnedNouns, error, refetch };
};

export const useUserEscrowedNounIds = (pollInterval: number, forkId: string) => {
  const { address } = useAccount();
  const { loading, data, error, refetch } = useQuery<{
    escrowedNouns: Array<EscrowedNoun>;
  }>(accountEscrowedNounsQuery(address?.toLowerCase() ?? ''), {
    pollInterval: pollInterval,
  });
  // filter escrowed nouns to just this fork
  const userEscrowedNounIds: number[] =
    data?.escrowedNouns?.reduce((acc: number[], escrowedNoun: EscrowedNoun) => {
      if (escrowedNoun.fork.id === forkId) {
        acc.push(+escrowedNoun.noun.id);
      }
      return acc;
    }, []) || [];
  return { loading, data: userEscrowedNounIds, error, refetch };
};

export const useSetApprovalForAll = () => {
  const { data: simulateData } = useSimulateNounsTokenSetApprovalForAll();

  const { writeContract, data, isPending: isLoading, isSuccess, isError } = useWriteContract();

  const getApprovalStatus = () => {
    if (isLoading) return 'Mining';
    if (isSuccess) return 'Success';
    if (isError) return 'Fail';
    return 'None';
  };

  const setApprovalState = {
    status: getApprovalStatus(),
    transaction: data,
  };

  const isApprovedForAll = isSuccess;
  const setApproval = simulateData ? () => writeContract(simulateData.request) : undefined;

  return { setApproval, setApprovalState, isApprovedForAll };
};

export const useIsApprovedForAll = () => {
  const { address } = useAccount();
  const { data } = useReadNounsTokenIsApprovedForAll({
    args: address ? [address, config.addresses.nounsDAOProxy as Address] : undefined,
    query: { enabled: !!address },
  });

  return (data as boolean) || false;
};

export const useSetApprovalForTokenId = () => {
  const { data: simulateData } = useSimulateNounsTokenApprove();

  const { writeContract, data, isPending: isLoading, isSuccess, isError } = useWriteContract();

  const getApprovalStatus = () => {
    if (isLoading) return 'Mining';
    if (isSuccess) return 'Success';
    if (isError) return 'Fail';
    return 'None';
  };

  const approveTokenIdState = {
    status: getApprovalStatus(),
    transaction: data,
  };

  const approveTokenId = simulateData ? () => writeContract(simulateData.request) : undefined;

  return { approveTokenId, approveTokenIdState };
};

export const useDelegateNounsAtBlockQuery = (signers: string[], block: number) => {
  const { loading, data, error } = useQuery<{ delegates: Delegate[] }>(
    delegateNounsAtBlockQuery(signers, block),
  );
  return { loading, data, error };
};
