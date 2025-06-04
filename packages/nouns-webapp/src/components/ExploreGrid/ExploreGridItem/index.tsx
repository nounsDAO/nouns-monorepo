import React, { useState } from 'react';

import Placeholder from 'react-bootstrap/Placeholder';

import { StandaloneNounImage } from '@/components/StandaloneNoun';

interface ExploreGridItemProps {
  nounId: bigint | null;
  imgSrc: string | undefined;
}

// eslint-disable-next-line react/display-name
const ExploreGridItem: React.FC<ExploreGridItemProps> = React.forwardRef(
  // eslint-disable-next-line react/prop-types,@typescript-eslint/no-unused-vars
  ({ imgSrc, nounId }, _ref: React.Ref<HTMLButtonElement>) => {
    const [isImageLoaded, setIsImageLoaded] = useState<boolean | undefined>();
    const [isImageError, setIsImageError] = useState<boolean | undefined>();

    return (
      <>
        <img
          src={imgSrc}
          style={isImageLoaded ? {} : { display: 'none' }}
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setIsImageError(true)}
          alt={`Noun #${nounId}`}
        />

        {/* Show placeholder until image is loaded */}
        <div
          style={
            !isImageLoaded && !isImageError
              ? { display: 'block', height: '100%' }
              : { display: 'none' }
          }
        >
          <Placeholder xs={12} animation="glow" />
        </div>

        {/* If image can't be loaded, fetch Noun image internally */}
        {isImageError && nounId && <StandaloneNounImage nounId={BigInt(nounId)} />}
      </>
    );
  },
);

export default ExploreGridItem;
