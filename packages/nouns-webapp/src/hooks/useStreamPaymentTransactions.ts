import type { Address } from '@/utils/types';

import { encodeAbiParameters, getAbiItem, parseEther, toFunctionSignature } from 'viem';

import { ProposalActionModalState } from '@/components/ProposalActionsModal';
import { SupportedCurrency } from '@/components/ProposalActionsModal/steps/TransferFundsDetailsStep';
import {
  nounsPayerAbi,
  nounsPayerAddress,
  nounsStreamFactoryAbi,
  nounsStreamFactoryAddress,
  usdcAddress,
  wethAbi,
  wethAddress,
} from '@/contracts';
import {
  formatTokenAmount,
  getTokenAddressForCurrency,
} from '@/utils/streamingPaymentUtils/streamingPaymentUtils';
import { human2ContractUSDCFormat } from '@/utils/usdcUtils';
import { defaultChain } from '@/wagmi';

interface UseStreamPaymentTransactionsProps {
  state: ProposalActionModalState;
  predictedAddress?: Address;
}

interface Action {
  address: Address;
  calldata: `0x${string}`;
  decodedCalldata: string;
  signature: string;
  usdcValue: number;
  value: string;
}

export default function useStreamPaymentTransactions({
  state,
  predictedAddress,
}: UseStreamPaymentTransactionsProps) {
  const chainId = defaultChain.id;

  if (!predictedAddress) {
    return [];
  }

  const amount = state.amount ?? '0';
  const args = [
    state.address,
    formatTokenAmount(Number(amount), state.TransferFundsCurrency),
    getTokenAddressForCurrency(state.TransferFundsCurrency),
    BigInt(state.streamStartTimestamp !== undefined ? state.streamStartTimestamp : 0),
    BigInt(state.streamEndTimestamp !== undefined ? state.streamEndTimestamp : 0),
    0,
    predictedAddress,
  ] as const;
  const createStreamFunction = getAbiItem({
    abi: nounsStreamFactoryAbi,
    name: 'createStream',
    args, //provided to disambiguate the function overloads
  });
  const isUSDC = state.TransferFundsCurrency === SupportedCurrency.USDC;

  const actions: Action[] = [
    {
      address: nounsStreamFactoryAddress[chainId],
      signature: toFunctionSignature(createStreamFunction),
      value: '0',
      usdcValue: isUSDC ? Number(human2ContractUSDCFormat(amount)) : 0,
      decodedCalldata: JSON.stringify([
        state.address,
        isUSDC ? human2ContractUSDCFormat(amount) : parseEther(amount.toString()).toString(),
        isUSDC ? usdcAddress[chainId] : wethAddress[chainId],
        state.streamStartTimestamp,
        state.streamEndTimestamp,
        0,
        predictedAddress,
      ]),
      calldata: encodeAbiParameters(createStreamFunction.inputs, args),
    },
  ];

  if (!isUSDC) {
    actions.push({
      address: wethAddress[chainId],
      signature: 'deposit()',
      usdcValue: 0,
      value: amount ? parseEther(amount.toString()).toString() : '0',
      decodedCalldata: JSON.stringify([]),
      calldata: '0x',
    });
    const wethTransferFunction = getAbiItem({ abi: wethAbi, name: 'transfer' });
    actions.push({
      address: wethAddress[chainId],
      signature: toFunctionSignature(wethTransferFunction),
      usdcValue: 0,
      value: '0',
      decodedCalldata: JSON.stringify([
        predictedAddress,
        parseEther((amount ?? 0).toString()).toString(),
      ]),
      calldata: encodeAbiParameters(wethTransferFunction.inputs, [
        predictedAddress,
        parseEther(amount.toString()),
      ]),
    });
  } else {
    const sendOrRegisterDebtFunction = getAbiItem({
      abi: nounsPayerAbi,
      name: 'sendOrRegisterDebt',
    });
    actions.push({
      address: nounsPayerAddress[chainId],
      value: '0',
      usdcValue: Number(human2ContractUSDCFormat(amount)),
      signature: toFunctionSignature(sendOrRegisterDebtFunction),
      decodedCalldata: JSON.stringify([predictedAddress, human2ContractUSDCFormat(amount)]),
      calldata: encodeAbiParameters(sendOrRegisterDebtFunction.inputs, [
        predictedAddress,
        BigInt(human2ContractUSDCFormat(amount)),
      ]),
    });
  }

  return actions;
}
