import { Handler } from '@netlify/functions';
import { NormalizedNounBR, NormalizedVote, nounsbrQuery } from '../theGraph';
import { sharedResponseHeaders } from '../utils';

interface ProposalVote {
  nounbrId: number;
  owner: string;
  delegatedTo: null | string;
  supportDetailed: number;
}

interface ProposalVotes {
  [key: number]: ProposalVote[];
}

const builtProposalVote = (nounbr: NormalizedNounBR, vote: NormalizedVote): ProposalVote => ({
  nounbrId: nounbr.id,
  owner: nounbr.owner,
  delegatedTo: nounbr.delegatedTo,
  supportDetailed: vote.supportDetailed,
});

const reduceProposalVotes = (nounsbr: NormalizedNounBR[]) =>
  nounsbr.reduce((acc: ProposalVotes, nounbr: NormalizedNounBR) => {
    for (let i in nounbr.votes) {
      const vote = nounbr.votes[i];
      if (!acc[vote.proposalId]) acc[vote.proposalId] = [];
      acc[vote.proposalId].push(builtProposalVote(nounbr, vote));
    }
    return acc;
  }, {});

const handler: Handler = async (event, context) => {
  const nounsbr = await nounsbrQuery();
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(reduceProposalVotes(nounsbr)),
  };
};

export { handler };
