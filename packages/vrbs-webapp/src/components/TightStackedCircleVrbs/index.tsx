import React from 'react';
import TightStackedCircleVrb from '../TightStackedCircleVrb';

interface StackedCircleVrbsProps {
  vrbIds: Array<number>;
}

const MAX_NOUNS_PER_STACK = 3;

const TightStackedCircleVrbs: React.FC<StackedCircleVrbsProps> = props => {
  const { vrbIds } = props;

  const shift = 3;

  const square = 55;

  return (
    <svg width={square} height={square}>
      {vrbIds
        .slice(0, MAX_NOUNS_PER_STACK)
        .map((vrbId: number, i: number) => {
          return (
            <TightStackedCircleVrb vrbId={vrbId} index={i} square={square} shift={shift} />
          );
        })
        .reverse()}
    </svg>
  );
};

export default TightStackedCircleVrbs;
