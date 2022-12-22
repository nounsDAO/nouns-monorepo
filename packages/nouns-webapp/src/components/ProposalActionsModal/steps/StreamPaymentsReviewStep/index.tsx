import { Trans } from '@lingui/macro';
import { utils } from 'ethers';
import React from 'react';
import { FinalProposalActionStepProps, ProposalActionModalState } from '../..';
import ShortAddress from '../../../ShortAddress';
import classes from './StreamPaymentsReviewStep.module.css';
import ModalBottomButtonRow from '../../../ModalBottomButtonRow';
import ModalTitle from '../../../ModalTitle';
import config from '../../../../config';
import { SupportedCurrency } from '../TransferFundsDetailsStep';
import dayjs from 'dayjs';
import { usePredictStreamAddress } from '../../../../utils/streamingPaymentUtils/streamingPaymentUtils';
import StreamFactoryABI from '../../../../utils/streamingPaymentUtils/streamFactory.abi.json';
import wethABIJSON from '../../../../utils/wethUtils/weth.abi.json';
import payerABIJSON from '../../../../utils/payerContractUtils/payerABI.json';

const abi = new utils.Interface(StreamFactoryABI);
const wethABI = new utils.Interface(wethABIJSON);

const handleActionAdd = (
  state: ProposalActionModalState,
  onActionAdd: (e?: any) => void,
  predictedAddress?: string,
) => {
  const fundStreamFunction = 'createStream(address,uint256,address,uint256,uint256,address)';
  const isUSDC = state.TransferFundsCurrency === SupportedCurrency.USDC;

  // We only support WETH and USDC right now so !isUSDC => WETH

  const actions = [
    {
      address: config.addresses.nounsStreamFactory ?? '',
      signature: fundStreamFunction,
      value: '0',
      usdcValue: isUSDC ? Math.round(parseFloat(state.amount ?? '0') * 1_000_000) : 0,
      decodedCalldata: JSON.stringify([
        state.address,
        isUSDC ? Math.round(parseFloat(state.amount ?? '0') * 1_000_000).toString() : state.amount,
        isUSDC ? config.addresses.usdcToken : config.addresses.weth,
        state.streamStartTimestamp,
        state.streamEndTimestamp,
        predictedAddress,
      ]),
      calldata: abi._encodeParams(abi.functions[fundStreamFunction ?? '']?.inputs ?? [], [
        state.address,
        isUSDC ? Math.round(parseFloat(state.amount ?? '0') * 1_000_000).toString() : state.amount,
        isUSDC ? config.addresses.usdcToken : config.addresses.weth,
        state.streamStartTimestamp,
        state.streamEndTimestamp,
        predictedAddress,
      ]),
    },
  ];

  if (!isUSDC) {
    console.log('hey hey hey');
    actions.push({
      address: config.addresses.weth ?? '',
      signature: 'deposit()',
      usdcValue: 0,
      value: state.amount ? utils.parseEther(state.amount.toString()).toString() : '0',
      decodedCalldata: JSON.stringify([]),
      calldata: '0x',
    });
    const wethTransfer = 'transfer(address,uint256)';
    actions.push({
      address: config.addresses.weth ?? '',
      signature: wethTransfer,
      usdcValue: 0,
      value: state.amount ? utils.parseEther(state.amount.toString()).toString() : '0',
      decodedCalldata: JSON.stringify([
        predictedAddress,
        utils.parseEther((state.amount ?? 0).toString()).toString(),
      ]),
      calldata: wethABI._encodeParams(wethABI.functions[wethTransfer ?? '']?.inputs ?? [], [
        predictedAddress,
        state.amount ? utils.parseEther(state.amount.toString()).toString() : '0',
      ]),
    });
  } else {
    const signature = 'sendOrRegisterDebt(address,uint256)';
    const payerABI = new utils.Interface(payerABIJSON);
    actions.push({
      address: config.addresses.payerContract ?? '',
      value: '0',
      usdcValue: Math.round(parseFloat(state.amount ?? '0') * 1_000_000),
      signature: signature,
      decodedCalldata: JSON.stringify([
        // USDC has 6 decimals so we convert from human readable format to contract input format here
        predictedAddress,
        Math.round(parseFloat(state.amount ?? '0') * 1_000_000).toString(),
      ]),
      calldata: payerABI?._encodeParams(payerABI?.functions[signature]?.inputs, [
        predictedAddress,
        // USDC has 6 decimals so we convert from human readable format to contract input format here
        Math.round(parseFloat(state.amount ?? '0') * 1_000_000).toString(),
      ]),
    });
  }

  console.log('HELLO: ', actions);
  onActionAdd(actions);
};

const StreamPaymentsReviewStep: React.FC<FinalProposalActionStepProps> = props => {
  const { onNextBtnClick, onPrevBtnClick, state, onDismiss } = props;

  const predictedAddress = usePredictStreamAddress({
    msgSender: config.addresses.nounsDaoExecutor,
    payer: config.addresses.payerContract,
    recipient: state.address,
    tokenAmount: state.amount,
    tokenAddress: config.addresses.usdcToken,
    startTime: state.streamStartTimestamp,
    endTime: state.streamEndTimestamp,
  });

  return (
    <div>
      <ModalTitle>
        <Trans>Review Streaming Payment Action</Trans>
      </ModalTitle>

      <span className={classes.label}>Stream</span>
      <div className={classes.text}>
        {Intl.NumberFormat(undefined, { maximumFractionDigits: 18 }).format(Number(state.amount))}{' '}
        {state.TransferFundsCurrency}
      </div>
      <span className={classes.label}>To</span>
      <div className={classes.text}>
        <ShortAddress address={state.address} />
      </div>
      <span className={classes.label}>Starting on</span>
      <div className={classes.text}>
        {dayjs
          .unix(state.streamStartTimestamp ?? 0)
          .utc()
          .format('MMMM DD, YYYY')}
      </div>
      <span className={classes.label}>Ending on</span>
      <div className={classes.text}>
        {dayjs
          .unix(state.streamEndTimestamp ?? 0)
          .utc()
          .format('MMMM DD, YYYY')}
      </div>

      <ModalBottomButtonRow
        prevBtnText={<Trans>Back</Trans>}
        onPrevBtnClick={onPrevBtnClick}
        nextBtnText={<Trans>Add Streaming Payment Action</Trans>}
        onNextBtnClick={() => {
          handleActionAdd(state, onNextBtnClick, predictedAddress);
          onDismiss();
        }}
      />
    </div>
  );
};

export default StreamPaymentsReviewStep;
