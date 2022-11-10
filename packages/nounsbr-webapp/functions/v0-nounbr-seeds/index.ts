import { Handler } from '@netlify/functions';
import { nounsbrQuery, Seed } from '../theGraph';
import * as R from 'ramda';
import { sharedResponseHeaders } from '../utils';

interface SeededNounBR {
  id: number;
  seed: Seed;
}

const buildSeededNounBR = R.pick(['id', 'seed']);

const buildSeededNounsBR = R.map(buildSeededNounBR);

const handler: Handler = async (event, context) => {
  const nounsbr = await nounsbrQuery();
  const seededNounsBR: SeededNounBR[] = buildSeededNounsBR(nounsbr);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(seededNounsBR),
  };
};

export { handler };
