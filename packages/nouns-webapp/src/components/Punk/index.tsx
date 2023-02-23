import classes from './Token.module.css';
import React from 'react';
import loadingPunk from '../../assets/loading-skull-noun.gif';
import Image from 'react-bootstrap/Image';

export const LoadingPunk = () => {
  return (
    <div className={classes.imgWrapper}>
      {/*<Image className={classes.img} src={loadingPunk} alt={'loading punk'} fluid />*/}
    </div>
  );
};

const Punk: React.FC<{
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
        src={imgPath ? imgPath : loadingPunk}
        alt={alt}
        fluid
      />
    </div>
  );
};

export default Punk;
