import React from 'react';

import LegacyNoun from '@/components/legacy-noun';
import { getGrayBackgroundSVG } from '@/utils/gray-background-svg';

// Replaced CSS module with inline Tailwind classes

import nounClasses from '@/components/legacy-noun/noun.module.css';

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
          isDelegate ? nounClasses.delegateViewCircularNounWrapper : nounClasses.circularNounWrapper
        }
        className={isDelegate ? nounClasses.delegateViewCircular : nounClasses.circular}
      />
    </div>
  );
};
