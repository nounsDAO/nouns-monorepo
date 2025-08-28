import React from 'react';

interface ModalTitleProps {
  children: React.ReactNode;
}

const ModalTitle = (props: ModalTitleProps) => {
  return (
    <div className="font-londrina">
      <h1>{props.children}</h1>
    </div>
  );
};

export default ModalTitle;
