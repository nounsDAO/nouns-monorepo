import { Handler } from '@netlify/functions';
import { NormalizedVote, punksQuery } from '../theGraph';
import * as R from 'ramda';
import { sharedResponseHeaders } from '../utils';

interface PunkVote {
  id: number;
  owner: string;
  delegatedTo: null | string;
  votes: NormalizedVote[];
}

const buildPunkVote = R.pick(['id', 'owner', 'delegatedTo', 'votes']);

const buildPunkVotes = R.map(buildPunkVote);

const handler: Handler = async (event, context) => {
  const punks = await punksQuery();
  const punkVotes: PunkVote[] = buildPunkVotes(punks);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(punkVotes),
  };
};

export { handler };
