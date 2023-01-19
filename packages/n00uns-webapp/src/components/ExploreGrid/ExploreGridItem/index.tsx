import React, { useState } from 'react';
import Placeholder from 'react-bootstrap/Placeholder';
import { BigNumber } from 'ethers';
import { StandaloneN00unImage } from '../../StandaloneN00un';

interface ExploreGridItemProps {
  n00unId: number | null;
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
          alt={`N00un #${props.n00unId}`}
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

        {/* If image can't be loaded, fetch N00un image internally */}
        {isImageError && props.n00unId && (
          <StandaloneN00unImage n00unId={BigNumber.from(props.n00unId)} />
        )}
      </>
    );
  },
);

export default ExploreGridItem;
