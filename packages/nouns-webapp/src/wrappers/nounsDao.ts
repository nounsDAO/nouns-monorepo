import { NounsDAOABI } from '@nouns/contracts';
import { useContractCall, useContractCalls } from '@usedapp/core';
import { utils, Contract, BigNumber as EthersBN } from 'ethers';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { useMemo } from 'react';
import config from '../config';
import { useLogs } from '../hooks/useLogs';

export enum ProposalState {
  UNDETERMINED = -1,
  PENDING,
  ACTIVE,
  CANCELED,
  DEFEATED,
  SUCCEEDED,
  QUEUED,
  EXPIRED,
  EXECUTED,
  VETOED,
}

interface Proposal {
  id: EthersBN;
  abstainVotes: EthersBN;
  againstVotes: EthersBN;
  forVotes: EthersBN;
  canceled: boolean;
  vetoed: boolean;
  executed: boolean;
  startBlock: EthersBN;
  endBlock: EthersBN;
  eta: EthersBN;
  proposalThreshold: EthersBN;
  proposer: string;
  quorumVotes: EthersBN;
}

const abi = new utils.Interface(NounsDAOABI);
const contract = new Contract(config.nounsDaoAddress, abi);
const proposalCreatedFilter = contract.filters?.ProposalCreated();

const useProposalCount = (nounsDao: string): number | undefined => {
  const [count] = useContractCall<[EthersBN]>({
    abi,
    address: nounsDao,
    method: 'proposalCount',
    args: [],
  }) || [];
  return count?.toNumber();
}

const countToIndices = (count: number | undefined) => {
  return typeof count === 'number' ? new Array(count).fill(0).map((_, i) => [i + 1]) : []
}

const useFormattedProposalCreatedLogs = () => {
  const useLogsResult = useLogs(proposalCreatedFilter);

  return useMemo(() => {
    return useLogsResult?.logs?.map((log) => {
      const parsed = abi.parseLog(log).args
      return {
        description: parsed.description,
        details: parsed.targets.map((target: string, i: number) => {
          const signature = parsed.signatures[i]
          const [name, types] = signature.substr(0, signature.length - 1)?.split('(')
          if (!name || !types) {
            return {
              target,
              functionSig: name === '' ? 'transfer' : name === undefined ? 'unknown' : name,
              callData: types ?? '',
            }
          }
          const calldata = parsed.calldatas[i]
          const decoded = defaultAbiCoder.decode(types.split(','), calldata)
          return {
            target,
            functionSig: name,
            callData: decoded.join(', '),
          }
        }),
      }
    })
  }, [useLogsResult]);
};

export const useAllProposals = () => {
  const proposalCount = useProposalCount(contract.address);

  const govProposalIndexes = useMemo(() => {
    return countToIndices(proposalCount)
  }, [proposalCount]);

  const proposals = useContractCalls<Proposal>(
    govProposalIndexes.map(index => ({
      abi,
      address: contract.address,
      method: 'proposals',
      args: [index],
    })),
  );

  const proposalStates = useContractCalls<[ProposalState]>(
    govProposalIndexes.map(index => ({
      abi,
      address: contract.address,
      method: 'state',
      args: [index],
    })),
  );

  const formattedLogs = useFormattedProposalCreatedLogs();

    // Early return until events are fetched
    return useMemo(() => {
      const logs = formattedLogs ?? []
      if (proposals.length && !logs.length) {
        return { data: [], loading: true };
      }

      return {
        data: proposals.map((proposal, i) => {
          const description = logs[i]?.description;
          return {
            id: proposal?.id.toString(),
            title: description?.split(/# |\n/g)[1] ?? 'Untitled',
            description: description ?? 'No description.',
            proposer: proposal?.proposer,
            status: proposalStates[i]?.[0] ?? ProposalState.UNDETERMINED,
            forCount: parseInt(proposal?.forVotes?.toString() ?? '0'),
            againstCount: parseInt(proposal?.againstVotes?.toString() ?? '0'),
            startBlock: parseInt(proposal?.startBlock?.toString() ?? ''),
            endBlock: parseInt(proposal?.endBlock?.toString() ?? ''),
            details: logs[i]?.details,
            governorIndex: i >= govProposalIndexes.length ? 1 : 0,
          }
        }),
        loading: false,
      }
  }, [formattedLogs, govProposalIndexes.length, proposalStates, proposals])
};
