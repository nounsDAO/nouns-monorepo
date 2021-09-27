import { Handler } from "@netlify/functions";
import axios from 'axios'
import config from '../../src/config'
import * as R from 'ramda';
import { bigNumbersEqual } from "../utils";

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

const normalizeNouns = R.map(normalizeNoun)

const ownerFilterFactory = (owner: string) => R.filter((noun: any) => bigNumbersEqual(owner, noun.owner))

const handler: Handler = async (event, context) => {
  const graphResponse = await axios.post(config.subgraphApiUri, { query: nounsQuery });
  const nouns = normalizeNouns(graphResponse.data.data.nouns);
  const matchingNouns = ownerFilterFactory(event.body)(nouns);
  return {
    statusCode: 200,
    body: JSON.stringify(matchingNouns.length > 0)
  };
};

export { handler };
