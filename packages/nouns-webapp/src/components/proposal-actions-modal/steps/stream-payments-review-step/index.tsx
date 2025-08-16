import type { FinalProposalActionStepProps } from '@/components/proposal-actions-modal';
import type { ProposalTransaction } from '@/wrappers/nouns-dao';

import React from 'react';

import { Trans } from '@lingui/react/macro';
import ReactTooltip from 'react-tooltip';

import ModalBottomButtonRow from '@/components/modal-bottom-button-row';
import ModalLabel from '@/components/modal-label';
import ModalTextPrimary from '@/components/modal-text-primary';
import ModalTitle from '@/components/modal-title';
import ShortAddress from '@/components/short-address';
import { nounsGovernorAddress } from '@/contracts';
import useStreamPaymentTransactions from '@/hooks/use-stream-payment-transactions';
import {
  formatTokenAmount,
  getTokenAddressForCurrency,
  usePredictStreamAddress,
} from '@/utils/streaming-payment-utils/streaming-payment-utils';
import { unixToDateString } from '@/utils/timeUtils';
import { defaultChain } from '@/wagmi';

import classes from './stream-payments-review-step.module.css';

const StreamPaymentsReviewStep: React.FC<FinalProposalActionStepProps> = props => {
  const { onNextBtnClick, onPrevBtnClick, state, onDismiss } = props;

  const chainId = defaultChain.id;

  const predictedAddress = usePredictStreamAddress({
    msgSender: nounsGovernorAddress[chainId],
    payer: nounsGovernorAddress[chainId],
    recipient: state.address,
    tokenAmount: formatTokenAmount(Number(state.amount), state.TransferFundsCurrency),
    tokenAddress: getTokenAddressForCurrency(state.TransferFundsCurrency),
    startTime: BigInt(state.streamStartTimestamp ?? 0),
    endTime: BigInt(state.streamEndTimestamp ?? 0),
  });

  const actionTransactions = useStreamPaymentTransactions({
    state,
    predictedAddress,
  });

  return (
    <>
      <ReactTooltip
        id={'address-tooltip'}
        effect={'solid'}
        className={classes.hover}
        getContent={() => {
          return state.address;
        }}
      />
      <ModalTitle>
        <Trans>Review Streaming Payment Action</Trans>
      </ModalTitle>

      <ModalLabel>
        <Trans>Stream</Trans>
      </ModalLabel>

      <ModalTextPrimary>
        {Intl.NumberFormat(undefined, { maximumFractionDigits: 18 }).format(Number(state.amount))}{' '}
        {state.TransferFundsCurrency}
      </ModalTextPrimary>

      <ModalLabel>
        <Trans>To</Trans>
      </ModalLabel>
      <ModalTextPrimary>
        <span data-for="address-tooltip" data-tip="address">
          <ShortAddress address={state.address} />
        </span>
      </ModalTextPrimary>

      <ModalLabel>
        <Trans>Starting on</Trans>
      </ModalLabel>
      <ModalTextPrimary>{unixToDateString(state.streamStartTimestamp)}</ModalTextPrimary>

      <ModalLabel>
        <Trans>Ending on</Trans>
      </ModalLabel>

      <ModalTextPrimary>{unixToDateString(state.streamEndTimestamp)}</ModalTextPrimary>

      <ModalBottomButtonRow
        prevBtnText={<Trans>Back</Trans>}
        onPrevBtnClick={onPrevBtnClick}
        nextBtnText={<Trans>Add Streaming Payment Action</Trans>}
        onNextBtnClick={() => {
          onNextBtnClick(actionTransactions as unknown as ProposalTransaction);
          onDismiss();
        }}
      />
    </>
  );
};

export default StreamPaymentsReviewStep;
