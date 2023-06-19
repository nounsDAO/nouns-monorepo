import { Proposal, ProposalSubgraphResponse, Vote } from '../types';
import R from 'ramda';

const SECONDS_IN_DAY = 60 * 60 * 24;

/**
 * Parse Proposal Subgraph Response into usable types
 * @param psgRes Response from Proposal Subgraph query
 * @returns Array of Proposals parsed as Numbers, etc
 */
export const parseProposalSubgraphResponse = (psgRes: ProposalSubgraphResponse): Proposal[] =>
  R.map(parseProposal, psgRes.proposals);

/**
 * Coerce Proposal into the correct types
 * @param proposal Proposal or proposal-like object
 * @returns Parsed Proposal object
 */
export const parseProposal = (proposal: Proposal): Proposal => ({
  ...proposal,
  id: Number(proposal.id),
  quorumVotes: Number(proposal.quorumVotes),
  proposalThreshold: Number(proposal.proposalThreshold),
  startBlock: Number(proposal.startBlock),
  endBlock: Number(proposal.endBlock),
  executionETA: Number(proposal.executionETA),
  votes: R.map(parseVote, proposal.votes),
});

/**
 * Coerce Vote object into correct type
 * @param vote Vote or vote-like object
 * @returns Parsed Vote object
 */
export const parseVote = (vote: Vote): Vote => ({
  ...vote,
  votes: Number(vote.votes),
});

/**
 * Extract new votes between two proposal records
 * @param proposalBefore Previous proposal record
 * @param proposalAfter Current proposal record
 * @returns New votes present in the current record and not the previous record
 */
export const extractNewVotes = (proposalBefore: Proposal, proposalAfter: Proposal): Vote[] => {
  const previousStateVoteIds = R.map(R.prop('id'), proposalBefore.votes);
  return proposalAfter.votes.filter(
    vote => previousStateVoteIds.indexOf(vote.id) === -1 && vote.votes > 0,
  );
};

/**
 * Extract the title from a proposal's description
 * @param proposal Proposal object
 * @returns Title extracted from description (first line)
 */
export const extractProposalTitle = (proposal: Proposal): string =>
  proposal.description.split('\n')[0].replace(/^#\s*/, '');

/**
 * Determine if the passed proposal is at-risk of expiry
 * @param proposal Proposal object
 */
export const isAtRiskOfExpiry = (proposal: Proposal) => {
  if (proposal.status !== 'QUEUED') {
    return false;
  }
  const expiresAt = proposal.executionETA + SECONDS_IN_DAY * 14;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const secondsUntilExpiry = expiresAt - currentTimestamp;

  // Proposals are at-risk of expiry if within 2 days of the 14 day limit
  return secondsUntilExpiry > 0 && secondsUntilExpiry <= SECONDS_IN_DAY * 2;
};
