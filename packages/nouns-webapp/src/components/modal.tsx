import React from 'react';

import ReactDOM from 'react-dom';

import xIcon from '@/assets/x-icon.png';

export const Backdrop: React.FC<{ onDismiss: () => void }> = props => {
  return (
    <div
      className="fixed inset-0 z-10 size-full bg-black/60 backdrop-blur-[10px]"
      onClick={props.onDismiss}
    />
  );
};

interface ModalOverlayProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
  onDismiss: () => void;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ content, onDismiss, title }) => {
  return (
    <div className="font-pt lg:rounded-15 fixed bottom-0 left-0 top-auto max-h-full w-full rounded-b-none bg-white/60 px-8 py-12 text-center font-bold backdrop-blur-[10px] lg:left-[calc(50%-17.5rem)] lg:top-[30vh] lg:w-[35rem]">
      <button
        className="absolute right-8 top-8 size-[40px] min-h-[44px] border-0 bg-transparent pt-[2px] hover:bg-white hover:text-black"
        onClick={onDismiss}
        type="button"
      >
        <img
          className="mt-[-4px] size-4 opacity-50 transition-all duration-150 ease-in-out hover:opacity-100"
          src={typeof xIcon === 'string' ? xIcon : (xIcon as { src: string }).src}
          alt="Button to close modal"
        />
      </button>
      <h3 className="text-2xl font-bold">{title}</h3>
      <div className="max-h-[50vh] overflow-y-auto p-4">{content}</div>
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
