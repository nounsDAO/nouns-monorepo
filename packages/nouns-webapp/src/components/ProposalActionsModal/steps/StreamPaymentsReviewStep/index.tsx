import { Trans } from '@lingui/macro';
import React from 'react';
import { FinalProposalActionStepProps } from '../..';
import ModalBottomButtonRow from '../../../ModalBottomButtonRow';
import ModalTitle from '../../../ModalTitle';
import config from '../../../../config';
import {
  formatTokenAmount,
  getTokenAddressForCurrency,
  usePredictStreamAddress,
} from '../../../../utils/streamingPaymentUtils/streamingPaymentUtils';
import { unixToDateString } from '../../../../utils/timeUtils';
import ModalLabel from '../../../ModalLabel';
import ModalTextPrimary from '../../../ModalTextPrimary';
import useStreamPaymentTransactions from '../../../../hooks/useStreamPaymentTransactions';
import ShortAddress from '../../../ShortAddress';
import ReactTooltip from 'react-tooltip';
import classes from './StreamPaymentsReviewStep.module.css';

const StreamPaymentsReviewStep: React.FC<FinalProposalActionStepProps> = props => {
  const { onNextBtnClick, onPrevBtnClick, state, onDismiss } = props;

  const predictedAddress = usePredictStreamAddress({
    msgSender: config.addresses.nounsDaoExecutorProxy,
    payer: config.addresses.nounsDaoExecutorProxy,
    recipient: state.address,
    tokenAmount: formatTokenAmount(state.amount, state.TransferFundsCurrency),
    tokenAddress: getTokenAddressForCurrency(state.TransferFundsCurrency),
    startTime: state.streamStartTimestamp,
    endTime: state.streamEndTimestamp,
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
        getContent={dataTip => {
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
          onNextBtnClick(actionTransactions);
          onDismiss();
        }}
      />
    </>
  );
};

export default StreamPaymentsReviewStep;
