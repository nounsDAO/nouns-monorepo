import { BigNumber } from 'ethers';
import React from 'react';
import { StandaloneN00unCircular } from '../StandaloneN00un';
import classes from './HorizontalStackedN00uns.module.css';

interface HorizontalStackedN00unsProps {
  n00unIds: string[];
}

const HorizontalStackedN00uns: React.FC<HorizontalStackedN00unsProps> = props => {
  const { n00unIds } = props;
  return (
    <div className={classes.wrapper}>
      {n00unIds
        .slice(0, 6)
        .map((n00unId: string, i: number) => {
          return (
            <div
              key={n00unId.toString()}
              style={{
                top: '0px',
                left: `${25 * i}px`,
              }}
              className={classes.n00unWrapper}
            >
              <StandaloneN00unCircular n00unId={BigNumber.from(n00unId)} border={true} />
            </div>
          );
        })
        .reverse()}
    </div>
  );
};

export default HorizontalStackedN00uns;
