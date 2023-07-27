import { Proposal, ProposalState } from '../wrappers/nounsDao';

export const isProposalUpdatable = (
  proposalState: ProposalState,
  proposalUpdatePeriodEndBlock: number,
  currentBlock: number,
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
  if (availableVotes && proposalThreshold !== undefined && availableVotes > proposalThreshold) {
    return true;
  } else {
    return false;
  }
};

export const checkIsEligibleToPropose = (
  latestProposal: Proposal | undefined,
  account: string | null | undefined,
) => {
  if (
    latestProposal &&
    account &&
    (latestProposal?.status === ProposalState.ACTIVE ||
      latestProposal?.status === ProposalState.PENDING ||
      latestProposal?.status === ProposalState.UPDATABLE) &&
    latestProposal.proposer?.toLowerCase() === account?.toLowerCase()
  ) {
    return true;
  }
  return false;
};

export const checkHasActiveOrPendingProposalOrCandidate = (
  latestProposalStatus: ProposalState,
  latestProposalProposer: string | undefined,
  account: string | null | undefined,
) => {
  if (
    account &&
    latestProposalProposer &&
    (latestProposalStatus === ProposalState.ACTIVE ||
      latestProposalStatus === ProposalState.PENDING ||
      latestProposalStatus === ProposalState.UPDATABLE) &&
    latestProposalProposer.toLowerCase() === account?.toLowerCase()
  ) {
    return true;
  }
  return false;
};
