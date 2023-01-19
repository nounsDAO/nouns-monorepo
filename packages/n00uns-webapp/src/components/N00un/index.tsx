import classes from './N00un.module.css';
import React from 'react';
import loadingN00un from '../../assets/loading-skull-n00un.gif';
import Image from 'react-bootstrap/Image';

export const LoadingN00un = () => {
  return (
    <div className={classes.imgWrapper}>
      <Image className={classes.img} src={loadingN00un} alt={'loading n00un'} fluid />
    </div>
  );
};

const N00un: React.FC<{
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
        src={imgPath ? imgPath : loadingN00un}
        alt={alt}
        fluid
      />
    </div>
  );
};

export default N00un;
