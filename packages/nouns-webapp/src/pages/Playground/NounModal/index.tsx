import { Button } from 'react-bootstrap';
import classes from './NounModal.module.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Noun from '../../../components/Noun';
import { Backdrop } from '../../../components/Modal';

const NounModal: React.FC<{ onDismiss: () => void; imgSrc: string }> = props => {
  const { onDismiss, imgSrc } = props;
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop
          onDismiss={() => {
            onDismiss();
          }}
        />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <div className={classes.modal}>
          <Noun imgPath={imgSrc} alt="fff" className={classes.nounImg} />
          <div className={classes.displayNounFooter}>
            <span>Use this Noun as your profile picture!</span>
            <Button>Download</Button>
          </div>
        </div>,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};
export default NounModal;
