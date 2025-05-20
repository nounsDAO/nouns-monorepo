import type { Address, Hash, Hex } from '@/utils/types';

import { useQuery } from '@apollo/client';
import { filter, isNonNullish, isNullish, map, pipe, sort } from 'remeda';

import {
  useReadNounsDataCreateCandidateCost,
  useReadNounsDataUpdateCandidateCost,
  useWriteNounsDataAddSignature,
  useWriteNounsDataCancelProposalCandidate,
  useWriteNounsDataCreateProposalCandidate,
  useWriteNounsDataSendCandidateFeedback,
  useWriteNounsDataSendFeedback,
  useWriteNounsDataUpdateProposalCandidate,
  useWriteNounsGovernorCancelSig,
  useWriteNounsGovernorProposeBySigs,
  useWriteNounsGovernorUpdateProposalBySigs,
} from '@/contracts';
import {
  CandidateFeedback as GraphQLCandidateFeedback,
  Maybe,
  ProposalCandidate as GraphQLProposalCandidate,
  ProposalCandidateSignature as GraphQLProposalCandidateSignature,
  ProposalFeedback as GraphQLProposalFeedback,
} from '@/subgraphs';

import {
  extractTitle,
  formatProposalTransactionDetails,
  formatProposalTransactionDetailsToUpdate,
  ProposalDetail,
  ProposalTransactionDetails,
  removeMarkdownStyle,
  useActivePendingUpdatableProposers,
  useProposalThreshold,
  useUpdatableProposalIds,
} from './nounsDao';
import { useDelegateNounsAtBlockQuery } from './nounToken';
import {
  candidateFeedbacksQuery,
  candidateProposalQuery,
  candidateProposalsQuery,
  candidateProposalVersionsQuery,
  Delegates,
  proposalFeedbacksQuery,
} from './subgraph';

export interface VoteSignalDetail {
  supportDetailed: number;
  reason: string;
  votes: number;
  createdTimestamp: number;
  voter: {
    id: Address;
  };
}

export const useCreateProposalCandidate = () => {
  const {
    data: hash,
    writeContractAsync: createProposalCandidate,
    isPending: isCreatePending,
    isSuccess: isCreateSuccess,
    error: createError,
  } = useWriteNounsDataCreateProposalCandidate();

  let status = 'None';
  if (isCreatePending) {
    status = 'Mining';
  } else if (isCreateSuccess) {
    status = 'Success';
  } else if (createError) {
    status = 'Fail';
  }

  const createProposalCandidateState = {
    status,
    errorMessage: createError?.message,
    transaction: { hash },
  };

  return {
    createProposalCandidate,
    createProposalCandidateState,
  };
};

export const useCancelCandidate = () => {
  const {
    data: hash,
    writeContract: cancelCandidate,
    isPending: isCancelPending,
    isSuccess: isCancelSuccess,
    error: cancelError,
  } = useWriteNounsDataCancelProposalCandidate();

  let status = 'None';
  if (isCancelPending) {
    status = 'Mining';
  } else if (isCancelSuccess) {
    status = 'Success';
  } else if (cancelError) {
    status = 'Fail';
  }

  const cancelCandidateState = {
    status,
    errorMessage: cancelError?.message,
    transaction: { hash },
  };

  return {
    cancelCandidate,
    cancelCandidateState,
  };
};

export const useAddSignature = () => {
  const {
    data: hash,
    writeContractAsync: addSignature,
    isPending: isAddPending,
    isSuccess: isAddSuccess,
    error: addError,
  } = useWriteNounsDataAddSignature();

  let status = 'None';
  if (isAddPending) {
    status = 'Mining';
  } else if (isAddSuccess) {
    status = 'Success';
  } else if (addError) {
    status = 'Fail';
  }

  const addSignatureState = {
    status,
    errorMessage: addError?.message,
    transaction: { hash },
  };

  return {
    addSignature,
    addSignatureState,
  };
};

const deDupeSigners = (signers: string[]) => {
  const uniqueSigners: string[] = [];
  signers.forEach(signer => {
    if (!uniqueSigners.includes(signer)) {
      uniqueSigners.push(signer);
    }
  });
  return uniqueSigners;
};

const filterSigners = (
  timestampNow: number,
  delegateSnapshot: Delegates | undefined,
  activePendingProposers: string[],
  signers?: GraphQLProposalCandidateSignature[],
  proposalIdToUpdate?: number,
  updatableProposalIds?: number[],
) => {
  const sigsFiltered = signers?.filter(
    sig => !sig.canceled && BigInt(sig.expirationTimestamp) > timestampNow,
  );
  let voteCount = 0;
  const activeSigs: CandidateSignature[] = [];

  sigsFiltered?.forEach(signature => {
    const delegateVoteCount =
      delegateSnapshot?.delegates?.find(delegate => delegate.id === signature.signer.id)
        ?.nounsRepresented.length || 0;
    // don't count votes from signers who have active or pending proposals
    // but include them in the list of signers to display with a note that they have an active proposal
    const parentProposalIsUpdatable =
      proposalIdToUpdate && updatableProposalIds?.includes(proposalIdToUpdate ?? 0);
    const activeOrPendingProposal =
      !parentProposalIsUpdatable && activePendingProposers.includes(signature.signer.id);
    if (!activeOrPendingProposal) {
      voteCount += delegateVoteCount;
    }
    const sigWithVotes = {
      ...signature,
      signer: {
        ...signature.signer,
        id: signature.signer.id as Address,
        voteCount: delegateVoteCount,
        activeOrPendingProposal: activeOrPendingProposal,
      },
      expirationTimestamp: Number(signature.expirationTimestamp),
    };
    activeSigs.push(sigWithVotes);
  });

  const filteredSignatures = activeSigs.filter((signature: CandidateSignature) => {
    return !signature.canceled && signature.expirationTimestamp > timestampNow / 1000;
  });
  const sortedSignatures = [...filteredSignatures].sort((a, b) => {
    return a.expirationTimestamp - b.expirationTimestamp;
  });

  return { activeSigs: sortedSignatures, voteCount };
};

export const useCandidateProposals = (blockNumber?: bigint) => {
  const timestampNow = Math.floor(Date.now() / 1000); // in seconds
  const { query, variables } = candidateProposalsQuery();
  const { loading, data, error } = useQuery<{
    proposalCandidates: Maybe<GraphQLProposalCandidate[]>;
  }>(query, { variables });

  const unmatchedCandidates = pipe(
    data?.proposalCandidates ?? [],
    filter(
      candidate =>
        candidate?.latestVersion?.content?.matchingProposalIds?.length === 0 && !candidate.canceled,
    ),
    map(candidate => ({
      ...candidate,
    })),
  );

  const activeCandidateProposers = unmatchedCandidates?.map(candidate => candidate.proposer);

  const proposerDelegates = useDelegateNounsAtBlockQuery(
    activeCandidateProposers,
    blockNumber ?? 0n,
  );
  const threshold = useProposalThreshold() || 0;
  const activePendingProposers = useActivePendingUpdatableProposers(Number(blockNumber) ?? 0);
  const allSigners = unmatchedCandidates
    ?.map(candidate => candidate.latestVersion.content.contentSignatures?.map(sig => sig.signer.id))
    .flat();
  const signersDelegateSnapshot = useDelegateNounsAtBlockQuery(
    allSigners ? deDupeSigners(allSigners) : [],
    blockNumber ?? 0n,
  );
  const updatableProposalIds = useUpdatableProposalIds(Number(blockNumber) ?? 0);
  const candidatesData =
    proposerDelegates.data &&
    unmatchedCandidates?.map(candidate => {
      const proposerVotes =
        proposerDelegates.data?.delegates.find(d => d.id === candidate.proposer.toLowerCase())
          ?.nounsRepresented?.length || 0;
      return parseSubgraphCandidate(
        candidate,
        proposerVotes,
        threshold,
        timestampNow,
        activePendingProposers.data,
        false,
        signersDelegateSnapshot.data,
        updatableProposalIds.data,
      );
    });

  if (candidatesData) {
    candidatesData.sort((a, b) => {
      return Number(a?.lastUpdatedTimestamp ?? 0) - Number(b?.lastUpdatedTimestamp ?? 0);
    });
  }
  return { loading, data: candidatesData, error };
};

export const useCandidateProposal = (
  id: string,
  pollInterval?: number = 0,
  toUpdate?: boolean,
  blockNumber?: number,
) => {
  const timestampNow = Math.floor(Date.now() / 1000); // in seconds
  const { query, variables } = candidateProposalQuery(id);
  const { loading, data, error, refetch } = useQuery<{
    proposalCandidate: Maybe<GraphQLProposalCandidate>;
  }>(query, {
    pollInterval,
    variables,
  });
  const activePendingProposers = useActivePendingUpdatableProposers(blockNumber ?? 0);
  const threshold = useProposalThreshold() || 0;
  const versionSignatures = data?.proposalCandidate?.latestVersion.content.contentSignatures;
  const allSigners = versionSignatures?.map(
    (sig: GraphQLProposalCandidateSignature) => sig.signer.id,
  );
  const proposerDelegates = useDelegateNounsAtBlockQuery(
    data?.proposalCandidate?.proposer ? [data?.proposalCandidate?.proposer] : [],
    BigInt(blockNumber ?? 0n),
  );
  const proposerNounVotes =
    (proposerDelegates.data && proposerDelegates.data.delegates[0]?.nounsRepresented?.length) || 0;
  const signersDelegateSnapshot = useDelegateNounsAtBlockQuery(
    allSigners ? deDupeSigners(allSigners) : [],
    BigInt(blockNumber ?? 0),
  );
  const updatableProposalIds = useUpdatableProposalIds(blockNumber ?? 0);

  const candidate = data?.proposalCandidate ?? undefined;

  const parsedData =
    proposerDelegates.data &&
    data?.proposalCandidate &&
    parseSubgraphCandidate(
      candidate,
      proposerNounVotes,
      threshold,
      timestampNow,
      activePendingProposers.data,
      toUpdate,
      signersDelegateSnapshot.data,
      updatableProposalIds.data,
    );

  return { loading, data: parsedData, error, refetch };
};

export const useCandidateProposalVersions = (id: string) => {
  const { query, variables } = candidateProposalVersionsQuery(id);
  const { loading, data, error } = useQuery<{
    proposalCandidate: Maybe<GraphQLProposalCandidate>;
  }>(query, { variables });

  const candidateVersions = parseSubgraphCandidateVersions(data?.proposalCandidate || undefined);
  const versions = data?.proposalCandidate
    ? {
        ...candidateVersions,
        id: candidateVersions?.id || '',
        isProposal: false,
        requiredVotes: 0,
        proposerVotes: 0,
        voteCount: 0,
        matchingProposalIds: [],
        title: candidateVersions?.title || '',
        description: candidateVersions?.description || '',
        versions: candidateVersions?.versions || [],
        slug: candidateVersions?.slug || '',
        proposer: (data.proposalCandidate.proposer || '') as `0x${string}`,
        canceled: !!candidateVersions?.canceled,
        versionsCount: candidateVersions?.versionsCount || 0,
        lastUpdatedTimestamp: candidateVersions?.lastUpdatedTimestamp
          ? Number(candidateVersions.lastUpdatedTimestamp)
          : 0,
        createdTransactionHash: data.proposalCandidate.createdTransactionHash || '',
      }
    : undefined;

  return { loading, data: versions, error };
};

export const useGetCreateCandidateCost = () => {
  const { data: createCandidateCost } = useReadNounsDataCreateCandidateCost();

  if (!createCandidateCost) {
    return;
  }

  return createCandidateCost;
};

export const useGetUpdateCandidateCost = () => {
  const { data: updateCandidateCost } = useReadNounsDataUpdateCandidateCost();

  if (!updateCandidateCost) {
    return;
  }

  return updateCandidateCost;
};

export const useUpdateProposalCandidate = () => {
  const {
    data: hash,
    writeContractAsync: updateProposalCandidate,
    isPending: isUpdatePending,
    isSuccess: isUpdateSuccess,
    error: updateError,
  } = useWriteNounsDataUpdateProposalCandidate();

  let status = 'None';
  if (isUpdatePending) {
    status = 'Mining';
  } else if (isUpdateSuccess) {
    status = 'Success';
  } else if (updateError) {
    status = 'Fail';
  }

  const updateProposalCandidateState = {
    status,
    errorMessage: updateError?.message,
    transaction: { hash },
  };

  return {
    updateProposalCandidate,
    updateProposalCandidateState,
  };
};

export const useCancelSignature = () => {
  const {
    data: hash,
    writeContractAsync: cancelSig,
    isPending: isCancelSigPending,
    isSuccess: isCancelSigSuccess,
    error: cancelSigError,
  } = useWriteNounsGovernorCancelSig();

  let status = 'None';
  if (isCancelSigPending) {
    status = 'Mining';
  } else if (isCancelSigSuccess) {
    status = 'Success';
  } else if (cancelSigError) {
    status = 'Fail';
  }

  const cancelSignatureState = {
    status,
    errorMessage: cancelSigError?.message,
    transaction: { hash },
  };

  const cancelSignature = {
    send: cancelSig,
    state: cancelSignatureState,
  };

  return { cancelSignature };
};

export const useSendFeedback = () => {
  const {
    data: proposalFeedbackHash,
    writeContractAsync: sendProposalFeedback,
    isPending: isSendProposalFeedbackPending,
    isSuccess: isSendProposalFeedbackSuccess,
    error: sendProposalFeedbackError,
  } = useWriteNounsDataSendFeedback();

  let proposalFeedbackStatus = 'None';
  if (isSendProposalFeedbackPending) {
    proposalFeedbackStatus = 'Mining';
  } else if (isSendProposalFeedbackSuccess) {
    proposalFeedbackStatus = 'Success';
  } else if (sendProposalFeedbackError) {
    proposalFeedbackStatus = 'Fail';
  }

  const sendProposalFeedbackState = {
    status: proposalFeedbackStatus,
    errorMessage: sendProposalFeedbackError?.message,
    transaction: { hash: proposalFeedbackHash },
  };

  const {
    data: candidateFeedbackHash,
    writeContractAsync: sendCandidateFeedback,
    isPending: isSendCandidateFeedbackPending,
    isSuccess: isSendCandidateFeedbackSuccess,
    error: sendCandidateFeedbackError,
  } = useWriteNounsDataSendCandidateFeedback();

  let candidateFeedbackStatus = 'None';
  if (isSendCandidateFeedbackPending) {
    candidateFeedbackStatus = 'Mining';
  } else if (isSendCandidateFeedbackSuccess) {
    candidateFeedbackStatus = 'Success';
  } else if (sendCandidateFeedbackError) {
    candidateFeedbackStatus = 'Fail';
  }

  const sendCandidateFeedbackState = {
    status: candidateFeedbackStatus,
    errorMessage: sendCandidateFeedbackError?.message,
    transaction: { hash: candidateFeedbackHash },
  };

  return {
    sendProposalFeedback,
    sendProposalFeedbackState,
    sendCandidateFeedback,
    sendCandidateFeedbackState,
  };
};

export const useProposalFeedback = (id: string, pollInterval?: number = 0) => {
  const { query, variables } = proposalFeedbacksQuery(id);
  const { loading, data, error, refetch } = useQuery<{
    proposalFeedbacks: Maybe<GraphQLProposalFeedback[]>;
  }>(query, {
    pollInterval,
    variables,
  });

  const feedbacks: VoteSignalDetail[] = map(data?.proposalFeedbacks ?? [], feedback => ({
    ...feedback,
    reason: feedback.reason || '',
    votes: Number(feedback.votes),
    createdTimestamp: Number(feedback.createdTimestamp),
    createdBlock: Number(feedback.createdBlock),
    voter: {
      ...feedback.voter,
      id: feedback.voter.id as Address,
    },
  }));

  return { loading, data: feedbacks, error, refetch };
};

export const useCandidateFeedback = (id: string, pollInterval?: number) => {
  const { query, variables } = candidateFeedbacksQuery(id);
  const { loading, data, error, refetch } = useQuery<{
    candidateFeedbacks: Maybe<GraphQLCandidateFeedback[]>;
  }>(query, {
    pollInterval,
    variables,
  });
  const feedbacks: VoteSignalDetail[] = map(data?.candidateFeedbacks ?? [], feedback => ({
    ...feedback,
    reason: feedback.reason || '',
    votes: Number(feedback.votes),
    createdTimestamp: Number(feedback.createdTimestamp),
    createdBlock: Number(feedback.createdBlock),
    voter: {
      ...feedback.voter,
      id: feedback.voter.id as Address,
    },
  }));

  return { loading, data: feedbacks, error, refetch };
};

export const useProposeBySigs = () => {
  const {
    data: hash,
    writeContractAsync: proposeBySigs,
    isPending: isProposePending,
    isSuccess: isProposeSuccess,
    error: proposeError,
  } = useWriteNounsGovernorProposeBySigs();

  let status = 'None';
  if (isProposePending) {
    status = 'Mining';
  } else if (isProposeSuccess) {
    status = 'Success';
  } else if (proposeError) {
    status = 'Fail';
  }

  const proposeBySigsState = {
    status,
    errorMessage: proposeError?.message,
    transaction: { hash },
  };

  return {
    proposeBySigs,
    proposeBySigsState,
  };
};

export const useUpdateProposalBySigs = () => {
  const {
    data: hash,
    writeContractAsync: updateProposalBySigs,
    isPending: isUpdatePending,
    isSuccess: isUpdateSuccess,
    error: updateError,
  } = useWriteNounsGovernorUpdateProposalBySigs();

  let status = 'None';
  if (isUpdatePending) {
    status = 'Mining';
  } else if (isUpdateSuccess) {
    status = 'Success';
  } else if (updateError) {
    status = 'Fail';
  }

  const updateProposalBySigsState = {
    status,
    errorMessage: updateError?.message,
    transaction: { hash },
  };

  return {
    updateProposalBySigs,
    updateProposalBySigsState,
  };
};

const parseSubgraphCandidate = (
  candidate: GraphQLProposalCandidate | undefined,
  proposerVotes: number,
  threshold: number,
  timestamp: number,
  activePendingProposers: string[],
  toUpdate?: boolean,
  delegateSnapshot?: Delegates,
  updatableProposalIds?: number[],
): ProposalCandidate | undefined => {
  if (isNullish(candidate)) {
    return undefined;
  }

  const latestVersion = candidate.latestVersion;

  const description = latestVersion.content.description
    ?.replace(/\\n/g, '\n')
    .replace(/(^["']|["']$)/g, '');
  const transactionDetails: ProposalTransactionDetails = {
    targets: map(latestVersion.content.targets ?? [], t => t as Address),
    values: map(latestVersion.content.values ?? [], v => BigInt(v)),
    signatures: map(latestVersion.content.signatures ?? [], s => s),
    calldatas: map(latestVersion.content.calldatas ?? [], t => t as Hex),
    encodedProposalHash: latestVersion.content.encodedProposalHash as Hash,
  };
  let details;
  if (toUpdate) {
    details = formatProposalTransactionDetailsToUpdate(transactionDetails);
  } else {
    details = formatProposalTransactionDetails(transactionDetails);
  }

  const { activeSigs, voteCount } = filterSigners(
    timestamp,
    delegateSnapshot,
    activePendingProposers,
    latestVersion.content.contentSignatures,
    latestVersion.content.proposalIdToUpdate
      ? Number(latestVersion.content.proposalIdToUpdate)
      : undefined,
    updatableProposalIds,
  );
  const requiredVotes = threshold + 1 - proposerVotes > 0 ? threshold + 1 - proposerVotes : 0;
  return {
    id: candidate.id,
    slug: candidate.slug,
    proposer: candidate.proposer as Address,
    lastUpdatedTimestamp: BigInt(candidate.lastUpdatedTimestamp),
    canceled: candidate.canceled,
    versionsCount: candidate.versions.length,
    createdTransactionHash: candidate.createdTransactionHash as Hash,
    isProposal: Boolean(candidate?.latestVersion?.content?.matchingProposalIds?.length),
    matchingProposalIds: isNonNullish(latestVersion.content.matchingProposalIds)
      ? map(latestVersion.content.matchingProposalIds, v => ({
          id: Number(v),
        }))
      : undefined,
    requiredVotes: requiredVotes,
    proposalIdToUpdate: Number(latestVersion.content.proposalIdToUpdate),
    neededVotes: requiredVotes,
    proposerVotes: proposerVotes,
    voteCount: voteCount,
    version: {
      content: {
        title: pipe(description, extractTitle, removeMarkdownStyle) ?? 'Untitled',
        description: description ?? 'No description.',
        details: details,
        transactionHash: transactionDetails.encodedProposalHash as Hash,
        contentSignatures: activeSigs,
        targets: map(latestVersion.content.targets ?? [], v => v as Address),
        values: map(latestVersion.content.values ?? [], v => BigInt(v)),
        signatures: map(latestVersion.content.signatures ?? [], v => v),
        calldatas: map(latestVersion.content.calldatas ?? [], v => v as Hex),
      },
    },
  };
};

const parseSubgraphCandidateVersions = (
  candidate: GraphQLProposalCandidate | undefined,
): ProposalCandidateVersions | undefined => {
  if (isNullish(candidate)) {
    return undefined;
  }

  const versionsList = map(candidate?.versions ?? [], version => version);
  const versionsByDate = sort(versionsList, (a, b) => {
    return Number(b.createdTimestamp) - Number(a.createdTimestamp);
  });

  const versions: ProposalCandidateVersionContent[] = map(versionsByDate, (version, i) => {
    const description = version.content.description
      ?.replace(/\\n/g, '\n')
      .replace(/(^["']|["']$)/g, '');

    const transactionDetails: ProposalTransactionDetails = {
      targets: map(version.content.targets ?? [], t => t as Address),
      values: map(version.content.values ?? [], v => BigInt(v)),
      signatures: map(version.content.signatures ?? [], s => s),
      calldatas: map(version.content.calldatas ?? [], t => t as Hex),
      encodedProposalHash: version.content.encodedProposalHash as Hash,
    };

    const details = formatProposalTransactionDetails(transactionDetails);

    return {
      title: pipe(description, extractTitle, removeMarkdownStyle) ?? 'Untitled',
      description: description ?? 'No description.',
      details,
      createdAt: Number(version.createdTimestamp),
      updateMessage: version.updateMessage,
      versionNumber: candidate.versions.length - i,
    };
  });

  return {
    id: candidate.id,
    slug: candidate.slug,
    proposer: candidate.proposer as Address,
    lastUpdatedTimestamp: BigInt(candidate.lastUpdatedTimestamp),
    canceled: candidate.canceled,
    versionsCount: candidate.versions.length,
    createdTransactionHash: candidate.createdTransactionHash as Hash,
    title:
      pipe(candidate.latestVersion.content.description, extractTitle, removeMarkdownStyle) ??
      'Untitled',
    description: candidate.latestVersion.content.description ?? 'No description.',
    versions: versions,
    isProposal: false,
    requiredVotes: 0,
    proposerVotes: 0,
    voteCount: 0,
  };
};

export interface ProposalCandidateSubgraphEntity extends ProposalCandidateInfo {
  versions: {
    content: {
      title: string;
    };
  }[];
  latestVersion: {
    content: {
      title: string;
      description: string;
      targets: string[];
      values: string[];
      signatures: string[];
      calldatas: string[];
      encodedProposalHash: string;
      proposalIdToUpdate: string;
      contentSignatures: {
        reason: string;
        expirationTimestamp: number;
        sig: string;
        canceled: boolean;
        signer: {
          id: Address;
          proposals: {
            id: string;
          }[];
        };
      }[];
      matchingProposalIds: {
        id: string;
      }[];
    };
  };
}

export interface ProposalCandidateVersionsSubgraphEntity extends ProposalCandidateInfo {
  versions: {
    title: string;
    description: string;
    targets: string[];
    values: string[];
    signatures: string[];
    calldatas: string[];
    encodedProposalHash: string;
    updateMessage: string;
    createdTimestamp: number;
    content: {
      title: string;
      description: string;
      targets: string[];
      values: string[];
      signatures: string[];
      calldatas: string[];
      encodedProposalHash: string;
    };
  }[];
  latestVersion: {
    id: string;
    title: string;
    description: string;
  };
}

export interface PartialCandidateSignature {
  signer: {
    id: string;
  };
  expirationTimestamp: string;
}

export interface CandidateSignature {
  reason: string;
  expirationTimestamp: number;
  sig: string;
  canceled: boolean;
  signer: {
    id: Address;
    proposals: {
      id: string;
    }[];
    voteCount?: number;
    activeOrPendingProposal?: boolean;
  };
}

export interface ProposalCandidateInfo {
  id: string;
  slug: string;
  proposer: Address;
  lastUpdatedTimestamp: bigint;
  canceled: boolean;
  versionsCount: number;
  createdTransactionHash: Hash;
  isProposal: boolean;
  requiredVotes: number;
  proposalIdToUpdate?: number;
  proposerVotes: number;
  neededVotes?: number;
  voteCount: number;
  matchingProposalIds?: {
    id: number;
  }[];
}

export interface ProposalCandidateVersionContent {
  title: string;
  description: string;
  details: ProposalDetail[];
  createdAt: number;
  updateMessage: string;
  versionNumber: number;
}

export interface ProposalCandidateVersion {
  content: {
    title: string;
    description: string;
    details: ProposalDetail[];
    targets: Address[];
    values: bigint[];
    signatures: string[];
    calldatas: Hex[];
    contentSignatures: CandidateSignature[];
    transactionHash?: Hash;
  };
}

export interface ProposalCandidate extends ProposalCandidateInfo {
  version: ProposalCandidateVersion;
}

export interface PartialProposalCandidate extends ProposalCandidateInfo {
  lastUpdatedTimestamp: bigint;
  latestVersion: {
    content: {
      title: string;
      description: string;
      proposalIdToUpdate: string;
      contentSignatures: {
        reason: string;
        expirationTimestamp: number;
        sig: string;
        canceled: boolean;
        signer: {
          id: string;
          proposals: {
            id: string;
          }[];
        };
      }[];
      matchingProposalIds: {
        id: string;
      }[];
    };
  };
}

export interface ProposalCandidateVersions extends ProposalCandidateInfo {
  title: string;
  description: string;
  versions: ProposalCandidateVersionContent[];
}
