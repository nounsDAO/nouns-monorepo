import React from 'react';
import TightStackedCircleNounBR from '../TightStackedCircleNounBR';

interface StackedCircleNounsBRProps {
  nounbrIds: Array<number>;
}

const MAX_NOUNSBR_PER_STACK = 3;

const TightStackedCircleNounsBR: React.FC<StackedCircleNounsBRProps> = props => {
  const { nounbrIds } = props;

  const shift = 3;

  const square = 55;

  return (
    <svg width={square} height={square}>
      {nounbrIds
        .slice(0, MAX_NOUNSBR_PER_STACK)
        .map((nounbrId: number, i: number) => {
          return <TightStackedCircleNounBR nounbrId={nounbrId} index={i} square={square} shift={shift} />;
        })
        .reverse()}
    </svg>
  );
};

export default TightStackedCircleNounsBR;
