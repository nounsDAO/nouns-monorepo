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

const SelectProposalActionStep: React.FC<ProposalActionModalStepProps> = props => {
  const { onPrevBtnClick, onNextBtnClick, state, setState } = props;
  const [nextStep, setNextStep] = useState<ProposalActionCreationStep>(
    state.actionType === ProposalActionType.FUNCTION_CALL
      ? ProposalActionCreationStep.FUNCTION_CALL_SELECT_FUNCTION
      : ProposalActionCreationStep.LUMP_SUM_DETAILS,
  );

  return (
    <div>
      <ModalTitle>
        <Trans>Add Proposal Action</Trans>
      </ModalTitle>

      <ModalSubTitle>
        <Trans>
          <b>Supported Action Types:</b>
          <hr />
          <b>• Transfer Funds: </b>Send a fixed amount of ETH or USDC.
          <br />
          <b>• Function Call: </b>Call a contract function.
        </Trans>
      </ModalSubTitle>

      <BrandDropdown
        value={
          state.actionType === ProposalActionType.LUMP_SUM ? 'Transfer Funds' : 'Function Call'
        }
        onChange={e => {
          setState(x => ({
            ...x,
            actionType:
              e.target.value === 'Transfer Funds'
                ? ProposalActionType.LUMP_SUM
                : ProposalActionType.FUNCTION_CALL,
          }));

          if (e.target.value === 'Transfer Funds') {
            setNextStep(ProposalActionCreationStep.LUMP_SUM_DETAILS);
          } else {
            setNextStep(ProposalActionCreationStep.FUNCTION_CALL_SELECT_FUNCTION);
          }
        }}
      >
        <option value={'Transfer Funds'}>Transfer Funds</option>
        <option value={'Function Call'}>Function Call</option>
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
