import React from 'react';

import { Trans } from '@lingui/react/macro';

import { cn } from '@/lib/utils';
import { ProposalState } from '@/wrappers/nouns-dao';

const statusVariant = (status: ProposalState | undefined) => {
  switch (status) {
    case ProposalState.PENDING:
    case ProposalState.ACTIVE:
      return 'bg-brand-color-green';
    case ProposalState.OBJECTION_PERIOD:
      return 'border-2 border-brand-color-red bg-white text-brand-color-red';
    case ProposalState.SUCCEEDED:
    case ProposalState.EXECUTED:
      return 'bg-brand-color-blue';
    case ProposalState.DEFEATED:
    case ProposalState.VETOED:
      return 'bg-brand-color-red';
    case ProposalState.UPDATABLE:
      return 'border-2 border-brand-warning-border bg-white text-brand-warning-text';
    case ProposalState.QUEUED:
    case ProposalState.CANCELLED:
    case ProposalState.EXPIRED:
    default:
      return 'bg-brand-gray-light-text';
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
    case ProposalState.OBJECTION_PERIOD:
      return <Trans>Objection period</Trans>;
    case ProposalState.UPDATABLE:
      return <Trans>Updatable</Trans>;
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
    <div
      className={cn(
        'font-pt rounded-lg border-2 border-transparent px-2.5 py-1.5 text-sm font-bold text-white',
        statusVariant(status),
        className,
      )}
    >
      {statusText(status)}
    </div>
  );
};

export default ProposalStatus;
