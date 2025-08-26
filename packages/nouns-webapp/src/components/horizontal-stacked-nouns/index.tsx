import React from 'react';

import { StandaloneNounCircular } from '@/components/standalone-noun';

interface HorizontalStackedNounsProps {
  nounIds: string[];
}

const HorizontalStackedNouns: React.FC<HorizontalStackedNounsProps> = ({ nounIds }) => {
  return (
    <div className="relative mx-auto mb-[50px] mt-[10px] w-full">
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
              className="absolute"
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
