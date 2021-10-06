import { Handler } from '@netlify/functions';
import { nounsQuery, Seed } from '../theGraph';
import * as R from 'ramda';
import { sharedResponseHeaders } from '../utils';

interface SeededNoun {
  id: number;
  seed: Seed;
}

const buildSeededNoun = R.pick(['id', 'seed']);

const buildSeededNouns = R.map(buildSeededNoun);

const handler: Handler = async (event, context) => {
  const nouns = await nounsQuery();
  const seededNouns: SeededNoun[] = buildSeededNouns(nouns);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(seededNouns),
  };
};

export { handler };
