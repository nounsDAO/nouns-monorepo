import React from 'react';

import classes from './modal-title.module.css';

interface ModalTitleProps {
  children: React.ReactNode;
}

const ModalTitle = (props: ModalTitleProps) => {
  return (
    <div className={classes.title}>
      <h1>{props.children}</h1>
    </div>
  );
};

export default ModalTitle;
