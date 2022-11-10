import { Handler } from '@netlify/functions';
import { nounsbrQuery } from '../theGraph';
import * as R from 'ramda';
import { sharedResponseHeaders } from '../utils';

export interface LiteNounBR {
  id: number;
  owner: string;
  delegatedTo: null | string;
}

const lightenNounBR = R.pick(['id', 'owner', 'delegatedTo']);

const lightenNounsBR = R.map(lightenNounBR);

const handler: Handler = async (event, context) => {
  const nounsbr = await nounsbrQuery();
  const liteNounsBR: LiteNounBR[] = lightenNounsBR(nounsbr);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(liteNounsBR),
  };
};

export { handler };
