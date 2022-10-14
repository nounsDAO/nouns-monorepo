import React, { useState } from 'react';
import Placeholder from 'react-bootstrap/Placeholder';
import { BigNumber } from 'ethers';
import { StandaloneNounImage } from '../../StandaloneNoun';

interface ExploreGridItemProps {
  nounId: number | null;
  imgSrc: string | undefined;
}

const ExploreGridItem: React.FC<ExploreGridItemProps> = React.forwardRef(
  (props, ref: React.Ref<HTMLButtonElement>) => {
    const [isImageLoaded, setIsImageLoaded] = useState<boolean | undefined>();
    const [isImageError, setIsImageError] = useState<boolean | undefined>();

    return (
      <>
        <img
          src={props.imgSrc}
          style={isImageLoaded ? {} : { display: 'none' }}
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setIsImageError(true)}
          alt={`Noun #${props.nounId}`}
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
        {isImageError && props.nounId && (
          <StandaloneNounImage nounId={BigNumber.from(props.nounId)} />
        )}
      </>
    );
  },
);

export default ExploreGridItem;
