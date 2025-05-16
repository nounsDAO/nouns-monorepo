import type { Address } from '@/utils/types';

import { encodeFunctionData, parseEther } from 'viem';
import { useChainId } from 'wagmi';

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
  const chainId = useChainId();

  if (!predictedAddress) {
    return [];
  }

  const fundStreamFunction = 'createStream';
  const isUSDC = state.TransferFundsCurrency === SupportedCurrency.USDC;
  const amount = state.amount ?? '0';

  const actions: Action[] = [
    {
      address: nounsStreamFactoryAddress[chainId],
      signature: fundStreamFunction,
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
      calldata: encodeFunctionData({
        abi: nounsStreamFactoryAbi,
        functionName: fundStreamFunction,
        args: [
          state.address,
          formatTokenAmount(Number(amount), state.TransferFundsCurrency),
          getTokenAddressForCurrency(state.TransferFundsCurrency),
          BigInt(state.streamStartTimestamp ? state.streamStartTimestamp : 0),
          BigInt(state.streamEndTimestamp ? state.streamEndTimestamp : 0),
          0,
          predictedAddress,
        ],
      }),
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
    const wethTransfer = 'transfer';
    actions.push({
      address: wethAddress[chainId],
      signature: wethTransfer,
      usdcValue: 0,
      value: '0',
      decodedCalldata: JSON.stringify([
        predictedAddress,
        parseEther((amount ?? 0).toString()).toString(),
      ]),
      calldata: encodeFunctionData({
        abi: wethAbi,
        functionName: wethTransfer,
        args: [predictedAddress, parseEther(amount.toString())],
      }),
    });
  } else {
    const signature = 'sendOrRegisterDebt';
    actions.push({
      address: nounsPayerAddress[chainId],
      value: '0',
      usdcValue: Number(human2ContractUSDCFormat(amount)),
      signature: signature,
      decodedCalldata: JSON.stringify([predictedAddress, human2ContractUSDCFormat(amount)]),
      calldata: encodeFunctionData({
        abi: nounsPayerAbi,
        functionName: signature,
        args: [predictedAddress, BigInt(human2ContractUSDCFormat(amount))],
      }),
    });
  }

  return actions;
}
