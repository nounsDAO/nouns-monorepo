import classes from './ForkStatus.module.css';
import { ForkState } from '../../wrappers/nounsDao';
import React from 'react';
import clsx from 'clsx';
import { Trans } from '@lingui/macro';

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
