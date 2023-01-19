import { Handler } from '@netlify/functions';
import { n00unsQuery, Seed } from '../theGraph';
import * as R from 'ramda';
import { sharedResponseHeaders } from '../utils';

interface SeededN00un {
  id: number;
  seed: Seed;
}

const buildSeededN00un = R.pick(['id', 'seed']);

const buildSeededN00uns = R.map(buildSeededN00un);

const handler: Handler = async (event, context) => {
  const n00uns = await n00unsQuery();
  const seededN00uns: SeededN00un[] = buildSeededN00uns(n00uns);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(seededN00uns),
  };
};

export { handler };
