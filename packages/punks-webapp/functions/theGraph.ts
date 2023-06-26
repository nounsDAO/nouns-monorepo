import axios from 'axios';
import * as R from 'ramda';
import config from '../src/config';
import { bigNumbersEqual } from './utils';

export interface NormalizedVote {
  proposalId: number;
  supportDetailed: number;
}

export interface Accessory {
  accType: number;
  accId: number;
}

export interface Seed {
  punkType: number;
  skinTone: number;
  accessories: Accessory[];
}

export interface NormalizedPunk {
  id: number;
  owner: string;
  delegatedTo: null | string;
  votes: NormalizedVote[];
  seed: Seed;
}

const punksGql = `
{
  punks {
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
      punkType
      skinTone
      accessory_types
      accessory_ids
    }
  }
}
`;

export const normalizeVote = (vote: any): NormalizedVote => ({
  proposalId: Number(vote.proposal.id),
  supportDetailed: Number(vote.supportDetailed),
});

export const normalizeSeed = (seed: any): Seed => ({
  punkType: Number(seed.punkType),
  skinTone: Number(seed.skinTone),
  accessories: seed.accessory_types.map((accType: any, index: number) => (
    { accType: Number(accType), accId: Number(seed.accessory_ids[index]) } as Accessory
  )), /* DEBUG */
});

export const normalizePunk = (punk: any): NormalizedPunk => ({
  id: Number(punk.id),
  owner: punk.owner.id,
  delegatedTo: punk.owner.delegate?.id,
  votes: normalizeVotes(punk.votes),
  seed: normalizeSeed(punk.seed),
});

export const normalizePunks = R.map(normalizePunk);

export const normalizeVotes = R.map(normalizeVote);

export const ownerFilterFactory = (address: string) =>
  R.filter((punk: any) => bigNumbersEqual(address, punk.owner));

export const isPunkOwner = (address: string, punks: NormalizedPunk[]) =>
  ownerFilterFactory(address)(punks).length > 0;

export const delegateFilterFactory = (address: string) =>
  R.filter((punk: any) => punk.delegatedTo && bigNumbersEqual(address, punk.delegatedTo));

export const isPunkDelegate = (address: string, punks: NormalizedPunk[]) =>
  delegateFilterFactory(address)(punks).length > 0;

export const punksQuery = async () =>
  normalizePunks(
    (await axios.post(config.app.subgraphApiUri, { query: punksGql })).data.data.punks,
  );
