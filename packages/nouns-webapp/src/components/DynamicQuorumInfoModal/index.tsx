import classes from './DynamicQuorumInfoModal.module.css';
import ReactDOM from 'react-dom';
import React from 'react';
import { XIcon } from '@heroicons/react/solid';
import { Auction } from '../../wrappers/nounsAuction';
import { Trans } from '@lingui/macro';
import { Proposal } from '../../wrappers/nounsDao';

export const Backdrop: React.FC<{ onDismiss: () => void }> = props => {
  return <div className={classes.backdrop} onClick={props.onDismiss} />;
};

const DynamicQuorumInfoModalOverlay: React.FC<{
  proposal: Proposal;
  onDismiss: () => void;
}> = props => {
  const { onDismiss, proposal } = props;

  return (
    <>
      <div className={classes.closeBtnWrapper}>
        <button onClick={onDismiss} className={classes.closeBtn}>
          <XIcon className={classes.icon} />
        </button>
      </div>

      <div className={classes.modal}>
        <div className={classes.content}>

        </div>
      </div>
    </>
  );
};

const DynamicQuorumInfoModal: React.FC<{
  proposal: Proposal;
  onDismiss: () => void;
}> = props => {
  const { onDismiss, proposal } = props;
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onDismiss={onDismiss} />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <DynamicQuorumInfoModalOverlay onDismiss={onDismiss} proposal={proposal} />,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};

export default DynamicQuorumInfoModal;