import {
  readNounsGovernorAdjustedTotalSupply,
  readNounsGovernorGetDynamicQuorumParamsAt,
  readNounsGovernorMaxQuorumVotes,
  readNounsGovernorMinQuorumVotes,
  readNounsGovernorProposalThreshold,
  readNounsGovernorProposalUpdatablePeriodInBlocks,
  readNounsGovernorVotingDelay,
  readNounsGovernorVotingPeriod,
} from '@nouns/sdk/governor';
import { readNounsTreasuryDelay, readNounsTreasuryGracePeriod } from '@nouns/sdk/treasury';
import { getBlockNumber } from '@wagmi/core';

import config, { wagmiConfig } from '@/config';

export const minQuorumVotes = async () => {
  return readNounsGovernorMinQuorumVotes(wagmiConfig, {});
};

export const maxQuorumVotes = async () => {
  return readNounsGovernorMaxQuorumVotes(wagmiConfig, {});
};

export const dynamicQuorumParams = async () => {
  const currentBlockNumber = await getBlockNumber(wagmiConfig);

  return readNounsGovernorGetDynamicQuorumParamsAt(wagmiConfig, {
    args: [currentBlockNumber],
  });
};

export const adjustedTotalSupply = async () =>
  await readNounsGovernorAdjustedTotalSupply(wagmiConfig, {});

export const maxQuorumAgainstVotes = async () => {
  const { maxQuorumVotesBPS, minQuorumVotesBPS, quorumCoefficient } = await dynamicQuorumParams();

  return Math.ceil(
    (100 * Number(await adjustedTotalSupply()) * (maxQuorumVotesBPS - minQuorumVotesBPS)) /
      quorumCoefficient,
  );
};

export const quorumIncreasePerAgainstVote = async () => {
  return (
    Number((await maxQuorumVotes()) - (await minQuorumVotes())) / (await maxQuorumAgainstVotes())
  ).toFixed(2);
};

const secondsInADay = 86400;

export const updatablePeriodDurationDays = async () => {
  const updatablePeriodInBlocks = await readNounsGovernorProposalUpdatablePeriodInBlocks(
    wagmiConfig,
    {},
  );
  return (Number(updatablePeriodInBlocks) * config.mainnetBlockDurationSeconds) / secondsInADay;
};

export const pendingPeriodDurationDays = async () => {
  const pendingPeriodInBlocks = await readNounsGovernorVotingDelay(wagmiConfig, {});

  return (Number(pendingPeriodInBlocks) * config.mainnetBlockDurationSeconds) / secondsInADay;
};

export const activePeriodDurationDays = async () => {
  const activePeriodInBlocks = await readNounsGovernorVotingPeriod(wagmiConfig, {});

  return (Number(activePeriodInBlocks) * config.mainnetBlockDurationSeconds) / secondsInADay;
};

export const queuedPeriodDurationDays = async () => {
  const queuedPeriodInSeconds = await readNounsTreasuryDelay(wagmiConfig, {});
  return Number(queuedPeriodInSeconds) / secondsInADay;
};

export const gracePeriodDurationDays = async () => {
  const gracePeriodInSeconds = await readNounsTreasuryGracePeriod(wagmiConfig, {});
  return Number(gracePeriodInSeconds) / secondsInADay;
};

export const minProposalDurationDays = async () => {
  return (
    (await updatablePeriodDurationDays()) +
    (await pendingPeriodDurationDays()) +
    (await activePeriodDurationDays()) +
    (await queuedPeriodDurationDays())
  );
};

export const nounsRequiredToPropose = async () => {
  return (await readNounsGovernorProposalThreshold(wagmiConfig, {})) + 1n;
};
