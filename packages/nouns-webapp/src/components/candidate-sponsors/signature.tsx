import type { Address } from '@/utils/types';

import React, { useEffect } from 'react';

import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/react/macro';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import ShortAddress from '@/components/short-address';
import { cn } from '@/lib/utils';
import { buildEtherscanAddressLink } from '@/utils/etherscan';
import { useCancelSignature } from '@/wrappers/nouns-dao';
import { isTruthy } from 'remeda';

type CandidateSignatureProps = {
  reason: string;
  expirationTimestamp: number;
  signer: Address;
  voteCount: number;
  isAccountSigner: boolean;
  sig: string;
  signerHasActiveOrPendingProposal?: boolean;
  isUpdateToProposal?: boolean;
  isParentProposalUpdatable?: boolean;
  handleRefetchCandidateData: () => void;
  setDataFetchPollInterval: (interval: number) => void;
  setIsAccountSigner: (isAccountSigner: boolean) => void;
  handleSignatureRemoved: (voteCount: number) => void;
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
  const expiration = dayjs(dayjs.unix(props.expirationTimestamp)).fromNow();
  const { cancelSig, cancelSigState } = useCancelSignature();
  async function cancel() {
    await cancelSig({ args: [`0x${props.sig.replace(/^0x/, '')}`] });
  }
  const timestampNow = Math.floor(Date.now() / 1000); // in seconds

  useEffect(() => {
    switch (cancelSigState.status) {
      case 'None':
        setIsCancelSignaturePending(false);
        break;
      case 'Mining':
        setIsCancelSignaturePending(true);
        break;
      case 'Success':
        props.handleSignatureRemoved(props.voteCount);
        setCancelStatusOverlay({
          title: 'Success',
          message: 'Signature removed',
          show: true,
        });
        setIsCancelSignaturePending(false);
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
  const isInvalid = isTruthy(props.signerHasActiveOrPendingProposal);
  return (
    <li
      className={cn(
        'rounded-12 border-brand-border-light bg-brand-surface-contrast relative m-0 mb-[10px] list-none border p-[10px]',
        isTruthy(cancelStatusOverlay?.show) && 'min-h-[75px]',
      )}
    >
      {isTruthy(props.signerHasActiveOrPendingProposal) && (
        <div
          className={
            'mb-2 rounded-lg bg-black/5 px-4 py-2 text-center text-[13px] leading-none text-black/40'
          }
        >
          <Trans>Signature invalid while signer has an active or pending proposal</Trans>
        </div>
      )}
      <div className={cn(cancelSigState.status === 'Success' && 'opacity-0')}>
        <div className={cn('flex flex-row justify-between', isInvalid && 'opacity-50')}>
          <div>
            <p className={'m-0 p-0 leading-[1.1]'}>
              <a href={buildEtherscanAddressLink(props.signer)} target={'_blank'} rel="noreferrer">
                <span className="text-[14px] font-bold text-black no-underline hover:underline">
                  <ShortAddress address={props.signer} />
                </span>
              </a>
            </p>
            <p className={'text-brand-text-muted-500 text-[13px]'}>
              {(isTruthy(props.isUpdateToProposal) && !isTruthy(props.isParentProposalUpdatable)) ||
              props.expirationTimestamp < timestampNow
                ? 'Expired'
                : 'Expires'}{' '}
              {expiration}
            </p>
          </div>
          <p className={'text-brand-text-muted-500 m-0 p-0 text-[13px] font-bold'}>
            {props.voteCount} vote{props.voteCount !== 1 && 's'}
          </p>
        </div>
        {props.reason && (
          <div
            className={cn(
              'border-brand-border-light text-brand-text-muted-500 mt-2.5 border-t pt-[10px] text-[13px] leading-[1.2]',
              isInvalid && 'opacity-50',
            )}
            onClick={() => setIsReasonShown(!isReasonShown)}
          >
            <div
              className={cn(
                isReasonShown && props.reason.length > 50
                  ? 'block overflow-visible'
                  : 'overflow-hidden',
              )}
            >
              <p className="m-0 p-0">{props.reason}</p>
            </div>
            {!isReasonShown && props.reason.length > 50 && (
              <button
                type="button"
                className={
                  'relative z-[2] -mt-5 block w-full border-0 bg-[linear-gradient(0deg,rgba(251,251,252,1)_33%,rgba(251,251,252,0)_100%)] px-[3px] pb-1 pt-5 text-center text-[13px] font-bold text-black'
                }
                onClick={() => {}}
              >
                more
              </button>
            )}
          </div>
        )}
        {props.isAccountSigner && (
          <div
            className={
              'border-brand-border-light mt-2 border-0 border-t pt-[10px] text-center leading-[1.1]'
            }
          >
            {isCancelSignaturePending ? (
              <img
                src="/loading-noggles.svg"
                alt="loading"
                className={'mx-auto max-w-[60px] p-[10px]'}
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  cancel();
                  setIsCancelSignaturePending(true);
                }}
                className={
                  'text-brand-color-red m-0 cursor-pointer border-0 bg-transparent p-0 text-[14px] font-bold'
                }
              >
                <Trans>Remove sponsorship</Trans>
              </button>
            )}
          </div>
        )}
        {isTruthy(props.isUpdateToProposal) && !props.isAccountSigner && (
          <p
            className={
              'border-brand-border-light text-brand-text-muted-500 mt-2 border-0 border-t pt-[10px] text-left text-[12px] leading-[1.1]'
            }
          >
            <span className="text-brand-color-green mr-2 inline-block">
              <FontAwesomeIcon icon={faCircleCheck} />
            </span>
            <Trans>Re-signed</Trans>
          </p>
        )}
      </div>
      {isTruthy(cancelStatusOverlay?.show) && (
        <div
          className={cn(
            'absolute left-[3px] top-[3px] z-[3] flex size-[calc(100%-6px)] flex-col justify-center border bg-white p-[10px] text-center',
            (cancelSigState.status === 'Exception' || cancelSigState.status === 'Fail') &&
              'border-brand-color-red-translucent bg-brand-surface-contrast text-brand-color-red',
            cancelSigState.status === 'Success' &&
              'border-brand-color-green bg-brand-surface-contrast text-brand-color-green',
          )}
        >
          {(cancelSigState.status === 'Exception' ||
            cancelSigState.status === 'Fail' ||
            cancelSigState.status === 'Success') && (
            <button
              type="button"
              className={
                'absolute right-[10px] top-0 z-[99] cursor-pointer border-0 bg-transparent text-[20px] text-black'
              }
              onClick={() => {
                props.handleRefetchCandidateData();
                setCancelStatusOverlay(undefined);
                if (cancelSigState.status === 'Success') {
                  props.setIsAccountSigner(false);
                }
              }}
            >
              &times;
            </button>
          )}
          <div className={'text-center text-[18px] font-bold leading-none'}>
            {cancelStatusOverlay!.title}
          </div>
          <div className={'mt-[4px] text-[14px] font-normal'}>{cancelStatusOverlay!.message}</div>
        </div>
      )}
    </li>
  );
};

export default Signature;
