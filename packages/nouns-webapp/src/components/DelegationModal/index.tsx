import classes from './DelegationModal.module.css';
import ReactDOM from 'react-dom';
import React, { ReactNode, useState } from 'react';
import { SwitchHorizontalIcon, XIcon } from '@heroicons/react/solid';
import { useEthers } from '@usedapp/core';
import { Trans } from '@lingui/macro';
import ChangeDelegatePannel from '../ChangeDelegatePannel';
import CurrentDelegatePannel from '../CurrentDelegatePannel';

export const Backdrop: React.FC<{ onDismiss: () => void }> = props => {
  return <div className={classes.backdrop} onClick={props.onDismiss} />;
};

const DelegationModalOverlay: React.FC<{
  onDismiss: () => void;
}> = props => {
  const { onDismiss } = props;

  const { account } = useEthers();
  const [modalTitleState, setModalTitleState] = useState('');
  const [isChangingDelegation, setIsChangingDelegation] = useState(false);

  return (
    <>
      <div className={classes.closeBtnWrapper}>
        <button onClick={onDismiss} className={classes.closeBtn}>
          <XIcon className={classes.icon} />
        </button>
      </div>

      <div className={classes.modal}>
        {/* <div className={classes.title}>
            <h1>Delegation</h1>
          </div> */}
        {isChangingDelegation ? (
          <ChangeDelegatePannel />
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
