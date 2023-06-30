import { NounsDAOV3ABI, NounsDaoLogicV3Factory } from '@nouns/sdk';
import {
  ChainId,
  useBlockNumber,
  useContractCall,
  useContractCalls,
  useContractFunction,
  connectContractToSigner,
  useEthers,
} from '@usedapp/core';
import { utils, BigNumber as EthersBN } from 'ethers';
import { defaultAbiCoder, keccak256, Result, toUtf8Bytes } from 'ethers/lib/utils';
import { useMemo } from 'react';
import { useLogs } from '../hooks/useLogs';
import * as R from 'ramda';
import config, { CHAIN_ID } from '../config';
import { useQuery } from '@apollo/client';
import {
  proposalQuery,
  partialProposalsQuery,
  proposalVersionsQuery,
  escrowDepositEventsQuery,
  escrowWithdrawEventsQuery,
  proposalTitlesQuery,
  forksQuery,
  forkDetailsQuery,
} from './subgraph';
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
  OBJECTION_PERIOD,
  UPDATABLE,
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
  objectionPeriodEndBlock: EthersBN;
  updatePeriodEndBlock: EthersBN;
}

export interface ProposalDetail {
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
  objectionPeriodEndBlock: number;
  updatePeriodEndBlock: number;
}

export interface Proposal extends PartialProposal {
  description: string;
  createdBlock: number;
  proposer: string | undefined;
  proposalThreshold: number;
  details: ProposalDetail[];
  transactionHash: string;
  signers: { id: string }[];
}

export interface ProposalVersion {
  id: string;
  createdAt: number;
  updateMessage: string;
  description: string;
  targets: string[];
  values: string[];
  signatures: string[];
  calldatas: string[];
  title: string;
  details: ProposalDetail[];
  proposal: {
    id: string;
  };
  versionNumber: number;
}

export interface ProposalTransactionDetails {
  targets: string[];
  values: string[];
  signatures: string[];
  calldatas: string[];
  encodedProposalHash: string;
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
  objectionPeriodEndBlock: string;
  updatePeriodEndBlock: string;
}

export interface ProposalSubgraphEntity
  extends ProposalTransactionDetails,
  PartialProposalSubgraphEntity {
  description: string;
  createdBlock: string;
  createdTransactionHash: string;
  proposer: { id: string };
  proposalThreshold: string;
  signers: { id: string }[];
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

export interface EscrowDeposit {
  eventType: 'EscrowDeposit';
  id: string;
  createdAt: string;
  owner: { id: string };
  reason: string;
  tokenIDs: string[];
  proposalIDs: number[];
}

export interface EscrowWithdrawal {
  eventType: 'EscrowWithdrawal';
  id: string;
  createdAt: string;
  owner: { id: string };
  tokenIDs: string[];
}

export interface ForkCycleEvent {
  eventType: 'ForkStarted' | "ForkExecuted" | 'ForkingEnded';
  id: string;
  createdAt: string | null;
}

export interface ProposalTitle {
  id: string;
  title: string;
}

export interface Fork {
  id: string;
  forkID: string;
  executed: boolean | null;
  executedAt: string | null;
  forkTreasury: string | null;
  forkToken: string | null;
  tokensForkingCount: number;
  tokensInEscrowCount: number;
  forkingPeriodEndTimestamp: string | null;
  addedNouns: string[];
}
export interface ForkSubgraphEntity {
  id: string;
  forkID: string;
  executed: boolean;
  executedAt: string;
  forkTreasury: string;
  forkToken: string;
  tokensForkingCount: number;
  tokensInEscrowCount: number;
  forkingPeriodEndTimestamp: string;
  escrowedNouns: {
    noun: {
      id: string;
    }
  }[];
  joinedNouns: {
    noun: {
      id: string;
    }
  }[];
}

const abi = new utils.Interface(NounsDAOV3ABI);
const nounsDaoContract = NounsDaoLogicV3Factory.connect(config.addresses.nounsDAOProxy, undefined!);

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
export const extractTitle = (body: string | undefined): string | null => {
  if (!body) return null;
  const hashResult = extractHashTitle(body);
  const equalResult = extractEqualTitle(body);
  return hashResult ? hashResult[1] : equalResult ? equalResult[1] : null;
};

const removeBold = (text: string | null): string | null =>
  text ? text.replace(/\*\*/g, '') : text;
const removeItalics = (text: string | null): string | null =>
  text ? text.replace(/__/g, '') : text;

export const removeMarkdownStyle = R.compose(removeBold, removeItalics);

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

export const formatProposalTransactionDetails = (details: ProposalTransactionDetails | Result) => {
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

export const formatProposalTransactionDetailsToUpdate = (
  details: ProposalTransactionDetails | Result,
) => {
  return details.targets.map((target: string, i: number) => {
    const signature: string = details.signatures[i];
    const value = EthersBN.from(
      // Handle both logs and subgraph responses
      (details as ProposalTransactionDetails).values?.[i] ?? (details as Result)?.[3]?.[i] ?? 0,
    );
    const callData = details.calldatas[i];

    // Split at first occurrence of '('
    // todo: confirm name, types are unused
    // let [name, types] = signature.substring(0, signature.length - 1)?.split(/\((.*)/s);

    // We failed to decode. Display the raw calldata, appending function selectors if they exist.
    return {
      signature: signature,
      target,
      callData: callData,
      value: value,
    };
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
    if (blockNumber <= parseInt(proposal.updatePeriodEndBlock)) {
      return ProposalState.UPDATABLE;
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
      if (parseInt(proposal.objectionPeriodEndBlock) > 0) {
        return ProposalState.OBJECTION_PERIOD;
      }
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
  toUpdate?: boolean,
) => {
  if (!proposal) {
    return;
  }
  const description = proposal.description?.replace(/\\n/g, '\n').replace(/(^['"]|['"]$)/g, '');
  let details;
  if (toUpdate) {
    details = formatProposalTransactionDetailsToUpdate(proposal);
  } else {
    details = formatProposalTransactionDetails(proposal);
  }
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
    details: details,
    transactionHash: proposal.createdTransactionHash,
    objectionPeriodEndBlock: parseInt(proposal.objectionPeriodEndBlock),
    updatePeriodEndBlock: parseInt(proposal.updatePeriodEndBlock),
    signers: proposal.signers,
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
          objectionPeriodEndBlock: 0, // TODO: this should read from the contract
          forCount: parseInt(proposal?.forVotes?.toString() ?? '0'),
          againstCount: parseInt(proposal?.againstVotes?.toString() ?? '0'),
          abstainCount: parseInt(proposal?.abstainVotes?.toString() ?? '0'),
          quorumVotes: parseInt(proposal?.quorumVotes?.toString() ?? '0'),
          eta: proposal?.eta ? new Date(proposal?.eta?.toNumber() * 1000) : undefined,
          updatePeriodEndBlock: parseInt(proposal?.updatePeriodEndBlock?.toString() ?? ''),
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

export const useProposal = (id: string | number, toUpdate?: boolean): Proposal | undefined => {
  const blockNumber = useBlockNumber();
  const timestamp = useBlockTimestamp(blockNumber);
  return parseSubgraphProposal(
    useQuery(proposalQuery(id)).data?.proposal,
    blockNumber,
    timestamp,
    toUpdate,
  );
};

export const useProposalTitles = (ids: number[]): ProposalTitle[] | undefined => {
  const proposals: ProposalTitle[] | undefined = useQuery(proposalTitlesQuery(ids)).data?.proposals;
  return proposals;
};

export const useProposalVersions = (id: string | number): ProposalVersion[] | undefined => {
  const proposalVersions = useQuery(proposalVersionsQuery(id)).data?.proposalVersions;
  const sortedProposalVersions =
    proposalVersions &&
    [...proposalVersions].sort((a: ProposalVersion, b: ProposalVersion) =>
      a.createdAt > b.createdAt ? 1 : -1,
    );
  const sortedNumberedVersions = sortedProposalVersions?.map((proposalVersion: any, i: number) => {
    return {
      id: proposalVersion.id,
      versionNumber: i + 1,
      createdAt: proposalVersion.createdAt,
      updateMessage: proposalVersion.updateMessage,
      description: proposalVersion.description,
      targets: proposalVersion.targets,
      values: proposalVersion.values,
      signatures: proposalVersion.signatures,
      calldatas: proposalVersion.calldatas,
      title: proposalVersion.title,
      details: formatProposalTransactionDetails(proposalVersion),
      proposal: {
        id: proposalVersion.proposal.id,
      },
    };
  });

  return sortedNumberedVersions;
};

export const useCancelSignature = () => {
  const { send: cancelSig, state: cancelSigState } = useContractFunction(
    nounsDaoContract,
    'cancelSig',
  );
  return { cancelSig, cancelSigState };
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

export const useUpdateProposal = () => {
  const { send: updateProposal, state: updateProposalState } = useContractFunction(
    nounsDaoContract,
    'updateProposal',
  );
  return { updateProposal, updateProposalState };
};

export const useUpdateProposalTransactions = () => {
  const { send: updateProposalTransactions, state: updateProposaTransactionsState } = useContractFunction(
    nounsDaoContract,
    'updateProposalTransactions',
  );
  return { updateProposalTransactions, updateProposaTransactionsState };
};

export const useUpdateProposalDescription = () => {
  const { send: updateProposalDescription, state: updateProposalDescriptionState } = useContractFunction(
    nounsDaoContract,
    'updateProposalDescription',
  );
  return { updateProposalDescription, updateProposalDescriptionState };
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
  console.log('useExecuteProposal', executeProposalState)
  return { executeProposal, executeProposalState };
};

// fork functions 
export const useEscrowToFork = () => {
  const { send: escrowToFork, state: escrowToForkState } = useContractFunction(
    nounsDaoContract,
    'escrowToFork',
  );
  return { escrowToFork, escrowToForkState };
}

export const useWithdrawFromForkEscrow = () => {
  const { send: withdrawFromForkEscrow, state: withdrawFromForkEscrowState } = useContractFunction(
    nounsDaoContract,
    'withdrawFromForkEscrow',
  );
  return { withdrawFromForkEscrow, withdrawFromForkEscrowState };
}


export const useJoinFork = () => {
  const { send: joinFork, state: joinForkState } = useContractFunction(
    nounsDaoContract,
    'joinFork',
  );
  return { joinFork, joinForkState };
}

export const useIsForkPeriodActive = (): boolean => {
  const [isForkPeriodActive] =
    useContractCall<[boolean]>({
      abi,
      address: nounsDaoContract.address,
      method: 'isForkPeriodActive',
      args: [],
    }) || [];
  return isForkPeriodActive ?? false;
}

export const useForkThreshold = () => {
  const [forkThreshold] = useContractCall<[EthersBN]>({
    abi,
    address: config.addresses.nounsDAOProxy,
    method: 'forkThreshold',
    args: [],
  }) || [];
  return forkThreshold?.toNumber();
}

export const useNumTokensInForkEscrow = (): number | undefined => {
  const [numTokensInForkEscrow] =
    useContractCall<[EthersBN]>({
      abi,
      address: nounsDaoContract.address,
      method: 'numTokensInForkEscrow',
      args: [],
    }) || [];
  return numTokensInForkEscrow?.toNumber();
}

export const useEscrowDepositEvents = (pollInterval: number, forkId: string) => {
  const { loading, data, error, refetch } = useQuery(
    escrowDepositEventsQuery(forkId), {
    pollInterval: pollInterval,
  }) as { loading: boolean, data: { escrowDeposits: EscrowDeposit[] }, error: Error, refetch: () => void }
  const escrowDeposits = data?.escrowDeposits?.map((escrowDeposit) => {
    const proposalIDs = escrowDeposit.proposalIDs.map((id) => id);
    return {
      eventType: 'EscrowDeposit',
      id: escrowDeposit.id,
      createdAt: escrowDeposit.createdAt,
      owner: { id: escrowDeposit.owner.id },
      reason: escrowDeposit.reason,
      tokenIDs: escrowDeposit.tokenIDs,
      proposalIDs: proposalIDs,
    };
  });

  return {
    loading,
    error,
    data: escrowDeposits as EscrowDeposit[] ?? [],
    refetch
  };
}

export const useEscrowWithdrawalEvents = (pollInterval: number, forkId: string) => {
  const { loading, data, error, refetch } = useQuery(
    escrowWithdrawEventsQuery(forkId), {
    pollInterval: pollInterval,
  }) as { loading: boolean, data: { escrowWithdrawals: EscrowWithdrawal[] }, error: Error, refetch: () => void };
  const escrowWithdrawals = data?.escrowWithdrawals?.map((escrowWithdrawal: EscrowWithdrawal) => {
    return {
      eventType: 'EscrowWithdrawal',
      id: escrowWithdrawal.id,
      createdAt: escrowWithdrawal.createdAt,
      owner: { id: escrowWithdrawal.owner.id },
      tokenIDs: escrowWithdrawal.tokenIDs,
    };
  },
  );

  return {
    loading,
    error,
    data: escrowWithdrawals as EscrowWithdrawal[] ?? [],
    refetch
  };
}

// helper function to add fork cycle events to escrow events
const eventsWithforkCycleEvents = (events: (EscrowDeposit | EscrowWithdrawal | ForkCycleEvent)[], forkDetails: Fork) => {
  const now = new Date();
  const currentTime = now.getTime() / 1000;
  const endTimestamp = forkDetails.forkingPeriodEndTimestamp && +forkDetails.forkingPeriodEndTimestamp;
  const started: ForkCycleEvent = {
    eventType: 'ForkStarted',
    id: 'fork-started',
    createdAt: `${(events[0]?.createdAt && +events[0]?.createdAt - 1)}`,
  };
  const executed: ForkCycleEvent = {
    eventType: 'ForkExecuted',
    id: 'fork-executed',
    createdAt: forkDetails.executedAt,
  };
  const forkEnded: ForkCycleEvent = {
    eventType: 'ForkingEnded',
    id: 'fork-ended',
    // createdAt: endTimestamp && forkDetails.executed && endTimestamp < currentTime ? null : endTimestamp ? `${endTimestamp + 1}` : null,
    createdAt: endTimestamp ? endTimestamp.toString() : null,
  };
  const forkEvents: ForkCycleEvent[] = [
    started,
    executed,
    forkEnded,
    // {
    //   eventType: 'ForkStarted',
    //   id: 'fork-started',
    //   createdAt: `${(+events[0]?.createdAt - 1)}`,
    // },
    // {
    //   eventType: 'ForkExecuted',
    //   id: 'fork-executed',
    //   createdAt: forkDetails.executedAt,
    // },
    // {
    //   eventType: 'ForkingEnded',
    //   id: 'fork-ended',
    //   createdAt: forkDetails.forkingPeriodEndTimestamp,
    // },
  ];
  const sortedEvents = [...events, ...forkEvents].sort((a: EscrowDeposit | EscrowWithdrawal | ForkCycleEvent, b: EscrowDeposit | EscrowWithdrawal | ForkCycleEvent) => {
    return a.createdAt && b.createdAt && a.createdAt > b.createdAt ? -1 : 1;
  });
  const filteredEvents = sortedEvents.filter((event: EscrowDeposit | EscrowWithdrawal | ForkCycleEvent) => {
    return event.createdAt !== '0';
  });
  return sortedEvents;
}

export const useEscrowEvents = (pollInterval: number, forkId: string) => {
  const { loading: depositsLoading, data: depositEvents, error: depositsError, refetch: refetchEscrowDepositEvents } = useEscrowDepositEvents(pollInterval, forkId);
  const { loading: withdrawalsLoading, data: withdrawalEvents, error: withdrawalsError, refetch: refetchEscrowWithdrawalEvents } = useEscrowWithdrawalEvents(pollInterval, forkId);
  const { loading: forkDetailsLoading, data: forkDetails, error: forkDetailsError, refetch: refetchForkDetails } = useForkDetails(pollInterval, forkId);

  const loading = depositsLoading || withdrawalsLoading;
  const error = depositsError || withdrawalsError;
  const data: (EscrowDeposit | EscrowWithdrawal)[] = [...depositEvents, ...withdrawalEvents];

  // const sortedData = data.sort((a: EscrowDeposit | EscrowWithdrawal, b: EscrowDeposit | EscrowWithdrawal) => {
  //   return a.createdAt > b.createdAt ? -1 : 1;
  // });
  // get fork details to pass to forkCycleEvents
  const events = eventsWithforkCycleEvents(data, forkDetails);

  return {
    loading,
    error,
    data: events,
    refetch: () => {
      refetchEscrowDepositEvents();
      refetchEscrowWithdrawalEvents();
    }
  }
}

export const useForkDetails = (pollInterval: number, id: string) => {
  const { loading, data: forkData, error, refetch } = useQuery(
    forkDetailsQuery(id.toString()), {
    pollInterval: pollInterval,
  }) as { loading: boolean, data: { fork: ForkSubgraphEntity }, error: Error, refetch: () => void };
  const joined = forkData?.fork?.joinedNouns?.map((item) => item.noun.id) ?? [];
  const escrowed = forkData?.fork?.escrowedNouns?.map((item) => item.noun.id) ?? [];
  console.log(forkData);
  // const data = forkData?.fork;
  const addedNouns = [...escrowed, ...joined];
  // const sortedNouns = [...forkData?.fork?.joinedNouns, ...forkData?.fork?.escrowedNouns].sort((a, b) => { return a.noun.id > b.noun.id ? 1 : -1 });

  const data = {
    ...forkData?.fork,
    addedNouns: addedNouns,
  } as Fork;
  return {
    loading,
    data,
    error,
    refetch,
  }
}

export const useForks = (pollInterval: number) => {
  const { loading, data: forksData, error, refetch } = useQuery(
    forksQuery(), {
    pollInterval: pollInterval,
  }) as { loading: boolean, data: { forks: Fork[] }, error: Error, refetch: () => void };
  const data = forksData?.forks;
  return {
    loading,
    data,
    error,
    refetch,
  }
}


export const useExecuteFork = () => {
  const { send: executeFork, state: executeForkState } = useContractFunction(
    nounsDaoContract,
    'executeFork',
  );
  return { executeFork, executeForkState };
}