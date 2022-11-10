import { Handler } from '@netlify/functions';
import { NormalizedVote, nounsbrQuery } from '../theGraph';
import * as R from 'ramda';
import { sharedResponseHeaders } from '../utils';

interface NounBRVote {
  id: number;
  owner: string;
  delegatedTo: null | string;
  votes: NormalizedVote[];
}

const buildNounBRVote = R.pick(['id', 'owner', 'delegatedTo', 'votes']);

const buildNounBRVotes = R.map(buildNounBRVote);

const handler: Handler = async (event, context) => {
  const nounsbr = await nounsbrQuery();
  const nounbrVotes: NounBRVote[] = buildNounBRVotes(nounsbr);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(nounbrVotes),
  };
};

export { handler };
