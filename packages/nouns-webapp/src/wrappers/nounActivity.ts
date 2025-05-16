import type { Address } from '@/utils/types';

import { useQuery } from '@apollo/client';

import { NounVoteHistory } from '@/components/ProfileActivityFeed';

import { useNounCanVoteTimestamp } from './nounsAuction';
import { PartialProposal, Proposal, ProposalState, useAllProposals } from './nounsDao';
import {
  createTimestampAllProposals,
  nounDelegationHistoryQuery,
  nounTransferHistoryQuery,
  nounVotingHistoryQuery,
} from './subgraph';
import {
  DelegationEvent as GraphQLDelegationEvent,
  Maybe,
  Noun,
  TransferEvent as GraphQLTransferEvent,
} from '@/subgraphs';
import { map } from 'remeda';

export enum NounEventType {
  PROPOSAL_VOTE,
  DELEGATION,
  TRANSFER,
  AUCTION_WIN,
}

export type ProposalVoteEvent = {
  proposal: Proposal;
  vote: {
    // Delegate (possibly holder in case of self-delegation) ETH address (undefined in the case of no vote cast)
    voter: Address | undefined;
    supportDetailed: 0 | 1 | 2 | undefined;
  };
};

export type TransferEvent = {
  from: Address;
  to: Address;
  transactionHash: string;
};

export type DelegationEvent = {
  previousDelegate: Address;
  newDelegate: Address;
  transactionHash: string;
};

// Wrapper type around Noun events.
// All events are keyed by blockNumber to allow sorting.
export type NounProfileEvent = {
  blockNumber: number;
  eventType: NounEventType;
  payload: ProposalVoteEvent | DelegationEvent | TransferEvent | NounWinEvent;
};

export type NounWinEvent = {
  nounId: string | number;
  winner: Address;
  transactionHash: string;
};

export type NounProfileEventFetcherResponse = {
  data?: NounProfileEvent[];
  error: boolean;
  loading: boolean;
};

/**
 * Fetch list of ProposalVoteEvents representing the voting history of the given Noun
 * @param nounId Id of Noun who's voting history will be fetched
 */
const useNounProposalVoteEvents = (nounId: number): NounProfileEventFetcherResponse => {
  const { loading, error, data } = useQuery<{ noun: Maybe<Noun> }>(nounVotingHistoryQuery(nounId));

  const {
    loading: proposalTimestampLoading,
    error: proposalTimestampError,
    data: proposalCreatedTimestamps,
  } = useQuery<{ proposals: Maybe<Proposal[]> }>(createTimestampAllProposals());

  const nounCanVoteTimestamp = useNounCanVoteTimestamp(nounId);

  const { data: proposals } = useAllProposals();

  if (loading || !proposals || !proposals.length || proposalTimestampLoading) {
    return {
      loading: true,
      error: false,
    };
  } else if (error || proposalTimestampError) {
    return {
      loading: false,
      error: true,
    };
  }

  const nounVotes: { [key: string]: NounVoteHistory } = data?.noun?.votes
    ? data.noun.votes.slice(0).reduce((acc: { [key: string]: NounVoteHistory }, h) => {
        // Convert the proposal vote to NounVoteHistory and ensure proposal.id is a number
        acc[h.proposal.id] = {
          ...h,
          proposal: {
            ...h.proposal,
            id: Number(h.proposal.id),
          },
          voter: {
            id: h.voter.id as `0x${string}`,
          },
        };
        return acc;
      }, {})
    : {};

  const filteredProposals = proposals.filter((p: PartialProposal, id: number) => {
    if (!p.id) {
      return false;
    }

    const proposalCreationTimestamp = Number(
      proposalCreatedTimestamps?.proposals
        ? proposalCreatedTimestamps?.proposals[id].createdTimestamp
        : 0,
    );

    // Filter props from before the Noun was born
    if (nounCanVoteTimestamp > proposalCreationTimestamp) {
      return false;
    }
    // Filter props which were canceled and got 0 votes of any kind
    return !(
      p.status === ProposalState.CANCELLED && p.forCount + p.abstainCount + p.againstCount === 0
    );
  });

  const events = filteredProposals.map((proposal: PartialProposal) => {
    const vote = nounVotes[proposal.id as string];
    const didVote = vote != undefined;
    return {
      // If no vote was cast, for indexing / sorting purposes declear the block number of this event
      // to be the end block of the voting period
      blockNumber: didVote ? Number(vote.blockNumber.toString()) : proposal.endBlock,
      eventType: NounEventType.PROPOSAL_VOTE,
      payload: {
        proposal,
        vote: {
          voter: didVote ? vote.voter.id : undefined,
          supportDetailed: didVote ? vote.supportDetailed : undefined,
        },
      },
    };
  }) as NounProfileEvent[];

  return {
    loading: false,
    error: false,
    data: events,
  };
};

/**
 * Fetch list of TransferEvents for given Noun
 * @param nounId Id of Noun who's transfer history we will fetch
 */
const useNounTransferEvents = (nounId: number): NounProfileEventFetcherResponse => {
  const { loading, error, data } = useQuery<{ transferEvents: Maybe<GraphQLTransferEvent[]> }>(
    nounTransferHistoryQuery(nounId),
  );
  if (loading) {
    return {
      loading,
      error: false,
    };
  }

  if (error) {
    return {
      loading,
      error: true,
    };
  }

  return {
    loading: false,
    error: false,
    data: map(data?.transferEvents ?? [], event => {
      return {
        blockNumber: BigInt(event.blockNumber),
        eventType: NounEventType.TRANSFER,
        payload: {
          from: event.previousHolder.id as Address,
          to: event.newHolder.id as Address,
          transactionHash: event.id.substring(0, event.id.indexOf('_')),
        },
      } as NounProfileEvent;
    }),
  };
};

/**
 * Fetch list of DelegationEvents for given Noun
 * @param nounId Id of Noun who's transfer history we will fetch
 */
const useDelegationEvents = (nounId: number): NounProfileEventFetcherResponse => {
  const { loading, error, data } = useQuery<{ delegationEvents: Maybe<GraphQLDelegationEvent[]> }>(
    nounDelegationHistoryQuery(nounId),
  );
  if (loading) {
    return {
      loading,
      error: false,
    };
  }

  if (error) {
    return {
      loading,
      error: true,
    };
  }

  return {
    loading: false,
    error: false,
    data: map(data?.delegationEvents ?? [], event => {
      return {
        blockNumber: BigInt(event.blockNumber),
        eventType: NounEventType.DELEGATION,
        payload: {
          previousDelegate: event.previousDelegate.id as Address,
          newDelegate: event.newDelegate.id as Address,
          transactionHash: event.id.substring(0, event.id.indexOf('_')),
        },
      };
    }),
  };
};

/**
 * Fetch list of all events for given Noun (ex: voting, transfer, delegation, etc.)
 * @param nounId Id of Noun who's history we will fetch
 */
export const useNounActivity = (nounId: number): NounProfileEventFetcherResponse => {
  const {
    loading: loadingVotes,
    error: votesError,
    data: votesData,
  } = useNounProposalVoteEvents(nounId);
  const {
    loading: loadingNounTransfer,
    error: nounTransferError,
    data: nounTransferData,
  } = useNounTransferEvents(nounId);
  const {
    loading: loadingDelegationEvents,
    error: delegationEventsError,
    data: delegationEventsData,
  } = useDelegationEvents(nounId);

  if (loadingDelegationEvents || loadingNounTransfer || loadingVotes) {
    return {
      loading: true,
      error: false,
    };
  }

  if (votesError || nounTransferError || delegationEventsError) {
    return {
      loading: false,
      error: true,
    };
  }

  if (
    nounTransferData === undefined ||
    votesData === undefined ||
    delegationEventsData === undefined
  ) {
    return {
      loading: true,
      error: false,
    };
  }

  const events = votesData
    ?.concat(nounTransferData)
    .concat(delegationEventsData)
    .sort((a: NounProfileEvent, b: NounProfileEvent) => a.blockNumber - b.blockNumber)
    .reverse();

  const postProcessedEvents = events.slice(0, events.length - (nounId % 10 === 0 ? 2 : 4));

  // Wrap this line in a try-catch to prevent edge case
  // where excessive spamming to left / right keys can cause transfer
  // and delegation data to be empty which leads to errors
  try {
    // Parse noun birth + win events into a single event
    const nounTransferFromAuctionHouse = nounTransferData.toSorted(
      (a: NounProfileEvent, b: NounProfileEvent) => a.blockNumber - b.blockNumber,
    )[nounId % 10 === 0 ? 0 : 1].payload as TransferEvent;
    const nounTransferFromAuctionHouseBlockNumber = nounTransferData.toSorted(
      (a: NounProfileEvent, b: NounProfileEvent) => a.blockNumber - b.blockNumber,
    )[nounId % 10 === 0 ? 0 : 1].blockNumber;

    const nounWinEvent = {
      nounId: nounId,
      winner: nounTransferFromAuctionHouse.to,
      transactionHash: nounTransferFromAuctionHouse.transactionHash,
    } as NounWinEvent;

    postProcessedEvents.push({
      eventType: NounEventType.AUCTION_WIN,
      blockNumber: nounTransferFromAuctionHouseBlockNumber,
      payload: nounWinEvent,
    } as NounProfileEvent);
  } catch (e) {
    console.log(e);
  }

  return {
    loading: false,
    error: false,
    data: postProcessedEvents,
  };
};
