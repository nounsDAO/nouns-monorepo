import { useQuery } from '@apollo/client';
import { NounBRVoteHistory } from '../components/ProfileActivityFeed';
import { useNounBRCanVoteTimestamp } from './nounsbrAuction';
import { Proposal, ProposalState, useAllProposals } from './nounsbrDao';
import {
  createTimestampAllProposals,
  nounbrDelegationHistoryQuery,
  nounbrTransferHistoryQuery,
  nounbrVotingHistoryQuery,
} from './subgraph';

export enum NounBREventType {
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

// Wrapper type around NounBR events.
// All events are keyed by blockNumber to allow sorting.
export type NounBRProfileEvent = {
  blockNumber: number;
  eventType: NounBREventType;
  payload: ProposalVoteEvent | DelegationEvent | TransferEvent | NounBRWinEvent;
};

export type NounBRWinEvent = {
  nounbrId: string | number;
  winner: string;
  transactionHash: string;
};

export type NounBRProfileEventFetcherResponse = {
  data?: NounBRProfileEvent[];
  error: boolean;
  loading: boolean;
};

/**
 * Fetch list of ProposalVoteEvents representing the voting history of the given NounBR
 * @param nounbrId Id of NounBR who's voting history will be fetched
 */
const useNounBRProposalVoteEvents = (nounbrId: number): NounBRProfileEventFetcherResponse => {
  const { loading, error, data } = useQuery(nounbrVotingHistoryQuery(nounbrId));

  const {
    loading: proposalTimestampLoading,
    error: proposalTimestampError,
    data: proposalCreatedTimestamps,
  } = useQuery(createTimestampAllProposals());

  const nounbrCanVoteTimestamp = useNounBRCanVoteTimestamp(nounbrId);

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

  const nounbrVotes: { [key: string]: NounBRVoteHistory } = data.nounbr.votes
    .slice(0)
    .reduce((acc: any, h: NounBRVoteHistory, i: number) => {
      acc[h.proposal.id] = h;
      return acc;
    }, {});

  const filteredProposals = proposals.filter((p: Proposal, id: number) => {
    if (!p.id) {
      return false;
    }

    const proposalCreationTimestamp = parseInt(
      proposalCreatedTimestamps.proposals[id].createdTimestamp,
    );

    // Filter props from before the NounBR was born
    if (nounbrCanVoteTimestamp.gt(proposalCreationTimestamp)) {
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

  const events = filteredProposals.map((proposal: Proposal) => {
    const vote = nounbrVotes[proposal.id as string];
    const didVote = vote !== undefined;
    return {
      // If no vote was cast, for indexing / sorting purposes declear the block number of this event
      // to be the end block of the voting period
      blockNumber: didVote ? parseInt(vote.blockNumber.toString()) : proposal.endBlock,
      eventType: NounBREventType.PROPOSAL_VOTE,
      payload: {
        proposal,
        vote: {
          voter: didVote ? vote.voter.id : undefined,
          supportDetailed: didVote ? vote.supportDetailed : undefined,
        },
      },
    };
  }) as NounBRProfileEvent[];

  return {
    loading: false,
    error: false,
    data: events,
  };
};

/**
 * Fetch list of TransferEvents for given NounBR
 * @param nounbrId Id of NounBR who's transfer history we will fetch
 */
const useNounBRTransferEvents = (nounbrId: number): NounBRProfileEventFetcherResponse => {
  const { loading, error, data } = useQuery(nounbrTransferHistoryQuery(nounbrId));
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
          eventType: NounBREventType.TRANSFER,
          payload: {
            from: event.previousHolder.id,
            to: event.newHolder.id,
            transactionHash: event.id.substring(0, event.id.indexOf('_')),
          } as TransferEvent,
        } as NounBRProfileEvent;
      },
    ),
  };
};

/**
 * Fetch list of DelegationEvents for given NounBR
 * @param nounbrId Id of NounBR who's transfer history we will fetch
 */
const useDelegationEvents = (nounbrId: number): NounBRProfileEventFetcherResponse => {
  const { loading, error, data } = useQuery(nounbrDelegationHistoryQuery(nounbrId));
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
          eventType: NounBREventType.DELEGATION,
          payload: {
            previousDelegate: event.previousDelegate.id,
            newDelegate: event.newDelegate.id,
            transactionHash: event.id.substring(0, event.id.indexOf('_')),
          } as DelegationEvent,
        } as NounBRProfileEvent;
      },
    ),
  };
};

/**
 * Fetch list of all events for given NounBR (ex: voting, transfer, delegation, etc.)
 * @param nounbrId Id of NounBR who's history we will fetch
 */
export const useNounBRActivity = (nounbrId: number): NounBRProfileEventFetcherResponse => {
  const {
    loading: loadingVotes,
    error: votesError,
    data: votesData,
  } = useNounBRProposalVoteEvents(nounbrId);
  const {
    loading: loadingNounBRTransfer,
    error: nounbrTransferError,
    data: nounbrTransferData,
  } = useNounBRTransferEvents(nounbrId);
  const {
    loading: loadingDelegationEvents,
    error: delegationEventsError,
    data: delegationEventsData,
  } = useDelegationEvents(nounbrId);

  if (loadingDelegationEvents || loadingNounBRTransfer || loadingVotes) {
    return {
      loading: true,
      error: false,
    };
  }

  if (votesError || nounbrTransferError || delegationEventsError) {
    return {
      loading: false,
      error: true,
    };
  }

  if (
    nounbrTransferData === undefined ||
    votesData === undefined ||
    delegationEventsData === undefined
  ) {
    return {
      loading: true,
      error: false,
    };
  }

  const events = votesData
    ?.concat(nounbrTransferData)
    .concat(delegationEventsData)
    .sort((a: NounBRProfileEvent, b: NounBRProfileEvent) => a.blockNumber - b.blockNumber)
    .reverse();

  const postProcessedEvents = events.slice(0, events.length - (nounbrId % 10 === 0 ? 2 : 4));

  // Wrap this line in a try-catch to prevent edge case
  // where excessive spamming to left / right keys can cause transfer
  // and delegation data to be empty which leads to errors
  try {
    // Parse nounbr birth + win events into a single event
    const nounbrTransferFromAuctionHouse = nounbrTransferData.sort(
      (a: NounBRProfileEvent, b: NounBRProfileEvent) => a.blockNumber - b.blockNumber,
    )[nounbrId % 10 === 0 ? 0 : 1].payload as TransferEvent;
    const nounbrTransferFromAuctionHouseBlockNumber = nounbrTransferData.sort(
      (a: NounBRProfileEvent, b: NounBRProfileEvent) => a.blockNumber - b.blockNumber,
    )[nounbrId % 10 === 0 ? 0 : 1].blockNumber;

    const nounbrWinEvent = {
      nounbrId: nounbrId,
      winner: nounbrTransferFromAuctionHouse.to,
      transactionHash: nounbrTransferFromAuctionHouse.transactionHash,
    } as NounBRWinEvent;

    postProcessedEvents.push({
      eventType: NounBREventType.AUCTION_WIN,
      blockNumber: nounbrTransferFromAuctionHouseBlockNumber,
      payload: nounbrWinEvent,
    } as NounBRProfileEvent);
  } catch (e) {
    console.log(e);
  }

  return {
    loading: false,
    error: false,
    data: postProcessedEvents,
  };
};
