import axios from 'axios';
import * as R from 'ramda';
import config from '../src/config';
import { bigNumbersEqual } from './utils';

export interface NormalizedNoun {
	id: number;
	owner: string;
	delegatedTo: null | string;
}

const nounsGql = `
{
  nouns {
    id
    owner {
      id
	  delegate {
		id
	  }
    }
  }
}
`

export const normalizeNoun = (noun: any) => ({
  id: Number(noun.id),
  owner: noun.owner.id,
  delegatedTo: noun.owner.delegate.id,
})

export const normalizeNouns = R.map(normalizeNoun)

export const ownerFilterFactory = (address: string) => R.filter((noun: any) => bigNumbersEqual(address, noun.owner))

export const isNounOwner = (address: string, nouns: NormalizedNoun[]) => ownerFilterFactory(address)(nouns).length > 0

export const delegateFilterFactory = (address: string) => R.filter((noun: any) => bigNumbersEqual(address, noun.delegatedTo))

export const isNounDelegate = (address: string, nouns: NormalizedNoun[]) => delegateFilterFactory(address)(nouns).length > 0

export const nounsQuery = () => axios.post(config.subgraphApiUri, { query: nounsGql });
