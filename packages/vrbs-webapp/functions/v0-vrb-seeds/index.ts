import { Handler } from '@netlify/functions';
import { vrbsQuery, Seed } from '../theGraph';
import * as R from 'ramda';
import { sharedResponseHeaders } from '../utils';

interface SeededVrb {
  id: number;
  seed: Seed;
}

const buildSeededVrb = R.pick(['id', 'seed']);

const buildSeededVrbs = R.map(buildSeededVrb);

const handler: Handler = async (event, context) => {
  const vrbs = await vrbsQuery();
  const seededVrbs: SeededVrb[] = buildSeededVrbs(vrbs);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(seededVrbs),
  };
};

export { handler };
