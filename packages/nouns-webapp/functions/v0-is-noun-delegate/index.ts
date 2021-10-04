import { Handler } from '@netlify/functions';
import { isNounDelegate, nounsQuery } from '../theGraph';
import { sharedResponseHeaders } from '../utils';

const handler: Handler = async (event, context) => {
  const nouns = await nounsQuery();
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(isNounDelegate(event.body, nouns)),
  };
};

export { handler };
