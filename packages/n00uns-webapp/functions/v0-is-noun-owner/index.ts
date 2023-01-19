import { Handler } from '@netlify/functions';
import { isN00unOwner, n00unsQuery } from '../theGraph';
import { sharedResponseHeaders } from '../utils';

const handler: Handler = async (event, context) => {
  const n00uns = await n00unsQuery();
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(isN00unOwner(event.body, n00uns)),
  };
};

export { handler };
