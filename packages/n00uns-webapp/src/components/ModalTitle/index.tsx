import React from 'react';
import classes from './ModalTitle.module.css';

const ModalTitle = (props: { children: React.ReactNode }) => {
  return (
    <div className={classes.title}>
      <h1>{props.children}</h1>
    </div>
  );
};

export default ModalTitle;
