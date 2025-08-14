import React from 'react';

import LegacyNoun from '@/components/legacy-noun';
import { getGrayBackgroundSVG } from '@/utils/grayBackgroundSVG';

import classes from './gray-circle.module.css';

import nounClasses from '@/components/legacy-noun/noun.module.css';

interface GrayCircleProps {
  isDelegateView?: boolean;
}

export const GrayCircle: React.FC<GrayCircleProps> = ({ isDelegateView }) => {
  return (
    <div className={isDelegateView ? classes.wrapper : ''}>
      <LegacyNoun
        imgPath={getGrayBackgroundSVG()}
        alt={''}
        wrapperClassName={
          isDelegateView
            ? nounClasses.delegateViewCircularNounWrapper
            : nounClasses.circularNounWrapper
        }
        className={isDelegateView ? nounClasses.delegateViewCircular : nounClasses.circular}
      />
    </div>
  );
};
