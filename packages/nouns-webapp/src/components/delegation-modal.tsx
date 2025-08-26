import React, { useState } from 'react';

import { XIcon } from '@heroicons/react/solid';
import ReactDOM from 'react-dom';

import ChangeDelegatePanel from '@/components/change-delegate-panel';
import CurrentDelegatePannel from '@/components/current-delegate-pannel';
import { cn } from '@/lib/utils';

export const Backdrop: React.FC<{ onDismiss: () => void }> = props => {
  return (
    <div
      className="lg-max:bg-[rgba(0,0,0,0.74)] fixed inset-0 z-[60] size-full bg-[rgba(75,75,75,0.5)] backdrop-blur-xl"
      onClick={props.onDismiss}
    />
  );
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
      <div className="flex justify-end px-8 py-4">
        <button
          type="button"
          onClick={onDismiss}
          className="fixed z-[100] size-10 rounded-full border-0 transition-all duration-150 ease-in-out hover:cursor-pointer hover:bg-white/50"
        >
          <XIcon className="size-6" />
        </button>
      </div>

      <div
        className={cn(
          'bg-brand-gray-background font-pt shadow-quorum-modal lg-max:bottom-0 lg-max:left-0 lg-max:top-auto lg-max:max-h-full lg-max:w-full lg-max:rounded-b-none lg-max:shadow-none fixed left-[calc(50%_-_236px)] top-[15vh] z-[100] w-[472px] rounded-[24px] p-6 font-bold',
          'flex h-auto !max-h-fit flex-col gap-2',
        )}
      >
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
  // Avoid SSR errors when document is not available
  onDismiss: () => void;
  delegateTo?: string;
}> = props => {
  const { onDismiss, delegateTo } = props;

  if (typeof document === 'undefined') return null;

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
