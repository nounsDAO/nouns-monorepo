import React from 'react';
import TightStackedCircleN00un from '../TightStackedCircleN00un';

interface StackedCircleN00unsProps {
  n00unIds: Array<number>;
}

const MAX_NOUNS_PER_STACK = 3;

const TightStackedCircleN00uns: React.FC<StackedCircleN00unsProps> = props => {
  const { n00unIds } = props;

  const shift = 3;

  const square = 55;

  return (
    <svg width={square} height={square}>
      {n00unIds
        .slice(0, MAX_NOUNS_PER_STACK)
        .map((n00unId: number, i: number) => {
          return (
            <TightStackedCircleN00un n00unId={n00unId} index={i} square={square} shift={shift} />
          );
        })
        .reverse()}
    </svg>
  );
};

export default TightStackedCircleN00uns;
