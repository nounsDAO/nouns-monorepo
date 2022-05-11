import { BigInt } from '@graphprotocol/graph-ts';
import { BIGINT_10K } from './constants';

export function dynamicQuorumVotes(
  againstVotes: i32,
  totalSupply: BigInt,
  minQuorumVotesBPS: i32,
  maxQuorumVotesBPS: i32,
  quorumVotesBPSOffset: i32,
  quorumLinearCoefficient: BigInt,
  quorumQuadraticCoefficient: BigInt,
): BigInt {
  const againstVotesBPS = (againstVotes * 10000) / totalSupply.toI32();
  if (againstVotesBPS <= quorumVotesBPSOffset) {
    return totalSupply.times(BigInt.fromI32(minQuorumVotesBPS)).div(BIGINT_10K);
  }

  const polynomInput = againstVotesBPS - quorumVotesBPSOffset;
  const polynomValueBPS = quorumLinearCoefficient
    .times(BigInt.fromI32(polynomInput))
    .plus(quorumQuadraticCoefficient.times(BigInt.fromI32(polynomInput ** 2)))
    .div(BigInt.fromI32(<i32>1e6));
  const adjustedQuorumBPS = polynomValueBPS.plus(BigInt.fromI32(minQuorumVotesBPS));
  const quorumBPS = <i32>Math.min(maxQuorumVotesBPS, adjustedQuorumBPS.toI32());

  return totalSupply.times(BigInt.fromI32(quorumBPS)).div(BigInt.fromI32(10000));
}
