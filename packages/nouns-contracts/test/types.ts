import { BigNumberish } from 'ethers';

export interface LongestPart {
  length: number;
  index: number;
}

export type DynamicQuorumParams = {
  minQuorumVotesBPS: BigNumberish;
  maxQuorumVotesBPS: BigNumberish;
  quorumVotesBPSOffset: BigNumberish;
  quorumPolynomCoefs: [BigNumberish, BigNumberish];
};
