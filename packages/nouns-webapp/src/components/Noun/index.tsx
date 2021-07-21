import classes from './Noun.module.css';
import React from 'react';
import questionNoun from '../../assets/question-noun.png';

const Noun: React.FC<{ imgPath: string; alt: string }> = props => {
  const { imgPath, alt } = props;
  return <img className={classes.img} src={imgPath ? imgPath : questionNoun} alt={alt} />;
};

export default Noun;
