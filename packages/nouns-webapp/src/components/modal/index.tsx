import React from 'react';

import ReactDOM from 'react-dom';

import xIcon from '@/assets/x-icon.png';

import classes from './modal.module.css';

export const Backdrop: React.FC<{ onDismiss: () => void }> = props => {
  return <div className={classes.backdrop} onClick={props.onDismiss} />;
};

interface ModalOverlayProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
  onDismiss: () => void;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ content, onDismiss, title }) => {
  return (
    <div className={classes.modal}>
      <button className={classes.closeButton} onClick={onDismiss} type="button">
        <img
          src={typeof xIcon === 'string' ? xIcon : (xIcon as { src: string }).src}
          alt="Button to close modal"
        />
      </button>
      <h3>{title}</h3>
      <div className={classes.content}>{content}</div>
    </div>
  );
};

const Modal: React.FC<ModalOverlayProps> = ({ content, onDismiss, title }) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onDismiss={onDismiss} />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <ModalOverlay title={title} content={content} onDismiss={onDismiss} />,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};

export default Modal;
