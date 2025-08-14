import React from 'react';

import { StandaloneNounCircular } from '@/components/standalone-noun';

import classes from './horizontal-stacked-nouns.module.css';

interface HorizontalStackedNounsProps {
  nounIds: string[];
}

const HorizontalStackedNouns: React.FC<HorizontalStackedNounsProps> = ({ nounIds }) => {
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
              <StandaloneNounCircular nounId={BigInt(nounId)} border={true} />
            </div>
          );
        })
        .reverse()}
    </div>
  );
};

export default HorizontalStackedNouns;
