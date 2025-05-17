import React from 'react';

import classes from './ModalSubtitle.module.css';

interface ModalSubTitleProps {
  children: React.ReactNode;
}

const ModalSubTitle = (props: ModalSubTitleProps) => {
  return <div className={classes.subtitle}>{props.children}</div>;
};

export default ModalSubTitle;
