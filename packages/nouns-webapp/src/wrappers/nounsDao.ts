import type { Address, Hash, Hex } from '@/utils/types';
import type {
  EscrowDeposit as GraphQLEscrowDeposit,
  EscrowWithdrawal as GraphQLEscrowWithdrawal,
  Fork as GraphQLFork,
  ForkJoin as GraphQLForkJoin,
  Maybe,
  Proposal as GraphQLProposal,
  ProposalVersion as GraphQLProposalVersion,
} from '@/subgraphs';

import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import {
  filter,
  flatMap,
  forEach,
  isNonNullish,
  isNullish,
  isTruthy,
  map,
  pipe,
  sort,
} from 'remeda';
import {
  AbiParameter,
  decodeAbiParameters,
  decodeEventLog,
  formatEther,
  keccak256,
  parseAbiItem,
  stringToBytes,
} from 'viem';
import { useQuery as useReactQuery } from '@tanstack/react-query';

import { useBlockTimestamp } from '@/hooks/useBlockTimestamp';

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
  nounsGovernorAbi,
  nounsGovernorAddress,
  useReadNounsGovernorAdjustedTotalSupply,
  useReadNounsGovernorForkThreshold,
  useReadNounsGovernorForkThresholdBps,
  useReadNounsGovernorGetDynamicQuorumParamsAt,
  useReadNounsGovernorGetReceipt,
  useReadNounsGovernorNumTokensInForkEscrow,
  useReadNounsGovernorProposalCount,
  useReadNounsGovernorProposalThreshold,
  useWriteNounsGovernorCancel,
  useWriteNounsGovernorCancelSig,
  useWriteNounsGovernorCastRefundableVote,
  useWriteNounsGovernorCastRefundableVoteWithReason,
  useWriteNounsGovernorEscrowToFork,
  useWriteNounsGovernorExecute,
  useWriteNounsGovernorExecuteFork,
  useWriteNounsGovernorJoinFork,
  useWriteNounsGovernorPropose,
  useWriteNounsGovernorProposeOnTimelockV1,
  useWriteNounsGovernorQueue,
  useWriteNounsGovernorUpdateProposal,
  useWriteNounsGovernorUpdateProposalDescription,
  useWriteNounsGovernorUpdateProposalTransactions,
  useWriteNounsGovernorWithdrawFromForkEscrow,
} from '@/contracts';
import { useAccount, useBlockNumber, usePublicClient, useReadContracts } from 'wagmi';
import { mainnet } from 'viem/chains';
import { defaultChain } from '@/wagmi';

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
  abstainVotes: bigint;
  againstVotes: bigint;
  canceled: boolean;
  creationBlock: bigint;
  endBlock: bigint;
  eta: bigint;
  executed: boolean;
  forVotes: bigint;
  id: bigint;
  proposalThreshold: bigint;
  proposer: `0x${string}`;
  quorumVotes: bigint;
  startBlock: bigint;
  totalSupply: bigint;
  vetoed: boolean;
  objectionPeriodEndBlock?: bigint;
  updatePeriodEndBlock?: bigint;
}

export interface ProposalDetail {
  target: Address;
  value?: bigint;
  functionSig?: string;
  callData: Hex;
}

export interface PartialProposal {
  id: string | undefined;
  title: string;
  status: ProposalState;
  forCount: number;
  againstCount: number;
  abstainCount: number;
  startBlock: bigint;
  endBlock: bigint;
  eta: Date | undefined;
  quorumVotes: number;
  objectionPeriodEndBlock: bigint;
  updatePeriodEndBlock: bigint;
}

export interface Proposal extends PartialProposal {
  description: string;
  createdBlock: bigint;
  createdTimestamp: bigint;
  proposer: Address | undefined;
  proposalThreshold: bigint;
  details: ProposalDetail[];
  transactionHash: Hash;
  signers: { id: Address }[];
  onTimelockV1: boolean;
  voteSnapshotBlock: bigint;
}

export interface ProposalVersion {
  id: string;
  createdAt: bigint;
  updateMessage: string;
  description: string;
  targets: Address[];
  values: bigint[];
  signatures: string[];
  calldatas: Hex[];
  title: string;
  details: ProposalDetail[];
  proposal: {
    id: string;
  };
  versionNumber: number;
}

export interface ProposalTransactionDetails {
  targets: Address[];
  values: bigint[];
  signatures: string[];
  calldatas: Hex[];
  encodedProposalHash: Hash;
}

export interface PartialProposalSubgraphEntity {
  id: string;
  title: string;
  status: keyof typeof ProposalState;
  forVotes: bigint;
  againstVotes: bigint;
  abstainVotes: bigint;
  startBlock: bigint;
  endBlock: bigint;
  executionETA: bigint | null;
  quorumVotes: bigint;
  objectionPeriodEndBlock: bigint;
  updatePeriodEndBlock: bigint;
  onTimelockV1: boolean | null;
  signers: { id: Address }[];
}

interface PartialProposalData {
  data: PartialProposal[] | undefined;
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
  address: Address;
  value: bigint;
  signature: string;
  calldata: Hex;
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

const hashRegex = /^\s*#{1,6}\s+([^\n]+)/;
const equalTitleRegex = /^\s*([^\n]{1,256})\r?\n(?:={3,25}|-{3,25})/;

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
  if (hashResult && hashResult[1]) {
    return hashResult[1];
  }

  const equalResult = extractEqualTitle(body);
  return equalResult && equalResult[1] ? equalResult[1] : null;
};

const removeBold = (text: string): string => text.replace(/\*\*/g, '');
const removeItalics = (text: string): string => text.replace(/__/g, '');

export const removeMarkdownStyle = (text: string | null): string | null =>
  text === null ? null : pipe(text, removeBold, removeItalics);
/**
 * Add missing schemes to Markdown links in a proposal's description.
 * @param descriptionText The description text of a proposal
 */
const addMissingSchemes = (descriptionText: string | undefined) => {
  if (!descriptionText) return descriptionText;

  // Match Markdown links: [text](url)
  const markdownLinkRegex = /\[([^\]]+)]\(([^)]+)\)/g;

  return descriptionText.replace(markdownLinkRegex, (match, text, url) => {
    // If the URL already has a scheme or starts with #, leave it as is
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('#')) {
      return match;
    }
    // Otherwise, add the https:// scheme
    return `[${text}](https://${url})`;
  });
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

export function useDynamicQuorumProps(block: bigint): DynamicQuorumParams | undefined {
  // @ts-expect-error wagmi hook's return type might be inferred incorrectly or too broadly
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
  /**
   * @ts-expect-error wagmi hook's argument types might be inferred incorrectly
   */
  const { data: receipt } = useReadNounsGovernorGetReceipt({
    args: [proposalId, address!],
    query: { enabled: Boolean(proposalId && address) },
  });

  return receipt?.hasVoted ?? false;
}

export function useProposalVote(proposalId: bigint): 'Against' | 'For' | 'Abstain' | '' {
  const { address } = useAccount();
  const enabled = Boolean(proposalId) && Boolean(address);

  /**
   * @ts-expect-error wagmi hook's return type might be inferred incorrectly or too broadly
   */
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

export const concatSelectorToCalldata = (signature: string, callData: Hex): Hex => {
  if (signature) {
    return `0x${keccak256(stringToBytes(signature)).substring(2, 10)}${callData.substring(2)}` as Hex;
  }
  return callData;
};

const determineCallData = (types: string | undefined, value: bigint | undefined): string => {
  if (types) {
    return types;
  }
  if (value) {
    return `${formatEther(BigInt(value))} ETH`;
  }
  return '';
};

export const formatProposalTransactionDetails = (details: {
  readonly targets: readonly Address[];
  readonly signatures: readonly string[];
  readonly values: readonly bigint[];
  readonly calldatas: readonly Hex[];
}) =>
  details.targets.map((target, i) => {
    const signature = details.signatures[i];
    const value = details.values[i] ?? 0n;
    const callData = details.calldatas[i];

    const [name = 'unknown', types] = (signature?.slice?.(0, -1) ?? 'unknown()').split(/\((.*)/s);

    if (!types) {
      // no types to decode, show raw calldata or fallback
      if (callData && callData !== '0x') {
        return { target, callData: concatSelectorToCalldata(signature, callData), value };
      }
      return {
        target,
        functionSig: name || 'unknown',
        callData: determineCallData('', value) as Hex,
        value,
      };
    }

    if (callData === '0x') {
      return {
        target,
        functionSig: name,
        callData: callData as Hex,
        value,
      };
    }

    try {
      const abiParams: AbiParameter[] = types.split(/,(?![^(]*\))/g).map(t => ({ type: t.trim() }));
      const decoded = decodeAbiParameters(abiParams, callData);
      return {
        target,
        functionSig: name,
        callData: (decoded as string[]).join() as Hex,
        value,
      };
    } catch (err) {
      console.error('decodeAbiParameters failed:', err);
      return { target, callData: concatSelectorToCalldata(signature, callData), value };
    }
  });

export const formatProposalTransactionDetailsToUpdate = (details: {
  targets: Address[];
  signatures: string[];
  values?: bigint[];
  calldatas: Hex[];
}) =>
  details.targets.map((target, i) => ({
    target,
    functionSig: details.signatures[i],
    callData: details.calldatas[i],
    value: details.values?.[i] ?? 0n,
  }));

export function useFormattedProposalCreatedLogs(skip: boolean, fromBlockOverride?: number) {
  const publicClient = usePublicClient();
  const chainId = defaultChain.id;

  const proposalCreatedEvent = parseAbiItem(
    'event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)',
  );

  // pick the right starting block
  let fromBlock: bigint;
  if (fromBlockOverride != null) {
    fromBlock = BigInt(fromBlockOverride);
  } else if (chainId === mainnet.id) {
    fromBlock = 12985453n;
  } else {
    fromBlock = 0n;
  }

  const { data: logs } = useReactQuery({
    queryKey: ['proposalCreatedLogs', fromBlock.toString()],
    queryFn: () =>
      publicClient.getLogs({
        address: nounsGovernorAddress[chainId],
        event: proposalCreatedEvent,
        fromBlock,
      }),
    enabled: !skip,
  });

  // decode and massage the results
  return useMemo(() => {
    if (!logs) return [];
    return logs.map(log => {
      const parsed = decodeEventLog({
        abi: nounsGovernorAbi,
        eventName: 'ProposalCreated',
        data: log.data,
        topics: log.topics,
      });
      return {
        description: parsed.args.description,
        transactionHash: log.transactionHash,
        details: formatProposalTransactionDetails(parsed.args),
      };
    });
  }, [logs]);
}

const getProposalState = (
  blockNumber: number | undefined,
  blockTimestamp: Date | undefined,
  proposal: GraphQLProposal,
  isDaoGteV3?: boolean,
  onTimelockV1?: boolean,
) => {
  // Get the initial status from the proposal
  const status = isNonNullish(proposal.status)
    ? ProposalState[proposal.status]
    : ProposalState.UNDETERMINED;

  // Handle specific status cases with dedicated functions
  if (status === ProposalState.PENDING || status === ProposalState.ACTIVE) {
    return handlePendingOrActiveState(blockNumber, proposal, isDaoGteV3);
  }

  if (status === ProposalState.QUEUED) {
    return handleQueuedState(blockTimestamp, proposal, isDaoGteV3, onTimelockV1);
  }

  return status;
};

// Handle the state for PENDING or ACTIVE proposals
const handlePendingOrActiveState = (
  blockNumber: number | undefined,
  proposal: GraphQLProposal,
  isDaoGteV3?: boolean,
): ProposalState => {
  if (!blockNumber) {
    return ProposalState.UNDETERMINED;
  }

  // Check if it's in UPDATABLE state
  if (isUpdatableProposal(blockNumber, proposal, isDaoGteV3)) {
    return ProposalState.UPDATABLE;
  }

  // Check if it's in PENDING state
  if (blockNumber <= BigInt(proposal.startBlock)) {
    return ProposalState.PENDING;
  }

  // Check if it's in OBJECTION_PERIOD state
  if (isInObjectionPeriod(blockNumber, proposal, isDaoGteV3)) {
    return ProposalState.OBJECTION_PERIOD;
  }

  // Check if past end block and determine resulting state
  if (isPastEndBlock(blockNumber, proposal)) {
    return getPastEndBlockState(proposal);
  }

  return ProposalState.ACTIVE;
};

// Check if a proposal is in UPDATABLE state
const isUpdatableProposal = (
  blockNumber: number,
  proposal: GraphQLProposal,
  isDaoGteV3?: boolean,
): boolean => {
  return Boolean(
    isDaoGteV3 &&
      proposal.updatePeriodEndBlock &&
      blockNumber <= BigInt(proposal.updatePeriodEndBlock),
  );
};

// Check if a proposal is in OBJECTION_PERIOD state
const isInObjectionPeriod = (
  blockNumber: number,
  proposal: GraphQLProposal,
  isDaoGteV3?: boolean,
): boolean => {
  return Boolean(
    isDaoGteV3 &&
      blockNumber > BigInt(proposal.endBlock) &&
      BigInt(proposal.objectionPeriodEndBlock) > 0 &&
      blockNumber <= BigInt(proposal.objectionPeriodEndBlock),
  );
};

// Check if a proposal is past its end block
const isPastEndBlock = (blockNumber: number, proposal: GraphQLProposal): boolean => {
  return (
    blockNumber > BigInt(proposal.endBlock) &&
    blockNumber > BigInt(proposal.objectionPeriodEndBlock)
  );
};

// Determine the state for a proposal that is past its end block
const getPastEndBlockState = (proposal: GraphQLProposal): ProposalState => {
  const forVotes = BigInt(proposal.forVotes);
  if (forVotes <= BigInt(proposal.againstVotes) || forVotes < BigInt(proposal.quorumVotes ?? 0)) {
    return ProposalState.DEFEATED;
  }

  if (!proposal.executionETA) {
    return ProposalState.SUCCEEDED;
  }

  return ProposalState.ACTIVE;
};

// Handle the state for QUEUED proposals
const handleQueuedState = (
  blockTimestamp: Date | undefined,
  proposal: GraphQLProposal,
  isDaoGteV3?: boolean,
  onTimelockV1?: boolean,
): ProposalState => {
  if (!blockTimestamp || !proposal.executionETA) {
    return ProposalState.UNDETERMINED;
  }

  if (isExpiredProposal(blockTimestamp, proposal, isDaoGteV3, onTimelockV1)) {
    return ProposalState.EXPIRED;
  }

  return ProposalState.QUEUED;
};

// Check if a queued proposal has expired
const isExpiredProposal = (
  blockTimestamp: Date,
  proposal: GraphQLProposal,
  isDaoGteV3?: boolean,
  onTimelockV1?: boolean,
): boolean => {
  // If v3+ and not on time lock v1, grace period is 21 days, otherwise 14 days
  const GRACE_PERIOD = isDaoGteV3 && !onTimelockV1 ? 21 * 60 * 60 * 24 : 14 * 60 * 60 * 24;

  return blockTimestamp.getTime() / 1_000 >= Number(proposal.executionETA) + Number(GRACE_PERIOD);
};

const parsePartialSubgraphProposal = (
  proposal: GraphQLProposal | undefined,
  blockNumber: bigint | number | undefined,
  timestamp: number | undefined,
  isDaoGteV3?: boolean,
): PartialProposal | undefined => {
  if (isNullish(proposal)) {
    return undefined;
  }

  const onTimelockV1 = proposal.onTimelockV1 !== null;
  return {
    id: proposal.id,
    title: proposal.title ?? 'Untitled',
    status: getProposalState(
      Number(blockNumber),
      new Date((timestamp ?? 0) * 1000),
      proposal,
      isDaoGteV3,
      onTimelockV1,
    ),
    startBlock: BigInt(proposal.startBlock),
    endBlock: BigInt(proposal.endBlock),
    updatePeriodEndBlock: BigInt(proposal?.updatePeriodEndBlock ?? 0),
    forCount: Number(proposal.forVotes),
    againstCount: Number(proposal.againstVotes),
    abstainCount: Number(proposal.abstainVotes),
    quorumVotes: Number(proposal?.quorumVotes ?? 0),
    eta: proposal.executionETA ? new Date(Number(proposal.executionETA) * 1000) : undefined,
    objectionPeriodEndBlock: 0n,
  };
};

const parseSubgraphProposal = (
  proposal: GraphQLProposal | undefined,
  blockNumber: number | undefined,
  timestamp: number | undefined,
  toUpdate?: boolean,
  isDaoGteV3?: boolean,
): Proposal | undefined => {
  if (isNullish(proposal)) {
    return;
  }

  const description = addMissingSchemes(
    replaceInvalidDropboxImageLinks(
      proposal.description?.replace(/\\n/g, '\n').replace(/(^['"]|['"]$)/g, ''),
    ),
  );
  const transactionDetails: ProposalTransactionDetails = {
    targets: map(proposal.targets ?? [], t => t as Address),
    values: map(proposal.values ?? [], v => BigInt(v)),
    signatures: map(proposal.signatures ?? [], s => s),
    calldatas: map(proposal.calldatas ?? [], t => t as Hex),
    encodedProposalHash: '' as Hash,
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
    title: pipe(description, extractTitle, removeMarkdownStyle) ?? 'Untitled',
    description: description ?? 'No description.',
    proposer: proposal.proposer?.id as Address,
    status: getProposalState(
      blockNumber,
      new Date((timestamp ?? 0) * 1000),
      proposal,
      isDaoGteV3,
      onTimelockV1,
    ),
    proposalThreshold: BigInt(proposal.proposalThreshold ?? 0),
    quorumVotes: Number(proposal.quorumVotes ?? 0),
    forCount: Number(proposal.forVotes),
    againstCount: Number(proposal.againstVotes),
    abstainCount: Number(proposal.abstainVotes),
    createdBlock: BigInt(proposal.createdBlock),
    startBlock: BigInt(proposal.startBlock),
    endBlock: BigInt(proposal.endBlock),
    createdTimestamp: BigInt(proposal.createdTimestamp),
    eta: proposal.executionETA ? new Date(Number(proposal.executionETA) * 1000) : undefined,
    details: details,
    transactionHash: proposal.createdTransactionHash as Hash,
    objectionPeriodEndBlock: BigInt(proposal.objectionPeriodEndBlock),
    updatePeriodEndBlock: BigInt(proposal.updatePeriodEndBlock ?? 0),
    signers: map(proposal.signers ?? [], v => ({ id: v.id as Address })),
    onTimelockV1: onTimelockV1,
    voteSnapshotBlock: BigInt(proposal.voteSnapshotBlock),
  };
};

export const useAllProposalsViaSubgraph = (): PartialProposalData => {
  const { query, variables } = partialProposalsQuery();
  const { loading, data, error } = useQuery<{ proposals: Maybe<GraphQLProposal[]> }>(query, {
    variables,
  });
  const isDaoGteV3 = useIsDaoGteV3();
  const { data: blockNumber } = useBlockNumber();
  const timestamp = useBlockTimestamp(blockNumber);
  const proposals = pipe(
    data?.proposals ?? [],
    map(proposal => {
      return parsePartialSubgraphProposal(proposal, Number(blockNumber), timestamp, isDaoGteV3);
    }),
    filter((x): x is PartialProposal => x !== undefined),
  );

  return {
    loading,
    error,
    data: proposals,
  };
};

export const useAllProposalsViaChain = (skip = false): PartialProposalData => {
  const proposalCount = useProposalCount();
  const govProposalIndexes = useMemo(() => countToIndices(proposalCount), [proposalCount]);
  const chainId = defaultChain.id;

  const proposalCalls = useMemo(
    () =>
      govProposalIndexes.map(idx => ({
        abi: nounsGovernorAbi,
        address: nounsGovernorAddress[chainId],
        functionName: 'proposals',
        args: [idx],
      })),
    [govProposalIndexes],
  );

  const stateCalls = useMemo(
    () =>
      govProposalIndexes.map(idx => ({
        abi: nounsGovernorAbi,
        address: nounsGovernorAddress[chainId],
        functionName: 'state',
        args: [idx],
      })),
    [govProposalIndexes],
  );

  const { data: proposalResults, isLoading: loadingProposals } = useReadContracts<
    { result?: ProposalCallResult }[]
  >({
    contracts: proposalCalls,
    query: { enabled: !skip && proposalCalls.length > 0 },
  });
  const proposals = pipe(
    proposalResults ?? [],
    flatMap(item => (isNullish(item.result) ? [] : [item.result])),
  ) as ProposalCallResult[];

  const { data: stateResults, isLoading: loadingStates } = useReadContracts<{ result?: number }[]>({
    contracts: stateCalls,
    query: { enabled: !skip && stateCalls.length > 0 },
  });
  const proposalStates = pipe(
    stateResults ?? [],
    flatMap(item => (isNullish(item.result) ? [] : [item.result])),
  ) as number[];

  const formattedLogs = useFormattedProposalCreatedLogs(skip);

  // Early return until events are fetched
  return useMemo(() => {
    const logs = formattedLogs ?? [];
    if (!skip && proposals.length > 0 && formattedLogs?.length === 0) {
      return { data: [], loading: true };
    }

    return {
      data: proposals.map((proposal, i) => {
        const description = addMissingSchemes(logs[i]?.description?.replace(/\\n/g, '\n'));
        return {
          id: proposal?.id.toString(),
          title: pipe(description, extractTitle, removeMarkdownStyle) ?? 'Untitled',
          status: proposalStates[i] ?? ProposalState.UNDETERMINED,
          startBlock: BigInt(proposal?.startBlock?.toString() ?? ''),
          endBlock: BigInt(proposal?.endBlock?.toString() ?? ''),
          objectionPeriodEndBlock: BigInt(proposal?.objectionPeriodEndBlock?.toString() ?? 0),
          forCount: Number(proposal?.forVotes?.toString() ?? '0'),
          againstCount: Number(proposal?.againstVotes?.toString() ?? '0'),
          abstainCount: Number(proposal?.abstainVotes?.toString() ?? '0'),
          quorumVotes: Number(proposal?.quorumVotes?.toString() ?? '0'),
          eta: proposal?.eta ? new Date(Number(proposal?.eta) * 1000) : undefined,
          updatePeriodEndBlock: BigInt(proposal?.updatePeriodEndBlock?.toString() ?? 0),
        };
      }),
      loading: loadingProposals || loadingStates,
    };
  }, [formattedLogs, proposalStates, proposals]);
};

export const useAllProposals = (): PartialProposalData => {
  const subgraph = useAllProposalsViaSubgraph();
  const onchain = useAllProposalsViaChain(!subgraph.error);
  return subgraph?.error ? onchain : subgraph;
};

export const useProposal = (id: string | number, toUpdate?: boolean) => {
  const { data: blockNumber } = useBlockNumber();
  const timestamp = useBlockTimestamp(blockNumber);
  const isDaoGteV3 = useIsDaoGteV3();

  const { query, variables } = proposalQuery(id);
  const { data } = useQuery<{ proposal: Maybe<GraphQLProposal> }>(query, { variables });
  const proposal = data?.proposal ?? undefined;

  return parseSubgraphProposal(proposal, Number(blockNumber), timestamp, toUpdate, isDaoGteV3);
};

export const useProposalTitles = (ids: number[]): ProposalTitle[] | undefined => {
  const { query, variables } = proposalTitlesQuery(ids);
  const { data } = useQuery<{ proposals: Maybe<GraphQLProposal[]> }>(query, { variables });

  return (
    data?.proposals?.map(proposal => ({
      id: proposal.id,
      title: proposal.title,
    })) ?? undefined
  );
};

export const useProposalVersions = (id: string | number): ProposalVersion[] | undefined => {
  const { query, variables } = proposalVersionsQuery(id);
  const { data } = useQuery<{
    proposalVersions: Maybe<GraphQLProposalVersion[]>;
  }>(query, { variables });

  const sortedProposalVersions = sort(data?.proposalVersions ?? [], (a, b) =>
    a.createdAt > b.createdAt ? 1 : -1,
  );

  const sortedNumberedVersions = sortedProposalVersions?.map((proposalVersion, i: number) => {
    const details: ProposalTransactionDetails = {
      targets: map(proposalVersion.targets ?? [], t => t as Address),
      values: map(proposalVersion.values ?? [], v => BigInt(v)),
      signatures: map(proposalVersion.signatures ?? [], s => s),
      calldatas: map(proposalVersion.calldatas ?? [], t => t as Hex),
      encodedProposalHash: '' as Hash,
    };

    return {
      id: proposalVersion.id,
      versionNumber: i + 1,
      createdAt: BigInt(proposalVersion.createdAt),
      updateMessage: proposalVersion.updateMessage,
      description: proposalVersion.description,
      targets: map(proposalVersion.targets ?? [], t => t as Address),
      values: map(proposalVersion.values ?? [], v => BigInt(v)),
      signatures: map(proposalVersion.signatures ?? [], s => s),
      calldatas: map(proposalVersion.calldatas ?? [], t => t as Hex),
      title: proposalVersion.title,
      details: formatProposalTransactionDetails(details),
      proposal: {
        id: proposalVersion.proposal.id,
      },
    };
  });

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

export function useForkThreshold(): number | undefined {
  const { data: threshold } = useReadNounsGovernorForkThreshold();

  return threshold ? Number(threshold) : undefined;
}

export function useNumTokensInForkEscrow(): number | undefined {
  const { data: count } = useReadNounsGovernorNumTokensInForkEscrow();

  return count ? Number(count) : undefined;
}

export const useEscrowDepositEvents = (pollInterval: number, forkId: string) => {
  const { query, variables } = escrowDepositEventsQuery(forkId);
  const { loading, data, error, refetch } = useQuery<{
    escrowDeposits: Maybe<GraphQLEscrowDeposit[]>;
  }>(query, {
    pollInterval,
    variables,
  });
  const escrowDeposits: EscrowDeposit[] = map(data?.escrowDeposits ?? [], escrowDeposit => {
    const proposalIDs = escrowDeposit.proposalIDs.map(id => Number(id));
    return {
      ...escrowDeposit,
      eventType: 'EscrowDeposit' as const,
      owner: { id: escrowDeposit.owner.id as Address },
      reason: String(escrowDeposit.reason),
      proposalIDs,
    };
  });

  return { loading, error, data: escrowDeposits, refetch };
};

export const useEscrowWithdrawalEvents = (pollInterval: number, forkId: string) => {
  const { query, variables } = escrowWithdrawEventsQuery(forkId);
  const { loading, data, error, refetch } = useQuery<{
    escrowWithdrawals: Maybe<GraphQLEscrowWithdrawal[]>;
  }>(query, {
    pollInterval,
    variables,
  });

  const escrowWithdrawals: EscrowWithdrawal[] = map(
    data?.escrowWithdrawals ?? [],
    escrowWithdrawal => ({
      ...escrowWithdrawal,
      eventType: 'EscrowWithdrawal' as const,
      owner: { id: escrowWithdrawal.id as Address },
    }),
  );

  return { loading, error, data: escrowWithdrawals, refetch };
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
  const { query, variables } = forkJoinsQuery(forkId);
  const { loading, data, error, refetch } = useQuery<{ forkJoins: Maybe<GraphQLForkJoin[]> }>(
    query,
    {
      pollInterval,
      variables,
    },
  );
  const forkJoins = data?.forkJoins?.map(forkJoin => {
    const proposalIDs = forkJoin.proposalIDs.map(id => id);
    return {
      eventType: 'ForkJoin' as const,
      id: forkJoin.id,
      createdAt: forkJoin.createdAt,
      owner: { id: forkJoin.owner.id as Address },
      fork: { id: forkId },
      reason: forkJoin.reason,
      tokenIDs: forkJoin.tokenIDs,
      proposalIDs: proposalIDs,
    };
  });

  const escrowDeposits: EscrowDeposit[] = map(forkJoins ?? [], forkJoin => {
    return {
      ...forkJoin,
      reason: '',
      proposalIDs: [],
    };
  });

  return {
    loading,
    error,
    data: escrowDeposits,
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
  const { query, variables } = forkDetailsQuery(id.toString());
  const {
    loading,
    data: forkData,
    error,
    refetch,
  } = useQuery<{ fork: Maybe<GraphQLFork> }>(query, {
    pollInterval,
    variables,
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

export const useForks = (pollInterval: number = 0) => {
  const { query, variables } = forksQuery();
  const { loading, data, error, refetch } = useQuery<{ forks: Maybe<GraphQLFork[]> }>(query, {
    pollInterval,
    variables,
  });

  const forks: Fork[] = map(data?.forks ?? [], fork => {
    const joined = fork?.joinedNouns?.map(item => item.noun.id) ?? [];
    const escrowed = fork?.escrowedNouns?.map(item => item.noun.id) ?? [];
    const addedNouns = [...escrowed, ...joined];
    return {
      ...fork,
      addedNouns,
      executed: fork.executed ?? null,
      executedAt: fork.executedAt ?? null,
      forkTreasury: fork.forkTreasury ?? null,
      forkToken: fork.forkToken ?? null,
      forkingPeriodEndTimestamp: fork.forkingPeriodEndTimestamp?.toString() ?? null,
    };
  });

  return { loading, data: forks, error, refetch };
};

export const useIsForkActive = () => {
  const timestamp = Number((new Date().getTime() / 1000).toFixed(0));
  const { query, variables } = isForkActiveQuery(timestamp);
  const {
    loading,
    data: forksData,
    error,
  } = useQuery<{ forks: Maybe<GraphQLFork[]> }>(query, { variables });
  const data = isTruthy(forksData?.forks?.length);
  return {
    loading,
    data,
    error,
  };
};

export function useExecuteFork() {
  const {
    data: hash,
    writeContractAsync: executeFork,
    isPending: isExecuteForkPending,
    isSuccess: isExecuteForkSuccess,
    error: executeForkError,
  } = useWriteNounsGovernorExecuteFork();

  let status = 'None';
  if (isExecuteForkPending) status = 'Mining';
  else if (isExecuteForkSuccess) status = 'Success';
  else if (executeForkError) status = 'Fail';

  const executeForkState = {
    status,
    errorMessage: executeForkError?.message,
    transaction: { hash },
  };

  return { executeFork, executeForkState };
}

export function useAdjustedTotalSupply(): number | undefined {
  const { data } = useReadNounsGovernorAdjustedTotalSupply();

  return data ? Number(data) : undefined;
}

export function useForkThresholdBPS(): number | undefined {
  const { data } = useReadNounsGovernorForkThresholdBps();

  return data ? Number(data) : undefined;
}

export const useActivePendingUpdatableProposers = (blockNumber: bigint = 0n) => {
  const { query, variables } = activePendingUpdatableProposersQuery(1000, blockNumber);
  const {
    loading,
    data: proposals,
    error,
  } = useQuery<{ proposals: Maybe<GraphQLProposal[]> }>(query, { variables }) as {
    loading: boolean;
    data: { proposals: ProposalProposerAndSigners[] };
    error: Error;
  };
  const data: string[] = [];
  if (proposals?.proposals.length > 0) {
    forEach(proposals.proposals, proposal => {
      data.push(proposal.proposer.id);
      forEach(proposal.signers, (signer: { id: string }) => {
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

export function useIsDaoGteV3(): boolean {
  return true;
}

export function useUpdatableProposalIds(blockNumber?: bigint) {
  const { query, variables } = updatableProposalsQuery(1000, blockNumber);
  const {
    loading,
    data: proposals,
    error,
  } = useQuery<{ proposals: Maybe<GraphQLProposal[]> }>(query, { variables }) as {
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
}
