import { useQuery } from '@apollo/client';
import { VrbVoteHistory } from '../components/ProfileActivityFeed';
import { useVrbCanVoteTimestamp } from './vrbsAuction';
import { PartialProposal, Proposal, ProposalState, useAllProposals } from './vrbsDao';
import {
  createTimestampAllProposals,
  vrbDelegationHistoryQuery,
  vrbTransferHistoryQuery,
  vrbVotingHistoryQuery,
} from './subgraph';

export enum VrbEventType {
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

// Wrapper type around Vrb events.
// All events are keyed by blockNumber to allow sorting.
export type VrbProfileEvent = {
  blockNumber: number;
  eventType: VrbEventType;
  payload: ProposalVoteEvent | DelegationEvent | TransferEvent | WinEvent;
};

export type WinEvent = {
  vrbId: string | number;
  winner: string;
  transactionHash: string;
};

export type VrbProfileEventFetcherResponse = {
  data?: VrbProfileEvent[];
  error: boolean;
  loading: boolean;
};

/**
 * Fetch list of ProposalVoteEvents representing the voting history of the given Vrb
 * @param vrbId Id of Vrb who's voting history will be fetched
 */
const useVrbProposalVoteEvents = (vrbId: number): VrbProfileEventFetcherResponse => {
  const { loading, error, data } = useQuery(vrbVotingHistoryQuery(vrbId));

  const {
    loading: proposalTimestampLoading,
    error: proposalTimestampError,
    data: proposalCreatedTimestamps,
  } = useQuery(createTimestampAllProposals());

  const vrbCanVoteTimestamp = useVrbCanVoteTimestamp(vrbId);

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

  const vrbVotes: { [key: string]: VrbVoteHistory } = data.vrb.votes
    .slice(0)
    .reduce((acc: any, h: VrbVoteHistory, i: number) => {
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

    // Filter props from before the Vrb was born
    if (vrbCanVoteTimestamp.gt(proposalCreationTimestamp)) {
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
    const vote = vrbVotes[proposal.id as string];
    const didVote = vote !== undefined;
    return {
      // If no vote was cast, for indexing / sorting purposes declear the block number of this event
      // to be the end block of the voting period
      blockNumber: didVote ? parseInt(vote.blockNumber.toString()) : proposal.endBlock,
      eventType: VrbEventType.PROPOSAL_VOTE,
      payload: {
        proposal,
        vote: {
          voter: didVote ? vote.voter.id : undefined,
          supportDetailed: didVote ? vote.supportDetailed : undefined,
        },
      },
    };
  }) as VrbProfileEvent[];

  return {
    loading: false,
    error: false,
    data: events,
  };
};

/**
 * Fetch list of TransferEvents for given Vrb
 * @param vrbId Id of Vrb who's transfer history we will fetch
 */
const useVrbTransferEvents = (vrbId: number): VrbProfileEventFetcherResponse => {
  const { loading, error, data } = useQuery(vrbTransferHistoryQuery(vrbId));
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
          eventType: VrbEventType.TRANSFER,
          payload: {
            from: event.previousHolder.id,
            to: event.newHolder.id,
            transactionHash: event.id.substring(0, event.id.indexOf('_')),
          } as TransferEvent,
        } as VrbProfileEvent;
      },
    ),
  };
};

/**
 * Fetch list of DelegationEvents for given Vrb
 * @param vrbId Id of Vrb who's transfer history we will fetch
 */
const useDelegationEvents = (vrbId: number): VrbProfileEventFetcherResponse => {
  const { loading, error, data } = useQuery(vrbDelegationHistoryQuery(vrbId));
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
          eventType: VrbEventType.DELEGATION,
          payload: {
            previousDelegate: event.previousDelegate.id,
            newDelegate: event.newDelegate.id,
            transactionHash: event.id.substring(0, event.id.indexOf('_')),
          } as DelegationEvent,
        } as VrbProfileEvent;
      },
    ),
  };
};

/**
 * Fetch list of all events for given Vrb (ex: voting, transfer, delegation, etc.)
 * @param vrbId Id of Vrb who's history we will fetch
 */
export const useVrbActivity = (vrbId: number): VrbProfileEventFetcherResponse => {
  const {
    loading: loadingVotes,
    error: votesError,
    data: votesData,
  } = useVrbProposalVoteEvents(vrbId);
  const {
    loading: loadingVrbTransfer,
    error: vrbTransferError,
    data: vrbTransferData,
  } = useVrbTransferEvents(vrbId);
  const {
    loading: loadingDelegationEvents,
    error: delegationEventsError,
    data: delegationEventsData,
  } = useDelegationEvents(vrbId);

  if (loadingDelegationEvents || loadingVrbTransfer || loadingVotes) {
    return {
      loading: true,
      error: false,
    };
  }

  if (votesError || vrbTransferError || delegationEventsError) {
    return {
      loading: false,
      error: true,
    };
  }

  if (
    vrbTransferData === undefined ||
    votesData === undefined ||
    delegationEventsData === undefined
  ) {
    return {
      loading: true,
      error: false,
    };
  }

  const events = votesData
    ?.concat(vrbTransferData)
    .concat(delegationEventsData)
    .sort((a: VrbProfileEvent, b: VrbProfileEvent) => a.blockNumber - b.blockNumber)
    .reverse();

  const postProcessedEvents = events.slice(0, events.length - (vrbId % 10 === 0 ? 2 : 4));

  // Wrap this line in a try-catch to prevent edge case
  // where excessive spamming to left / right keys can cause transfer
  // and delegation data to be empty which leads to errors
  try {
    // Parse vrb birth + win events into a single event
    const vrbTransferFromAuctionHouse = vrbTransferData.sort(
      (a: VrbProfileEvent, b: VrbProfileEvent) => a.blockNumber - b.blockNumber,
    )[vrbId % 10 === 0 ? 0 : 1].payload as TransferEvent;
    const vrbTransferFromAuctionHouseBlockNumber = vrbTransferData.sort(
      (a: VrbProfileEvent, b: VrbProfileEvent) => a.blockNumber - b.blockNumber,
    )[vrbId % 10 === 0 ? 0 : 1].blockNumber;

    const vrbWinEvent = {
      vrbId: vrbId,
      winner: vrbTransferFromAuctionHouse.to,
      transactionHash: vrbTransferFromAuctionHouse.transactionHash,
    } as WinEvent;

    postProcessedEvents.push({
      eventType: VrbEventType.AUCTION_WIN,
      blockNumber: vrbTransferFromAuctionHouseBlockNumber,
      payload: vrbWinEvent,
    } as VrbProfileEvent);
  } catch (e) {
    console.log(e);
  }

  return {
    loading: false,
    error: false,
    data: postProcessedEvents,
  };
};
