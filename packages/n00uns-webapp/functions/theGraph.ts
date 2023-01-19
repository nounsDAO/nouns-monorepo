import axios from 'axios';
import * as R from 'ramda';
import config from '../src/config';
import { bigNumbersEqual } from './utils';

export interface NormalizedVote {
  proposalId: number;
  supportDetailed: number;
}

export interface Seed {
  background: number;
  body: number;
  accessory: number;
  head: number;
  glasses: number;
}

export interface NormalizedN00un {
  id: number;
  owner: string;
  delegatedTo: null | string;
  votes: NormalizedVote[];
  seed: Seed;
}

const n00unsGql = `
{
  n00uns {
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
    seed {
      background
      body
      accessory
      head
      glasses
    }
  }
}
`;

export const normalizeVote = (vote: any): NormalizedVote => ({
  proposalId: Number(vote.proposal.id),
  supportDetailed: Number(vote.supportDetailed),
});

export const normalizeSeed = (seed: any): Seed => ({
  background: Number(seed.background),
  body: Number(seed.body),
  glasses: Number(seed.glasses),
  accessory: Number(seed.accessory),
  head: Number(seed.head),
});

export const normalizeN00un = (n00un: any): NormalizedN00un => ({
  id: Number(n00un.id),
  owner: n00un.owner.id,
  delegatedTo: n00un.owner.delegate?.id,
  votes: normalizeVotes(n00un.votes),
  seed: normalizeSeed(n00un.seed),
});

export const normalizeN00uns = R.map(normalizeN00un);

export const normalizeVotes = R.map(normalizeVote);

export const ownerFilterFactory = (address: string) =>
  R.filter((n00un: any) => bigNumbersEqual(address, n00un.owner));

export const isN00unOwner = (address: string, n00uns: NormalizedN00un[]) =>
  ownerFilterFactory(address)(n00uns).length > 0;

export const delegateFilterFactory = (address: string) =>
  R.filter((n00un: any) => n00un.delegatedTo && bigNumbersEqual(address, n00un.delegatedTo));

export const isN00unDelegate = (address: string, n00uns: NormalizedN00un[]) =>
  delegateFilterFactory(address)(n00uns).length > 0;

export const n00unsQuery = async () =>
  normalizeN00uns(
    (await axios.post(config.app.subgraphApiUri, { query: n00unsGql })).data.data.n00uns,
  );
