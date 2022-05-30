import classes from './DelegationModal.module.css';
import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import ChangeDelegatePannel from '../ChangeDelegatePannel';
import CurrentDelegatePannel from '../CurrentDelegatePannel';
import { XIcon } from '@heroicons/react/solid';

export const Backdrop: React.FC<{ onDismiss: () => void }> = props => {
  return <div className={classes.backdrop} onClick={props.onDismiss} />;
};

const DelegationModalOverlay: React.FC<{
  onDismiss: () => void;
}> = props => {
  const { onDismiss } = props;

  const [isChangingDelegation, setIsChangingDelegation] = useState(false);

  return (
    <>
      <div className={classes.closeBtnWrapper}>
        <button onClick={onDismiss} className={classes.closeBtn}>
          <XIcon className={classes.icon} />
        </button>
      </div>

      <div className={classes.modal}>
        {isChangingDelegation ? (
          <ChangeDelegatePannel onDismiss={onDismiss} />
        ) : (
          <CurrentDelegatePannel
            onPrimaryBtnClick={() => setIsChangingDelegation(true)}
            onSecondaryBtnClick={onDismiss}
          />
        )}
      </div>
    </>
  );
};

const DelegationModal: React.FC<{
  onDismiss: () => void;
}> = props => {
  const { onDismiss } = props;
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onDismiss={onDismiss} />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <DelegationModalOverlay onDismiss={onDismiss} />,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};

export default DelegationModal;
