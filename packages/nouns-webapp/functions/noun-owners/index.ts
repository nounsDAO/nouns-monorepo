import { Handler } from "@netlify/functions";
import axios from 'axios'
import config from '../../src/config'
import * as R from 'ramda';

const nounsQuery = `
{
  nouns {
    id
    owner {
      id
    }
  }
}
`

const normalizeNoun = (noun: any) => ({
  id: Number(noun.id),
  owner: noun.owner.id
})

const handler: Handler = async (event, context) => {
  const graphResponse = await axios.post(config.subgraphApiUri, { query: nounsQuery });
  const nouns = R.map(normalizeNoun, graphResponse.data.data.nouns);
  return {
    statusCode: 200,
    body: JSON.stringify(R.map(normalizeNoun, nouns))
  };
};

export { handler };
