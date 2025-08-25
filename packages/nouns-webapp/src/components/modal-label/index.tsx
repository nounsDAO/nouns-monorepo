import React from 'react';

import classes from './modal-label.module.css';

interface ModalLabelProps {
  children?: React.ReactNode;
}

const ModalLabel = ({ children }: ModalLabelProps) => (
  <div className={classes.label}>{children}</div>
);
export default ModalLabel;
