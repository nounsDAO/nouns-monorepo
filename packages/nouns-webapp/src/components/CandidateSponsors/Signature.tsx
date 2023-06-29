import React, { useEffect } from 'react';
import classes from './CandidateSponsors.module.css';
import clsx from 'clsx';
import { useCancelSignature } from '../../wrappers/nounsDao';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ShortAddress from '../ShortAddress';

type CandidateSignatureProps = {
  reason: string;
  expirationTimestamp: number;
  signer: string;
  voteCount: number;
  isAccountSigner: boolean;
  sig: string;
  handleSignerCountDecrease: Function;
  handleRefetchCandidateData: Function;
  setIsAccountSigner: Function;
  handleSignatureRemoved: Function;
  setIsCancelOverlayVisible: Function;
};

const Signature: React.FC<CandidateSignatureProps> = props => {
  const [isReasonShown, setIsReasonShown] = React.useState(false);
  const [isCancelSignaturePending, setIsCancelSignaturePending] = React.useState(false);
  const [cancelStatusOverlay, setCancelStatusOverlay] = React.useState<{
    title: string;
    message: string;
    show: boolean;
  }>();
  dayjs.extend(relativeTime);
  const expiration = dayjs(dayjs.unix(props.expirationTimestamp / 1000)).fromNow();
  const { cancelSig, cancelSigState } = useCancelSignature();
  async function cancel() {
    await cancelSig(props.sig);
  }

  useEffect(() => {
    switch (cancelSigState.status) {
      case 'None':
        setIsCancelSignaturePending(false);
        break;
      case 'Mining':
        setIsCancelSignaturePending(true);
        break;
      case 'Success':
        setCancelStatusOverlay({
          title: 'Success',
          message: 'Signature removed',
          show: true,
        });
        setIsCancelSignaturePending(false);
        props.setIsAccountSigner(false);
        props.handleSignerCountDecrease(props.voteCount);
        break;
      case 'Fail':
        setCancelStatusOverlay({
          title: 'Transaction Failed',
          message: cancelSigState?.errorMessage || 'Please try again.',
          show: true,
        });
        setIsCancelSignaturePending(false);
        break;
      case 'Exception':
        setCancelStatusOverlay({
          title: 'Error',
          message: cancelSigState?.errorMessage || 'Please try again.',
          show: true,
        });
        setIsCancelSignaturePending(false);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelSigState, setCancelStatusOverlay]);
  return (
    <li className={clsx(classes.sponsor,
      cancelStatusOverlay?.show && classes.cancelOverlay
    )}>
      <div className={clsx(classes.sponsorInteriorWrapper,
        cancelSigState.status === "Success" && classes.hidden
      )}>
        <div className={classes.details}>
          <div className={classes.sponsorInfo}>
            <p className={classes.sponsorName}>
              <a href={buildEtherscanAddressLink(props.signer)} target={'_blank'} rel="noreferrer">
                <ShortAddress address={props.signer} />
              </a>
            </p>
            <p className={classes.expiration}>Expires {expiration}</p>
          </div>
          <p className={classes.voteCount}>
            {props.voteCount} vote{props.voteCount !== 1 && 's'}
          </p>
        </div>
        {props.reason && (
          <div className={classes.reason} onClick={() => setIsReasonShown(!isReasonShown)}>
            <div
              className={clsx(
                classes.reasonWrapper,
                isReasonShown && props.reason.length > 50 && classes.reasonShown,
              )}
            >
              <p>{props.reason}</p>
            </div>
            {!isReasonShown && props.reason.length > 50 && (
              <button className={classes.readMore} onClick={() => { }}>
                more
              </button>
            )}
          </div>
        )}
        {props.isAccountSigner && (
          <div className={classes.removeSignature}>
            {isCancelSignaturePending ? (
              <img src="/loading-noggles.svg" alt="loading" className={classes.loadingNoggles} />
            ) : (
              <button
                onClick={() => {
                  cancel();
                  setIsCancelSignaturePending(true);
                  props.setIsCancelOverlayVisible(true);
                }}
              >
                Remove sponsorship
              </button>
            )}
          </div>
        )}
      </div>
      <div className={classes.cancelStatusOverlayWrapper}>
        {cancelStatusOverlay?.show && (
          <div className={clsx(
            classes.cancelStatusOverlay,
            (cancelSigState.status === 'Exception' || cancelSigState.status === 'Fail') && classes.errorMessage,
            cancelSigState.status === 'Success' && classes.successMessage
          )}>
            {(cancelSigState.status === 'Exception' || cancelSigState.status === 'Fail' || cancelSigState.status === 'Success') && (
              <button
                className={classes.closeButton}
                onClick={() => {
                  props.handleRefetchCandidateData();
                  setCancelStatusOverlay(undefined);
                  props.setIsCancelOverlayVisible(false);
                }}
              >
                &times;
              </button>
            )}
            <div className={classes.cancelStatusOverlayTitle}>
              {cancelStatusOverlay.title}
            </div>
            <div className={classes.cancelStatusOverlayMessage}>
              {cancelStatusOverlay.message}
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

export default Signature;
