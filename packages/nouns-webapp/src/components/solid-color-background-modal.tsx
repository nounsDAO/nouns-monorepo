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

export const Backdrop: React.FC<{ onDismiss: () => void; show: boolean }> = props => {
  const nodeRef = useRef(null);

  return (
    <NounsTransition
      className={[
        'fixed inset-0 z-10 h-full w-full bg-black/50 opacity-0 backdrop-blur-[24px] transition-opacity duration-75 ease-in-out',
        'max-lg:bg-black/75',
      ].join(' ')}
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
        <div
          className={['flex justify-end px-8 py-4', 'md-lg:absolute md-lg:left-[96.5%]'].join(' ')}
        >
          <button
            type="button"
            onClick={onDismiss}
            className="fixed z-[100] size-10 rounded-full border-0 transition-all duration-150 ease-in-out hover:cursor-pointer hover:bg-white/50"
          >
            <XIcon className="size-6" />
          </button>
        </div>
      </NounsTransition>
      <NounsTransition
        nodeRef={modalRef}
        show={show}
        className={[
          'font-pt bg-brand-surface shadow-quorum-modal absolute left-[calc(50%_-_236px)] top-[15vh] z-[100] w-[472px] translate-y-[-1rem] scale-50 rounded-3xl p-6 font-bold transition-all duration-150 ease-in-out',
          'max-lg:bottom-0 max-lg:left-0 max-lg:top-auto max-lg:max-h-[calc(100%_-_75px)] max-lg:w-full max-lg:overflow-y-scroll max-lg:rounded-b-none max-lg:shadow-none max-lg:translate-y-[20rem] max-lg:scale-100',
        ].join(' ')}
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
