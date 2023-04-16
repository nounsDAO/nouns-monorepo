import { Contract, utils } from 'ethers';
import { NounsDAODataABI, NounsDaoDataFactory } from '@nouns/contracts';
import { useContractFunction, useEthers } from '@usedapp/core';
import config from '../config';
import { candidateProposalQuery, candidateProposalsQuery } from './subgraph';
import { useQuery } from '@apollo/client';

const abi = new utils.Interface(NounsDAODataABI);

export const useCreateProposalCandidate = () => {
  const nounsDAOData = new NounsDaoDataFactory().attach(config.addresses.nounsDAOData!);

  const { send: createProposalCandidate, state: createProposalCandidateState } =
    useContractFunction(nounsDAOData, 'createProposalCandidate');

  return { createProposalCandidate, createProposalCandidateState };
};

export const useCandidateProposals = () => {
  const { loading, data, error } = useQuery(candidateProposalsQuery());

  return { loading, data, error };
};

export const useCandidateProposal = (id: string) => {
  return useQuery(candidateProposalQuery(id)).data?.proposalCandidate;
};
