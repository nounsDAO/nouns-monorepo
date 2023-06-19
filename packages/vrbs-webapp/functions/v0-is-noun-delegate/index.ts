import { Handler } from '@netlify/functions';
import { isVrbDelegate, vrbsQuery } from '../theGraph';
import { sharedResponseHeaders } from '../utils';

const handler: Handler = async (event, context) => {
  const vrbs = await vrbsQuery();
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(isVrbDelegate(event.body, vrbs)),
  };
};

export { handler };
