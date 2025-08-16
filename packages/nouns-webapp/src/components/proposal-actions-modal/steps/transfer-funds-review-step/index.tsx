import React from 'react';

import { Trans } from '@lingui/react/macro';
import { encodeFunctionData, parseAbi, parseEther } from 'viem';

import ModalBottomButtonRow from '@/components/modal-bottom-button-row';
import ModalTitle from '@/components/modal-title';
import ShortAddress from '@/components/short-address';
import { nounsPayerAbi, stEthAddress, nounsPayerAddress } from '@/contracts';
import { Address, Hex } from '@/utils/types';
import { defaultChain } from '@/wagmi';

import { FinalProposalActionStepProps, ProposalActionModalState } from '../..';
import { SupportedCurrency } from '../transfer-funds-details-step';

import classes from './transfer-funds-review-step.module.css';

type ProposalAction = {
  address: Address;
  value: bigint;
  signature: string;
  calldata: Hex;
  usdcValue?: number;
  decodedCalldata?: string;
};

const handleActionAdd = (
  state: ProposalActionModalState,
  onActionAdd: (action: ProposalAction) => void,
) => {
  const chainId = defaultChain.id;
  if (state.TransferFundsCurrency === SupportedCurrency.ETH) {
    onActionAdd({
      address: state.address,
      value: BigInt(state.amount ? parseEther(state.amount.toString()).toString() : '0'),
      signature: '',
      calldata: '0x' as Hex,
    });
  } else if (state.TransferFundsCurrency === SupportedCurrency.STETH) {
    const value = parseEther((state.amount ?? 0).toString()).toString();
    const args = [state.address, BigInt(value)] as const;

    // Define the transfer function ABI
    const transferAbi = parseAbi(['function transfer(address to, uint256 value) returns (bool)']);

    const calldata = encodeFunctionData({
      abi: transferAbi,
      functionName: 'transfer',
      args,
    });

    onActionAdd({
      address: stEthAddress[chainId],
      value: 0n,
      signature: 'transfer(address,uint256)',
      decodedCalldata: JSON.stringify(args),
      calldata,
    });
  } else if (state.TransferFundsCurrency === SupportedCurrency.USDC) {
    // Convert USDC amount - USDC has 6 decimals
    const usdcAmount = Math.round(parseFloat(state.amount ?? '0') * 1_000_000).toString();
    const calldata = encodeFunctionData({
      abi: nounsPayerAbi,
      functionName: 'sendOrRegisterDebt',
      args: [state.address, BigInt(usdcAmount)],
    });

    onActionAdd({
      address: nounsPayerAddress[chainId],
      value: 0n,
      usdcValue: Math.round(parseFloat(state.amount ?? '0') * 1_000_000),
      signature: 'sendOrRegisterDebt(address,uint256)',
      decodedCalldata: JSON.stringify([state.address, usdcAmount]),
      calldata,
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
