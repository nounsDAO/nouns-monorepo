import { BigInt } from '@graphprotocol/graph-ts';
import { BIGINT_10K } from './constants';

export function dynamicQuorumVotes(
  againstVotes: BigInt,
  totalSupply: BigInt,
  minQuorumVotesBPS: i32,
  maxQuorumVotesBPS: i32,
  quorumCoefficient: BigInt,
): BigInt {
  const againstVotesBPS = againstVotes.times(BIGINT_10K).div(totalSupply);
  const quorumAdjustmentBPS = quorumCoefficient
    .times(againstVotesBPS)
    .div(BigInt.fromI32(<i32>1e6));
  const adjustedQuorumBPS = quorumAdjustmentBPS.plus(BigInt.fromI32(minQuorumVotesBPS));
  const quorumBPS = <i32>Math.min(maxQuorumVotesBPS, adjustedQuorumBPS.toI32());

  return totalSupply.times(BigInt.fromI32(quorumBPS)).div(BigInt.fromI32(10000));
}
