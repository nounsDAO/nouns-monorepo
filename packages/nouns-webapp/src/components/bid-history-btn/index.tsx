import React from 'react';

import { Trans } from '@lingui/react/macro';

import { useAppSelector } from '@/hooks';
import { cn } from '@/lib/utils';

interface BidHistoryBtnProps {
  onClick: () => void;
}

const BidHistoryBtn: React.FC<BidHistoryBtnProps> = ({ onClick }) => {
  const isCool = useAppSelector(state => state.application.stateBackgroundColor) === '#d5d7e1';

  return (
    <div
      className={cn(
        'flex cursor-pointer justify-center rounded-[10px] transition-all duration-200 ease-in-out',
        isCool
          ? 'text-[var(--brand-cool-light-text)] hover:text-[var(--brand-color-blue)]'
          : 'text-[var(--brand-warm-light-text)] hover:text-[var(--brand-color-red)]',
      )}
      onClick={onClick}
    >
      <div className={cn('font-pt ml-2 pb-4 text-[16px] font-bold text-[var(--brand-color-blue)]')}>
        <Trans>View all bids</Trans>
      </div>
    </div>
  );
};
export default BidHistoryBtn;
