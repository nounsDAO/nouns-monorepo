import React, { useEffect } from 'react';
import classes from './CandidateSponsors.module.css';
import clsx from 'clsx';
import { useBlockNumber } from '@usedapp/core';
import { CandidateSignature, useCancelSignature } from '../../wrappers/nounsDao';
import dayjs, { locale } from 'dayjs';
import en from 'dayjs/locale/en';
import { useEthers } from '@usedapp/core';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AVERAGE_BLOCK_TIME_IN_SECS } from '../../utils/constants';
import { useQuery } from '@apollo/client';
import {
  Delegates,
  currentlyDelegatedNouns,
  delegateNounsAtBlockQuery,
} from '../../wrappers/subgraph';
import ShortAddress from '../ShortAddress';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { SUPPORTED_LOCALE_TO_DAYSJS_LOCALE } from '../../i18n/locales';
import { useActiveLocale } from '../../hooks/useActivateLocale';
import { Trans } from '@lingui/macro';

type CandidateSignatureProps = {
  reason: string;
  expirationTimestamp: number;
  signer: string;
  isAccountSigner: boolean;
  sig: string;
  handleSignerCountDecrease: Function;
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
  // get votes for signer
  const blockNumber = useBlockNumber();
  const { account } = useEthers();
  const { data: delegateSnapshot } = useQuery<Delegates>(
    delegateNounsAtBlockQuery([props.signer], blockNumber || 0),
  );
  const { cancelSig, cancelSigState } = useCancelSignature();
  async function cancel() {
    // await
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
        props.handleSignerCountDecrease(delegateSnapshot?.delegates[0]?.nounsRepresented.length);
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
  }, [cancelSigState, setCancelStatusOverlay]);

  return (
    <li className={classes.sponsor}>
      <div className={classes.sponsorInteriorWrapper}>
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
            {delegateSnapshot?.delegates[0]?.nounsRepresented.length} votes
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
              <button className={classes.readMore} onClick={() => {}}>
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
                }}
              >
                Remove sponsorship
              </button>
            )}

            <div className={classes.cancelStatusOverlayWrapper}>
              {cancelStatusOverlay?.show && (
                <div className={classes.cancelStatusOverlay}>
                  {(cancelSigState.status === 'Exception' || cancelSigState.status === 'Fail') && (
                    <button
                      className={classes.closeButton}
                      onClick={() => {
                        setCancelStatusOverlay(undefined);
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
          </div>
        )}
      </div>
    </li>
  );
};

export default Signature;
