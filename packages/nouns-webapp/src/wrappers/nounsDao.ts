import { NounsDAOABI } from '@nouns/contracts';
import { useContractCall, useContractCalls } from '@usedapp/core';
import { utils, BigNumber as EthersBN } from 'ethers';
import { useMemo } from 'react';
import config from '../config';

const abi = new utils.Interface(NounsDAOABI);

const useProposalCount = (nounsDao: string): number => {
  const result = useContractCall({
    abi,
    address: nounsDao,
    method: 'proposalCount',
    args: [],
  });
  return result?.[0].proposalCount.toNumber();
}

const countToIndices = (count: number | undefined) => {
  return typeof count === 'number' ? new Array(count).fill(0).map((_, i) => [i + 1]) : []
}

export const useAllProposals = () => {
  const address = config.nounsDaoAddress;
  const proposalCount = useProposalCount(address);

  const govProposalIndexes = useMemo(() => {
    return countToIndices(proposalCount)
  }, [proposalCount])

  const proposals = useContractCalls(
    govProposalIndexes.map(index => ({
      abi,
      address,
      method: 'proposals',
      args: [index],
    })),
  );

  const proposalStates = useContractCalls(
    govProposalIndexes.map(index => ({
      abi,
      address,
      method: 'state',
      args: [index],
    })),
  );
};
