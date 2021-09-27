import { Handler } from '@netlify/functions';
import { isNounOwner, normalizeNouns, nounsQuery } from '../../theGraph';

const handler: Handler = async (event, context) => {
  const graphResponse = await nounsQuery();
  const nouns = normalizeNouns(graphResponse.data.data.nouns);
  return {
    statusCode: 200,
    body: JSON.stringify(isNounOwner(event.body, nouns)),
  };
};

export { handler };
