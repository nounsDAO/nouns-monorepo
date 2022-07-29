import { Proposal } from './nounsDao';

export enum NounEventType {
  PROPOSAL_VOTE,
  DELEGATION,
  TRANSFER,
}

export type ProposalVoteEvent = {
  proposal: Proposal;
  vote: {
    // Delegate (possibly holder in case of self-delegation) ETH address
    voter: string;
    supportDetailed: 0 | 1 | 2 | undefined;
  };
};

export type TransferEvent = {
  from: string;
  to: string;
  transactionHash: string;
};

export type DelegationEvent = {
  holder: string;
  previousDelegate: string;
  newDelegate: string;
  transactionHash: string;
};

// Wrapper type around Noun events.
// All events are keyed by blockNumber to allow sorting.
export type NounProfileEvent = {
  blockNumber: number;
  eventType: NounEventType;
  payload: ProposalVoteEvent | DelegationEvent | TransferEvent;
};

/**
 * Fetch list of ProposalVoteEvents representing the voting history of the given Noun
 * @param nounId Id of Noun who's voting history will be fetched
 * @returns Array of ProposalVoteEvents (1 per proposal this Noun was elidigble to vote on) representing its voting history
 */
const fetchNounProposalVoteEvents = (nounId: number): ProposalVoteEvent[] => {
  return [];
};

/**
 * Fetch list of TransferEvents for given Noun
 * @param nounId Id of Noun who's transfer history we will fetch
 * @returns Array of TransferEvents for given Noun
 */
const fetchNounTransferEvents = (nounId: number): TransferEvent[] => {
  // Include birth?
  return [];
};

/**
 * Fetch list of DelegationEvents for given Noun
 * @param nounId Id of Noun who's transfer history we will fetch
 * @returns Array of DelegationEvents for given Noun
 */
const fetchDelegationEvents = (nounId: number): DelegationEvent[] => {
  return [];
};

/**
 * Fetch list of all events for given Noun (ex: voting, transfer, delegation, etc.)
 * @param nounId Id of Noun who's history we will fetch
 * @returns Array of NounProfileEvents sorted by descending blockNumber (i.e. most recent events first)
 */
export const fetchNounActivity = (nounId: number): NounProfileEvent[] => {
  return [];
};
