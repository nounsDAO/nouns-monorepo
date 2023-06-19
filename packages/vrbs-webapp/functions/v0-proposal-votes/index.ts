import { Handler } from '@netlify/functions';
import { NormalizedVrb, NormalizedVote, vrbsQuery } from '../theGraph';
import { sharedResponseHeaders } from '../utils';

interface ProposalVote {
  vrbId: number;
  owner: string;
  delegatedTo: null | string;
  supportDetailed: number;
}

interface ProposalVotes {
  [key: number]: ProposalVote[];
}

const builtProposalVote = (vrb: NormalizedVrb, vote: NormalizedVote): ProposalVote => ({
  vrbId: vrb.id,
  owner: vrb.owner,
  delegatedTo: vrb.delegatedTo,
  supportDetailed: vote.supportDetailed,
});

const reduceProposalVotes = (vrbs: NormalizedVrb[]) =>
  vrbs.reduce((acc: ProposalVotes, vrb: NormalizedVrb) => {
    for (let i in vrb.votes) {
      const vote = vrb.votes[i];
      if (!acc[vote.proposalId]) acc[vote.proposalId] = [];
      acc[vote.proposalId].push(builtProposalVote(vrb, vote));
    }
    return acc;
  }, {});

const handler: Handler = async (event, context) => {
  const vrbs = await vrbsQuery();
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(reduceProposalVotes(vrbs)),
  };
};

export { handler };
