import classes from './Noun.module.css';
import React from 'react';
import loadingNoun from '../../assets/loading-skull-noun.gif';
import Image from 'react-bootstrap/Image';

export const LoadingNoun = () => {
  return <Image className={classes.img} src={loadingNoun} alt={'loading noun'} fluid />;
};

const Noun: React.FC<{ imgPath: string; alt: string }> = props => {
  const { imgPath, alt } = props;
  return <Image className={classes.img} src={imgPath ? imgPath : loadingNoun} alt={alt} fluid />;
};

export default Noun;
