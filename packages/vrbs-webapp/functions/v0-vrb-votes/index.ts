import { Handler } from '@netlify/functions';
import { NormalizedVote, vrbsQuery } from '../theGraph';
import * as R from 'ramda';
import { sharedResponseHeaders } from '../utils';

interface VrbVote {
  id: number;
  owner: string;
  delegatedTo: null | string;
  votes: NormalizedVote[];
}

const buildVrbVote = R.pick(['id', 'owner', 'delegatedTo', 'votes']);

const buildVrbVotes = R.map(buildVrbVote);

const handler: Handler = async (event, context) => {
  const vrbs = await vrbsQuery();
  const vrbVotes: VrbVote[] = buildVrbVotes(vrbs);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(vrbVotes),
  };
};

export { handler };
