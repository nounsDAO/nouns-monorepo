import type { FinalProposalActionStepProps } from '@/components/ProposalActionsModal';
import type { ProposalTransaction } from '@/wrappers/nounsDao';

import React from 'react';

import { Trans } from '@lingui/react/macro';
import ReactTooltip from 'react-tooltip';
import { useChainId } from 'wagmi';

import ModalBottomButtonRow from '@/components/ModalBottomButtonRow';
import ModalLabel from '@/components/ModalLabel';
import ModalTextPrimary from '@/components/ModalTextPrimary';
import ModalTitle from '@/components/ModalTitle';
import ShortAddress from '@/components/ShortAddress';
import { nounsGovernorAddress } from '@/contracts';
import useStreamPaymentTransactions from '@/hooks/useStreamPaymentTransactions';
import {
  formatTokenAmount,
  getTokenAddressForCurrency,
  usePredictStreamAddress,
} from '@/utils/streamingPaymentUtils/streamingPaymentUtils';
import { unixToDateString } from '@/utils/timeUtils';

import classes from './StreamPaymentsReviewStep.module.css';

const StreamPaymentsReviewStep: React.FC<FinalProposalActionStepProps> = props => {
  const { onNextBtnClick, onPrevBtnClick, state, onDismiss } = props;

  const chainId = useChainId();

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
