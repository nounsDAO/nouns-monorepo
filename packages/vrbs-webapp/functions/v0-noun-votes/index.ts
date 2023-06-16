import { Handler } from '@netlify/functions';
import { NormalizedVote, vrbsQuery } from '../theGraph';
import * as R from 'ramda';
import { sharedResponseHeaders } from '../utils';

interface N00unVote {
  id: number;
  owner: string;
  delegatedTo: null | string;
  votes: NormalizedVote[];
}

const buildN00unVote = R.pick(['id', 'owner', 'delegatedTo', 'votes']);

const buildN00unVotes = R.map(buildN00unVote);

const handler: Handler = async (event, context) => {
  const vrbs = await vrbsQuery();
  const n00unVotes: N00unVote[] = buildN00unVotes(vrbs);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(n00unVotes),
  };
};

export { handler };
