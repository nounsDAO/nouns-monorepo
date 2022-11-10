import classes from './NounBR.module.css';
import React from 'react';
import loadingNounBR from '../../assets/loading-skull-nounbr.gif';
import Image from 'react-bootstrap/Image';

export const LoadingNounBR = () => {
  return (
    <div className={classes.imgWrapper}>
      <Image className={classes.img} src={loadingNounBR} alt={'loading nounbr'} fluid />
    </div>
  );
};

const NounBR: React.FC<{
  imgPath: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}> = props => {
  const { imgPath, alt, className, wrapperClassName } = props;
  return (
    <div className={`${classes.imgWrapper} ${wrapperClassName}`}>
      <Image
        className={`${classes.img} ${className}`}
        src={imgPath ? imgPath : loadingNounBR}
        alt={alt}
        fluid
      />
    </div>
  );
};

export default NounBR;
