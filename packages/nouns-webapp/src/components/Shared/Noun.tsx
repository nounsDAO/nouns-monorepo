import classes from './Noun.module.css';
import React from 'react';

const Noun: React.FC<{ imgPath: string }> = props => {
  return <img className={classes.img} src={props.imgPath} alt="A happy Nouns DAO member." />;
};

export default Noun;
