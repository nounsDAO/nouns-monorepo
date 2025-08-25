/* eslint-disable react/prop-types */
import { cn } from '@/lib/utils';

import { VoteCardVariant } from '../vote-card';

import classes from './vote-progress-bar.module.css';

const VoteProgressBar: React.FC<{
  variant: VoteCardVariant;
  percentage: number;
}> = props => {
  const { variant, percentage } = props;

  let progressBarClass;
  let wrapperClass;
  switch (variant) {
    case VoteCardVariant.FOR:
      progressBarClass = classes.forProgressBar;
      wrapperClass = classes.forWrapper;
      break;
    case VoteCardVariant.AGAINST:
      progressBarClass = classes.againstProgressBar;
      wrapperClass = classes.againstWrapper;
      break;
    default:
      progressBarClass = classes.abstainProgressBar;
      wrapperClass = classes.abstainWrapper;
      break;
  }

  return (
    <div className={cn(classes.wrapper, wrapperClass)}>
      <div
        style={{
          width: `${percentage}%`,
        }}
        className={cn(classes.progressBar, progressBarClass)}
      ></div>
    </div>
  );
};

export default VoteProgressBar;
