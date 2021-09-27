import { Handler } from "@netlify/functions";
import axios from 'axios'
import config from '../../src/config'
import * as R from 'ramda';
import { BigNumber } from "@ethersproject/bignumber"

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

const ownerFilterFactory = (owner: string) => (noun: any) => BigNumber.from(owner).eq(BigNumber.from(noun.owner))

const handler: Handler = async (event, context) => {
  const graphResponse = await axios.post(config.subgraphApiUri, { query: nounsQuery });
  const nouns = R.map(normalizeNoun, graphResponse.data.data.nouns);
  const matchingNouns = R.filter(ownerFilterFactory(event.body), nouns);
  return {
    statusCode: 200,
    body: JSON.stringify(matchingNouns.length > 0)
  };
};

export { handler };
