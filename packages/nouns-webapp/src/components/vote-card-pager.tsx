import React from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';

import { cn } from '@/lib/utils';

interface VoteCardPagerProps {
  onRightArrowClick: () => void;
  onLeftArrowClick: () => void;
  isRightArrowDisabled: boolean;
  isLeftArrowDisabled: boolean;
  numPages: number;
  currentPage: number;
}

const VoteCardPager: React.FC<VoteCardPagerProps> = props => {
  const {
    onRightArrowClick,
    onLeftArrowClick,
    isRightArrowDisabled,
    isLeftArrowDisabled,
    numPages,
    currentPage,
  } = props;

  const isOnePage = numPages === 1;

  return (
    <>
      {/* Dots */}
      <div
        className={cn(
          'text-brand-gray-light-text text-center text-[24px] font-bold',
          isOnePage ? 'opacity-25' : '',
        )}
      >
        {Array.from(Array(numPages).keys()).map((n: number) => {
          return (
            <span className={n === currentPage ? '' : 'opacity-50'} key={n}>
              •
            </span>
          );
        })}
      </div>
      {/* Arrows */}
      <div className={cn('flex justify-center', isOnePage ? 'opacity-25' : '')}>
        <button
          className="border-0 bg-transparent disabled:opacity-50"
          disabled={isLeftArrowDisabled || isOnePage}
          onClick={onLeftArrowClick}
        >
          <ChevronLeftIcon className="text-brand-gray-light-text size-7" />
        </button>

        <button
          disabled={isRightArrowDisabled || isOnePage}
          onClick={onRightArrowClick}
          className="border-0 bg-transparent disabled:opacity-50"
        >
          <ChevronRightIcon className="text-brand-gray-light-text size-7" />
        </button>
      </div>
    </>
  );
};

export default VoteCardPager;
