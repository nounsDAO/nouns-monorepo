import type { StaticImageData } from 'next/image';

import React from 'react';

import Image from 'react-bootstrap/Image';

import loadingNoun from '@/assets/loading-skull-noun.gif';

import classes from './Noun.module.css';

export const LoadingNoun = () => {
  return (
    <div className={classes.imgWrapper}>
      <Image
        className={classes.img}
        src={(loadingNoun as StaticImageData).src}
        alt={'loading noun'}
        fluid
      />
    </div>
  );
};

const LegacyNoun: React.FC<{
  imgPath: string | StaticImageData;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}> = props => {
  const { imgPath, alt, className, wrapperClassName } = props;

  const resolvedSrc =
    typeof imgPath === 'string'
      ? imgPath
      : (imgPath as StaticImageData | undefined)?.src || (loadingNoun as StaticImageData).src;

  return (
    <div className={`${classes.imgWrapper} ${wrapperClassName}`}>
      <Image className={`${classes.img} ${className}`} src={resolvedSrc} alt={alt} fluid />
    </div>
  );
};

export default LegacyNoun;
