import classes from './Noun.module.css';
import React from 'react';
import questionNoun from '../../assets/question-noun.png';

const Noun: React.FC<{ imgPath: string }> = props => {
  return (
    <img
      className={classes.img}
      src={props.imgPath ? props.imgPath : questionNoun}
      alt="A happy Nouns DAO member."
    />
  );
};

export default Noun;
