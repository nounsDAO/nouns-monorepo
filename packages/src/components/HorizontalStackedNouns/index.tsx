import { BigNumber } from 'ethers';
import React from 'react';
import { StandaloneNounCircular } from '../StandaloneNoun';
import classes from './HorizontalStackedNouns.module.css';

interface HorizontalStackedNounsProps {
  nounIds: string[];
}

const HorizontalStackedNouns: React.FC<HorizontalStackedNounsProps> = props => {
  const { nounIds } = props;
  return (
    <div className={classes.wrapper}>
      {nounIds
        .slice(0, 6)
        .map((nounId: string, i: number) => {
          return (
            <div
              key={nounId.toString()}
              style={{
                top: '0px',
                left: `${25 * i}px`,
              }}
              className={classes.nounWrapper}
            >
              <StandaloneNounCircular nounId={BigNumber.from(nounId)} border={true} />
            </div>
          );
        })
        .reverse()}
    </div>
  );
};

export default HorizontalStackedNouns;
