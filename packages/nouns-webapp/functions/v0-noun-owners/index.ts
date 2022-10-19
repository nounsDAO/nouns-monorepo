import { Handler } from '@netlify/functions';
import { punksQuery } from '../theGraph';
import * as R from 'ramda';
import { sharedResponseHeaders } from '../utils';

export interface LitePunk {
  id: number;
  owner: string;
  delegatedTo: null | string;
}

const lightenPunk = R.pick(['id', 'owner', 'delegatedTo']);

const lightenPunks = R.map(lightenPunk);

const handler: Handler = async (event, context) => {
  const punks = await punksQuery();
  const litePunks: LitePunk[] = lightenPunks(punks);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(litePunks),
  };
};

export { handler };
