import React, { useState } from 'react';

import { XIcon } from '@heroicons/react/solid';
import ReactDOM from 'react-dom';

import { cn } from '@/lib/utils';

import ChangeDelegatePanel from '../change-delegate-panel';
import CurrentDelegatePannel from '../current-delegate-pannel';

export const Backdrop: React.FC<{ onDismiss: () => void }> = props => {
  return (
    <div
      className="fixed inset-0 z-[60] size-full bg-[rgba(75,75,75,0.5)] backdrop-blur-xl max-[992px]:bg-[rgba(0,0,0,0.74)]"
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
          'bg-brand-gray-background font-pt shadow-quorum-modal fixed left-[calc(50%_-_236px)] top-[15vh] z-[100] max-h-[347px] w-[472px] rounded-[24px] p-6 font-bold max-[992px]:bottom-0 max-[992px]:left-0 max-[992px]:top-auto max-[992px]:max-h-full max-[992px]:w-full max-[992px]:rounded-b-none max-[992px]:shadow-none',
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
