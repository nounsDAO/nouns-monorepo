import { BigNumber } from 'ethers';
import React from 'react';
import { StandaloneNounBRCircular } from '../StandaloneNounBR';
import classes from './HorizontalStackedNounsBR.module.css';

interface HorizontalStackedNounsBRProps {
  nounbrIds: string[];
}

const HorizontalStackedNounsBR: React.FC<HorizontalStackedNounsBRProps> = props => {
  const { nounbrIds } = props;
  return (
    <div className={classes.wrapper}>
      {nounbrIds
        .slice(0, 6)
        .map((nounbrId: string, i: number) => {
          return (
            <div
              key={nounbrId.toString()}
              style={{
                top: '0px',
                left: `${25 * i}px`,
              }}
              className={classes.nounbrWrapper}
            >
              <StandaloneNounBRCircular nounbrId={BigNumber.from(nounbrId)} border={true} />
            </div>
          );
        })
        .reverse()}
    </div>
  );
};

export default HorizontalStackedNounsBR;
