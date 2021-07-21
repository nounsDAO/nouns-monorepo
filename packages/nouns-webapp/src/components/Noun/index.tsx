import classes from './Noun.module.css';
import React from 'react';
import questionNoun from '../../assets/question-noun.png';
import Image from 'react-bootstrap/Image';

const Noun: React.FC<{ imgPath: string; alt: string }> = props => {
  const { imgPath, alt } = props;
  return <Image className={classes.img} src={imgPath ? imgPath : questionNoun} alt={alt} fluid />;
};

export default Noun;
