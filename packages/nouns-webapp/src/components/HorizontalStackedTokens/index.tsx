import { BigNumber } from 'ethers';
import React from 'react';
import { StandaloneTokenCircular } from '../StandaloneToken';
import classes from './HorizontalStackedTokens.module.css';

interface HorizontalStackedTokensProps {
  tokenIds: string[];
}

const HorizontalStackedTokens: React.FC<HorizontalStackedTokensProps> = props => {
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
              className={classes.tokenWrapper}
            >
              <StandaloneTokenCircular tokenId={BigNumber.from(tokenId)} border={true} />
            </div>
          );
        })
        .reverse()}
    </div>
  );
};

export default HorizontalStackedTokens;
