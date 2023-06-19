import { BigNumber } from 'ethers';
import React from 'react';
import { StandaloneVrbCircular } from '../StandaloneVrb';
import classes from './HorizontalStackedVrbs.module.css';

interface HorizontalStackedVrbsProps {
  vrbIds: string[];
}

const HorizontalStackedVrbs: React.FC<HorizontalStackedVrbsProps> = props => {
  const { vrbIds } = props;
  return (
    <div className={classes.wrapper}>
      {vrbIds
        .slice(0, 6)
        .map((vrbId: string, i: number) => {
          return (
            <div
              key={vrbId.toString()}
              style={{
                top: '0px',
                left: `${25 * i}px`,
              }}
              className={classes.vrbWrapper}
            >
              <StandaloneVrbCircular vrbId={BigNumber.from(vrbId)} border={true} />
            </div>
          );
        })
        .reverse()}
    </div>
  );
};

export default HorizontalStackedVrbs;
