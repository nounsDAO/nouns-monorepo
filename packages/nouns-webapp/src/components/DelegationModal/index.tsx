import React, { useState } from 'react';

import { XIcon } from '@heroicons/react/solid';
import ReactDOM from 'react-dom';

import { cn } from '@/lib/utils';

import ChangeDelegatePanel from '../ChangeDelegatePanel';
import CurrentDelegatePannel from '../CurrentDelegatePannel';

import classes from './DelegationModal.module.css';

export const Backdrop: React.FC<{ onDismiss: () => void }> = props => {
  return <div className={classes.backdrop} onClick={props.onDismiss} />;
};

interface DelegationModalOverlayProps {
  onDismiss: () => void;
  delegateTo?: string;
}

const DelegationModalOverlay: React.FC<DelegationModalOverlayProps> = props => {
  const { onDismiss, delegateTo } = props;

  const [isChangingDelegation, setIsChangingDelegation] = useState(delegateTo !== undefined);

  return (
    <>
      <div className={classes.closeBtnWrapper}>
        <button onClick={onDismiss} className={classes.closeBtn}>
          <XIcon className={classes.icon} />
        </button>
      </div>

      <div className={cn(classes.modal, 'flex h-auto !max-h-fit flex-col gap-2')}>
        {isChangingDelegation ? (
          <ChangeDelegatePanel onDismiss={onDismiss} delegateTo={delegateTo} />
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
  delegateTo?: string;
}> = props => {
  const { onDismiss, delegateTo } = props;
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onDismiss={onDismiss} />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <DelegationModalOverlay onDismiss={onDismiss} delegateTo={delegateTo} />,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};

export default DelegationModal;
