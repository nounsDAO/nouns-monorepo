import React, { useEffect } from 'react';
import classes from './CandidateSponsors.module.css';
import clsx from 'clsx';
import { useCancelSignature } from '../../wrappers/nounsDao';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ShortAddress from '../ShortAddress';
import { Trans } from '@lingui/macro';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type CandidateSignatureProps = {
  reason: string;
  expirationTimestamp: number;
  signer: string;
  voteCount: number;
  isAccountSigner: boolean;
  sig: string;
  handleRefetchCandidateData: Function;
  setDataFetchPollInterval: Function;
  setIsAccountSigner: Function;
  setIsCancelOverlayVisible: Function;
  signerHasActiveOrPendingProposal?: boolean;
  isUpdateToProposal?: boolean;
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
        props.setDataFetchPollInterval(50);
        break;
      case 'Success':
        props.handleRefetchCandidateData();
        setCancelStatusOverlay({
          title: 'Success',
          message: 'Signature removed',
          show: true,
        });
        setIsCancelSignaturePending(false);
        break;
      case 'Fail':
        props.setDataFetchPollInterval(0);
        setCancelStatusOverlay({
          title: 'Transaction Failed',
          message: cancelSigState?.errorMessage || 'Please try again.',
          show: true,
        });
        setIsCancelSignaturePending(false);
        break;
      case 'Exception':
        props.setDataFetchPollInterval(0);
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
      cancelStatusOverlay?.show && classes.cancelOverlay,
      props.signerHasActiveOrPendingProposal && classes.sponsorInvalid,
    )}>
      {props.signerHasActiveOrPendingProposal && (
        <div className={classes.sponsorInvalidLabel}>
          <Trans>
            This signature is invalid while the signer has an active or pending proposal.
          </Trans>
        </div>
      )}
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
                <Trans>Remove sponsorship</Trans>
              </button>
            )}
          </div>
        )}
        {props.isUpdateToProposal && !props.isAccountSigner && (
          <p className={classes.sigStatus}>
            <span><FontAwesomeIcon icon={faCircleCheck} /></span>
            <Trans>Re-signed</Trans>
          </p>
        )}
      </div>

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
                cancelSigState.status === 'Success' && props.setIsAccountSigner(false);
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

    </li>
  );
};

export default Signature;
