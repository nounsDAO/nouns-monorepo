import classes from './Noun.module.css';
import React from 'react';

const Noun: React.FC<{ imgPath: string }> = props => {
  return <img className={classes.img} src={props.imgPath} />;
};

export default Noun;
