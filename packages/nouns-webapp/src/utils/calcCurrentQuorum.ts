import { DynamicQuorumParams } from '../wrappers/nounsDao';

export const calcCurrentQuorum = (
  againstVotesBps: number,
  dynamicQuorumParams?: DynamicQuorumParams,
) => {
  if (!dynamicQuorumParams) {
    return 0;
  }

  const quorumAdjustementBps =
    dynamicQuorumParams.quorumCoefficient * againstVotesBps;
  return Math.min(
    dynamicQuorumParams.minQuorumVotesBPS + quorumAdjustementBps,
    dynamicQuorumParams.maxQuorumVotesBPS,
  );
};
