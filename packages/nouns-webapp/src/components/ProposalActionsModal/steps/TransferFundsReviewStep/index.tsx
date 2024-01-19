import { Trans } from '@lingui/macro';
import { utils } from 'ethers';
import React from 'react';
import { FinalProposalActionStepProps, ProposalActionModalState } from '../..';
import ShortAddress from '../../../ShortAddress';
import { SupportedCurrency } from '../TransferFundsDetailsStep';
import classes from './TransferFundsReviewStep.module.css';
import payerABI from '../../../../utils/payerContractUtils/payerABI.json';
import ModalBottomButtonRow from '../../../ModalBottomButtonRow';
import ModalTitle from '../../../ModalTitle';
import config from '../../../../config';

const handleActionAdd = (state: ProposalActionModalState, onActionAdd: (e?: any) => void) => {
  if (state.TransferFundsCurrency === SupportedCurrency.ETH) {
    onActionAdd({
      address: state.address,
      value: state.amount ? utils.parseEther(state.amount.toString()).toString() : '0',
      signature: '',
      calldata: '0x',
    });
  } else if (state.TransferFundsCurrency === SupportedCurrency.STETH) {
    const values = [state.address, utils.parseEther((state.amount ?? 0).toString()).toString()];
    onActionAdd({
      address: config.addresses.steth,
      value: '0',
      signature: 'transfer(address,uint256)',
      decodedCalldata: JSON.stringify(values),
      calldata: utils.defaultAbiCoder.encode(['address', 'uint256'], values),
    });
  } else if (state.TransferFundsCurrency === SupportedCurrency.USDC) {
    const signature = 'sendOrRegisterDebt(address,uint256)';
    const abi = new utils.Interface(payerABI);

    onActionAdd({
      address: config.addresses.payerContract,
      value: '0',
      usdcValue: Math.round(parseFloat(state.amount ?? '0') * 1_000_000),
      signature,
      decodedCalldata: JSON.stringify([
        state.address,
        // USDC has 6 decimals so we convert from human readable format to contract input format here
        Math.round(parseFloat(state.amount ?? '0') * 1_000_000).toString(),
      ]),
      calldata: abi?._encodeParams(abi?.functions[signature]?.inputs, [
        state.address,
        // USDC has 6 decimals so we convert from human readable format to contract input format here
        Math.round(parseFloat(state.amount ?? '0') * 1_000_000).toString(),
      ]),
    });
  } else {
    // This should never happen
    alert('Unsupported currency selected');
  }
};

const TransferFundsReviewStep: React.FC<FinalProposalActionStepProps> = props => {
  const { onNextBtnClick, onPrevBtnClick, state, onDismiss } = props;

  return (
    <div>
      <ModalTitle>
        <Trans>Review Transfer Funds Action</Trans>
      </ModalTitle>

      <span className={classes.label}>Pay</span>
      <div className={classes.text}>
        {Intl.NumberFormat(undefined, { maximumFractionDigits: 18 }).format(Number(state.amount))}{' '}
        {state.TransferFundsCurrency}
      </div>
      <span className={classes.label}>To</span>
      <div className={classes.text}>
        <ShortAddress address={state.address} />
      </div>

      <ModalBottomButtonRow
        prevBtnText={<Trans>Back</Trans>}
        onPrevBtnClick={onPrevBtnClick}
        nextBtnText={<Trans>Add Transfer Funds Action</Trans>}
        onNextBtnClick={() => {
          handleActionAdd(state, onNextBtnClick);
          onDismiss();
        }}
      />
    </div>
  );
};

export default TransferFundsReviewStep;
