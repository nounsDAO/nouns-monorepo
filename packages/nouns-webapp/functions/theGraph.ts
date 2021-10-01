import axios from 'axios';
import * as R from 'ramda';
import config from '../src/config';
import { bigNumbersEqual } from './utils';

export interface NormalizedVote {
  proposalId: number;
  supportDetailed: number;
}

export interface NormalizedNoun {
  id: number;
  owner: string;
  delegatedTo: null | string;
  votes: NormalizedVote[];
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
    votes {
      proposal {
        id
      }
      supportDetailed
    }
  }
}
`;

export const normalizeVote = (vote: any): NormalizedVote => ({
  proposalId: Number(vote.proposal.id),
  supportDetailed: Number(vote.supportDetailed),
});

export const normalizeNoun = (noun: any): NormalizedNoun => ({
  id: Number(noun.id),
  owner: noun.owner.id,
  delegatedTo: noun.owner.delegate?.id,
  votes: normalizeVotes(noun.votes),
});

export const normalizeNouns = R.map(normalizeNoun);

export const normalizeVotes = R.map(normalizeVote);

export const ownerFilterFactory = (address: string) =>
  R.filter((noun: any) => bigNumbersEqual(address, noun.owner));

export const isNounOwner = (address: string, nouns: NormalizedNoun[]) =>
  ownerFilterFactory(address)(nouns).length > 0;

export const delegateFilterFactory = (address: string) =>
  R.filter((noun: any) => noun.delegatedTo && bigNumbersEqual(address, noun.delegatedTo));

export const isNounDelegate = (address: string, nouns: NormalizedNoun[]) =>
  delegateFilterFactory(address)(nouns).length > 0;

export const nounsQuery = async () =>
  normalizeNouns((await axios.post(config.subgraphApiUri, { query: nounsGql })).data.data.nouns);
