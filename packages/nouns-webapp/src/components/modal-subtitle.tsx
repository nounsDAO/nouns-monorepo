import React from 'react';

interface ModalSubTitleProps {
  children: React.ReactNode;
}

const ModalSubTitle = (props: ModalSubTitleProps) => {
  return <div className="font-medium">{props.children}</div>;
};

export default ModalSubTitle;
