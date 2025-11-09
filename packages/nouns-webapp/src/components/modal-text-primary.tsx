import React from 'react';

interface ModalTextPrimaryProps {
  children?: React.ReactNode;
}

const ModalTextPrimary = ({ children }: Readonly<ModalTextPrimaryProps>) => (
  <div className="text-22 text-brand-cool-dark-text mb-2 font-bold">{children}</div>
);
export default ModalTextPrimary;
