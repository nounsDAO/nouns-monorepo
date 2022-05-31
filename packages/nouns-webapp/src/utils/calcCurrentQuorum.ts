import { DynamicQuorumParams } from '../wrappers/nounsDao';

export const calcCurrentQuorum = (
  againstVotesBps: number,
  dynamicQuorumParams?: DynamicQuorumParams,
) => {
  if (!dynamicQuorumParams) {
    return 0;
  }

  const adjustedAgainstVotesBps =
    againstVotesBps > dynamicQuorumParams.quorumVotesBPSOffset
      ? againstVotesBps - dynamicQuorumParams.quorumVotesBPSOffset
      : 0;
  const quorumAdjustementBps =
    dynamicQuorumParams.quorumQuadraticCoefficient * Math.pow(adjustedAgainstVotesBps, 2) +
    dynamicQuorumParams.quorumLinearCoefficient * adjustedAgainstVotesBps;
  return Math.min(
    dynamicQuorumParams.minQuorumVotesBPS + quorumAdjustementBps,
    dynamicQuorumParams.maxQuorumVotesBPS,
  );
};
