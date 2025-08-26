/* eslint-disable react/prop-types */
import { cn } from '@/lib/utils';

import { VoteCardVariant } from '../vote-card';

const VoteProgressBar: React.FC<{
  variant: VoteCardVariant;
  percentage: number;
}> = props => {
  const { variant, percentage } = props;

  let progressBarClass;
  let wrapperClass;
  switch (variant) {
    case VoteCardVariant.FOR:
      progressBarClass = 'bg-brand-color-green';
      wrapperClass = 'bg-brand-color-green-translucent';
      break;
    case VoteCardVariant.AGAINST:
      progressBarClass = 'bg-brand-color-red';
      wrapperClass = 'bg-brand-color-red-translucent';
      break;
    default:
      progressBarClass = 'bg-brand-gray-light-text';
      wrapperClass = 'bg-brand-gray-light-text-translucent';
      break;
  }

  return (
    <div className={cn('h-4 rounded-md', wrapperClass)}>
      <div
        style={{
          width: `${percentage}%`,
        }}
        className={cn('h-full rounded-md', progressBarClass)}
      ></div>
    </div>
  );
};

export default VoteProgressBar;
