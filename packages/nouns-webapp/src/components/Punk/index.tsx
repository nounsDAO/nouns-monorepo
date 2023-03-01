import classes from './Token.module.css';
import React from 'react';
// import loadingPunk from '../../assets/loading-skull-noun.gif';
import Image from 'react-bootstrap/Image';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const LoadingPunk = () => {
  return (
    <div className={classes.imgWrapper}>
      <FontAwesomeIcon icon={faSpinner} spin className={classes.spinner} />
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
      {imgPath ? (
        <Image className={`${classes.img} ${className}`} src={imgPath} alt={alt} fluid />
      ) : (
        <FontAwesomeIcon icon={faSpinner} spin className={classes.spinner} />
      )}
    </div>
  );
};

export default Punk;
