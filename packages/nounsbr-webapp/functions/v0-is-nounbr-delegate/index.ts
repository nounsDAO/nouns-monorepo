import { Handler } from '@netlify/functions';
import { isNounBRDelegate, nounsbrQuery } from '../theGraph';
import { sharedResponseHeaders } from '../utils';

const handler: Handler = async (event, context) => {
  const nounsbr = await nounsbrQuery();
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(isNounBRDelegate(event.body, nounsbr)),
  };
};

export { handler };
