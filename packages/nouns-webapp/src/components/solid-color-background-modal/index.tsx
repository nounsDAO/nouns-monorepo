'use client';

import React, { useEffect, useRef } from 'react';

import { XIcon } from '@heroicons/react/solid';
import ReactDOM from 'react-dom';

import NounsTransition from '@/components/nouns-transition';
import {
  basicFadeInOut,
  desktopModalSlideInFromTopAndGrow,
  mobileModalSlideInFromBottm,
} from '@/utils/css-transition-utils';
import { isMobileScreen } from '@/utils/is-mobile';

import classes from './solid-color-background-modal.module.css';

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

  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (!show) return;

    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      const top = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, Math.abs(parseInt(top || '0', 10)));
    };
  }, [show]);

  return (
    <>
      <NounsTransition
        nodeRef={exitBtnRef}
        timeout={200}
        transitionStyes={basicFadeInOut}
        show={show}
      >
        <div className={classes.closeBtnWrapper}>
          <button type="button" onClick={onDismiss} className={classes.closeBtn}>
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

  // Avoid rendering on the server where document/window are not available
  if (typeof document === 'undefined') return null;

  const ensurePortalRoot = (id: string): HTMLElement => {
    let el = document.getElementById(id) as HTMLElement | null;
    if (!el) {
      el = document.createElement('div');
      el.setAttribute('id', id);
      document.body.appendChild(el);
    }
    return el;
  };

  const backdropRoot = ensurePortalRoot('backdrop-root');
  const overlayRoot = ensurePortalRoot('overlay-root');

  return (
    <>
      {ReactDOM.createPortal(<Backdrop show={show} onDismiss={onDismiss} />, backdropRoot)}
      {ReactDOM.createPortal(
        <SolidColorBackgroundModalOverlay show={show} onDismiss={onDismiss} content={content} />,
        overlayRoot,
      )}
    </>
  );
};

export default SolidColorBackgroundModal;
