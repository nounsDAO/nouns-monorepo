import { useContractCall } from '@usedapp/core';
import { utils } from 'ethers';
import config from '../../config';
import StreamFactoryABI from './streamFactory.abi.json';

interface UsePredictStreamAddressProps {
  msgSender?: string;
  payer?: string;
  recipient?: string;
  tokenAmount?: string;
  tokenAddress?: string;
  startTime?: number;
  endTime?: number;
}

const abi = new utils.Interface(StreamFactoryABI);

export function usePredictStreamAddress({
  msgSender,
  payer,
  recipient,
  tokenAmount,
  tokenAddress,
  startTime,
  endTime,
}: UsePredictStreamAddressProps) {
  const [predictedAddress] =
    useContractCall<[string]>({
      abi,
      address: config.addresses.nounsStreamFactory ?? '',
      method: 'predictStreamAddress',
      args: [msgSender, payer, recipient, tokenAmount, tokenAddress, startTime, endTime],
    }) || [];
  return predictedAddress?.toString();
}
