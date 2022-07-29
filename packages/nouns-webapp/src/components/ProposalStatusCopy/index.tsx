import { Trans } from '@lingui/macro';
import React from 'react';
import { Proposal, ProposalState } from '../../wrappers/nounsDao';

interface ProposalStatusCopyProps {
  proposal: Proposal;
}

const ProposalStatusCopy: React.FC<ProposalStatusCopyProps> = props => {
  const { proposal } = props;
  switch (proposal.status) {
    case ProposalState.PENDING:
      return <Trans>Pending</Trans>;
    case ProposalState.ACTIVE:
      return <Trans>Active</Trans>;
    case ProposalState.SUCCEEDED:
      return <Trans>Succeeded</Trans>;
    case ProposalState.EXECUTED:
      return <Trans>Executed</Trans>;
    case ProposalState.DEFEATED:
      return <Trans>Defeated</Trans>;
    case ProposalState.QUEUED:
      return <Trans>Queued</Trans>;
    case ProposalState.CANCELLED:
      return <Trans>Canceled</Trans>;
    case ProposalState.VETOED:
      return <Trans>Vetoed</Trans>;
    case ProposalState.EXPIRED:
      return <Trans>Expired</Trans>;
    default:
      return <Trans>Undetermined</Trans>;
  }
};

export default ProposalStatusCopy;
