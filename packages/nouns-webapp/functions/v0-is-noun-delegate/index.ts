import { Handler } from '@netlify/functions';
import { isNounDelegate, normalizeNouns, nounsQuery } from '../theGraph';

const handler: Handler = async (event, context) => {
  const graphResponse = await nounsQuery();
  const nouns = normalizeNouns(graphResponse.data.data.nouns);
  return {
    statusCode: 200,
    body: JSON.stringify(isNounDelegate(event.body, nouns)),
  };
};

export { handler };
