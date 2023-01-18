import classes from './SolidColorBackgroundModal.module.css';
import ReactDOM from 'react-dom';
import React, { useRef } from 'react';
import { XIcon } from '@heroicons/react/solid';
import { isMobileScreen } from '../../utils/isMobile';
import NounsTransition from '../NounsTransition';
import {
  basicFadeInOut,
  desktopModalSlideInFromTopAndGrow,
  mobileModalSlideInFromBottm,
} from '../../utils/cssTransitionUtils';

export const Backdrop: React.FC<{ onDismiss: () => void; show: boolean }> = props => {
  const nodeRef = useRef(null);

  return (
    <NounsTransition
      className={classes.backdrop}
      nodeRef={nodeRef}
      show={props.show}
      timeout={100}
      onClick={() => props.onDismiss()}
      transitionStyes={basicFadeInOut}
    />
  );
};

const SolidColorBackgroundModalOverlay: React.FC<{
  onDismiss: () => void;
  content: React.ReactNode;
  show: boolean;
}> = props => {
  const { show, onDismiss, content } = props;

  const exitBtnRef = useRef(null);
  const modalRef = useRef(null);

  const isMobile = isMobileScreen();

  return (
    <>
      <NounsTransition
        nodeRef={exitBtnRef}
        timeout={200}
        transitionStyes={basicFadeInOut}
        show={show}
      >
        <div className={classes.closeBtnWrapper}>
          <button onClick={onDismiss} className={classes.closeBtn}>
            <XIcon className={classes.icon} />
          </button>
        </div>
      </NounsTransition>
      <NounsTransition
        nodeRef={modalRef}
        show={show}
        className={classes.modal}
        timeout={200}
        transitionStyes={isMobile ? mobileModalSlideInFromBottm : desktopModalSlideInFromTopAndGrow}
      >
        <>{content}</>
      </NounsTransition>
    </>
  );
};

const SolidColorBackgroundModal: React.FC<{
  onDismiss: () => void;
  content: React.ReactNode;
  show: boolean;
}> = props => {
  const { onDismiss, content, show } = props;

  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop show={show} onDismiss={onDismiss} />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <SolidColorBackgroundModalOverlay show={show} onDismiss={onDismiss} content={content} />,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};

export default SolidColorBackgroundModal;
