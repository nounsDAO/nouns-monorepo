import { Proposal, ProposalState, Vote } from '../../wrappers/nounsDao';
import _YesVoteIcon from '../../assets/icons/YesVote.svg';
import _NoVoteIcon from '../../assets/icons/NoVote.svg';
import _AbsentVoteIcon from '../../assets/icons/AbsentVote.svg';
import _AbstainVoteIcon from '../../assets/icons/Abstain.svg';
import _PendingVoteIcon from '../../assets/icons/PendingVote.svg';

export const getProposalVoteIcon = (proposal: Proposal, supportDetailed: 0 | 1 | 2 | undefined) => {
  if (supportDetailed === undefined) {
    if (proposal.status === ProposalState.PENDING || proposal.status === ProposalState.ACTIVE) {
      return _PendingVoteIcon;
    }
    return _AbsentVoteIcon;
  }

  switch (supportDetailed) {
    case Vote.FOR:
      return _YesVoteIcon;
    case Vote.ABSTAIN:
      return _AbstainVoteIcon;
    default:
      return _NoVoteIcon;
  }
};
