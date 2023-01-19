import { Handler } from '@netlify/functions';
import { NormalizedN00un, NormalizedVote, n00unsQuery } from '../theGraph';
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

const reduceProposalVotes = (n00uns: NormalizedN00un[]) =>
  n00uns.reduce((acc: ProposalVotes, n00un: NormalizedN00un) => {
    for (let i in n00un.votes) {
      const vote = n00un.votes[i];
      if (!acc[vote.proposalId]) acc[vote.proposalId] = [];
      acc[vote.proposalId].push(builtProposalVote(n00un, vote));
    }
    return acc;
  }, {});

const handler: Handler = async (event, context) => {
  const n00uns = await n00unsQuery();
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(reduceProposalVotes(n00uns)),
  };
};

export { handler };
