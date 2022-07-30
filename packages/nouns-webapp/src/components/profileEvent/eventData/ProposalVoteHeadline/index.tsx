import { Trans } from '@lingui/macro';
import { Proposal, ProposalState, Vote } from '../../../../wrappers/nounsDao';
import ShortAddress from '../../../ShortAddress';

interface ProposalVoteHeadlineProps {
  proposal: Proposal;
  supportDetailed: Vote | undefined;
  voter: string | undefined;
}

const ProposalVoteHeadline: React.FC<ProposalVoteHeadlineProps> = props => {
  const { proposal, supportDetailed, voter } = props;

  if (supportDetailed === undefined) {
    if (proposal.status === ProposalState.PENDING || proposal.status === ProposalState.ACTIVE) {
      return <Trans>Waiting for</Trans>;
    }
    return <Trans>Absent for</Trans>;
  }

  const voterComponent = (
    <span style={{ fontWeight: 'bold' }}>
      <ShortAddress address={voter ?? ''} />
    </span>
  );

  switch (supportDetailed) {
    case Vote.FOR:
      return <Trans>{voterComponent} voted for</Trans>;
    case Vote.ABSTAIN:
      return <Trans>{voterComponent} abstained on</Trans>;
    default:
      return <Trans>{voterComponent} voted against</Trans>;
  }
};

export default ProposalVoteHeadline;
