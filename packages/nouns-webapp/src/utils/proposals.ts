import { Proposal, ProposalState } from '../wrappers/nounsDao';

export const isProposalUpdatable = (proposal: Proposal, currentBlock: number) => {
  return (
    proposal?.status === ProposalState.UPDATABLE && currentBlock <= proposal.updatePeriodEndBlock
  );
};
