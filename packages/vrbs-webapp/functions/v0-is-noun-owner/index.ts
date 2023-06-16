import { Handler } from '@netlify/functions';
import { isN00unOwner, vrbsQuery } from '../theGraph';
import { sharedResponseHeaders } from '../utils';

const handler: Handler = async (event, context) => {
  const vrbs = await vrbsQuery();
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(isN00unOwner(event.body, vrbs)),
  };
};

export { handler };
