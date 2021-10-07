import { Handler } from '@netlify/functions';
import { NormalizedNoun, NormalizedVote, nounsQuery } from '../theGraph';
import { sharedResponseHeaders } from '../utils';

interface ProposalVote {
  nounId: number;
  owner: string;
  delegatedTo: null | string;
  supportDetailed: number;
}

interface ProposalVotes {
  [key: number]: ProposalVote[];
}

const builtProposalVote = (noun: NormalizedNoun, vote: NormalizedVote): ProposalVote => ({
  nounId: noun.id,
  owner: noun.owner,
  delegatedTo: noun.delegatedTo,
  supportDetailed: vote.supportDetailed,
});

const reduceProposalVotes = (nouns: NormalizedNoun[]) =>
  nouns.reduce((acc: ProposalVotes, noun: NormalizedNoun) => {
    for (let i in noun.votes) {
      const vote = noun.votes[i];
      if (!acc[vote.proposalId]) acc[vote.proposalId] = [];
      acc[vote.proposalId].push(builtProposalVote(noun, vote));
    }
    return acc;
  }, {});

const handler: Handler = async (event, context) => {
  const nouns = await nounsQuery();
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(reduceProposalVotes(nouns)),
  };
};

export { handler };
