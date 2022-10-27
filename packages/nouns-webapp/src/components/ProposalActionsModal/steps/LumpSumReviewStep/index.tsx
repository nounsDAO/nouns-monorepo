import { Trans } from '@lingui/macro';
import { utils } from 'ethers';
import React from 'react';
import { FinalProposalActionStepProps, ProposalActionModalState } from '../..';
import ShortAddress from '../../../ShortAddress';
import { SupportedCurrency } from '../LumpSumDetailsStep';
import classes from './LumpSumReviewStep.module.css';
import payerABI from '../../../../utils/payerContractUtils/payerABI.json';
import ModalBottomButtonRow from '../../../ModalBottomButtonRow';
import ModalTitle from '../../../ModalTitle';
import config from '../../../../config';

const handleActionAdd = (state: ProposalActionModalState, onActionAdd: (e?: any) => void) => {
  if (state.lumpSumCurrency === SupportedCurrency.ETH) {
    onActionAdd({
      address: state.address,
      value: state.amount ? utils.parseEther(state.amount.toString()).toString() : '0',
      signature: undefined,
      calldata: '0x',
    });
  } else if (state.lumpSumCurrency === SupportedCurrency.USDC) {
    const signature = 'sendOrRegisterDebt(address,uint256)';
    const abi = new utils.Interface(payerABI);
    onActionAdd({
      address: config.addresses.payerContract,
      value: '0',
      signature,
      calldata: abi?._encodeParams(abi?.functions[signature]?.inputs, [
        state.address,
        state.amount,
      ]),
    });
  } else {
    // This should never happen
    alert('Unsupported currency selected');
  }
};

const LumpSumReviewStep: React.FC<FinalProposalActionStepProps> = props => {
  const { onNextBtnClick, onPrevBtnClick, state, onDismiss } = props;

  return (
    <div>
      <ModalTitle>
        <Trans>Review Lump Sum Action</Trans>
      </ModalTitle>

      <span className={classes.label}>Pay</span>
      <div className={classes.text}>
        {state.amount} {state.lumpSumCurrency}
      </div>
      <span className={classes.label}>To</span>
      <div className={classes.text}>
        <ShortAddress address={state.address} />
      </div>

      <ModalBottomButtonRow
        prevBtnText={<Trans>Back</Trans>}
        onPrevBtnClick={onPrevBtnClick}
        nextBtnText={<Trans>Add Lump Sum Action</Trans>}
        onNextBtnClick={() => {
          handleActionAdd(state, onNextBtnClick);
          onDismiss();
        }}
      />
    </div>
  );
};

export default LumpSumReviewStep;
