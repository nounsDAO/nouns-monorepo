import { useQuery } from '@apollo/client';
import { TokenVoteHistory } from '../components/ProfileActivityFeed';
import { useTokenCanVoteTimestamp } from './nAuction';
import { Proposal, ProposalState, useAllProposals } from './nDao';
import {
  createTimestampAllProposals,
  nDelegationHistoryQuery,
  nTransferHistoryQuery,
  nVotingHistoryQuery,
} from './subgraph';

export enum TokenEventType {
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

// Wrapper type around Noun events.
// All events are keyed by blockNumber to allow sorting.
export type TokenProfileEvent = {
  blockNumber: number;
  eventType: TokenEventType;
  payload: ProposalVoteEvent | DelegationEvent | TransferEvent | TokenWinEvent;
};

export type TokenWinEvent = {
  tokenId: string | number;
  winner: string;
  transactionHash: string;
};

export type NounProfileEventFetcherResponse = {
  data?: TokenProfileEvent[];
  error: boolean;
  loading: boolean;
};

/**
 * Fetch list of ProposalVoteEvents representing the voting history of the given Noun
 * @param tokenId Id of Noun who's voting history will be fetched
 */
const useNounProposalVoteEvents = (tokenId: number): NounProfileEventFetcherResponse => {
  const { loading, error, data } = useQuery(nVotingHistoryQuery(tokenId));

  const {
    loading: proposalTimestampLoading,
    error: proposalTimestampError,
    data: proposalCreatedTimestamps,
  } = useQuery(createTimestampAllProposals());

  const nounCanVoteTimestamp = useTokenCanVoteTimestamp(tokenId);

  const { data: proposals } = useAllProposals();

  if (loading || proposalTimestampLoading) {
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

  const nounVotes: { [key: string]: TokenVoteHistory } = data.punk.votes
    .slice(0)
    .reduce((acc: any, h: TokenVoteHistory, i: number) => {
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

    // Filter props from before the Noun was born
    if (nounCanVoteTimestamp.gt(proposalCreationTimestamp)) {
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
    const vote = nounVotes[proposal.id as string];
    const didVote = vote !== undefined;
    return {
      // If no vote was cast, for indexing / sorting purposes declear the block number of this event
      // to be the end block of the voting period
      blockNumber: didVote ? parseInt(vote.blockNumber.toString()) : proposal.endBlock,
      eventType: TokenEventType.PROPOSAL_VOTE,
      payload: {
        proposal,
        vote: {
          voter: didVote ? vote.voter.id : undefined,
          supportDetailed: didVote ? vote.supportDetailed : undefined,
        },
      },
    };
  }) as TokenProfileEvent[];

  return {
    loading: false,
    error: false,
    data: events ?? [],
  };
};

/**
 * Fetch list of TransferEvents for given Noun
 * @param tokenId Id of Noun who's transfer history we will fetch
 */
const useNounTransferEvents = (tokenId: number): NounProfileEventFetcherResponse => {
  const { loading, error, data } = useQuery(nTransferHistoryQuery(tokenId));
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
          eventType: TokenEventType.TRANSFER,
          payload: {
            from: event.previousHolder.id,
            to: event.newHolder.id,
            transactionHash: event.id.substring(0, event.id.indexOf('_')),
          } as TransferEvent,
        } as TokenProfileEvent;
      },
    ),
  };
};

/**
 * Fetch list of DelegationEvents for given Token
 * @param tokenId Id of Noun who's transfer history we will fetch
 */
const useDelegationEvents = (tokenId: number): NounProfileEventFetcherResponse => {
  const { loading, error, data } = useQuery(nDelegationHistoryQuery(tokenId));
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
          eventType: TokenEventType.DELEGATION,
          payload: {
            previousDelegate: event.previousDelegate.id,
            newDelegate: event.newDelegate.id,
            transactionHash: event.id.substring(0, event.id.indexOf('_')),
          } as DelegationEvent,
        } as TokenProfileEvent;
      },
    ),
  };
};

/**
 * Fetch list of all events for given Noun (ex: voting, transfer, delegation, etc.)
 * @param tokenId Id of Noun who's history we will fetch
 */
export const useNounActivity = (tokenId: number): NounProfileEventFetcherResponse => {
  const {
    loading: loadingVotes,
    error: votesError,
    data: votesData,
  } = useNounProposalVoteEvents(tokenId);
  const {
    loading: loadingNounTransfer,
    error: tokenTransferError,
    data: tokenTransferData,
  } = useNounTransferEvents(tokenId);
  const {
    loading: loadingDelegationEvents,
    error: delegationEventsError,
    data: delegationEventsData,
  } = useDelegationEvents(tokenId);

  if (loadingDelegationEvents || loadingNounTransfer || loadingVotes) {
    return {
      loading: true,
      error: false,
    };
  }

  if (votesError || tokenTransferError || delegationEventsError) {
    return {
      loading: false,
      error: true,
    };
  }

  if (!tokenTransferData || !votesData || !delegationEventsData) {
    return {
      loading: true,
      error: false,
    };
  }

  const events = votesData
    ?.concat(tokenTransferData)
    .concat(delegationEventsData)
    .sort((a: TokenProfileEvent, b: TokenProfileEvent) => a.blockNumber - b.blockNumber)
    .reverse();

  const postProcessedEvents = events.slice(0, events.length - (tokenId % 10 === 0 ? 2 : 4));

  // Wrap this line in a try-catch to prevent edge case
  // where excessive spamming to left / right keys can cause transfer
  // and delegation data to be empty which leads to errors
  try {
    // Parse noun birth + win events into a single event
    const nounTransferFromAuctionHouse = tokenTransferData.sort(
      (a: TokenProfileEvent, b: TokenProfileEvent) => a.blockNumber - b.blockNumber,
    )[tokenId % 10 === 0 ? 0 : 1].payload as TransferEvent;
    const tokenTransferFromAuctionHouseBlockNumber = tokenTransferData.sort(
      (a: TokenProfileEvent, b: TokenProfileEvent) => a.blockNumber - b.blockNumber,
    )[tokenId % 10 === 0 ? 0 : 1].blockNumber;

    const tokenWinEvent = {
      tokenId: tokenId,
      winner: nounTransferFromAuctionHouse.to,
      transactionHash: nounTransferFromAuctionHouse.transactionHash,
    } as TokenWinEvent;

    postProcessedEvents.push({
      eventType: TokenEventType.AUCTION_WIN,
      blockNumber: tokenTransferFromAuctionHouseBlockNumber,
      payload: tokenWinEvent,
    } as TokenProfileEvent);
  } catch (e) {
    console.log(e);
  }

  return {
    loading: false,
    error: false,
    data: postProcessedEvents,
  };
};
