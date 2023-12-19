import React, { useState } from 'react';
import { Trans } from '@lingui/macro';
import {
  ProposalActionCreationStep,
  ProposalActionModalStepProps,
  ProposalActionType,
} from '../..';
import BrandDropdown from '../../../BrandDropdown';
import ModalSubTitle from '../../../ModalSubtitle';
import ModalBottomButtonRow from '../../../ModalBottomButtonRow';
import ModalTitle from '../../../ModalTitle';

const proposalActionTypeToProposalActionCreationStep = (actionTypeString: string) => {
  if (actionTypeString === ProposalActionType.LUMP_SUM.toString()) {
    return ProposalActionCreationStep.LUMP_SUM_DETAILS;
  } else if (actionTypeString === ProposalActionType.STREAM.toString()) {
    return ProposalActionCreationStep.STREAM_PAYMENT_PAYMENT_DETAILS;
  } else {
    return ProposalActionCreationStep.FUNCTION_CALL_SELECT_FUNCTION;
  }
};

const SelectProposalActionStep: React.FC<ProposalActionModalStepProps> = props => {
  const { onPrevBtnClick, onNextBtnClick, state, setState } = props;

  const [nextStep, setNextStep] = useState<ProposalActionCreationStep>(
    proposalActionTypeToProposalActionCreationStep(state.actionType?.toString() ?? ''),
  );

  return (
    <div>
      <ModalTitle>
        <Trans>Add Proposal Action</Trans>
      </ModalTitle>

      <ModalSubTitle>
        <Trans>
          <hr />
          <b>Guidelines</b>
          <hr />• At this time only "Transfer Funds" is supported.
          <hr />
          <b>Supported Action Types</b>
          <hr />
          <b>• Transfer Funds: </b>ETH.
        </Trans>
      </ModalSubTitle>

      <BrandDropdown
        value={state.actionType.toString()}
        onChange={e => {
          const actionType = Object.entries(ProposalActionType).find(entry => {
            return entry[1] === e.target.value;
          });

          setState(x => ({
            ...x,
            actionType: actionType ? actionType[1] : ProposalActionType.LUMP_SUM,
          }));

          setNextStep(proposalActionTypeToProposalActionCreationStep(e.target.value));
        }}
      >
        <option value={'Transfer Funds'}>Transfer Funds</option>
        <option value={'Stream Funds'} disabled>Stream Funds</option>
        <option value={'Function Call'} disabled>Function Call</option>
      </BrandDropdown>

      <ModalBottomButtonRow
        prevBtnText={<Trans>Close</Trans>}
        onPrevBtnClick={onPrevBtnClick}
        nextBtnText={<Trans>Add Action Details</Trans>}
        onNextBtnClick={() => {
          onNextBtnClick(nextStep);
        }}
      />
    </div>
  );
};

export default SelectProposalActionStep;
