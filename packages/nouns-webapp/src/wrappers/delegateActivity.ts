import { NounVoteHistory } from '../components/ProfileActivityFeed';
import { NounEventType, NounProfileEvent, ProposalVoteEvent } from './nounActivity';
import { Proposal, useAllProposals } from './nounsDao';

/**
 * Process list of votes (from graph) into equivelent list of NounProfileEvents
 * @param data list of graph votes for given delegate
 * @returns  corresponding list of NounProfileEvents
 */
export const useDelegateProposalVoteEvents = (data: any[]): NounProfileEvent[] => {
  const { data: proposals } = useAllProposals();

  const nounVotes: { [key: string]: NounVoteHistory } = data
    .slice(0)
    .reduce((acc: any, h: NounVoteHistory, i: number) => {
      acc[h.proposal.id] = h;
      return acc;
    }, {});

  return proposals
    .map((proposal: Proposal) => {
      const vote = nounVotes[proposal.id as string];
      const didVote = vote !== undefined;
      return {
        // If no vote was cast, for indexing / sorting purposes declear the block number of this event
        // to be the end block of the voting period
        blockNumber: didVote ? parseInt(vote.blockNumber.toString()) : proposal.endBlock,
        eventType: NounEventType.PROPOSAL_VOTE,
        payload: {
          proposal,
          vote: {
            voter: didVote ? vote.voter.id : undefined,
            supportDetailed: didVote ? vote.supportDetailed : undefined,
            voteReason: didVote ? vote.reason : undefined,
          },
        } as ProposalVoteEvent,
      } as NounProfileEvent;
    })
    .filter((event: NounProfileEvent) => {
      const payload = event.payload as ProposalVoteEvent;
      return payload.vote.voter !== undefined;
    })
    .reverse();
};
