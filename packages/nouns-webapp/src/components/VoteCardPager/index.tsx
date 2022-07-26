import classes from './VoteCardPager.module.css';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import React from 'react';

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
  return (
    <>
      {/* Dots */}
      <div className={classes.pageDots}>
        {Array.from(Array(numPages).keys()).map((n: number) => {
          return <span className={n === currentPage ? '' : classes.disabledPageDot}>•</span>;
        })}
      </div>
      {/* Arrows */}
      <div className={classes.paginationArrowsWrapper}>
        <button
          className={classes.paginationArrowBtnWrapper}
          disabled={isLeftArrowDisabled}
          onClick={onLeftArrowClick}
        >
          <ChevronLeftIcon className={classes.paginationArrow} />
        </button>

        <button
          disabled={isRightArrowDisabled}
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
