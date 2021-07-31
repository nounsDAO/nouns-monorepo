import classes from './Noun.module.css';
import React from 'react';
import loadingNoun from '../../assets/loadnoun.gif';
import Image from 'react-bootstrap/Image';

const Noun: React.FC<{ imgPath: string; alt: string }> = props => {
  const { imgPath, alt } = props;
  return <Image className={classes.img} src={imgPath ? imgPath : loadingNoun} alt={alt} fluid />;
};

export default Noun;
