import React, { useState } from 'react';
import Placeholder from 'react-bootstrap/Placeholder';
import { BigNumber } from 'ethers';
import { StandaloneVrbImage } from '../../StandaloneVrb';

interface ExploreGridItemProps {
  vrbId: number | null;
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
          alt={`Vrb #${props.vrbId}`}
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

        {/* If image can't be loaded, fetch Vrb image internally */}
        {isImageError && props.vrbId && (
          <StandaloneVrbImage vrbId={BigNumber.from(props.vrbId)} />
        )}
      </>
    );
  },
);

export default ExploreGridItem;
