import { Handler } from '@netlify/functions';
import { punksQuery, Seed } from '../theGraph';
import * as R from 'ramda';
import { sharedResponseHeaders } from '../utils';

interface SeededPunk {
  id: number;
  seed: Seed;
}

const buildSeededPunk = R.pick(['id', 'seed']);

const buildSeededPunks = R.map(buildSeededPunk);

const handler: Handler = async (event, context) => {
  const punks = await punksQuery();
  const seededPunks: SeededPunk[] = buildSeededPunks(punks);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(seededPunks),
  };
};

export { handler };
