import classes from './ProposalStatus.module.css';
import { ProposalState } from '../../wrappers/nounsDao';
import React from 'react';
import clsx from 'clsx';
import { Trans } from '@lingui/macro';

const statusVariant = (status: ProposalState | undefined) => {
  switch (status) {
    case ProposalState.PENDING:
    case ProposalState.ACTIVE:
      return classes.primary;
    case ProposalState.SUCCEEDED:
    case ProposalState.EXECUTED:
      return classes.success;
    case ProposalState.DEFEATED:
    case ProposalState.VETOED:
      return classes.danger;
    case ProposalState.QUEUED:
    case ProposalState.CANCELLED:
    case ProposalState.EXPIRED:
    default:
      return classes.secondary;
  }
};

const statusText = (status: ProposalState | undefined) => {
  switch (status) {
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

interface ProposalStateProps {
  status?: ProposalState;
  className?: string;
}

const ProposalStatus: React.FC<ProposalStateProps> = props => {
  const { status, className } = props;
  return (
    <div className={clsx(statusVariant(status), classes.proposalStatus, className)}>
      {statusText(status)}
    </div>
  );
};

export default ProposalStatus;
