import { Handler } from '@netlify/functions';
import { NormalizedN00un, NormalizedVote, vrbsQuery } from '../theGraph';
import { sharedResponseHeaders } from '../utils';

interface ProposalVote {
  n00unId: number;
  owner: string;
  delegatedTo: null | string;
  supportDetailed: number;
}

interface ProposalVotes {
  [key: number]: ProposalVote[];
}

const builtProposalVote = (n00un: NormalizedN00un, vote: NormalizedVote): ProposalVote => ({
  n00unId: n00un.id,
  owner: n00un.owner,
  delegatedTo: n00un.delegatedTo,
  supportDetailed: vote.supportDetailed,
});

const reduceProposalVotes = (vrbs: NormalizedN00un[]) =>
  vrbs.reduce((acc: ProposalVotes, n00un: NormalizedN00un) => {
    for (let i in n00un.votes) {
      const vote = n00un.votes[i];
      if (!acc[vote.proposalId]) acc[vote.proposalId] = [];
      acc[vote.proposalId].push(builtProposalVote(n00un, vote));
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
