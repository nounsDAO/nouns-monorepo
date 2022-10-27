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
          Nouns supports two transaction types: Lump sum and function call. Lump sum transaction
          send a fixed amount of ETH or USDC to a given wallet. Function call transaction call a
          function on a provided contract.
        </Trans>
      </ModalSubTitle>

      <BrandDropdown
        value={state.actionType === ProposalActionType.LUMP_SUM ? 'Lump sum' : 'Function call'}
        onChange={e => {
          setState(x => ({
            ...x,
            actionType:
              e.target.value === 'Lump sum'
                ? ProposalActionType.LUMP_SUM
                : ProposalActionType.FUNCTION_CALL,
          }));

          if (e.target.value === 'Lump sum') {
            setNextStep(ProposalActionCreationStep.LUMP_SUM_DETAILS);
          } else {
            setNextStep(ProposalActionCreationStep.FUNCTION_CALL_SELECT_FUNCTION);
          }
        }}
      >
        <option value={'Lump sum'}>Lump sum</option>
        <option value={'Function call'}>Function call</option>
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
