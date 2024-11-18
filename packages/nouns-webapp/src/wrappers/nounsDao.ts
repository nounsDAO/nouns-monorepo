import { NounsDAOV3ABI, NounsDaoLogicFactory } from '@nouns/sdk';
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
  activePendingUpdatableProposersQuery,
  forkJoinsQuery,
  isForkActiveQuery,
  updatableProposalsQuery,
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
  proposer: string | undefined;
  proposalThreshold: number;
  details: ProposalDetail[];
  transactionHash: string;
  signers: { id: string }[];
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
  signers: { id: string }[];
}

export interface ProposalSubgraphEntity
  extends ProposalTransactionDetails,
    PartialProposalSubgraphEntity {
  description: string;
  createdBlock: string;
  createdTransactionHash: string;
  createdTimestamp: string;
  proposer: { id: string };
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

export const concatSelectorToCalldata = (signature: string, callData: string) => {
  if (signature) {
    return `${keccak256(toUtf8Bytes(signature)).substring(0, 10)}${callData.substring(2)}`;
  }
  return callData;
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
      const forVotes = new BigNumber(proposal.forVotes);
      if (forVotes.lte(proposal.againstVotes) || forVotes.lt(proposal.quorumVotes)) {
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
    // if v3+ and not on timelock v1, grace period is 21 days, otherwise 14 days
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
  const onTimelockV1 = proposal.onTimelockV1 === null ? false : true;
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
  const onTimelockV1 = proposal.onTimelockV1 === null ? false : true;
  return {
    id: proposal.id,
    title: R.pipe(extractTitle, removeMarkdownStyle)(description) ?? 'Untitled',
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
          title: R.pipe(extractTitle, removeMarkdownStyle)(description) ?? 'Untitled',
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
  return parseSubgraphProposal(
    useQuery(proposalQuery(id)).data?.proposal,
    blockNumber,
    timestamp,
    toUpdate,
    isDaoGteV3,
  );
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
  const functionSig = 'castRefundableVote(uint256,uint8)';
  const { send: castRefundableVote, state: castRefundableVoteState } = useContractFunction(
    nounsDaoContract,
    functionSig
  );

  return {
    castRefundableVote: async (...args: any[]): Promise<void> => {
      const contract = connectContractToSigner(nounsDaoContract, undefined, library);
      const gasLimit = await contract.estimateGas[functionSig](...args);
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
  const functionSig = 'castRefundableVoteWithReason(uint256,uint8,string)';
  const { send: castRefundableVoteWithReason, state: castRefundableVoteWithReasonState } =
    useContractFunction(nounsDaoContract, functionSig);

  return {
    castRefundableVoteWithReason: async (...args: any[]): Promise<void> => {
      const contract = connectContractToSigner(nounsDaoContract, undefined, library);
      const gasLimit = await contract.estimateGas[functionSig](...args);
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

export const useProposeOnTimelockV1 = () => {
  const { send: proposeOnTimelockV1, state: proposeOnTimelockV1State } = useContractFunction(
    nounsDaoContract,
    'proposeOnTimelockV1',
  );
  return { proposeOnTimelockV1, proposeOnTimelockV1State };
};

export const useUpdateProposal = () => {
  const { send: updateProposal, state: updateProposalState } = useContractFunction(
    nounsDaoContract,
    'updateProposal',
  );
  return { updateProposal, updateProposalState };
};

export const useUpdateProposalTransactions = () => {
  const { send: updateProposalTransactions, state: updateProposaTransactionsState } =
    useContractFunction(nounsDaoContract, 'updateProposalTransactions');
  return { updateProposalTransactions, updateProposaTransactionsState };
};

export const useUpdateProposalDescription = () => {
  const { send: updateProposalDescription, state: updateProposalDescriptionState } =
    useContractFunction(nounsDaoContract, 'updateProposalDescription');
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
  return { executeProposal, executeProposalState };
};
export const useExecuteProposalOnTimelockV1 = () => {
  const { send: executeProposalOnTimelockV1, state: executeProposalOnTimelockV1State } =
    useContractFunction(nounsDaoContract, 'executeOnTimelockV1');
  return { executeProposalOnTimelockV1, executeProposalOnTimelockV1State };
};

// fork functions
export const useEscrowToFork = () => {
  const { send: escrowToFork, state: escrowToForkState } = useContractFunction(
    nounsDaoContract,
    'escrowToFork',
  );
  return { escrowToFork, escrowToForkState };
};

export const useWithdrawFromForkEscrow = () => {
  const { send: withdrawFromForkEscrow, state: withdrawFromForkEscrowState } = useContractFunction(
    nounsDaoContract,
    'withdrawFromForkEscrow',
  );
  return { withdrawFromForkEscrow, withdrawFromForkEscrowState };
};

export const useJoinFork = () => {
  const { send: joinFork, state: joinForkState } = useContractFunction(
    nounsDaoContract,
    'joinFork',
  );
  return { joinFork, joinForkState };
};

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

// helper function to add fork cycle events to escrow events
const eventsWithforkCycleEvents = (
  events: (EscrowDeposit | EscrowWithdrawal | ForkCycleEvent)[],
  forkDetails: Fork,
) => {
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

  const sortedEvents = [...events, ...forkEvents].sort(
    (
      a: EscrowDeposit | EscrowWithdrawal | ForkCycleEvent,
      b: EscrowDeposit | EscrowWithdrawal | ForkCycleEvent,
    ) => {
      return a.createdAt && b.createdAt && a.createdAt > b.createdAt ? -1 : 1;
    },
  );
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
  let data: string[] = [];
  proposals?.proposals.length > 0 &&
    proposals.proposals.map(proposal => {
      data.push(proposal.proposer.id);
      proposal.signers.map((signer: { id: string }) => {
        data.push(signer.id);
        return signer.id;
      });
      return proposal.proposer.id;
    });

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
  if (
    account &&
    latestProposalProposer &&
    (latestProposalStatus === ProposalState.ACTIVE ||
      latestProposalStatus === ProposalState.PENDING ||
      latestProposalStatus === ProposalState.UPDATABLE) &&
    latestProposalProposer.toLowerCase() === account?.toLowerCase()
  ) {
    return true;
  }
  return false;
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
