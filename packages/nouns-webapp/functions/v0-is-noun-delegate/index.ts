import { Handler } from '@netlify/functions';
import { isPunkDelegate, punksQuery } from '../theGraph';
import { sharedResponseHeaders } from '../utils';

const handler: Handler = async (event, context) => {
  const punks = await punksQuery();
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(isPunkDelegate(event.body, punks)),
  };
};

export { handler };
