import { Handler } from '@netlify/functions';
import { n00unsQuery } from '../theGraph';
import * as R from 'ramda';
import { sharedResponseHeaders } from '../utils';

export interface LiteN00un {
  id: number;
  owner: string;
  delegatedTo: null | string;
}

const lightenN00un = R.pick(['id', 'owner', 'delegatedTo']);

const lightenN00uns = R.map(lightenN00un);

const handler: Handler = async (event, context) => {
  const n00uns = await n00unsQuery();
  const liteN00uns: LiteN00un[] = lightenN00uns(n00uns);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(liteN00uns),
  };
};

export { handler };
