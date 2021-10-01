import { Handler } from '@netlify/functions';
import { nounsQuery } from '../theGraph';

const handler: Handler = async (event, context) => {
  const nouns = await nounsQuery();
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nouns),
  };
};

export { handler };
