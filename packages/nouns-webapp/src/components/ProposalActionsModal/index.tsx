import React, { SetStateAction, useState } from 'react';
import SolidColorBackgroundModal from '../SolidColorBackgroundModal';
import { ProposalTransaction } from '../../wrappers/nounsDao';
import SelectProposalActionStep from './steps/SelectProposalActionStep';
import TransferFundsDetailsStep, { SupportedCurrency } from './steps/TransferFundsDetailsStep';
import TransferFundsReviewStep from './steps/TransferFundsReviewStep';
import FunctionCallSelectFunctionStep from './steps/FunctionCallSelectFunctionStep';
import FunctionCallEnterArgsStep from './steps/FunctionCallEnterArgsStep';
import FunctionCallReviewStep from './steps/FunctionCallReviewStep';
import { Interface } from 'ethers/lib/utils';

export enum ProposalActionCreationStep {
  SELECT_ACTION_TYPE,
  LUMP_SUM_DETAILS,
  LUMP_SUM_REVIEW,
  FUNCTION_CALL_SELECT_FUNCTION,
  FUNCTION_CALL_ADD_ARGUMENTS,
  FUNCTION_CALL_REVIEW,
}

export enum ProposalActionType {
  LUMP_SUM,
  FUNCTION_CALL,
}

export interface ProposalActionModalState {
  actionType: ProposalActionType;
  address: string;
  amount?: string;
  TransferFundsCurrency?: SupportedCurrency;
  function?: string;
  abi?: Interface;
  args?: string[];
}
export interface ProposalActionModalStepProps {
  onPrevBtnClick: (e?: any) => void;
  onNextBtnClick: (e?: any) => void;
  state: ProposalActionModalState;
  setState: (e: SetStateAction<ProposalActionModalState>) => void;
}

export interface FinalProposalActionStepProps extends ProposalActionModalStepProps {
  onDismiss: () => void;
}

export interface ProposalActionModalProps {
  onActionAdd: (transaction: ProposalTransaction) => void;
  show: boolean;
  onDismiss: () => void;
}

const ModalContent: React.FC<{
  onActionAdd: (transaction: ProposalTransaction) => void;
  onDismiss: () => void;
}> = props => {
  const { onActionAdd, onDismiss } = props;

  const [step, setStep] = useState<ProposalActionCreationStep>(
    ProposalActionCreationStep.SELECT_ACTION_TYPE,
  );

  const [state, setState] = useState<ProposalActionModalState>({
    actionType: ProposalActionType.LUMP_SUM,
    address: '',
  });

  switch (step) {
    case ProposalActionCreationStep.SELECT_ACTION_TYPE:
      return (
        <SelectProposalActionStep
          onNextBtnClick={(s: ProposalActionCreationStep) => setStep(s)}
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
          onNextBtnClick={onActionAdd}
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
          onNextBtnClick={onActionAdd}
          onPrevBtnClick={() => setStep(ProposalActionCreationStep.FUNCTION_CALL_ADD_ARGUMENTS)}
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
  const { onActionAdd, show, onDismiss } = props;

  return (
    <SolidColorBackgroundModal
      show={show}
      onDismiss={onDismiss}
      content={<ModalContent onActionAdd={onActionAdd} onDismiss={onDismiss} />}
    />
  );
};

export default ProposalActionModal;
