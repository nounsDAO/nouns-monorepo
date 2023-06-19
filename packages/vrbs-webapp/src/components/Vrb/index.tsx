import classes from './Vrb.module.css';
import React from 'react';
import loadingSkull from '../../assets/loading-skull.gif';
import Image from 'react-bootstrap/Image';

export const LoadingVrb = () => {
  return (
    <div className={classes.imgWrapper}>
      <Image className={classes.img} src={loadingSkull} alt={'loading vrb'} fluid />
    </div>
  );
};

const Vrb: React.FC<{
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
        src={imgPath ? imgPath : loadingSkull}
        alt={alt}
        fluid
      />
    </div>
  );
};

export default Vrb;
