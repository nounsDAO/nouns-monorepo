import { utils } from 'ethers';
import { NounsDAODataABI, NounsDaoDataFactory, NounsDaoLogicFactory } from '@nouns/contracts';
import { useContractCall, useContractFunction } from '@usedapp/core';
import config from '../config';
import {
  Delegates,
  candidateFeedbacksQuery,
  candidateProposalQuery,
  candidateProposalVersionsQuery,
  candidateProposalsQuery,
  proposalFeedbacksQuery,
} from './subgraph';
import { useQuery } from '@apollo/client';
import {
  ProposalDetail,
  ProposalTransactionDetails,
  extractTitle,
  formatProposalTransactionDetails,
  formatProposalTransactionDetailsToUpdate,
  removeMarkdownStyle,
  useActivePendingUpdatableProposers,
  useProposalThreshold,
  useUpdatableProposalIds,
} from './nounsDao';
import * as R from 'ramda';
import { useDelegateNounsAtBlockQuery } from './nounToken';

const abi = new utils.Interface(NounsDAODataABI);
const nounsDAOData = new NounsDaoDataFactory().attach(config.addresses.nounsDAOData!);

export interface VoteSignalDetail {
  supportDetailed: number;
  reason: string;
  votes: number;
  createdTimestamp: number;
  voter: {
    id: string;
  };
}

const nounsDaoContract = NounsDaoLogicFactory.connect(config.addresses.nounsDAOProxy, undefined!);

export const useCreateProposalCandidate = () => {
  const { send: createProposalCandidate, state: createProposalCandidateState } =
    useContractFunction(nounsDAOData, 'createProposalCandidate');
  return { createProposalCandidate, createProposalCandidateState };
};

export const useCancelCandidate = () => {
  const { send: cancelCandidate, state: cancelCandidateState } = useContractFunction(
    nounsDAOData,
    'cancelProposalCandidate',
  );
  return { cancelCandidate, cancelCandidateState };
};

export const useAddSignature = () => {
  const { send: addSignature, state: addSignatureState } = useContractFunction(
    nounsDAOData,
    'addSignature',
  );
  return { addSignature, addSignatureState };
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
  signers?: CandidateSignature[],
  proposalIdToUpdate?: number,
  updatableProposalIds?: number[],
) => {
  const sigsFiltered = signers?.filter(
    sig => sig.canceled === false && sig.expirationTimestamp > timestampNow,
  );
  let voteCount = 0;
  let activeSigs: CandidateSignature[] = [];

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
        voteCount: delegateVoteCount,
        activeOrPendingProposal: activeOrPendingProposal,
      },
    };
    activeSigs.push(sigWithVotes);
  });

  const filteredSignatures = activeSigs.filter((signature: CandidateSignature) => {
    return signature.canceled === false && signature.expirationTimestamp > timestampNow / 1000;
  });
  const sortedSignatures = [...filteredSignatures].sort((a, b) => {
    return a.expirationTimestamp - b.expirationTimestamp;
  });

  return { activeSigs: sortedSignatures, voteCount };
};

export const useCandidateProposals = (blockNumber?: number) => {
  const timestampNow = Math.floor(Date.now() / 1000); // in seconds
  const { loading, data: candidates, error } = useQuery(candidateProposalsQuery());
  const unmatchedCandidates: ProposalCandidateSubgraphEntity[] =
    candidates?.proposalCandidates?.filter(
      (candidate: ProposalCandidateSubgraphEntity) =>
        candidate.latestVersion.content.matchingProposalIds.length === 0 &&
        candidate.canceled === false,
    );
  const activeCandidateProposers = unmatchedCandidates?.map(
    (candidate: ProposalCandidateSubgraphEntity) => candidate.proposer,
  );
  const proposerDelegates = useDelegateNounsAtBlockQuery(
    activeCandidateProposers,
    blockNumber ?? 0,
  );
  const threshold = useProposalThreshold() || 0;
  const activePendingProposers = useActivePendingUpdatableProposers(blockNumber ?? 0);
  const allSigners = unmatchedCandidates
    ?.map((candidate: ProposalCandidateSubgraphEntity) =>
      candidate.latestVersion.content.contentSignatures?.map(
        (sig: CandidateSignature) => sig.signer.id,
      ),
    )
    .flat();
  const signersDelegateSnapshot = useDelegateNounsAtBlockQuery(
    allSigners ? deDupeSigners(allSigners) : [],
    blockNumber ?? 0,
  );
  const updatableProposalIds = useUpdatableProposalIds(blockNumber ?? 0);
  const candidatesData =
    proposerDelegates.data &&
    unmatchedCandidates?.map((candidate: ProposalCandidateSubgraphEntity) => {
      const proposerVotes =
        proposerDelegates.data?.delegates.find(d => d.id === candidate.proposer.toLowerCase())
          ?.nounsRepresented?.length || 0;
      const parsedData = parseSubgraphCandidate(
        candidate,
        proposerVotes,
        threshold,
        timestampNow,
        activePendingProposers.data,
        false,
        signersDelegateSnapshot.data,
        updatableProposalIds.data,
      );
      return parsedData;
    });

  candidatesData &&
    candidatesData?.sort((a, b) => {
      return a.lastUpdatedTimestamp - b.lastUpdatedTimestamp;
    });
  return { loading, data: candidatesData, error };
};

export const useCandidateProposal = (
  id: string,
  pollInterval?: number,
  toUpdate?: boolean,
  blockNumber?: number,
) => {
  const timestampNow = Math.floor(Date.now() / 1000); // in seconds
  const { loading, data, error, refetch } = useQuery(candidateProposalQuery(id), {
    pollInterval: pollInterval || 0,
  });
  const activePendingProposers = useActivePendingUpdatableProposers(blockNumber ?? 0);
  const threshold = useProposalThreshold() || 0;
  const versionSignatures = data?.proposalCandidate.latestVersion.content.contentSignatures;
  const allSigners = versionSignatures?.map((sig: CandidateSignature) => sig.signer.id);
  const proposerDelegates = useDelegateNounsAtBlockQuery(
    [data?.proposalCandidate.proposer],
    blockNumber || 0,
  );
  const proposerNounVotes =
    (proposerDelegates.data && proposerDelegates.data.delegates[0]?.nounsRepresented?.length) || 0;
  const signersDelegateSnapshot = useDelegateNounsAtBlockQuery(
    allSigners ? deDupeSigners(allSigners) : [],
    blockNumber ?? 0,
  );
  const updatableProposalIds = useUpdatableProposalIds(blockNumber ?? 0);
  const parsedData =
    proposerDelegates.data &&
    data?.proposalCandidate &&
    parseSubgraphCandidate(
      data.proposalCandidate,
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
  const { loading, data, error } = useQuery(candidateProposalVersionsQuery(id));
  const versions: ProposalCandidateVersions =
    data && parseSubgraphCandidateVersions(data.proposalCandidate);
  return { loading, data: versions, error };
};

export const useGetCreateCandidateCost = () => {
  const createCandidateCost = useContractCall({
    abi,
    address: config.addresses.nounsDAOData,
    method: 'createCandidateCost',
    args: [],
  });

  if (!createCandidateCost) {
    return;
  }

  return createCandidateCost[0];
};

export const useGetUpdateCandidateCost = () => {
  const updateCandidateCost = useContractCall({
    abi,
    address: config.addresses.nounsDAOData,
    method: 'updateCandidateCost',
    args: [],
  });

  if (!updateCandidateCost) {
    return;
  }

  return updateCandidateCost[0];
};

export const useUpdateProposalCandidate = () => {
  const { send: updateProposalCandidate, state: updateProposalCandidateState } =
    useContractFunction(nounsDAOData, 'updateProposalCandidate');
  return { updateProposalCandidate, updateProposalCandidateState };
};

export const useCancelSignature = () => {
  const cancelSignature = useContractFunction(nounsDAOData, 'cancelSig');

  return { cancelSignature };
};

export const useSendFeedback = (proposalType?: 'proposal' | 'candidate') => {
  const { send: sendFeedback, state: sendFeedbackState } = useContractFunction(
    nounsDAOData,
    proposalType === 'candidate' ? 'sendCandidateFeedback' : 'sendFeedback',
  );
  return { sendFeedback, sendFeedbackState };
};

export const useProposalFeedback = (id: string, pollInterval?: number) => {
  const { loading, data, error, refetch } = useQuery(proposalFeedbacksQuery(id), {
    pollInterval: pollInterval || 0,
  });

  return { loading, data, error, refetch };
};

export const useCandidateFeedback = (id: string, pollInterval?: number) => {
  const {
    loading,
    data: results,
    error,
    refetch,
  } = useQuery(candidateFeedbacksQuery(id), {
    pollInterval: pollInterval || 0,
  });
  const data: VoteSignalDetail[] = results?.candidateFeedbacks.map(
    (feedback: VoteSignalDetail) => feedback,
  );

  return { loading, data, error, refetch };
};

export const useProposeBySigs = () => {
  const { send: proposeBySigs, state: proposeBySigsState } = useContractFunction(
    nounsDaoContract,
    'proposeBySigs',
  );
  return { proposeBySigs, proposeBySigsState };
};

export const useUpdateProposalBySigs = () => {
  const { send: updateProposalBySigs, state: updateProposalBySigsState } = useContractFunction(
    nounsDaoContract,
    'updateProposalBySigs',
  );
  return { updateProposalBySigs, updateProposalBySigsState };
};

const parseSubgraphCandidate = (
  candidate: ProposalCandidateSubgraphEntity,
  proposerVotes: number,
  threshold: number,
  timestamp: number,
  activePendingProposers: string[],
  toUpdate?: boolean,
  delegateSnapshot?: Delegates,
  updatableProposalIds?: number[],
) => {
  const description = candidate.latestVersion.content.description
    ?.replace(/\\n/g, '\n')
    .replace(/(^['"]|['"]$)/g, '');
  const transactionDetails: ProposalTransactionDetails = {
    targets: candidate.latestVersion.content.targets,
    values: candidate.latestVersion.content.values,
    signatures: candidate.latestVersion.content.signatures,
    calldatas: candidate.latestVersion.content.calldatas,
    encodedProposalHash: candidate.latestVersion.content.encodedProposalHash,
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
    candidate.latestVersion.content.contentSignatures,
    candidate.latestVersion.content.proposalIdToUpdate
      ? parseInt(candidate.latestVersion.content.proposalIdToUpdate)
      : undefined,
    updatableProposalIds,
  );
  const requiredVotes = threshold + 1 - proposerVotes > 0 ? threshold + 1 - proposerVotes : 0;
  return {
    id: candidate.id,
    slug: candidate.slug,
    proposer: candidate.proposer,
    lastUpdatedTimestamp: candidate.lastUpdatedTimestamp,
    canceled: candidate.canceled,
    versionsCount: candidate.versions.length,
    createdTransactionHash: candidate.createdTransactionHash,
    isProposal: candidate.latestVersion.content.matchingProposalIds.length > 0,
    proposalIdToUpdate: candidate.latestVersion.content.proposalIdToUpdate,
    matchingProposalIds: candidate.latestVersion.content.matchingProposalIds,
    requiredVotes: requiredVotes,
    neededVotes: requiredVotes,
    proposerVotes: proposerVotes,
    voteCount: voteCount,
    version: {
      content: {
        title: R.pipe(extractTitle, removeMarkdownStyle)(description) ?? 'Untitled',
        description: description ?? 'No description.',
        details: details,
        transactionHash: details.encodedProposalHash,
        contentSignatures: activeSigs,
        targets: candidate.latestVersion.content.targets,
        values: candidate.latestVersion.content.values,
        signatures: candidate.latestVersion.content.signatures,
        calldatas: candidate.latestVersion.content.calldatas,
        proposalIdToUpdate: candidate.latestVersion.content.proposalIdToUpdate,
      },
    },
  };
};

const parseSubgraphCandidateVersions = (
  candidateVersions: ProposalCandidateVersionsSubgraphEntity | undefined,
) => {
  if (!candidateVersions) {
    return;
  }
  const versionsList = candidateVersions.versions.map(version => version);
  const versionsByDate = versionsList.sort((a, b) => {
    return b.createdTimestamp - a.createdTimestamp;
  });
  const versions: ProposalCandidateVersionContent[] = versionsByDate.map((version, i) => {
    const description = version.content.description
      ?.replace(/\\n/g, '\n')
      .replace(/(^['"]|['"]$)/g, '');
    const transactionDetails: ProposalTransactionDetails = {
      targets: version.content.targets,
      values: version.content.values,
      signatures: version.content.signatures,
      calldatas: version.content.calldatas,
      encodedProposalHash: version.content.encodedProposalHash,
    };
    const details = formatProposalTransactionDetails(transactionDetails);
    return {
      title: R.pipe(extractTitle, removeMarkdownStyle)(description) ?? 'Untitled',
      description: description ?? 'No description.',
      details: details,
      createdAt: version.createdTimestamp,
      updateMessage: version.updateMessage,
      versionNumber: candidateVersions.versions.length - i,
    };
  });

  return {
    id: candidateVersions.id,
    slug: candidateVersions.slug,
    proposer: candidateVersions.proposer,
    lastUpdatedTimestamp: candidateVersions.lastUpdatedTimestamp,
    canceled: candidateVersions.canceled,
    versionsCount: candidateVersions.versions.length,
    createdTransactionHash: candidateVersions.createdTransactionHash,
    title:
      R.pipe(extractTitle, removeMarkdownStyle)(candidateVersions.latestVersion.description) ??
      'Untitled',
    description: candidateVersions.latestVersion.description ?? 'No description.',
    versions: versions,
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
    id: string;
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
  proposer: string;
  lastUpdatedTimestamp: number;
  canceled: boolean;
  versionsCount: number;
  createdTransactionHash: string;
  isProposal: boolean;
  requiredVotes: number;
  proposerVotes: number;
  voteCount: number;
  matchingProposalIds: {
    id: string;
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
    targets: string[];
    values: string[];
    signatures: string[];
    calldatas: string[];
    contentSignatures: CandidateSignature[];
  };
}

export interface ProposalCandidate extends ProposalCandidateInfo {
  version: ProposalCandidateVersion;
}

export interface PartialProposalCandidate extends ProposalCandidateInfo {
  lastUpdatedTimestamp: number;
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
