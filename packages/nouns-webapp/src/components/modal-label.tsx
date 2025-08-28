import React from 'react';

interface ModalLabelProps {
  children?: React.ReactNode;
}

const ModalLabel = ({ children }: ModalLabelProps) => <div className="opacity-50">{children}</div>;
export default ModalLabel;
