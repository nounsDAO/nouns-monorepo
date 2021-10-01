import { Handler } from '@netlify/functions';
import { NormalizedNoun, NormalizedVote, nounsQuery } from '../theGraph';
import * as R from 'ramda'

interface NounVote {
  id: number;
  owner: string;
  delegatedTo: null | string;
  votes: NormalizedVote[];
}

const buildNounVote = R.pick(['id', 'owner', 'delegatedTo', 'votes'])

const buildNounVotes = R.map(buildNounVote)

const handler: Handler = async (event, context) => {
  const nouns = await nounsQuery();
  const nounVotes: NounVote[] = buildNounVotes(nouns)
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nounVotes)
  };
};

export { handler };
