import React from 'react';
import TightStackedCircleToken from '../TightStackedCircleToken';

interface StackedCircleTokensProps {
  tokenIds: Array<number>;
}

const MAX_TOKENS_PER_STACK = 3;

const TightStackedCircleTokens: React.FC<StackedCircleTokensProps> = props => {
  const { tokenIds } = props;

  const shift = 3;

  const square = 55;

  return (
    <svg width={square} height={square}>
      {tokenIds
        .slice(0, MAX_TOKENS_PER_STACK)
        .map((tokenId: number, i: number) => {
          return <TightStackedCircleToken tokenId={tokenId} index={i} square={square} shift={shift} />;
        })
        .reverse()}
    </svg>
  );
};

export default TightStackedCircleTokens;
