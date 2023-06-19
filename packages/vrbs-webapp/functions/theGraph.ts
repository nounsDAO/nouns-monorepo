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

export interface NormalizedVrb {
  id: number;
  owner: string;
  delegatedTo: null | string;
  votes: NormalizedVote[];
  seed: Seed;
}

const vrbsGql = `
{
  vrbs {
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

export const normalizeVrb = (vrb: any): NormalizedVrb => ({
  id: Number(vrb.id),
  owner: vrb.owner.id,
  delegatedTo: vrb.owner.delegate?.id,
  votes: normalizeVotes(vrb.votes),
  seed: normalizeSeed(vrb.seed),
});

export const normalizeVrbs = R.map(normalizeVrb);

export const normalizeVotes = R.map(normalizeVote);

export const ownerFilterFactory = (address: string) =>
  R.filter((vrb: any) => bigNumbersEqual(address, vrb.owner));

export const isVrbOwner = (address: string, vrbs: NormalizedVrb[]) =>
  ownerFilterFactory(address)(vrbs).length > 0;

export const delegateFilterFactory = (address: string) =>
  R.filter((vrb: any) => vrb.delegatedTo && bigNumbersEqual(address, vrb.delegatedTo));

export const isVrbDelegate = (address: string, vrbs: NormalizedVrb[]) =>
  delegateFilterFactory(address)(vrbs).length > 0;

export const vrbsQuery = async () =>
  normalizeVrbs(
    (await axios.post(config.app.subgraphApiUri, { query: vrbsGql })).data.data.vrbs,
  );
