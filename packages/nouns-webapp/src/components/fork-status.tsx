import React from 'react';

import { Trans } from '@lingui/react/macro';

import { cn } from '@/lib/utils';
import { ForkState } from '@/wrappers/nouns-dao';

const statusVariant = (status: ForkState | undefined) => {
  switch (status) {
    case ForkState.ESCROW:
      return 'border-2 border-brand-warning-border bg-white text-brand-warning-text';
    case ForkState.ACTIVE:
      return 'bg-brand-color-green';
    case ForkState.EXECUTED:
      return 'bg-brand-color-blue';
    default:
      return 'bg-brand-gray-light-text';
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

export default ForkStatus;
