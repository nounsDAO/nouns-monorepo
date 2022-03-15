import classes from './Noun.module.css';
import React from 'react';
import loadingNoun from '../../assets/loading-skull-noun.gif';
import Image from 'react-bootstrap/Image';

export const LoadingNoun = () => {
  return (
    <div className={classes.imgWrapper}>
      <Image className={classes.img} src={loadingNoun} alt={'loading noun'} fluid />
    </div>
  );
};

const Noun: React.FC<{
  imgPath: string;
  alt?: string;
  type?: 'animation' | 'image';
  isEthereum?: boolean;
  className?: string;
  wrapperClassName?: string;
}> = props => {
  const { imgPath, type, alt, className, wrapperClassName, isEthereum = false } = props;
  return (
    <div className={`${classes.imgWrapper} ${wrapperClassName}`}>
      {type === 'image' ? (
        <Image
          className={`${classes.img} ${
            isEthereum ? classes.ethereumBorder : classes.polygonBorder
          } ${className}`}
          src={imgPath ? imgPath : loadingNoun}
          alt={alt}
          fluid
        />
      ) : (
        <video
          autoPlay
          loop
          muted
          className={`${classes.video} ${
            isEthereum ? classes.ethereumBorder : classes.polygonBorder
          } ${className}`}
        >
          <source src={imgPath} />
        </video>
      )}
    </div>
  );
};

export default Noun;
