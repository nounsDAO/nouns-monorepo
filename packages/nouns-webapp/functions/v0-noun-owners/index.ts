import { Handler } from '@netlify/functions';
import { normalizeNouns, nounsQuery } from '../theGraph';

const handler: Handler = async (event, context) => {
  const graphResponse = await nounsQuery();
  const nouns = normalizeNouns(graphResponse.data.data.nouns);
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nouns),
  };
};

export { handler };
