import { parseEther, zeroAddress } from 'viem';

import { SupportedCurrency } from '@/components/ProposalActionsModal/steps/TransferFundsDetailsStep';
import {
  stEthAddress,
  usdcAddress,
  useReadNounsStreamFactoryPredictStreamAddress,
  wethAddress,
} from '@/contracts';
import { Address } from '@/utils/types';

interface UsePredictStreamAddressProps {
  msgSender: Address;
  payer: Address;
  recipient: Address;
  tokenAmount: bigint;
  tokenAddress: Address;
  startTime: bigint;
  endTime: bigint;
}

export const usePredictStreamAddress = ({
  msgSender,
  payer,
  recipient,
  tokenAmount,
  tokenAddress,
  startTime,
  endTime,
}: UsePredictStreamAddressProps) => {
  const { data: predictedAddress } = useReadNounsStreamFactoryPredictStreamAddress({
    args: [msgSender, payer, recipient, tokenAmount, tokenAddress, startTime, endTime],
  });

  return predictedAddress;
};

export function formatTokenAmount(amount?: number, currency?: SupportedCurrency) {
  switch (currency) {
    case SupportedCurrency.USDC:
      return amount ? BigInt(Math.round(amount * 1_000_000)) : 0n;
    case SupportedCurrency.WETH:
    case SupportedCurrency.STETH:
      return amount ? parseEther(amount.toString()) : 0n;
    default:
      return amount ? BigInt(amount) : 0n;
  }
}

export function getTokenAddressForCurrency(currency?: SupportedCurrency, chainId = 1) {
  switch (currency) {
    case SupportedCurrency.USDC:
      return usdcAddress[chainId as keyof typeof usdcAddress] ?? zeroAddress;
    case SupportedCurrency.WETH:
      return wethAddress[chainId as keyof typeof wethAddress] ?? zeroAddress;
    case SupportedCurrency.STETH:
      return stEthAddress[chainId as keyof typeof stEthAddress] ?? zeroAddress;
    default:
      return zeroAddress;
  }
}

export function parseStreamCreationCallData(callData: string) {
  const callDataArray = callData.split(',');

  if (!callDataArray || callDataArray.length < 6) {
    return {
      recipient: '',
      streamAddress: '',
      startTime: 0,
      endTime: 0,
      streamAmount: 0,
      tokenAddress: '',
    };
  }

  const streamAddress = callDataArray[6];
  const nonce = callDataArray[5];
  const startTime = parseInt(callDataArray[3]);
  const endTime = parseInt(callDataArray[4]);
  const streamAmount = parseInt(callDataArray[1]);
  const recipient = callDataArray[0];
  const tokenAddress = callDataArray[2];
  return {
    recipient,
    streamAddress,
    startTime,
    endTime,
    streamAmount,
    tokenAddress,
    nonce,
  };
}
