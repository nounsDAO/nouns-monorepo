import { XIcon } from '@heroicons/react/solid';
import React from 'react';
import ReactDOM from 'react-dom';
import classes from './StreamWidthdrawModal.module.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import { Trans } from '@lingui/macro';
import ModalTitle from '../ModalTitle';

dayjs.extend(relativeTime);

export const Backdrop: React.FC<{ onDismiss: () => void }> = props => {
  return <div className={classes.backdrop} onClick={props.onDismiss} />;
};

const StreamWidthdrawModalOverlay: React.FC<{
  onDismiss: () => void;
  streamAddress?: string;
  endTime: number;
}> = props => {
  const { onDismiss, streamAddress, endTime } = props;

  return (
    <>
      <div className={classes.closeBtnWrapper}>
        <button onClick={onDismiss} className={classes.closeBtn}>
          <XIcon className={classes.icon} />
        </button>
      </div>

      <div className={classes.modal}>
        <ModalTitle>
          <Trans>Withdraw from Stream</Trans>
        </ModalTitle>

        <span
          style={{
            opacity: '0.5',
            fontWeight: 'bold',
          }}
        >
          Avilable to withdraw
        </span>
        <h1
          style={{
            fontWeight: 'bold',
          }}
        >
          100 WETH
        </h1>

        <span
          style={{
            opacity: '0.5',
            fontWeight: 'bold',
          }}
        >
          Total stream value
        </span>
        <h1
          style={{
            fontWeight: 'bold',
          }}
        >
          200 WETH
        </h1>

        <div
          style={{
            opacity: '0.5',
            fontWeight: 'bold',
            marginBottom: '1rem',
          }}
        >
          Stream ends {dayjs.unix(endTime).fromNow()}
        </div>

        <NavBarButton
          buttonText={<Trans>Withdraw</Trans>}
          buttonIcon={<></>}
          buttonStyle={NavBarButtonStyle.FOR_VOTE_SUBMIT}
        />
      </div>
    </>
  );
};

const StreamWidthdrawModal: React.FC<{
  onDismiss: () => void;
  streamAddress?: string;
  startTime: number;
  endTime: number;
}> = props => {
  const { onDismiss } = props;
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onDismiss={onDismiss} />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <StreamWidthdrawModalOverlay {...props} />,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};

export default StreamWidthdrawModal;
