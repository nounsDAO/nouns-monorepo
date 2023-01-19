import { useQuery } from '@apollo/client';
import { N00unVoteHistory } from '../components/ProfileActivityFeed';
import { useN00unCanVoteTimestamp } from './n00unsAuction';
import { PartialProposal, Proposal, ProposalState, useAllProposals } from './n00unsDao';
import {
  createTimestampAllProposals,
  n00unDelegationHistoryQuery,
  n00unTransferHistoryQuery,
  n00unVotingHistoryQuery,
} from './subgraph';

export enum N00unEventType {
  PROPOSAL_VOTE,
  DELEGATION,
  TRANSFER,
  AUCTION_WIN,
}

export type ProposalVoteEvent = {
  proposal: Proposal;
  vote: {
    // Delegate (possibly holder in case of self-delegation) ETH address (undefined in the case of no vote cast)
    voter: string | undefined;
    supportDetailed: 0 | 1 | 2 | undefined;
  };
};

export type TransferEvent = {
  from: string;
  to: string;
  transactionHash: string;
};

export type DelegationEvent = {
  previousDelegate: string;
  newDelegate: string;
  transactionHash: string;
};

// Wrapper type around N00un events.
// All events are keyed by blockNumber to allow sorting.
export type N00unProfileEvent = {
  blockNumber: number;
  eventType: N00unEventType;
  payload: ProposalVoteEvent | DelegationEvent | TransferEvent | N00unWinEvent;
};

export type N00unWinEvent = {
  n00unId: string | number;
  winner: string;
  transactionHash: string;
};

export type N00unProfileEventFetcherResponse = {
  data?: N00unProfileEvent[];
  error: boolean;
  loading: boolean;
};

/**
 * Fetch list of ProposalVoteEvents representing the voting history of the given N00un
 * @param n00unId Id of N00un who's voting history will be fetched
 */
const useN00unProposalVoteEvents = (n00unId: number): N00unProfileEventFetcherResponse => {
  const { loading, error, data } = useQuery(n00unVotingHistoryQuery(n00unId));

  const {
    loading: proposalTimestampLoading,
    error: proposalTimestampError,
    data: proposalCreatedTimestamps,
  } = useQuery(createTimestampAllProposals());

  const n00unCanVoteTimestamp = useN00unCanVoteTimestamp(n00unId);

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

  const n00unVotes: { [key: string]: N00unVoteHistory } = data.n00un.votes
    .slice(0)
    .reduce((acc: any, h: N00unVoteHistory, i: number) => {
      acc[h.proposal.id] = h;
      return acc;
    }, {});

  const filteredProposals = proposals.filter((p: PartialProposal, id: number) => {
    if (!p.id) {
      return false;
    }

    const proposalCreationTimestamp = parseInt(
      proposalCreatedTimestamps.proposals[id].createdTimestamp,
    );

    // Filter props from before the N00un was born
    if (n00unCanVoteTimestamp.gt(proposalCreationTimestamp)) {
      return false;
    }
    // Filter props which were cancelled and got 0 votes of any kind
    if (
      p.status === ProposalState.CANCELLED &&
      p.forCount + p.abstainCount + p.againstCount === 0
    ) {
      return false;
    }
    return true;
  });

  const events = filteredProposals.map((proposal: PartialProposal) => {
    const vote = n00unVotes[proposal.id as string];
    const didVote = vote !== undefined;
    return {
      // If no vote was cast, for indexing / sorting purposes declear the block number of this event
      // to be the end block of the voting period
      blockNumber: didVote ? parseInt(vote.blockNumber.toString()) : proposal.endBlock,
      eventType: N00unEventType.PROPOSAL_VOTE,
      payload: {
        proposal,
        vote: {
          voter: didVote ? vote.voter.id : undefined,
          supportDetailed: didVote ? vote.supportDetailed : undefined,
        },
      },
    };
  }) as N00unProfileEvent[];

  return {
    loading: false,
    error: false,
    data: events,
  };
};

/**
 * Fetch list of TransferEvents for given N00un
 * @param n00unId Id of N00un who's transfer history we will fetch
 */
const useN00unTransferEvents = (n00unId: number): N00unProfileEventFetcherResponse => {
  const { loading, error, data } = useQuery(n00unTransferHistoryQuery(n00unId));
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
    data: data.transferEvents.map(
      (event: {
        blockNumber: string;
        previousHolder: { id: any };
        newHolder: { id: any };
        id: any;
      }) => {
        return {
          blockNumber: parseInt(event.blockNumber),
          eventType: N00unEventType.TRANSFER,
          payload: {
            from: event.previousHolder.id,
            to: event.newHolder.id,
            transactionHash: event.id.substring(0, event.id.indexOf('_')),
          } as TransferEvent,
        } as N00unProfileEvent;
      },
    ),
  };
};

/**
 * Fetch list of DelegationEvents for given N00un
 * @param n00unId Id of N00un who's transfer history we will fetch
 */
const useDelegationEvents = (n00unId: number): N00unProfileEventFetcherResponse => {
  const { loading, error, data } = useQuery(n00unDelegationHistoryQuery(n00unId));
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
    data: data.delegationEvents.map(
      (event: {
        blockNumber: string;
        previousDelegate: { id: any };
        newDelegate: { id: any };
        id: string;
      }) => {
        return {
          blockNumber: parseInt(event.blockNumber),
          eventType: N00unEventType.DELEGATION,
          payload: {
            previousDelegate: event.previousDelegate.id,
            newDelegate: event.newDelegate.id,
            transactionHash: event.id.substring(0, event.id.indexOf('_')),
          } as DelegationEvent,
        } as N00unProfileEvent;
      },
    ),
  };
};

/**
 * Fetch list of all events for given N00un (ex: voting, transfer, delegation, etc.)
 * @param n00unId Id of N00un who's history we will fetch
 */
export const useN00unActivity = (n00unId: number): N00unProfileEventFetcherResponse => {
  const {
    loading: loadingVotes,
    error: votesError,
    data: votesData,
  } = useN00unProposalVoteEvents(n00unId);
  const {
    loading: loadingN00unTransfer,
    error: n00unTransferError,
    data: n00unTransferData,
  } = useN00unTransferEvents(n00unId);
  const {
    loading: loadingDelegationEvents,
    error: delegationEventsError,
    data: delegationEventsData,
  } = useDelegationEvents(n00unId);

  if (loadingDelegationEvents || loadingN00unTransfer || loadingVotes) {
    return {
      loading: true,
      error: false,
    };
  }

  if (votesError || n00unTransferError || delegationEventsError) {
    return {
      loading: false,
      error: true,
    };
  }

  if (
    n00unTransferData === undefined ||
    votesData === undefined ||
    delegationEventsData === undefined
  ) {
    return {
      loading: true,
      error: false,
    };
  }

  const events = votesData
    ?.concat(n00unTransferData)
    .concat(delegationEventsData)
    .sort((a: N00unProfileEvent, b: N00unProfileEvent) => a.blockNumber - b.blockNumber)
    .reverse();

  const postProcessedEvents = events.slice(0, events.length - (n00unId % 10 === 0 ? 2 : 4));

  // Wrap this line in a try-catch to prevent edge case
  // where excessive spamming to left / right keys can cause transfer
  // and delegation data to be empty which leads to errors
  try {
    // Parse n00un birth + win events into a single event
    const n00unTransferFromAuctionHouse = n00unTransferData.sort(
      (a: N00unProfileEvent, b: N00unProfileEvent) => a.blockNumber - b.blockNumber,
    )[n00unId % 10 === 0 ? 0 : 1].payload as TransferEvent;
    const n00unTransferFromAuctionHouseBlockNumber = n00unTransferData.sort(
      (a: N00unProfileEvent, b: N00unProfileEvent) => a.blockNumber - b.blockNumber,
    )[n00unId % 10 === 0 ? 0 : 1].blockNumber;

    const n00unWinEvent = {
      n00unId: n00unId,
      winner: n00unTransferFromAuctionHouse.to,
      transactionHash: n00unTransferFromAuctionHouse.transactionHash,
    } as N00unWinEvent;

    postProcessedEvents.push({
      eventType: N00unEventType.AUCTION_WIN,
      blockNumber: n00unTransferFromAuctionHouseBlockNumber,
      payload: n00unWinEvent,
    } as N00unProfileEvent);
  } catch (e) {
    console.log(e);
  }

  return {
    loading: false,
    error: false,
    data: postProcessedEvents,
  };
};
