import { Trans } from '@lingui/macro';
import { Proposal, ProposalState, Vote } from '../../../../wrappers/nounsDao';

interface ProposalVoteHeadlineProps {
  proposal: Proposal;
  supportDetailed: Vote | undefined;
}

const ProposalVoteHeadline: React.FC<ProposalVoteHeadlineProps> = props => {
  const { proposal, supportDetailed } = props;

  if (supportDetailed === undefined) {
    if (proposal.status === ProposalState.PENDING || proposal.status === ProposalState.ACTIVE) {
      return <Trans>Waiting for</Trans>;
    }
    return <Trans>Absent for</Trans>;
  }

  switch (supportDetailed) {
    case Vote.FOR:
      return <Trans>Voted for</Trans>;
    case Vote.ABSTAIN:
      return <Trans>Abstained on</Trans>;
    default:
      return <Trans>Voted against</Trans>;
  }
};

export default ProposalVoteHeadline;
