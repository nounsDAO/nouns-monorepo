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
  const hasAvailable = availableVotes !== undefined;
  const hasThreshold = proposalThreshold !== undefined;
  return hasAvailable && hasThreshold && availableVotes! > proposalThreshold!;
};

export const checkIsEligibleToPropose = (
  latestProposal: Proposal | undefined,
  account: string | null | undefined,
) => {
  const hasProposal = latestProposal !== undefined;
  const hasAccount = account !== null && account !== undefined && account !== '';
  return (
    hasProposal &&
    hasAccount &&
    (latestProposal?.status === ProposalState.ACTIVE ||
      latestProposal?.status === ProposalState.PENDING ||
      latestProposal?.status === ProposalState.UPDATABLE) &&
    latestProposal.proposer?.toLowerCase() === account!.toLowerCase()
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
