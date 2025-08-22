import React from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';

import { cn } from '@/lib/utils';

import classes from './vote-card-pager.module.css';

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
      <div className={cn(classes.pageDots, isOnePage ? classes.disabled : '')}>
        {Array.from(Array(numPages).keys()).map((n: number) => {
          return (
            <span className={n === currentPage ? '' : classes.disabledPageDot} key={n}>
              •
            </span>
          );
        })}
      </div>
      {/* Arrows */}
      <div className={cn(classes.paginationArrowsWrapper, isOnePage ? classes.disabled : '')}>
        <button
          className={classes.paginationArrowBtnWrapper}
          disabled={isLeftArrowDisabled || isOnePage}
          onClick={onLeftArrowClick}
        >
          <ChevronLeftIcon className={classes.paginationArrow} />
        </button>

        <button
          disabled={isRightArrowDisabled || isOnePage}
          onClick={onRightArrowClick}
          className={classes.paginationArrowBtnWrapper}
        >
          <ChevronRightIcon className={classes.paginationArrow} />
        </button>
      </div>
    </>
  );
};

export default VoteCardPager;
