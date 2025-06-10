import React from 'react';

import LegacyNoun from '@/components/LegacyNoun';
import { getGrayBackgroundSVG } from '@/utils/grayBackgroundSVG';

import classes from './GrayCircle.module.css';

import nounClasses from '@/components/LegacyNoun/Noun.module.css';

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
