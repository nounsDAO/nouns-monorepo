import { useQuery } from '@apollo/client';
import { faAssistiveListeningSystems } from '@fortawesome/free-solid-svg-icons';
import { NounVoteHistory } from '../components/ProfileActivityFeed';
import { useNounCanVoteTimestamp } from './nounsAuction';
import { Proposal, ProposalState, useAllProposals } from './nounsDao';
import {
  createTimestampAllProposals,
  nounDelegationHistoryQuery,
  nounTransferHistoryQuery,
  nounVotingHistoryQuery,
} from './subgraph';

export type NounVoteHistoryResponse = {
  loading: boolean;
  error: boolean;
  data?: NounProfileEvent[];
};

export type UseNounVoteHistoryConfig = {
  nounId: number;
};

export type NounProfileEvent = {
  eventBlockNumber: number;
  eventType: NounProfileEventType;
  // TODO this will evetually be an OR of a few types
  data: any;
};

export type UseNounProfileEventsResponse = {
  loading: boolean;
  error: boolean;
  data?: NounProfileEvent[];
};

export enum NounProfileEventType {
  VOTE = 'VOTE',
  TRANSFER = 'TRANSFER',
  DELEGATION = 'DELEGATION',
}

/**
 *
 * @param param0
 * @returns
 */
export function useNounVoteHistory({ nounId }: UseNounVoteHistoryConfig): NounVoteHistoryResponse {
  const { loading, error, data } = useQuery(nounVotingHistoryQuery(nounId));

  const {
    loading: proposalTimestampLoading,
    error: proposalTimestampError,
    data: proposalCreatedTimestamps,
  } = useQuery(createTimestampAllProposals());

  const nounCanVoteTimestamp = useNounCanVoteTimestamp(nounId);

  const { data: proposals } = useAllProposals();

  if (loading || !proposals || !proposals.length || proposalTimestampLoading) {
    return {
      loading: true,
      error: false,
    };
  } else if (error || proposalTimestampError) {
    console.log('VOTE HISTORY', error);
    return {
      loading: false,
      error: true,
    };
  }

  const nounVotes: { [key: string]: NounVoteHistory } = data.noun.votes
    .slice(0)
    .reduce((acc: any, h: NounVoteHistory, i: number) => {
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

  const filteredProposalIds = filteredProposals.map(
    (proposal: Proposal) => proposal.id,
  ) as string[];

  const fileteredProposalsWithVotes = filteredProposalIds
    .map((proposalId: string) => {
      return nounVotes[proposalId];
    })
    .filter(vote => vote !== undefined)
    .map((vote: NounVoteHistory) => {
      return {
        eventBlockNumber: parseInt(vote.blockNumber.toString()),
        eventType: NounProfileEventType.VOTE, // TODO maybe we should change this verbeage
        data: vote,
      };
    }) as NounProfileEvent[];

  const proposalIdsWithVotes = fileteredProposalsWithVotes.map((event: NounProfileEvent) => {
    console.log(event);
    return event.data.proposal.id;
  });

  const proposalsWithoutVotes = filteredProposals.filter((proposal: Proposal) => {
    return !proposalIdsWithVotes.includes(proposal.id);
  });

  return {
    loading: false,
    error: false,
    data: fileteredProposalsWithVotes.concat(
      proposalsWithoutVotes.map((proposal: Proposal) => {
        return {
          eventBlockNumber: proposal.endBlock,
          eventType: NounProfileEventType.VOTE,
          data: {
            proposal,
            supportDetailed: undefined,
          },
        };
      }),
    ),
  };
}

/**
 *
 * @param nounId
 */
export function useNounTransferHistory(nounId: number): UseNounProfileEventsResponse {
  const { loading, error, data } = useQuery(nounTransferHistoryQuery(nounId));
  if (loading) {
    return {
      loading,
      error: false,
    };
  }

  if (error) {
    console.log('TRANSFER', error);
    return {
      loading,
      error: true,
    };
  }

  // TODO any is evil
  const events = data.transferEvents.map((event: any) => {
    return {
      eventBlockNumber: parseInt(event.blockNumber),
      eventType: NounProfileEventType.TRANSFER,
      data: event,
    };
  });

  console.log(events);
  return {
    loading: false,
    error: false,
    data: events,
  };
}

/**
 *
 * @param nounId
 */
export function useNounDelegationHistory(nounId: number): UseNounProfileEventsResponse {
  const { loading, error, data } = useQuery(nounDelegationHistoryQuery(nounId));
  if (loading) {
    return {
      loading,
      error: false,
    };
  }

  if (error) {
    console.log('DELEGATION', error);
    return {
      loading,
      error: true,
    };
  }

  // TODO any is evil
  const events = data.delegationEvents.map((event: any) => {
    return {
      eventBlockNumber: parseInt(event.blockNumber),
      eventType: NounProfileEventType.DELEGATION,
      data: event,
    };
  });

  return {
    loading: false,
    error: false,
    data: events,
  };
}

/**
 *
 * @param nounId
 * @returns
 */
export function useNounProfileEvents(nounId: number): UseNounProfileEventsResponse {
  const {
    loading: loadingVotes,
    error: votesError,
    data: votesData,
  } = useNounVoteHistory({ nounId });
  const {
    loading: loadingNounTransfer,
    error: nounTransferError,
    data: nounTransferData,
  } = useNounTransferHistory(nounId);
  // TODO delegates is a bit of a misnomer here ... more like delegation events
  const {
    loading: loadingDelegates,
    error: delegatesError,
    data: delegatesData,
  } = useNounDelegationHistory(nounId);
  // TODO add one for create proposals

  if (loadingDelegates || loadingNounTransfer || loadingVotes) {
    return {
      loading: true,
      error: false,
    };
  }

  if (votesError || nounTransferError || delegatesError) {
    return {
      loading: false,
      error: true,
    };
  }

  console.log('HELLO');
  if (nounTransferData === undefined || votesData === undefined || delegatesData === undefined) {
    return {
      loading: true,
      error: false,
    };
  }

  const events = votesData
    ?.concat(nounTransferData)
    .concat(delegatesData)
    .sort(
      (a: NounProfileEvent, b: NounProfileEvent) => -1 * (a.eventBlockNumber - b.eventBlockNumber),
    );
  const sorted = events.map(e => e.eventBlockNumber).sort((a: number, b: number) => -1 * (a - b));

  console.log(events);
  console.log(sorted);

  return {
    loading: false,
    error: false,
    data: events,
  };
}
