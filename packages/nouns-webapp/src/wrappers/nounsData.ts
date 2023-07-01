import { utils } from 'ethers';
import { NounsDAODataABI, NounsDaoDataFactory, NounsDaoLogicV3Factory } from '@nouns/contracts';
import { useContractCall, useContractFunction } from '@usedapp/core';
import config from '../config';
import {
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
} from './nounsDao';
import * as R from 'ramda';

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
  console.log('useAddSignature', addSignatureState);
  return { addSignature, addSignatureState };
};

export const useCandidateProposals = () => {
  const { loading, data, error } = useQuery(candidateProposalsQuery());

  return { loading, data, error };
};

export const useCandidateProposal = (id: string, pollInterval?: number, toUpdate?: boolean,) => {
  const { loading, data, error, refetch } = useQuery(candidateProposalQuery(id), {
    pollInterval: pollInterval || 0,
  });
  const parsedData = parseSubgraphCandidate(data?.proposalCandidate, toUpdate);
  return { loading, data: parsedData, error, refetch };
};

export const useCandidateProposalVersions = (id: string) => {
  const { loading, data, error } = useQuery(candidateProposalVersionsQuery(id));
  const versions = data && parseSubgraphCandidateVersions(data.proposalCandidate);
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

export const useSendFeedback = () => {
  const { send: sendFeedback, state: sendFeedbackState } = useContractFunction(
    nounsDAOData,
    'sendFeedback',
  );
  return { sendFeedback, sendFeedbackState };
};

export const useProposalFeedback = (id: string, pollInterval?: number) => {
  const { loading, data, error, refetch } = useQuery(proposalFeedbacksQuery(id), {
    pollInterval: pollInterval || 0,
  });

  return { loading, data, error, refetch };
};

export const useProposeBySigs = () => {
  const { send: proposeBySigs, state: proposeBySigsState } = useContractFunction(
    nounsDaoContract,
    'proposeBySigs',
  );
  console.log('useProposeBySigs', proposeBySigsState);
  return { proposeBySigs, proposeBySigsState };
};

export const useUpdateProposalBySigs = () => {
  const { send: updateProposalBySigs, state: updateProposalBySigState } = useContractFunction(
    nounsDaoContract,
    'updateProposalBySigs',
  );
  return { updateProposalBySigs, updateProposalBySigState };
};

const parseSubgraphCandidate = (
  candidate: ProposalCandidateSubgraphEntity | undefined,
  toUpdate?: boolean,
) => {
  if (!candidate) {
    return;
  }
  const description = candidate.latestVersion.description
    ?.replace(/\\n/g, '\n')
    .replace(/(^['"]|['"]$)/g, '');
  const transactionDetails: ProposalTransactionDetails = {
    targets: candidate.latestVersion.targets,
    values: candidate.latestVersion.values,
    signatures: candidate.latestVersion.signatures,
    calldatas: candidate.latestVersion.calldatas,
    encodedProposalHash: candidate.latestVersion.encodedProposalHash,
  };
  let details;
  if (toUpdate) {
    details = formatProposalTransactionDetailsToUpdate(transactionDetails);
  } else {
    details = formatProposalTransactionDetails(transactionDetails);
  }

  return {
    id: candidate.id,
    slug: candidate.slug,
    proposer: candidate.proposer,
    lastUpdatedTimestamp: candidate.lastUpdatedTimestamp,
    canceled: candidate.canceled,
    versionsCount: candidate.versions.length,
    createdTransactionHash: candidate.createdTransactionHash,
    version: {
      title: R.pipe(extractTitle, removeMarkdownStyle)(description) ?? 'Untitled',
      description: description ?? 'No description.',
      details: details,
      transactionHash: details.encodedProposalHash,
      versionSignatures: candidate.latestVersion.versionSignatures,
      targets: candidate.latestVersion.targets,
      values: candidate.latestVersion.values,
      signatures: candidate.latestVersion.signatures,
      calldatas: candidate.latestVersion.calldatas,
    },
  };
};

const parseSubgraphCandidateVersions = (
  candidateVersions: ProposalCandidateVersionsSubgraphEntity | undefined,
) => {
  if (!candidateVersions) {
    return;
  }
  const versions = candidateVersions.versions.map((version, i) => {
    const description = version.description?.replace(/\\n/g, '\n').replace(/(^['"]|['"]$)/g, '');
    const transactionDetails: ProposalTransactionDetails = {
      targets: version.targets,
      values: version.values,
      signatures: version.signatures,
      calldatas: version.calldatas,
      encodedProposalHash: version.encodedProposalHash,
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

  console.log('versions', versions);
  return {
    id: candidateVersions.id,
    title:
      R.pipe(extractTitle, removeMarkdownStyle)(candidateVersions.latestVersion.description) ??
      'Untitled',
    description: candidateVersions.latestVersion.description ?? 'No description.',
    slug: candidateVersions.slug,
    proposer: candidateVersions.proposer,
    lastUpdatedTimestamp: candidateVersions.lastUpdatedTimestamp,
    canceled: candidateVersions.canceled,
    versionsCount: candidateVersions.versions.length,
    createdTransactionHash: candidateVersions.createdTransactionHash,
    versions: versions,
  };
};

export interface ProposalCandidateSubgraphEntity extends ProposalCandidateInfo {
  versions: {
    title: string;
  }[];
  latestVersion: {
    title: string;
    description: string;
    targets: string[];
    values: string[];
    signatures: string[];
    calldatas: string[];
    encodedProposalHash: string;
    versionSignatures: {
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
}

export interface ProposalCandidateVersion {
  title: string;
  description: string;
  details: ProposalDetail[];
  targets: string[];
  values: string[];
  signatures: string[];
  calldatas: string[];
  versionSignatures: {
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
}

export interface ProposalCandidate extends ProposalCandidateInfo {
  version: ProposalCandidateVersion;
}

export interface PartialProposalCandidate extends ProposalCandidateInfo {
  lastUpdatedTimestamp: number;
  latestVersion: {
    title: string;
    description: string;
    versionSignatures: {
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
