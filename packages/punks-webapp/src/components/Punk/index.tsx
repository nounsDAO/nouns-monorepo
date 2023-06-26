import classes from './Token.module.css';
import React from 'react';
import alienPunkLoader from '../../assets/alien-punk-loader.gif';
import Image from 'react-bootstrap/Image';

export const LoadingPunk = () => {
  return (
    <div className={classes.loaderWrapper}>
      <Image className={classes.loader} src={alienPunkLoader} alt="loading punk" />
    </div>
  );
};

interface PunkProps {
  imgPath: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}

const Punk: React.FC<PunkProps> = props => {
  const { imgPath, alt, className, wrapperClassName } = props;
  return imgPath.length ? (
    <div className={`${classes.imgWrapper} ${wrapperClassName}`}>
      <Image className={`${classes.img} ${className}`} src={imgPath} alt={alt} fluid />
    </div>
  ) : (
    <LoadingPunk />
  );
};

export default Punk;
