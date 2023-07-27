import { utils } from 'ethers';
import { NounsDAODataABI, NounsDaoDataFactory, NounsDaoLogicV3Factory } from '@nouns/contracts';
import { useBlockNumber, useContractCall, useContractFunction } from '@usedapp/core';
import config from '../config';
import {
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
  useProposalThreshold,
} from './nounsDao';
import * as R from 'ramda';
import { useBlockTimestamp } from '../hooks/useBlockTimestamp';
import { useDelegateNounsAtBlockQuery } from './nounToken';
import { useEffect, useState } from 'react';

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

const nounsDaoContract = NounsDaoLogicV3Factory.connect(config.addresses.nounsDAOProxy, undefined!);

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

export const useCandidateProposals = () => {
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const currentBlock = useBlockNumber();
  useEffect(() => {
    // prevent blockNumber from being reset to 0 on new blocks
    if (blockNumber === 0) {
      setBlockNumber(currentBlock || blockNumber);
    }
  }, [currentBlock, blockNumber]);
  const { loading, data: candidates, error } = useQuery(candidateProposalsQuery());
  const unmatchedCandidates: PartialProposalCandidate[] = candidates?.proposalCandidates?.filter(
    (candidate: PartialProposalCandidate) =>
      candidate.latestVersion.content.matchingProposalIds.length === 0 &&
      candidate.canceled === false,
  );
  const activeCandidateProposers = unmatchedCandidates?.map(
    (candidate: PartialProposalCandidate) => candidate.proposer,
  );
  const proposerDelegates =
    useDelegateNounsAtBlockQuery(activeCandidateProposers, blockNumber) || 0;
  const threshold = useProposalThreshold() || 0;
  const candidatesData = unmatchedCandidates?.map(
    (candidate: PartialProposalCandidate, i: number) => {
      const proposerVotes =
        (proposerDelegates.data && proposerDelegates.data.delegates[i]?.nounsRepresented?.length) ||
        0;
      const requiredVotes = threshold + 1 - proposerVotes > 0 ? threshold + 1 - proposerVotes : 0;
      return {
        ...candidate,
        requiredVotes: requiredVotes,
        proposerVotes: proposerVotes,
      };
    },
  );
  candidatesData?.sort((a, b) => {
    return a.lastUpdatedTimestamp - b.lastUpdatedTimestamp;
  });
  return { loading, data: candidatesData, error };
};

export const useCandidateProposal = (id: string, pollInterval?: number, toUpdate?: boolean) => {
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const currentBlock = useBlockNumber();
  useEffect(() => {
    // prevent blockNumber from triggering a re-render when it's already set
    if (blockNumber === 0) {
      setBlockNumber(currentBlock || blockNumber);
    }
  }, [currentBlock, blockNumber]);
  const { loading, data, error, refetch } = useQuery(candidateProposalQuery(id), {
    pollInterval: pollInterval || 0,
  });
  const timestamp = useBlockTimestamp(blockNumber);
  const threshold = useProposalThreshold() || 0;
  const proposerDelegates =
    useDelegateNounsAtBlockQuery([data?.proposalCandidate.proposer], blockNumber) || 0;
  const proposerNounVotes =
    (proposerDelegates.data && proposerDelegates.data.delegates[0]?.nounsRepresented?.length) || 0;
  const parsedData = parseSubgraphCandidate(
    data?.proposalCandidate,
    proposerNounVotes,
    threshold,
    toUpdate,
    blockNumber,
    timestamp,
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
  candidate: ProposalCandidateSubgraphEntity | undefined,
  proposerVotes: number,
  threshold: number,
  toUpdate?: boolean,
  blockNumber?: number,
  timestamp?: number,
) => {
  if (!candidate) {
    return;
  }
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
  const filteredSignatures = candidate.latestVersion.content.contentSignatures.filter(
    (signature: CandidateSignature) => {
      return signature.canceled === false && signature.expirationTimestamp > timestamp! / 1000;
    },
  );
  const sortedSignatures = [...filteredSignatures].sort((a, b) => {
    return a.expirationTimestamp - b.expirationTimestamp;
  });
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
    proposerVotes: proposerVotes,
    version: {
      content: {
        title: R.pipe(extractTitle, removeMarkdownStyle)(description) ?? 'Untitled',
        description: description ?? 'No description.',
        details: details,
        transactionHash: details.encodedProposalHash,
        contentSignatures: sortedSignatures,
        targets: candidate.latestVersion.content.targets,
        values: candidate.latestVersion.content.values,
        signatures: candidate.latestVersion.content.signatures,
        calldatas: candidate.latestVersion.content.calldatas,
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
