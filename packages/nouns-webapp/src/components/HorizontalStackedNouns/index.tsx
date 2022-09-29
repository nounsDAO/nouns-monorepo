import { BigNumber } from 'ethers';
import React from 'react';
import { StandaloneTokenCircular } from '../StandaloneNoun';
import classes from './HorizontalStackedNouns.module.css';

interface HorizontalStackedTokensProps {
  tokenIds: string[];
}

const HorizontalStackedNouns: React.FC<HorizontalStackedTokensProps> = props => {
  const { tokenIds } = props;
  return (
    <div className={classes.wrapper}>
      {tokenIds
        .slice(0, 6)
        .map((tokenId: string, i: number) => {
          return (
            <div
              key={tokenId.toString()}
              style={{
                top: '0px',
                left: `${25 * i}px`,
              }}
              className={classes.nounWrapper}
            >
              <StandaloneTokenCircular tokenId={BigNumber.from(tokenId)} border={true} />
            </div>
          );
        })
        .reverse()}
    </div>
  );
};

export default HorizontalStackedNouns;
