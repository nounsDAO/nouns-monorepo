/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import type { Abi } from 'viem';

import React, { SetStateAction, useState } from 'react';

import { decodeAbiParameters, formatEther, formatUnits } from 'viem';

import { nounsPayerAddress, nounsTokenBuyerAddress, stEthAddress } from '@/contracts';
import { Address } from '@/utils/types';
import { defaultChain } from '@/wagmi';
import { ProposalTransaction } from '@/wrappers/nounsDao';

import SolidColorBackgroundModal from '../SolidColorBackgroundModal';

import FunctionCallEnterArgsStep from './steps/FunctionCallEnterArgsStep';
import FunctionCallReviewStep from './steps/FunctionCallReviewStep';
import FunctionCallSelectFunctionStep from './steps/FunctionCallSelectFunctionStep';
import SelectProposalActionStep from './steps/SelectProposalActionStep';
import StreamPaymentDateDetailsStep from './steps/StreamPaymentsDateDetailsStep';
import StreamPaymentsPaymentDetailsStep from './steps/StreamPaymentsPaymentDetailsStep';
import StreamPaymentsReviewStep from './steps/StreamPaymentsReviewStep';
import TransferFundsDetailsStep, { SupportedCurrency } from './steps/TransferFundsDetailsStep';
import TransferFundsReviewStep from './steps/TransferFundsReviewStep';

export enum ProposalActionCreationStep {
  SELECT_ACTION_TYPE,
  LUMP_SUM_DETAILS,
  LUMP_SUM_REVIEW,
  FUNCTION_CALL_SELECT_FUNCTION,
  FUNCTION_CALL_ADD_ARGUMENTS,
  FUNCTION_CALL_REVIEW,
  STREAM_PAYMENT_PAYMENT_DETAILS,
  STREAM_PAYMENT_DATE_DETAILS,
  STREAM_PAYMENT_REVIEW,
}

export enum ProposalActionType {
  LUMP_SUM = 'Transfer Funds',
  STREAM = 'Stream Funds',
  FUNCTION_CALL = 'Function Call',
}

export interface ProposalActionModalState {
  actionType: ProposalActionType;
  address: Address;
  amount?: string;
  TransferFundsCurrency?: SupportedCurrency;
  streamStartTimestamp?: number;
  streamEndTimestamp?: number;
  function?: string;
  abi?: Abi;
  args?: string[];
  isTokenBuyerTopUp?: boolean;
  isTransferRecipientLocked?: boolean;
  isTransferCurrencyLocked?: boolean;
}
export interface ProposalActionModalStepProps {
  onPrevBtnClick: (e?: React.MouseEvent | ProposalActionCreationStep) => void;
  onNextBtnClick: (e?: React.MouseEvent | ProposalActionCreationStep | ProposalTransaction) => void;
  state: ProposalActionModalState;
  setState: (e: SetStateAction<ProposalActionModalState>) => void;
}

export interface FinalProposalActionStepProps extends ProposalActionModalStepProps {
  onDismiss: () => void;
}

export interface ProposalActionModalProps {
  onActionAdd: (transaction: ProposalTransaction | ProposalTransaction[]) => void;
  show: boolean;
  onDismiss: () => void;
  initialState?: ProposalActionModalState;
  isEditing?: boolean;
}

export const getProposalActionModalStateFromTransaction = (
  transaction: ProposalTransaction,
): ProposalActionModalState => {
  if (transaction.proposalActionState) {
    return transaction.proposalActionState as ProposalActionModalState;
  }

  const chainId = defaultChain.id;
  const transactionAddress = transaction.address.toLowerCase();
  const amount = transaction.value ? formatEther(BigInt(transaction.value)) : '';

  if (transaction.signature === '' && transaction.calldata === '0x') {
    const isTokenBuyerTopUp = transactionAddress === nounsTokenBuyerAddress[chainId].toLowerCase();

    return {
      actionType: ProposalActionType.LUMP_SUM,
      address: transaction.address,
      amount,
      TransferFundsCurrency: SupportedCurrency.ETH,
      isTokenBuyerTopUp,
      isTransferRecipientLocked: isTokenBuyerTopUp,
      isTransferCurrencyLocked: isTokenBuyerTopUp,
    };
  }

  if (
    transactionAddress === nounsPayerAddress[chainId].toLowerCase() &&
    transaction.signature === 'sendOrRegisterDebt(address,uint256)'
  ) {
    const [recipient, usdcAmount] = decodeAbiParameters(
      [{ type: 'address' }, { type: 'uint256' }],
      transaction.calldata,
    );

    return {
      actionType: ProposalActionType.LUMP_SUM,
      address: recipient,
      amount: formatUnits(usdcAmount, 6),
      TransferFundsCurrency: SupportedCurrency.USDC,
    };
  }

  if (
    transactionAddress === stEthAddress[chainId].toLowerCase() &&
    transaction.signature === 'transfer(address,uint256)'
  ) {
    const [recipient, stEthAmount] = decodeAbiParameters(
      [{ type: 'address' }, { type: 'uint256' }],
      transaction.calldata,
    );

    return {
      actionType: ProposalActionType.LUMP_SUM,
      address: recipient,
      amount: formatEther(stEthAmount),
      TransferFundsCurrency: SupportedCurrency.STETH,
    };
  }

  return {
    actionType: ProposalActionType.FUNCTION_CALL,
    address: transaction.address,
    amount,
    function: transaction.signature ? transaction.signature.split('(')[0] : undefined,
    args: transaction.decodedCalldata ? JSON.parse(transaction.decodedCalldata) : undefined,
  };
};

const getInitialStep = (state: ProposalActionModalState) => {
  switch (state.actionType) {
    case ProposalActionType.LUMP_SUM:
      return ProposalActionCreationStep.LUMP_SUM_DETAILS;
    case ProposalActionType.STREAM:
      return ProposalActionCreationStep.STREAM_PAYMENT_PAYMENT_DETAILS;
    case ProposalActionType.FUNCTION_CALL:
      return ProposalActionCreationStep.FUNCTION_CALL_SELECT_FUNCTION;
    default:
      return ProposalActionCreationStep.SELECT_ACTION_TYPE;
  }
};

const ModalContent: React.FC<{
  onActionAdd: (transaction: ProposalTransaction | ProposalTransaction[]) => void;
  onDismiss: () => void;
  initialState?: ProposalActionModalState;
}> = props => {
  const { onActionAdd, onDismiss, initialState } = props;

  const [step, setStep] = useState<ProposalActionCreationStep>(
    initialState ? getInitialStep(initialState) : ProposalActionCreationStep.SELECT_ACTION_TYPE,
  );

  const [state, setState] = useState<ProposalActionModalState>({
    actionType: ProposalActionType.LUMP_SUM,
    address: '0x',
    ...initialState,
  });

  const handleActionAdd = (transaction: ProposalTransaction | ProposalTransaction[]) => {
    if (Array.isArray(transaction)) {
      onActionAdd(transaction.map(txn => ({ ...txn, proposalActionState: state })));
      return;
    }

    onActionAdd({ ...transaction, proposalActionState: state });
  };

  switch (step) {
    case ProposalActionCreationStep.SELECT_ACTION_TYPE:
      return (
        <SelectProposalActionStep
          onNextBtnClick={(
            e?: React.MouseEvent | ProposalActionCreationStep | ProposalTransaction,
          ) => {
            if (e && typeof e !== 'object') {
              setStep(e);
            }
          }}
          onPrevBtnClick={onDismiss}
          state={state}
          setState={setState}
        />
      );
    case ProposalActionCreationStep.LUMP_SUM_DETAILS:
      return (
        <TransferFundsDetailsStep
          onNextBtnClick={() => setStep(ProposalActionCreationStep.LUMP_SUM_REVIEW)}
          onPrevBtnClick={() => setStep(ProposalActionCreationStep.SELECT_ACTION_TYPE)}
          state={state}
          setState={setState}
        />
      );
    case ProposalActionCreationStep.LUMP_SUM_REVIEW:
      return (
        <TransferFundsReviewStep
          onNextBtnClick={e => {
            if (e && typeof e !== 'object') {
              return;
            }
            if (e && 'target' in e) {
              return;
            }
            handleActionAdd(e as ProposalTransaction);
          }}
          onPrevBtnClick={() => setStep(ProposalActionCreationStep.LUMP_SUM_DETAILS)}
          state={state}
          setState={setState}
          onDismiss={onDismiss}
        />
      );
    case ProposalActionCreationStep.FUNCTION_CALL_SELECT_FUNCTION:
      return (
        <FunctionCallSelectFunctionStep
          onNextBtnClick={() => setStep(ProposalActionCreationStep.FUNCTION_CALL_ADD_ARGUMENTS)}
          onPrevBtnClick={() => setStep(ProposalActionCreationStep.SELECT_ACTION_TYPE)}
          state={state}
          setState={setState}
        />
      );
    case ProposalActionCreationStep.FUNCTION_CALL_ADD_ARGUMENTS:
      return (
        <FunctionCallEnterArgsStep
          onNextBtnClick={() => setStep(ProposalActionCreationStep.FUNCTION_CALL_REVIEW)}
          onPrevBtnClick={() => setStep(ProposalActionCreationStep.FUNCTION_CALL_SELECT_FUNCTION)}
          state={state}
          setState={setState}
        />
      );
    case ProposalActionCreationStep.FUNCTION_CALL_REVIEW:
      return (
        <FunctionCallReviewStep
          onNextBtnClick={e => {
            if (e && typeof e !== 'object') {
              return;
            }
            if (e && 'target' in e) {
              return;
            }
            handleActionAdd(e as ProposalTransaction);
          }}
          onPrevBtnClick={() => setStep(ProposalActionCreationStep.FUNCTION_CALL_ADD_ARGUMENTS)}
          state={state}
          setState={setState}
          onDismiss={onDismiss}
        />
      );
    case ProposalActionCreationStep.STREAM_PAYMENT_PAYMENT_DETAILS:
      return (
        <StreamPaymentsPaymentDetailsStep
          onNextBtnClick={() => setStep(ProposalActionCreationStep.STREAM_PAYMENT_DATE_DETAILS)}
          onPrevBtnClick={() => setStep(ProposalActionCreationStep.SELECT_ACTION_TYPE)}
          state={state}
          setState={setState}
        />
      );
    case ProposalActionCreationStep.STREAM_PAYMENT_DATE_DETAILS:
      return (
        <StreamPaymentDateDetailsStep
          onNextBtnClick={() => setStep(ProposalActionCreationStep.STREAM_PAYMENT_REVIEW)}
          onPrevBtnClick={() => setStep(ProposalActionCreationStep.STREAM_PAYMENT_PAYMENT_DETAILS)}
          state={state}
          setState={setState}
        />
      );
    case ProposalActionCreationStep.STREAM_PAYMENT_REVIEW:
      return (
        <StreamPaymentsReviewStep
          onNextBtnClick={e => {
            if (e && typeof e !== 'object') {
              return;
            }
            if (e && 'target' in e) {
              return;
            }
            handleActionAdd(e as ProposalTransaction);
          }}
          onPrevBtnClick={() => setStep(ProposalActionCreationStep.STREAM_PAYMENT_DATE_DETAILS)}
          state={state}
          setState={setState}
          onDismiss={onDismiss}
        />
      );
    default:
      return (
        <SelectProposalActionStep
          onNextBtnClick={() => console.log('')}
          onPrevBtnClick={() => console.log('')}
          state={state}
          setState={setState}
        />
      );
  }
};

const ProposalActionModal: React.FC<ProposalActionModalProps> = props => {
  const { onActionAdd, show, onDismiss, initialState, isEditing } = props;
  const modalKey = `${isEditing ? 'edit' : 'add'}-${initialState?.actionType ?? 'select'}-${
    initialState?.address ?? ''
  }-${initialState?.amount ?? ''}-${initialState?.function ?? ''}`;

  return (
    <SolidColorBackgroundModal
      show={show}
      onDismiss={onDismiss}
      content={
        <ModalContent
          key={modalKey}
          onActionAdd={onActionAdd}
          onDismiss={onDismiss}
          initialState={initialState}
        />
      }
    />
  );
};

export default ProposalActionModal;
