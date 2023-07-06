import { Proposal, ProposalState } from '../wrappers/nounsDao';

export const isProposalUpdatable = (proposal: Proposal, currentBlock: number) => {
  if (proposal.signers.length > 0) {
    return false;
  }
  return (
    (proposal?.status === ProposalState.UPDATABLE || proposal?.status === ProposalState.PENDING) && currentBlock <= proposal.updatePeriodEndBlock
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
  if (account && latestProposalProposer &&
    (latestProposalStatus === ProposalState.ACTIVE ||
      latestProposalStatus === ProposalState.PENDING ||
      latestProposalStatus === ProposalState.UPDATABLE) &&
    latestProposalProposer.toLowerCase() === account?.toLowerCase()
  ) {
    return true;
  }
  return false;
};