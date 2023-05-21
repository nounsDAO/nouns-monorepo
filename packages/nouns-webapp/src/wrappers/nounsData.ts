import { Contract, utils } from 'ethers';
import { NounsDAODataABI, NounsDaoDataFactory } from '@nouns/contracts';
import { useContractCall, useContractFunction, useEthers } from '@usedapp/core';
import config from '../config';
import {
  candidateProposalQuery,
  candidateProposalsQuery,
  proposalFeedbacksQuery,
} from './subgraph';
import { useQuery } from '@apollo/client';
import BigNumber from 'bignumber.js';
import { ProposalDetail, ProposalTransactionDetails, extractTitle, formatProposalTransactionDetails, formatProposalTransactionDetailsToUpdate, removeMarkdownStyle } from './nounsDao';
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
  const { loading, data, error } = useQuery(candidateProposalsQuery());

  return { loading, data, error };
};

export const useCandidateProposal = (id: string) => {
  return parseSubgraphCandidate(
    useQuery(candidateProposalQuery(id)).data?.proposalCandidate
  );
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
  console.log('useUpdateProposalCandidate');
  const { send: updateProposalCandidate, state: updateProposalCandidateState } = useContractFunction(
    nounsDAOData,
    'updateProposalCandidate',
  );
  console.log('updateProposalCandidateState', updateProposalCandidateState);
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

export const useProposalFeedback = (id: string) => {
  const { loading, data, error } = useQuery(proposalFeedbacksQuery(id));

  return { loading, data, error };
};


const parseSubgraphCandidate = (
  candidate: ProposalCandidateSubgraphEntity | undefined
) => {
  if (!candidate) {
    return;
  }

  console.log('parseSubgraphCandidate candidate', candidate);
  const description = candidate.latestVersion.description
    ?.replace(/\\n/g, '\n')
    .replace(/(^['"]|['"]$)/g, '');
  const details: ProposalTransactionDetails = {
    targets: candidate.latestVersion.targets,
    values: candidate.latestVersion.values,
    signatures: candidate.latestVersion.signatures,
    calldatas: candidate.latestVersion.calldatas,
    encodedProposalHash: candidate.latestVersion.encodedProposalHash,
  };
  console.log('parseSubgraphCandidate details', details);
  const formattedDetails = formatProposalTransactionDetailsToUpdate(details);
  console.log('parseSubgraphCandidate formattedDetails', formattedDetails);
  return {
    id: candidate.id,
    slug: candidate.slug,
    proposer: candidate.proposer,
    lastUpdatedTimestamp: candidate.lastUpdatedTimestamp,
    canceled: candidate.canceled,
    versionsCount: candidate.versions.length,
    version: {
      title: R.pipe(extractTitle, removeMarkdownStyle)(description) ?? 'Untitled',
      description: description ?? 'No description.',
      // details: formatProposalTransactionDetails(details),
      details: formatProposalTransactionDetailsToUpdate(details),
      transactionHash: details.encodedProposalHash,
      versionSignatures: candidate.latestVersion.versionSignatures,
    },
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
}

export interface ProposalCandidateVersion {
  title: string;
  description: string;
  details: ProposalDetail[];
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
  canceled: boolean;
  proposer: string;
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
