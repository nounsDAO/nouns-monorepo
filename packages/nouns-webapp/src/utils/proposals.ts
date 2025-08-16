import { Proposal, ProposalState } from '@/wrappers/nouns-dao';

export const isProposalUpdatable = (
  proposalState: ProposalState,
  proposalUpdatePeriodEndBlock: bigint,
  currentBlock: bigint,
) => {
  return (
    (proposalState === ProposalState.UPDATABLE || proposalState === ProposalState.PENDING) &&
    currentBlock <= proposalUpdatePeriodEndBlock
  );
};

export const checkEnoughVotes = (
  availableVotes: number | undefined,
  proposalThreshold: number | undefined,
) => {
  return !!(
    availableVotes &&
    proposalThreshold !== undefined &&
    availableVotes > proposalThreshold
  );
};

export const checkIsEligibleToPropose = (
  latestProposal: Proposal | undefined,
  account: string | null | undefined,
) => {
  return !!(
    latestProposal &&
    account &&
    (latestProposal?.status === ProposalState.ACTIVE ||
      latestProposal?.status === ProposalState.PENDING ||
      latestProposal?.status === ProposalState.UPDATABLE) &&
    latestProposal.proposer?.toLowerCase() === account?.toLowerCase()
  );
};

export const checkHasActiveOrPendingProposalOrCandidate = (
  latestProposalStatus: ProposalState,
  latestProposalProposer: string | undefined,
  account: string | null | undefined,
) => {
  return !!(
    account &&
    latestProposalProposer &&
    (latestProposalStatus === ProposalState.ACTIVE ||
      latestProposalStatus === ProposalState.PENDING ||
      latestProposalStatus === ProposalState.UPDATABLE) &&
    latestProposalProposer.toLowerCase() === account?.toLowerCase()
  );
};
