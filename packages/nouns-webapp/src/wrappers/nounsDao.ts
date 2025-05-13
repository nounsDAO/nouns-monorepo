import type { Address } from '@/utils/types';

import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { NounsDaoLogicFactory, NounsDAOV3ABI } from '@nouns/sdk';
import {
  ChainId,
  useBlockNumber,
  useContractCall,
  useContractCalls,
  useContractFunction,
} from '@usedapp/core';
import { BigNumber as EthersBN, utils } from 'ethers';
import { defaultAbiCoder, keccak256, Result, toUtf8Bytes } from 'ethers/lib/utils';
import * as R from 'remeda';
import { formatEther } from 'viem';

import config, { CHAIN_ID } from '@/config';
import { useBlockTimestamp } from '@/hooks/useBlockTimestamp';
import { useLogs } from '@/hooks/useLogs';

import {
  activePendingUpdatableProposersQuery,
  escrowDepositEventsQuery,
  escrowWithdrawEventsQuery,
  forkDetailsQuery,
  forkJoinsQuery,
  forksQuery,
  isForkActiveQuery,
  partialProposalsQuery,
  proposalQuery,
  proposalTitlesQuery,
  proposalVersionsQuery,
  updatableProposalsQuery,
} from './subgraph';
import {
  useReadNounsGovernorGetReceipt,
  useReadNounsGovernorProposalCount,
  useReadNounsGovernorProposalThreshold,
  useWriteNounsGovernorCancel,
  useWriteNounsGovernorCancelSig,
  useWriteNounsGovernorCastRefundableVote,
  useWriteNounsGovernorCastRefundableVoteWithReason,
  useWriteNounsGovernorEscrowToFork,
  useWriteNounsGovernorExecute,
  useWriteNounsGovernorJoinFork,
  useWriteNounsGovernorPropose,
  useWriteNounsGovernorProposeOnTimelockV1,
  useWriteNounsGovernorQueue,
  useWriteNounsGovernorUpdateProposal,
  useWriteNounsGovernorUpdateProposalDescription,
  useWriteNounsGovernorUpdateProposalTransactions,
  useWriteNounsGovernorWithdrawFromForkEscrow,
} from '@/contracts';
import { useAccount } from 'wagmi';

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

export enum ForkState {
  UNDETERMINED = -1,
  ESCROW,
  ACTIVE,
  EXECUTED,
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
  createdTimestamp: number;
  proposer: Address | undefined;
  proposalThreshold: number;
  details: ProposalDetail[];
  transactionHash: string;
  signers: { id: Address }[];
  onTimelockV1: boolean;
  voteSnapshotBlock: number;
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
  onTimelockV1: boolean | null;
  signers: { id: Address }[];
}

export interface ProposalSubgraphEntity
  extends ProposalTransactionDetails,
    PartialProposalSubgraphEntity {
  description: string;
  createdBlock: string;
  createdTransactionHash: string;
  createdTimestamp: string;
  proposer: { id: Address };
  proposalThreshold: string;
  onTimelockV1: boolean;
  voteSnapshotBlock: string;
}

interface PartialProposalData {
  data: PartialProposal[];
  error?: Error;
  loading: boolean;
}

export interface ProposalProposerAndSigners {
  id: string;
  proposer: {
    id: string;
  };
  signers: {
    id: string;
  }[];
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
  eventType: 'EscrowDeposit' | 'ForkJoin';
  id: string;
  createdAt: string;
  owner: { id: Address };
  reason: string;
  tokenIDs: string[];
  proposalIDs: number[];
}

export interface EscrowWithdrawal {
  eventType: 'EscrowWithdrawal';
  id: string;
  createdAt: string;
  owner: { id: Address };
  tokenIDs: string[];
}

export interface ForkCycleEvent {
  eventType: 'ForkStarted' | 'ForkExecuted' | 'ForkingEnded';
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
    };
  }[];
  joinedNouns: {
    noun: {
      id: string;
    };
  }[];
}

const abi = new utils.Interface(NounsDAOV3ABI);
const nounsDaoContract = NounsDaoLogicFactory.connect(config.addresses.nounsDAOProxy, undefined!);

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
const extractHashTitle = (body: string) => RegExp(hashRegex).exec(body);
/**
 * Extract a markdown title from a proposal body that uses the `Title\n===` format.
 * Returns null if no title found.
 */
const extractEqualTitle = (body: string) => RegExp(equalTitleRegex).exec(body);

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

const removeBold = (text: string): string => text.replace(/\*\*/g, '');
const removeItalics = (text: string): string => text.replace(/__/g, '');

export const removeMarkdownStyle = (text: string | null): string | null =>
  text === null ? null : R.pipe(text, removeBold, removeItalics);
/**
 * Add missing schemes to markdown links in a proposal's description.
 * @param descriptionText The description text of a proposal
 */
const addMissingSchemes = (descriptionText: string | undefined) => {
  const regex = /\[(.*?)\]\(((?!https?:\/\/|#)[^)]+)\)/g;
  const replacement = '[$1](https://$2)';

  return descriptionText?.replace(regex, replacement);
};

/**
 * Replace invalid dropbox image download links in a proposal's description.
 * @param descriptionText The description text of a proposal
 */
const replaceInvalidDropboxImageLinks = (descriptionText: string | undefined) => {
  const regex = /(https:\/\/www.dropbox.com\/([^?]+))\?dl=1/g;
  const replacement = '$1?raw=1';

  return descriptionText?.replace(regex, replacement);
};

export const useCurrentQuorum = (
  nounsDao: string,
  proposalId: number,
  skip = false,
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

export function useDynamicQuorumProps(block: bigint): DynamicQuorumParams | undefined {
  // @ts-ignore
  const { data } = useReadNounsGovernorGetDynamicQuorumParamsAt({
    args: [block],
  });

  if (!data) return undefined;

  return {
    minQuorumVotesBPS: Number(data.minQuorumVotesBPS),
    maxQuorumVotesBPS: Number(data.maxQuorumVotesBPS),
    quorumCoefficient: Number(data.quorumCoefficient),
  };
}

export function useHasVotedOnProposal(proposalId: bigint): boolean {
  const { address } = useAccount();
  // @ts-ignore
  const { data: receipt } = useReadNounsGovernorGetReceipt({
    args: [proposalId, address!],
    query: { enabled: Boolean(proposalId && address) },
  });

  return receipt?.hasVoted ?? false;
}

export function useProposalVote(proposalId: bigint): 'Against' | 'For' | 'Abstain' | '' {
  const { address } = useAccount();
  const enabled = Boolean(proposalId) && Boolean(address);

  // @ts-ignore
  const { data: receipt } = useReadNounsGovernorGetReceipt({
    args: [proposalId, address!],
    query: { enabled },
  });

  const voteStatus = receipt ? Number(receipt.support) : -1;

  if (voteStatus === 0) return 'Against';
  if (voteStatus === 1) return 'For';
  if (voteStatus === 2) return 'Abstain';
  return '';
}

export function useProposalCount(): number | undefined {
  const { data: count } = useReadNounsGovernorProposalCount();

  return count != null ? Number(count) : undefined;
}

export function useProposalThreshold(): number | undefined {
  const { data: threshold } = useReadNounsGovernorProposalThreshold();

  return threshold != null ? Number(threshold) : undefined;
}

const countToIndices = (count: number | undefined) => {
  return typeof count === 'number' ? new Array(count).fill(0).map((_, i) => [i + 1]) : [];
};

export const concatSelectorToCalldata = (signature: string, callData: string) => {
  if (signature) {
    return `${keccak256(toUtf8Bytes(signature)).substring(0, 10)}${callData.substring(2)}`;
  }
  return callData;
};

const determineCallData = (types: string | undefined, value: EthersBN | undefined): string => {
  if (types) {
    return types;
  }
  if (value) {
    return `${formatEther(value.toBigInt())} ETH`;
  }
  return '';
};

export const formatProposalTransactionDetails = (details: ProposalTransactionDetails | Result) => {
  return details?.targets?.map((target: string, i: number) => {
    const signature: string = details.signatures[i];
    const value = EthersBN.from(
      // Handle both logs and subgraph responses
      (details as ProposalTransactionDetails).values?.[i] ?? (details as Result)?.[3]?.[i] ?? 0,
    );
    const callData = details.calldatas[i];

    // Split at first occurrence of '('
    const [name, types] = signature.substring(0, signature.length - 1)?.split(/\((.*)/s);
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
        functionSig: name === '' ? 'transfer' : name == undefined ? 'unknown' : name,
        callData: determineCallData(types, value),
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
      console.error('Failed to decode calldata:', error);
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
  return details?.targets.map((target: string, i: number) => {
    const signature: string = details.signatures[i];
    const value = EthersBN.from(
      // Handle both logs and subgraph responses
      (details as ProposalTransactionDetails).values?.[i] ?? (details as Result)?.[3]?.[i],
    );
    const callData = details.calldatas[i];
    return {
      target,
      functionSig: signature,
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
  proposal: PartialProposalSubgraphEntity | ProposalSubgraphEntity,
  isDaoGteV3?: boolean,
  onTimelockV1?: boolean,
) => {
  const status = ProposalState[proposal.status];
  if (status === ProposalState.PENDING || status === ProposalState.ACTIVE) {
    if (!blockNumber) {
      return ProposalState.UNDETERMINED;
    }
    if (
      isDaoGteV3 &&
      proposal.updatePeriodEndBlock &&
      blockNumber <= parseInt(proposal.updatePeriodEndBlock)
    ) {
      return ProposalState.UPDATABLE;
    }

    if (blockNumber <= parseInt(proposal.startBlock)) {
      return ProposalState.PENDING;
    }

    if (
      isDaoGteV3 &&
      blockNumber > +proposal.endBlock &&
      parseInt(proposal.objectionPeriodEndBlock) > 0 &&
      blockNumber <= parseInt(proposal.objectionPeriodEndBlock)
    ) {
      return ProposalState.OBJECTION_PERIOD;
    }

    // if past endblock, but onchain status hasn't been changed
    if (
      blockNumber > parseInt(proposal.endBlock) &&
      blockNumber > parseInt(proposal.objectionPeriodEndBlock)
    ) {
      const forVotes = BigInt(proposal.forVotes);
      if (forVotes <= BigInt(proposal.againstVotes) || forVotes < BigInt(proposal.quorumVotes)) {
        return ProposalState.DEFEATED;
      }
      if (!proposal.executionETA) {
        return ProposalState.SUCCEEDED;
      }
    }
    return ProposalState.ACTIVE;
  }

  // if queued, check if expired
  if (status === ProposalState.QUEUED) {
    if (!blockTimestamp || !proposal.executionETA) {
      return ProposalState.UNDETERMINED;
    }
    // if v3+ and not on time lock v1, grace period is 21 days, otherwise 14 days
    const GRACE_PERIOD = isDaoGteV3 && !onTimelockV1 ? 21 * 60 * 60 * 24 : 14 * 60 * 60 * 24;
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
  isDaoGteV3?: boolean,
) => {
  if (!proposal) {
    return;
  }
  const onTimelockV1 = proposal.onTimelockV1 !== null;
  return {
    id: proposal.id,
    title: proposal.title ?? 'Untitled',
    status: getProposalState(
      blockNumber,
      new Date((timestamp ?? 0) * 1000),
      proposal,
      isDaoGteV3,
      onTimelockV1,
    ),
    startBlock: parseInt(proposal.startBlock),
    endBlock: parseInt(proposal.endBlock),
    updatePeriodEndBlock: parseInt(proposal.updatePeriodEndBlock),
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
  isDaoGteV3?: boolean,
) => {
  if (!proposal) {
    return;
  }
  const description = addMissingSchemes(
    replaceInvalidDropboxImageLinks(
      proposal.description?.replace(/\\n/g, '\n').replace(/(^['"]|['"]$)/g, ''),
    ),
  );
  const transactionDetails: ProposalTransactionDetails = {
    targets: proposal.targets,
    values: proposal.values,
    signatures: proposal.signatures,
    calldatas: proposal.calldatas,
    encodedProposalHash: proposal.encodedProposalHash,
  };

  let details;
  if (toUpdate) {
    details = formatProposalTransactionDetailsToUpdate(transactionDetails);
  } else {
    details = formatProposalTransactionDetails(transactionDetails);
  }
  const onTimelockV1 = proposal.onTimelockV1 != null;
  return {
    id: proposal.id,
    title: R.pipe(description, extractTitle, removeMarkdownStyle) ?? 'Untitled',
    description: description ?? 'No description.',
    proposer: proposal.proposer?.id,
    status: getProposalState(
      blockNumber,
      new Date((timestamp ?? 0) * 1000),
      proposal,
      isDaoGteV3,
      onTimelockV1,
    ),
    proposalThreshold: parseInt(proposal.proposalThreshold),
    quorumVotes: parseInt(proposal.quorumVotes),
    forCount: parseInt(proposal.forVotes),
    againstCount: parseInt(proposal.againstVotes),
    abstainCount: parseInt(proposal.abstainVotes),
    createdBlock: parseInt(proposal.createdBlock),
    startBlock: parseInt(proposal.startBlock),
    endBlock: parseInt(proposal.endBlock),
    createdTimestamp: parseInt(proposal.createdTimestamp),
    eta: proposal.executionETA ? new Date(Number(proposal.executionETA) * 1000) : undefined,
    details: details,
    transactionHash: proposal.createdTransactionHash,
    objectionPeriodEndBlock: parseInt(proposal.objectionPeriodEndBlock),
    updatePeriodEndBlock: parseInt(proposal.updatePeriodEndBlock),
    signers: proposal.signers,
    onTimelockV1: onTimelockV1,
    voteSnapshotBlock: parseInt(proposal.voteSnapshotBlock),
  };
};

export const useAllProposalsViaSubgraph = (): PartialProposalData => {
  const { loading, data, error } = useQuery(partialProposalsQuery());
  const isDaoGteV3 = useIsDaoGteV3();
  const blockNumber = useBlockNumber();
  const timestamp = useBlockTimestamp(blockNumber);
  const proposals = data?.proposals?.map((proposal: ProposalSubgraphEntity) =>
    parsePartialSubgraphProposal(proposal, blockNumber, timestamp, isDaoGteV3),
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
        const description = addMissingSchemes(logs[i]?.description?.replace(/\\n/g, '\n'));
        return {
          id: proposal?.id.toString(),
          title: R.pipe(description, extractTitle, removeMarkdownStyle) ?? 'Untitled',
          status: proposalStates[i]?.[0] ?? ProposalState.UNDETERMINED,
          startBlock: parseInt(proposal?.startBlock?.toString() ?? ''),
          endBlock: parseInt(proposal?.endBlock?.toString() ?? ''),
          objectionPeriodEndBlock: parseInt(proposal?.objectionPeriodEndBlock.toString() ?? ''),
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
  const isDaoGteV3 = useIsDaoGteV3();
  const proposal = useQuery(proposalQuery(id)).data?.proposal;
  return parseSubgraphProposal(proposal, blockNumber, timestamp, toUpdate, isDaoGteV3);
};

export const useProposalTitles = (ids: number[]): ProposalTitle[] | undefined => {
  const proposals: ProposalTitle[] | undefined = useQuery(proposalTitlesQuery(ids)).data?.proposals;
  return proposals;
};

export const useProposalVersions = (id: string | number): ProposalVersion[] | undefined => {
  const proposalVersions: ProposalVersion[] = useQuery(proposalVersionsQuery(id)).data
    ?.proposalVersions;
  const sortedProposalVersions =
    proposalVersions &&
    [...proposalVersions].sort((a: ProposalVersion, b: ProposalVersion) =>
      a.createdAt > b.createdAt ? 1 : -1,
    );
  const sortedNumberedVersions = sortedProposalVersions?.map(
    (proposalVersion: ProposalVersion, i: number) => {
      const details: ProposalTransactionDetails = {
        targets: proposalVersion.targets,
        values: proposalVersion.values,
        signatures: proposalVersion.signatures,
        calldatas: proposalVersion.calldatas,
        encodedProposalHash: '',
      };
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
        details: formatProposalTransactionDetails(details),
        proposal: {
          id: proposalVersion.proposal.id,
        },
      };
    },
  );

  return sortedNumberedVersions;
};

export function useCancelSignature() {
  const {
    data: hash,
    writeContractAsync: cancelSig,
    isPending: isCancelPending,
    isSuccess: isCancelSuccess,
    error: cancelError,
  } = useWriteNounsGovernorCancelSig();

  let status = 'None';
  if (isCancelPending) status = 'Mining';
  else if (isCancelSuccess) status = 'Success';
  else if (cancelError) status = 'Fail';

  const cancelSigState = {
    status,
    errorMessage: cancelError?.message,
    transaction: { hash },
  };

  return {
    cancelSig,
    cancelSigState,
  };
}

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

export function useCastRefundableVote() {
  const {
    data: hash,
    writeContractAsync: castRefundableVote,
    isPending: isCastRefundableVotePending,
    isSuccess: isCastRefundableVoteSuccess,
    error: castRefundableVoteError,
  } = useWriteNounsGovernorCastRefundableVote();

  let status = 'None';
  if (isCastRefundableVotePending) status = 'Mining';
  else if (isCastRefundableVoteSuccess) status = 'Success';
  else if (castRefundableVoteError) status = 'Fail';

  const castRefundableVoteState = {
    status,
    errorMessage: castRefundableVoteError?.message,
    transaction: { hash },
  };

  return { castRefundableVote, castRefundableVoteState };
}

export function useCastRefundableVoteWithReason() {
  const {
    data: hash,
    writeContractAsync: castRefundableVoteWithReason,
    isPending: isCastRefundableVoteWithReasonPending,
    isSuccess: isCastRefundableVoteWithReasonSuccess,
    error: castRefundableVoteWithReasonError,
  } = useWriteNounsGovernorCastRefundableVoteWithReason();

  let status = 'None';
  if (isCastRefundableVoteWithReasonPending) status = 'Mining';
  else if (isCastRefundableVoteWithReasonSuccess) status = 'Success';
  else if (castRefundableVoteWithReasonError) status = 'Fail';

  const castRefundableVoteWithReasonState = {
    status,
    errorMessage: castRefundableVoteWithReasonError?.message,
    transaction: { hash },
  };

  return { castRefundableVoteWithReason, castRefundableVoteWithReasonState };
}

export function usePropose() {
  const {
    data: hash,
    writeContractAsync: propose,
    isPending: isProposePending,
    isSuccess: isProposeSuccess,
    error: proposeError,
  } = useWriteNounsGovernorPropose();

  let status = 'None';
  if (isProposePending) status = 'Mining';
  else if (isProposeSuccess) status = 'Success';
  else if (proposeError) status = 'Fail';

  const proposeState = {
    status,
    errorMessage: proposeError?.message,
    transaction: { hash },
  };

  return { propose, proposeState };
}

export function useProposeOnTimelockV1() {
  const {
    data: hash,
    writeContractAsync: proposeOnTimelockV1,
    isPending: isProposeOnTimelockV1Pending,
    isSuccess: isProposeOnTimelockV1Success,
    error: proposeOnTimelockV1Error,
  } = useWriteNounsGovernorProposeOnTimelockV1();

  let status = 'None';
  if (isProposeOnTimelockV1Pending) status = 'Mining';
  else if (isProposeOnTimelockV1Success) status = 'Success';
  else if (proposeOnTimelockV1Error) status = 'Fail';

  const proposeOnTimelockV1State = {
    status,
    errorMessage: proposeOnTimelockV1Error?.message,
    transaction: { hash },
  };

  return { proposeOnTimelockV1, proposeOnTimelockV1State };
}

export function useUpdateProposal() {
  const {
    data: hash,
    writeContractAsync: updateProposal,
    isPending: isUpdateProposalPending,
    isSuccess: isUpdateProposalSuccess,
    error: updateProposalError,
  } = useWriteNounsGovernorUpdateProposal();

  let status = 'None';
  if (isUpdateProposalPending) status = 'Mining';
  else if (isUpdateProposalSuccess) status = 'Success';
  else if (updateProposalError) status = 'Fail';

  const updateProposalState = {
    status,
    errorMessage: updateProposalError?.message,
    transaction: { hash },
  };

  return { updateProposal, updateProposalState };
}

export function useUpdateProposalTransactions() {
  const {
    data: hash,
    writeContractAsync: updateProposalTransactions,
    isPending: isUpdateProposalTransactionsPending,
    isSuccess: isUpdateProposalTransactionsSuccess,
    error: updateProposalTransactionsError,
  } = useWriteNounsGovernorUpdateProposalTransactions();

  let status = 'None';
  if (isUpdateProposalTransactionsPending) status = 'Mining';
  else if (isUpdateProposalTransactionsSuccess) status = 'Success';
  else if (updateProposalTransactionsError) status = 'Fail';

  const updateProposalTransactionsState = {
    status,
    errorMessage: updateProposalTransactionsError?.message,
    transaction: { hash },
  };

  return { updateProposalTransactions, updateProposalTransactionsState };
}

export function useUpdateProposalDescription() {
  const {
    data: hash,
    writeContractAsync: updateProposalDescription,
    isPending: isUpdateProposalDescriptionPending,
    isSuccess: isUpdateProposalDescriptionSuccess,
    error: updateProposalDescriptionError,
  } = useWriteNounsGovernorUpdateProposalDescription();

  let status = 'None';
  if (isUpdateProposalDescriptionPending) status = 'Mining';
  else if (isUpdateProposalDescriptionSuccess) status = 'Success';
  else if (updateProposalDescriptionError) status = 'Fail';

  const updateProposalDescriptionState = {
    status,
    errorMessage: updateProposalDescriptionError?.message,
    transaction: { hash },
  };

  return { updateProposalDescription, updateProposalDescriptionState };
}

export function useQueueProposal() {
  const {
    data: hash,
    writeContractAsync: queueProposal,
    isPending: isQueueProposalPending,
    isSuccess: isQueueProposalSuccess,
    error: queueProposalError,
  } = useWriteNounsGovernorQueue();

  let status = 'None';
  if (isQueueProposalPending) status = 'Mining';
  else if (isQueueProposalSuccess) status = 'Success';
  else if (queueProposalError) status = 'Fail';

  const queueProposalState = {
    status,
    errorMessage: queueProposalError?.message,
    transaction: { hash },
  };

  return { queueProposal, queueProposalState };
}

export function useCancelProposal() {
  const {
    data: hash,
    writeContractAsync: cancelProposal,
    isPending: isCancelProposalPending,
    isSuccess: isCancelProposalSuccess,
    error: cancelProposalError,
  } = useWriteNounsGovernorCancel();

  let status = 'None';
  if (isCancelProposalPending) status = 'Mining';
  else if (isCancelProposalSuccess) status = 'Success';
  else if (cancelProposalError) status = 'Fail';

  const cancelProposalState = {
    status,
    errorMessage: cancelProposalError?.message,
    transaction: { hash },
  };

  return { cancelProposal, cancelProposalState };
}

export function useExecuteProposal() {
  const {
    data: hash,
    writeContractAsync: executeProposal,
    isPending: isExecuteProposalPending,
    isSuccess: isExecuteProposalSuccess,
    error: executeProposalError,
  } = useWriteNounsGovernorExecute();

  let status = 'None';
  if (isExecuteProposalPending) status = 'Mining';
  else if (isExecuteProposalSuccess) status = 'Success';
  else if (executeProposalError) status = 'Fail';

  const executeProposalState = {
    status,
    errorMessage: executeProposalError?.message,
    transaction: { hash },
  };

  return { executeProposal, executeProposalState };
}

export const useExecuteProposalOnTimelockV1 = () => {
  const { send: executeProposalOnTimelockV1, state: executeProposalOnTimelockV1State } =
    useContractFunction(nounsDaoContract, 'executeOnTimelockV1');
  return { executeProposalOnTimelockV1, executeProposalOnTimelockV1State };
};

export function useEscrowToFork() {
  const {
    data: hash,
    writeContractAsync: escrowToFork,
    isPending: isEscrowToForkPending,
    isSuccess: isEscrowToForkSuccess,
    error: escrowToForkError,
  } = useWriteNounsGovernorEscrowToFork();

  let status = 'None';
  if (isEscrowToForkPending) status = 'Mining';
  else if (isEscrowToForkSuccess) status = 'Success';
  else if (escrowToForkError) status = 'Fail';

  const escrowToForkState = {
    status,
    errorMessage: escrowToForkError?.message,
    transaction: { hash },
  };

  return { escrowToFork, escrowToForkState };
}

export function useWithdrawFromForkEscrow() {
  const {
    data: hash,
    writeContractAsync: withdrawFromForkEscrow,
    isPending: isWithdrawFromForkEscrowPending,
    isSuccess: isWithdrawFromForkEscrowSuccess,
    error: withdrawFromForkEscrowError,
  } = useWriteNounsGovernorWithdrawFromForkEscrow();

  let status = 'None';
  if (isWithdrawFromForkEscrowPending) status = 'Mining';
  else if (isWithdrawFromForkEscrowSuccess) status = 'Success';
  else if (withdrawFromForkEscrowError) status = 'Fail';

  const withdrawFromForkEscrowState = {
    status,
    errorMessage: withdrawFromForkEscrowError?.message,
    transaction: { hash },
  };

  return { withdrawFromForkEscrow, withdrawFromForkEscrowState };
}

export function useJoinFork() {
  const {
    data: hash,
    writeContractAsync: joinFork,
    isPending: isJoinForkPending,
    isSuccess: isJoinForkSuccess,
    error: joinForkError,
  } = useWriteNounsGovernorJoinFork();

  let status = 'None';
  if (isJoinForkPending) status = 'Mining';
  else if (isJoinForkSuccess) status = 'Success';
  else if (joinForkError) status = 'Fail';

  const joinForkState = {
    status,
    errorMessage: joinForkError?.message,
    transaction: { hash },
  };

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
};

export const useForkThreshold = () => {
  const [forkThreshold] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.nounsDAOProxy,
      method: 'forkThreshold',
      args: [],
    }) || [];
  return forkThreshold?.toNumber();
};

export const useNumTokensInForkEscrow = (): number | undefined => {
  const [numTokensInForkEscrow] =
    useContractCall<[EthersBN]>({
      abi,
      address: nounsDaoContract.address,
      method: 'numTokensInForkEscrow',
      args: [],
    }) || [];
  return numTokensInForkEscrow?.toNumber();
};

export const useEscrowDepositEvents = (pollInterval: number, forkId: string) => {
  const { loading, data, error, refetch } = useQuery(escrowDepositEventsQuery(forkId), {
    pollInterval: pollInterval,
  }) as {
    loading: boolean;
    data: { escrowDeposits: EscrowDeposit[] };
    error: Error;
    refetch: () => void;
  };
  const escrowDeposits = data?.escrowDeposits?.map(escrowDeposit => {
    const proposalIDs = escrowDeposit.proposalIDs.map(id => id);
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
    data: (escrowDeposits as EscrowDeposit[]) ?? [],
    refetch,
  };
};

export const useEscrowWithdrawalEvents = (pollInterval: number, forkId: string) => {
  const { loading, data, error, refetch } = useQuery(escrowWithdrawEventsQuery(forkId), {
    pollInterval: pollInterval,
  }) as {
    loading: boolean;
    data: { escrowWithdrawals: EscrowWithdrawal[] };
    error: Error;
    refetch: () => void;
  };
  const escrowWithdrawals = data?.escrowWithdrawals?.map((escrowWithdrawal: EscrowWithdrawal) => {
    return {
      eventType: 'EscrowWithdrawal',
      id: escrowWithdrawal.id,
      createdAt: escrowWithdrawal.createdAt,
      owner: { id: escrowWithdrawal.owner.id },
      tokenIDs: escrowWithdrawal.tokenIDs,
    };
  });

  return {
    loading,
    error,
    data: (escrowWithdrawals as EscrowWithdrawal[]) ?? [],
    refetch,
  };
};

// Define a type alias for the events union type
type EscrowEvent = EscrowDeposit | EscrowWithdrawal | ForkCycleEvent;

// helper function to add fork cycle events to escrow events
const eventsWithforkCycleEvents = (events: EscrowEvent[], forkDetails: Fork) => {
  const endTimestamp =
    forkDetails.forkingPeriodEndTimestamp && +forkDetails.forkingPeriodEndTimestamp;
  const executed: ForkCycleEvent = {
    eventType: 'ForkExecuted',
    id: 'fork-executed',
    createdAt: forkDetails.executedAt,
  };
  const forkEnded: ForkCycleEvent = {
    eventType: 'ForkingEnded',
    id: 'fork-ended',
    createdAt: endTimestamp ? endTimestamp.toString() : null,
  };
  const forkEvents: ForkCycleEvent[] = [executed, forkEnded];

  const sortedEvents = [...events, ...forkEvents].sort((a: EscrowEvent, b: EscrowEvent) => {
    return a.createdAt && b.createdAt && a.createdAt > b.createdAt ? -1 : 1;
  });
  return sortedEvents;
};

export const useForkJoins = (pollInterval: number, forkId: string) => {
  const { loading, data, error, refetch } = useQuery(forkJoinsQuery(forkId), {
    pollInterval: pollInterval,
  }) as {
    loading: boolean;
    data: { forkJoins: EscrowDeposit[] };
    error: Error;
    refetch: () => void;
  };
  const forkJoins = data?.forkJoins?.map(forkJoin => {
    const proposalIDs = forkJoin.proposalIDs.map(id => id);
    return {
      eventType: 'ForkJoin',
      id: forkJoin.id,
      createdAt: forkJoin.createdAt,
      owner: { id: forkJoin.owner.id },
      fork: { id: forkId },
      reason: forkJoin.reason,
      tokenIDs: forkJoin.tokenIDs,
      proposalIDs: proposalIDs,
    };
  });

  return {
    loading,
    error,
    data: (forkJoins as EscrowDeposit[]) ?? [],
    refetch,
  };
};

export const useEscrowEvents = (pollInterval: number, forkId: string) => {
  const {
    loading: depositsLoading,
    data: depositEvents,
    error: depositsError,
    refetch: refetchEscrowDepositEvents,
  } = useEscrowDepositEvents(pollInterval, forkId);
  const {
    loading: withdrawalsLoading,
    data: withdrawalEvents,
    error: withdrawalsError,
    refetch: refetchEscrowWithdrawalEvents,
  } = useEscrowWithdrawalEvents(pollInterval, forkId);
  const {
    loading: forkDetailsLoading,
    data: forkDetails,
    error: forkDetailsError,
  } = useForkDetails(pollInterval, forkId);
  const {
    loading: forkJoinsLoading,
    data: forkJoins,
    error: forkJoinsError,
    refetch: refetchForkJoins,
  } = useForkJoins(pollInterval, forkId);
  const loading = depositsLoading || withdrawalsLoading || forkDetailsLoading || forkJoinsLoading;
  const error = depositsError || withdrawalsError || forkDetailsError || forkJoinsError;
  const data: (EscrowDeposit | EscrowWithdrawal)[] = [
    ...depositEvents,
    ...withdrawalEvents,
    ...forkJoins,
  ];
  // get fork details to pass to forkCycleEvents
  const events = eventsWithforkCycleEvents(data, forkDetails);

  return {
    loading,
    error,
    data: events,
    refetch: () => {
      refetchEscrowDepositEvents();
      refetchEscrowWithdrawalEvents();
      refetchForkJoins();
    },
  };
};

export const useForkDetails = (pollInterval: number, id: string) => {
  const {
    loading,
    data: forkData,
    error,
    refetch,
  } = useQuery(forkDetailsQuery(id.toString()), {
    pollInterval: pollInterval,
  }) as { loading: boolean; data: { fork: ForkSubgraphEntity }; error: Error; refetch: () => void };
  const joined = forkData?.fork?.joinedNouns?.map(item => item.noun.id) ?? [];
  const escrowed = forkData?.fork?.escrowedNouns?.map(item => item.noun.id) ?? [];
  const addedNouns = [...escrowed, ...joined];
  const data = {
    ...forkData?.fork,
    addedNouns: addedNouns,
  } as Fork;
  return {
    loading,
    data,
    error,
    refetch,
  };
};

export const useForks = (pollInterval?: number) => {
  const {
    loading,
    data: forksData,
    error,
    refetch,
  } = useQuery(forksQuery(), {
    pollInterval: pollInterval || 0,
  }) as { loading: boolean; data: { forks: Fork[] }; error: Error; refetch: () => void };
  const data = forksData?.forks;
  return {
    loading,
    data,
    error,
    refetch,
  };
};

export const useIsForkActive = () => {
  const timestamp = parseInt((new Date().getTime() / 1000).toFixed(0));
  const {
    loading,
    data: forksData,
    error,
  } = useQuery(isForkActiveQuery(timestamp)) as {
    loading: boolean;
    data: { forks: Fork[] };
    error: Error;
  };
  const data = forksData?.forks.length > 0 ? true : false;
  return {
    loading,
    data,
    error,
  };
};

export const useExecuteFork = () => {
  const { send: executeFork, state: executeForkState } = useContractFunction(
    nounsDaoContract,
    'executeFork',
  );
  return { executeFork, executeForkState };
};

export const useAdjustedTotalSupply = (): number | undefined => {
  const [totalSupply] =
    useContractCall<[EthersBN]>({
      abi,
      address: nounsDaoContract.address,
      method: 'adjustedTotalSupply',
    }) || [];
  return totalSupply?.toNumber();
};

export const useForkThresholdBPS = (): number | undefined => {
  const [forkThresholdBPS] =
    useContractCall<[EthersBN]>({
      abi,
      address: nounsDaoContract.address,
      method: 'forkThresholdBPS',
    }) || [];
  return forkThresholdBPS?.toNumber();
};

export const useActivePendingUpdatableProposers = (blockNumber: number) => {
  const {
    loading,
    data: proposals,
    error,
  } = useQuery(activePendingUpdatableProposersQuery(1000, blockNumber)) as {
    loading: boolean;
    data: { proposals: ProposalProposerAndSigners[] };
    error: Error;
  };
  const data: string[] = [];
  if (proposals?.proposals.length > 0) {
    proposals.proposals.map(proposal => {
      data.push(proposal.proposer.id);
      proposal.signers.map((signer: { id: string }) => {
        data.push(signer.id);
        return signer.id;
      });
      return proposal.proposer.id;
    });
  }

  return {
    loading,
    data,
    error,
  };
};

export const checkHasActiveOrPendingProposalOrCandidate = (
  latestProposalStatus: ProposalState,
  latestProposalProposer: string | undefined,
  account: string | null | undefined,
) => {
  return !!(
    account &&
    latestProposalProposer &&
    (latestProposalStatus === ProposalState.ACTIVE ||
      latestProposalStatus === ProposalState.PENDING ||
      latestProposalStatus === ProposalState.UPDATABLE) &&
    latestProposalProposer.toLowerCase() === account?.toLowerCase()
  );
};

export const useIsDaoGteV3 = (): boolean => {
  return true;
};

export const useLastMinuteWindowInBlocks = (): number | undefined => {
  const [lastMinuteWindowInBlocks] =
    useContractCall({
      abi,
      address: nounsDaoContract.address,
      method: 'lastMinuteWindowInBlocks',
    }) || [];
  return lastMinuteWindowInBlocks?.toNumber();
};

export const useUpdatableProposalIds = (blockNumber: number) => {
  const {
    loading,
    data: proposals,
    error,
  } = useQuery(updatableProposalsQuery(1000, blockNumber)) as {
    loading: boolean;
    data: { proposals: ProposalProposerAndSigners[] };
    error: Error;
  };

  const data = proposals?.proposals.map(proposal => +proposal.id);

  return {
    loading,
    data,
    error,
  };
};
