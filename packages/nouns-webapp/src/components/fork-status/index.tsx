import React from 'react';

import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';

import { ForkState } from '@/wrappers/nounsDao';

import classes from './ForkStatus.module.css';

const statusVariant = (status: ForkState | undefined) => {
  switch (status) {
    case ForkState.ESCROW:
      return classes.escrow;
    case ForkState.ACTIVE:
      return classes.primary;
    case ForkState.EXECUTED:
      return classes.success;
    default:
      return classes.secondary;
  }
};

const statusText = (status: ForkState | undefined) => {
  switch (status) {
    case ForkState.ESCROW:
      return <Trans>In Escrow</Trans>;
    case ForkState.ACTIVE:
      return <Trans>Forking</Trans>;
    case ForkState.EXECUTED:
      return <Trans>Executed</Trans>;
    default:
      return <Trans>Undetermined</Trans>;
  }
};

interface ForkStateProps {
  status?: ForkState;
  className?: string;
}

const ForkStatus: React.FC<ForkStateProps> = props => {
  const { status, className } = props;
  return (
    <div className={clsx(statusVariant(status), classes.proposalStatus, className)}>
      {statusText(status)}
    </div>
  );
};

export default ForkStatus;
