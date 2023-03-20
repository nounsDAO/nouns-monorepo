import { NounsDAOV2ABI, NounsDaoLogicV2Factory } from '@nouns/sdk';
import {
  ChainId,
  connectContractToSigner,
  useBlockNumber,
  useContractCall,
  useContractCalls,
  useContractFunction,
  useEthers,
} from '@usedapp/core';
import { utils, BigNumber as EthersBN } from 'ethers';
import { defaultAbiCoder, keccak256, Result, toUtf8Bytes } from 'ethers/lib/utils';
import { useMemo } from 'react';
import { useLogs } from '../hooks/useLogs';
import * as R from 'ramda';
import config, { CHAIN_ID } from '../config';
import { useQuery } from '@apollo/client';
import { proposalQuery, partialProposalsQuery } from './subgraph';
import BigNumber from 'bignumber.js';
import { useBlockTimestamp } from '../hooks/useBlockTimestamp';

export interface DynamicQuorumParams {
  minQuorumVotesBPS: number;
  maxQuorumVotesBPS: number;
  quorumCoefficient: number;
}

export enum Vote {
  AGAINST = 0,
  FOR = 1,
  ABSTAIN = 2,
}

export enum ProposalState {
  UNDETERMINED = -1,
  PENDING,
  ACTIVE,
  CANCELLED,
  DEFEATED,
  SUCCEEDED,
  QUEUED,
  EXPIRED,
  EXECUTED,
  VETOED,
}

interface ProposalCallResult {
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

interface ProposalDetail {
  target: string;
  value?: string;
  functionSig: string;
  callData: string;
}

export interface PartialProposal {
  id: string | undefined;
  title: string;
  status: ProposalState;
  forCount: number;
  againstCount: number;
  abstainCount: number;
  startBlock: number;
  endBlock: number;
  eta: Date | undefined;
  quorumVotes: number;
}

export interface Proposal extends PartialProposal {
  description: string;
  createdBlock: number;
  proposer: string | undefined;
  proposalThreshold: number;
  details: ProposalDetail[];
  transactionHash: string;
}

interface ProposalTransactionDetails {
  targets: string[];
  values: string[];
  signatures: string[];
  calldatas: string[];
}

export interface PartialProposalSubgraphEntity {
  id: string;
  title: string;
  status: keyof typeof ProposalState;
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
  startBlock: string;
  endBlock: string;
  executionETA: string | null;
  quorumVotes: string;
}

export interface ProposalSubgraphEntity extends ProposalTransactionDetails, PartialProposalSubgraphEntity {
  description: string;
  createdBlock: string;
  createdTransactionHash: string;
  proposer: { id: string };
  proposalThreshold: string;
}

interface PartialProposalData {
  data: PartialProposal[];
  error?: Error;
  loading: boolean;
}

export interface ProposalTransaction {
  address: string;
  value: string;
  signature: string;
  calldata: string;
  decodedCalldata?: string;
  usdcValue?: number;
}

const abi = new utils.Interface(NounsDAOV2ABI);
const nounsDaoContract = new NounsDaoLogicV2Factory().attach(config.addresses.nounsDAOProxy);

// Start the log search at the mainnet deployment block to speed up log queries
const fromBlock = CHAIN_ID === ChainId.Mainnet ? 12985453 : 0;
const proposalCreatedFilter = {
  ...nounsDaoContract.filters?.ProposalCreated(
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ),
  fromBlock,
};

const hashRegex = /^\s*#{1,6}\s+([^\n]+)/;
const equalTitleRegex = /^\s*([^\n]+)\n(={3,25}|-{3,25})/;

/**
 * Extract a markdown title from a proposal body that uses the `# Title` format
 * Returns null if no title found.
 */
const extractHashTitle = (body: string) => body.match(hashRegex);
/**
 * Extract a markdown title from a proposal body that uses the `Title\n===` format.
 * Returns null if no title found.
 */
const extractEqualTitle = (body: string) => body.match(equalTitleRegex);

/**
 * Extract title from a proposal's body/description. Returns null if no title found in the first line.
 * @param body proposal body
 */
const extractTitle = (body: string | undefined): string | null => {
  if (!body) return null;
  const hashResult = extractHashTitle(body);
  const equalResult = extractEqualTitle(body);
  return hashResult ? hashResult[1] : equalResult ? equalResult[1] : null;
};

const removeBold = (text: string | null): string | null =>
  text ? text.replace(/\*\*/g, '') : text;
const removeItalics = (text: string | null): string | null =>
  text ? text.replace(/__/g, '') : text;

const removeMarkdownStyle = R.compose(removeBold, removeItalics);

export const useCurrentQuorum = (
  nounsDao: string,
  proposalId: number,
  skip: boolean = false,
): number | undefined => {
  const request = () => {
    if (skip) return false;
    return {
      abi,
      address: nounsDao,
      method: 'quorumVotes',
      args: [proposalId],
    };
  };
  const [quorum] = useContractCall<[EthersBN]>(request()) || [];
  return quorum?.toNumber();
};

export const useDynamicQuorumProps = (
  nounsDao: string,
  block: number,
): DynamicQuorumParams | undefined => {
  const [params] =
    useContractCall<[DynamicQuorumParams]>({
      abi,
      address: nounsDao,
      method: 'getDynamicQuorumParamsAt',
      args: [block],
    }) || [];

  return params;
};

export const useHasVotedOnProposal = (proposalId: string | undefined): boolean => {
  const { account } = useEthers();

  // Fetch a voting receipt for the passed proposal id
  const [receipt] =
    useContractCall<[any]>({
      abi,
      address: nounsDaoContract.address,
      method: 'getReceipt',
      args: [proposalId, account],
    }) || [];
  return receipt?.hasVoted ?? false;
};

export const useProposalVote = (proposalId: string | undefined): string => {
  const { account } = useEthers();

  // Fetch a voting receipt for the passed proposal id
  const [receipt] =
    useContractCall<[any]>({
      abi,
      address: nounsDaoContract.address,
      method: 'getReceipt',
      args: [proposalId, account],
    }) || [];
  const voteStatus = receipt?.support ?? -1;
  if (voteStatus === 0) {
    return 'Against';
  }
  if (voteStatus === 1) {
    return 'For';
  }
  if (voteStatus === 2) {
    return 'Abstain';
  }

  return '';
};

export const useProposalCount = (): number | undefined => {
  const [count] =
    useContractCall<[EthersBN]>({
      abi,
      address: nounsDaoContract.address,
      method: 'proposalCount',
      args: [],
    }) || [];
  return count?.toNumber();
};

export const useProposalThreshold = (): number | undefined => {
  const [count] =
    useContractCall<[EthersBN]>({
      abi,
      address: nounsDaoContract.address,
      method: 'proposalThreshold',
      args: [],
    }) || [];
  return count?.toNumber();
};

const countToIndices = (count: number | undefined) => {
  return typeof count === 'number' ? new Array(count).fill(0).map((_, i) => [i + 1]) : [];
};

const concatSelectorToCalldata = (signature: string, callData: string) => {
  if (signature) {
    return `${keccak256(toUtf8Bytes(signature)).substring(0, 10)}${callData.substring(2)}`;
  }
  return callData;
};

const formatProposalTransactionDetails = (details: ProposalTransactionDetails | Result) => {
  return details.targets.map((target: string, i: number) => {
    const signature: string = details.signatures[i];
    const value = EthersBN.from(
      // Handle both logs and subgraph responses
      (details as ProposalTransactionDetails).values?.[i] ?? (details as Result)?.[3]?.[i] ?? 0,
    );
    const callData = details.calldatas[i];

    // Split at first occurrence of '('
    let [name, types] = signature.substring(0, signature.length - 1)?.split(/\((.*)/s);
    if (!name || !types) {
      // If there's no signature and calldata is present, display the raw calldata
      if (callData && callData !== '0x') {
        return {
          target,
          callData: concatSelectorToCalldata(signature, callData),
          value: value.gt(0) ? `{ value: ${utils.formatEther(value)} ETH } ` : '',
        };
      }

      return {
        target,
        functionSig: name === '' ? 'transfer' : name === undefined ? 'unknown' : name,
        callData: types ? types : value ? `${utils.formatEther(value)} ETH` : '',
      };
    }

    try {
      // Split using comma as separator, unless comma is between parentheses (tuple).
      const decoded = defaultAbiCoder.decode(types.split(/,(?![^(]*\))/g), callData);
      return {
        target,
        functionSig: name,
        callData: decoded.join(),
        value: value.gt(0) ? `{ value: ${utils.formatEther(value)} ETH }` : '',
      };
    } catch (error) {
      // We failed to decode. Display the raw calldata, appending function selectors if they exist.
      return {
        target,
        callData: concatSelectorToCalldata(signature, callData),
        value: value.gt(0) ? `{ value: ${utils.formatEther(value)} ETH } ` : '',
      };
    }
  });
};

const useFormattedProposalCreatedLogs = (skip: boolean, fromBlock?: number) => {
  const filter = useMemo(
    () => ({
      ...proposalCreatedFilter,
      ...(fromBlock ? { fromBlock } : {}),
    }),
    [fromBlock],
  );
  const useLogsResult = useLogs(!skip ? filter : undefined);

  return useMemo(() => {
    return useLogsResult?.logs?.map(log => {
      const { args: parsed } = abi.parseLog(log);
      return {
        description: parsed.description,
        transactionHash: log.transactionHash,
        details: formatProposalTransactionDetails(parsed),
      };
    });
  }, [useLogsResult]);
};

const getProposalState = (
  blockNumber: number | undefined,
  blockTimestamp: Date | undefined,
  proposal: PartialProposalSubgraphEntity,
) => {
  const status = ProposalState[proposal.status];
  if (status === ProposalState.PENDING) {
    if (!blockNumber) {
      return ProposalState.UNDETERMINED;
    }
    if (blockNumber <= parseInt(proposal.startBlock)) {
      return ProposalState.PENDING;
    }
    return ProposalState.ACTIVE;
  }
  if (status === ProposalState.ACTIVE) {
    if (!blockNumber) {
      return ProposalState.UNDETERMINED;
    }
    if (blockNumber > parseInt(proposal.endBlock)) {
      const forVotes = new BigNumber(proposal.forVotes);
      if (forVotes.lte(proposal.againstVotes) || forVotes.lt(proposal.quorumVotes)) {
        return ProposalState.DEFEATED;
      }
      if (!proposal.executionETA) {
        return ProposalState.SUCCEEDED;
      }
    }
    return status;
  }
  if (status === ProposalState.QUEUED) {
    if (!blockTimestamp || !proposal.executionETA) {
      return ProposalState.UNDETERMINED;
    }
    const GRACE_PERIOD = 14 * 60 * 60 * 24;
    if (blockTimestamp.getTime() / 1_000 >= parseInt(proposal.executionETA) + GRACE_PERIOD) {
      return ProposalState.EXPIRED;
    }
    return status;
  }
  return status;
};

const parsePartialSubgraphProposal = (
  proposal: PartialProposalSubgraphEntity | undefined,
  blockNumber: number | undefined,
  timestamp: number | undefined,
) => {
  if (!proposal) {
    return;
  }

  return {
    id: proposal.id,
    title: proposal.title ?? 'Untitled',
    status: getProposalState(blockNumber, new Date((timestamp ?? 0) * 1000), proposal),
    startBlock: parseInt(proposal.startBlock),
    endBlock: parseInt(proposal.endBlock),
    forCount: parseInt(proposal.forVotes),
    againstCount: parseInt(proposal.againstVotes),
    abstainCount: parseInt(proposal.abstainVotes),
    quorumVotes: parseInt(proposal.quorumVotes),
    eta: proposal.executionETA ? new Date(Number(proposal.executionETA) * 1000) : undefined,
  };
};

const parseSubgraphProposal = (
  proposal: ProposalSubgraphEntity | undefined,
  blockNumber: number | undefined,
  timestamp: number | undefined,
) => {
  if (!proposal) {
    return;
  }

  const description = proposal.description?.replace(/\\n/g, '\n').replace(/(^['"]|['"]$)/g, '');
  return {
    id: proposal.id,
    title: R.pipe(extractTitle, removeMarkdownStyle)(description) ?? 'Untitled',
    description: description ?? 'No description.',
    proposer: proposal.proposer?.id,
    status: getProposalState(blockNumber, new Date((timestamp ?? 0) * 1000), proposal),
    proposalThreshold: parseInt(proposal.proposalThreshold),
    quorumVotes: parseInt(proposal.quorumVotes),
    forCount: parseInt(proposal.forVotes),
    againstCount: parseInt(proposal.againstVotes),
    abstainCount: parseInt(proposal.abstainVotes),
    createdBlock: parseInt(proposal.createdBlock),
    startBlock: parseInt(proposal.startBlock),
    endBlock: parseInt(proposal.endBlock),
    eta: proposal.executionETA ? new Date(Number(proposal.executionETA) * 1000) : undefined,
    details: formatProposalTransactionDetails(proposal),
    transactionHash: proposal.createdTransactionHash,
  };
};

export const useAllProposalsViaSubgraph = (): PartialProposalData => {
  const { loading, data, error } = useQuery(partialProposalsQuery());
  const blockNumber = useBlockNumber();
  const timestamp = useBlockTimestamp(blockNumber);

  const proposals = data?.proposals?.map((proposal: ProposalSubgraphEntity) =>
    parsePartialSubgraphProposal(proposal, blockNumber, timestamp),
  );

  return {
    loading,
    error,
    data: proposals ?? [],
  };
};

export const useAllProposalsViaChain = (skip = false): PartialProposalData => {
  const proposalCount = useProposalCount();

  const govProposalIndexes = useMemo(() => {
    return countToIndices(proposalCount);
  }, [proposalCount]);

  const requests = (method: string) => {
    if (skip) return [false];
    return govProposalIndexes.map(index => ({
      abi,
      method,
      address: nounsDaoContract.address,
      args: [index],
    }));
  };

  const proposals = useContractCalls<[ProposalCallResult]>(requests('proposals'));
  const proposalStates = useContractCalls<[ProposalState]>(requests('state'));

  const formattedLogs = useFormattedProposalCreatedLogs(skip);

  // Early return until events are fetched
  return useMemo(() => {
    const logs = formattedLogs ?? [];
    if (proposals.length && !logs.length) {
      return { data: [], loading: true };
    }

    return {
      data: proposals.map((p, i) => {
        const proposal = p?.[0];
        const description = logs[i]?.description?.replace(/\\n/g, '\n');
        return {
          id: proposal?.id.toString(),
          title: R.pipe(extractTitle, removeMarkdownStyle)(description) ?? 'Untitled',
          status: proposalStates[i]?.[0] ?? ProposalState.UNDETERMINED,

          startBlock: parseInt(proposal?.startBlock?.toString() ?? ''),
          endBlock: parseInt(proposal?.endBlock?.toString() ?? ''),
          forCount: parseInt(proposal?.forVotes?.toString() ?? '0'),
          againstCount: parseInt(proposal?.againstVotes?.toString() ?? '0'),
          abstainCount: parseInt(proposal?.abstainVotes?.toString() ?? '0'),
          quorumVotes: parseInt(proposal?.quorumVotes?.toString() ?? '0'),
          eta: proposal?.eta ? new Date(proposal?.eta?.toNumber() * 1000) : undefined,
        };
      }),
      loading: false,
    };
  }, [formattedLogs, proposalStates, proposals]);
};

export const useAllProposals = (): PartialProposalData => {
  const subgraph = useAllProposalsViaSubgraph();
  const onchain = useAllProposalsViaChain(!subgraph.error);
  return subgraph?.error ? onchain : subgraph;
};

export const useProposal = (id: string | number): Proposal | undefined => {
  const blockNumber = useBlockNumber();
  const timestamp = useBlockTimestamp(blockNumber);
  return parseSubgraphProposal(useQuery(proposalQuery(id)).data?.proposal, blockNumber, timestamp);
};

export const useCastVote = () => {
  const { send: castVote, state: castVoteState } = useContractFunction(
    nounsDaoContract,
    'castVote',
  );
  return { castVote, castVoteState };
};

export const useCastVoteWithReason = () => {
  const { send: castVoteWithReason, state: castVoteWithReasonState } = useContractFunction(
    nounsDaoContract,
    'castVoteWithReason',
  );
  return { castVoteWithReason, castVoteWithReasonState };
};

export const useCastRefundableVote = () => {
  const { library } = useEthers();
  const { send: castRefundableVote, state: castRefundableVoteState } = useContractFunction(
    nounsDaoContract,
    'castRefundableVote',
  );

  return {
    castRefundableVote: async (...args: any[]): Promise<void> => {
      const contract = connectContractToSigner(nounsDaoContract, undefined, library);
      const gasLimit = await contract.estimateGas.castRefundableVote(...args);
      return castRefundableVote(...args, {
        gasLimit: gasLimit.add(30_000), // A 30,000 gas pad is used to avoid 'Out of gas' errors
      });
    },
    castRefundableVoteState,
  };
};

export const useCastRefundableVoteWithReason = () => {
  const { library } = useEthers();
  // prettier-ignore
  const { send: castRefundableVoteWithReason, state: castRefundableVoteWithReasonState } = useContractFunction(
    nounsDaoContract,
    'castRefundableVoteWithReason',
  );

  return {
    castRefundableVoteWithReason: async (...args: any[]): Promise<void> => {
      const contract = connectContractToSigner(nounsDaoContract, undefined, library);
      const gasLimit = await contract.estimateGas.castRefundableVoteWithReason(...args);
      return castRefundableVoteWithReason(...args, {
        gasLimit: gasLimit.add(30_000), // A 30,000 gas pad is used to avoid 'Out of gas' errors
      });
    },
    castRefundableVoteWithReasonState,
  };
};

export const usePropose = () => {
  const { send: propose, state: proposeState } = useContractFunction(nounsDaoContract, 'propose');
  return { propose, proposeState };
};

export const useQueueProposal = () => {
  const { send: queueProposal, state: queueProposalState } = useContractFunction(
    nounsDaoContract,
    'queue',
  );
  return { queueProposal, queueProposalState };
};

export const useCancelProposal = () => {
  const { send: cancelProposal, state: cancelProposalState } = useContractFunction(
    nounsDaoContract,
    'cancel',
  );
  return { cancelProposal, cancelProposalState };
};

export const useExecuteProposal = () => {
  const { send: executeProposal, state: executeProposalState } = useContractFunction(
    nounsDaoContract,
    'execute',
  );
  return { executeProposal, executeProposalState };
};
