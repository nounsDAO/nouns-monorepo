import React from 'react';

import LegacyNoun from '@/components/legacy-noun';
import { getGrayBackgroundSVG } from '@/utils/gray-background-svg';

interface GrayCircleProps {
  isDelegateView?: boolean;
}

export const GrayCircle: React.FC<GrayCircleProps> = ({ isDelegateView }) => {
  const isDelegate = isDelegateView === true;
  return (
    <div className={isDelegate ? 'size-[55px]' : ''}>
      <LegacyNoun
        imgPath={getGrayBackgroundSVG()}
        alt={''}
        wrapperClassName={
          isDelegate
            ? 'h-[42px] w-[42px] ml-[12px]'
            : 'h-[42px] w-[42px] max-xl:h-[70%] max-xl:w-[70%]'
        }
        className={isDelegate ? 'mt-[13px] rounded-full' : 'rounded-full'}
      />
    </div>
  );
};
