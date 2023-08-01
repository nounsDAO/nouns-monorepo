import { useQuery } from '@apollo/client';
import { Delegates, delegateNounsAtBlockQuery } from '../wrappers/subgraph';
import { useBlockNumber } from '@usedapp/core';

/**
 * Helper function to get an array of owned nounIds for a given address at a given block
 *
 * @param address - Address for which to get owned nouns
 * @returns - Array of nounIds owned by the given address at the given block number
 */
export const useGetOwnedNounIds = (address: string): number[] => {
  const currentBlock = useBlockNumber();
  const { data: delegateSnapshot } = useQuery<Delegates>(
    delegateNounsAtBlockQuery([address], 9163080),
  );
  const { delegates } = delegateSnapshot || {};
  const delegateToNounIds = delegates?.reduce<Record<string, number[]>>((acc, curr) => {
    acc[curr.id] = curr?.nounsRepresented?.map(nr => +nr.id) ?? [];
    return acc;
  }, {});
  const nounIds = Object.values(delegateToNounIds ?? {}).flat();
  return nounIds;
};
