import { Handler } from '@netlify/functions';
import { NormalizedPunk, NormalizedVote, punksQuery } from '../theGraph';
import { sharedResponseHeaders } from '../utils';

interface ProposalVote {
  tokenId: number;
  owner: string;
  delegatedTo: null | string;
  supportDetailed: number;
}

interface ProposalVotes {
  [key: number]: ProposalVote[];
}

const builtProposalVote = (punk: NormalizedPunk, vote: NormalizedVote): ProposalVote => ({
  tokenId: punk.id,
  owner: punk.owner,
  delegatedTo: punk.delegatedTo,
  supportDetailed: vote.supportDetailed,
});

const reduceProposalVotes = (punks: NormalizedPunk[]) =>
punks.reduce((acc: ProposalVotes, punk: NormalizedPunk) => {
    for (let i in punk.votes) {
      const vote = punk.votes[i];
      if (!acc[vote.proposalId]) acc[vote.proposalId] = [];
      acc[vote.proposalId].push(builtProposalVote(punk, vote));
    }
    return acc;
  }, {});

const handler: Handler = async (event, context) => {
  const punks = await punksQuery();
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(reduceProposalVotes(punks)),
  };
};

export { handler };
