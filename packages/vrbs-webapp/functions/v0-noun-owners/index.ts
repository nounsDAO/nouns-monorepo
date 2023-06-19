import { Handler } from '@netlify/functions';
import { vrbsQuery } from '../theGraph';
import * as R from 'ramda';
import { sharedResponseHeaders } from '../utils';

export interface LiteVrb {
  id: number;
  owner: string;
  delegatedTo: null | string;
}

const lightenVrb = R.pick(['id', 'owner', 'delegatedTo']);

const lightenVrbs = R.map(lightenVrb);

const handler: Handler = async (event, context) => {
  const vrbs = await vrbsQuery();
  const liteVrbs: LiteVrb[] = lightenVrbs(vrbs);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(liteVrbs),
  };
};

export { handler };
