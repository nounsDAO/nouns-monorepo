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
  return useQuery(candidateProposalQuery(id)).data?.proposalCandidate;
};

export const useCreateCandidateCost = () => {
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

export const useCancelSignature = () => {
  const cancelSignature = useContractFunction(nounsDAOData, 'cancelSig');

  return { cancelSignature };
};

export const useSendFeedback = () => {
  const { send: sendFeedback, state: sendFeedbackState } = useContractFunction(
    nounsDAOData,
    'sendFeedback',
  );

  console.log('sendFeedbackState', sendFeedbackState);
  // console.log('sendFeedback', sendFeedback);

  return { sendFeedback, sendFeedbackState };
};

export const useProposalFeedback = (id: string) => {
  const { loading, data, error } = useQuery(proposalFeedbacksQuery(id));

  return { loading, data, error };
};
