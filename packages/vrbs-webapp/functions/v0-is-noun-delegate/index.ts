import { Handler } from '@netlify/functions';
import { isN00unDelegate, vrbsQuery } from '../theGraph';
import { sharedResponseHeaders } from '../utils';

const handler: Handler = async (event, context) => {
  const vrbs = await vrbsQuery();
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(isN00unDelegate(event.body, vrbs)),
  };
};

export { handler };
