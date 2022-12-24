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

function warnOnInvalidContractCall(call: { address: any; method: any; args: any }) {
  console.warn(
    `Invalid contract call: address=${call && call.address} method=${call && call.method} args=${
      call && call.args
    }`,
  );
}
function encodeCallData(
  call: {
    address: any;
    method: any;
    abi: { encodeFunctionData: (arg0: any, arg1: any) => any };
    args: any;
  },
  chainId: any,
) {
  if (!call) {
    return undefined;
  }
  if (!call.address || !call.method) {
    console.log('fail', call);
    warnOnInvalidContractCall(call);
    return undefined;
  }
  try {
    return {
      address: call.address,
      data: call.abi.encodeFunctionData(call.method, call.args),
      chainId,
    };
  } catch (_a) {
    console.log(_a);
    warnOnInvalidContractCall(call);
    return undefined;
  }
}

export function usePredictStreamAddress({
  msgSender,
  payer,
  recipient,
  tokenAmount,
  tokenAddress,
  startTime,
  endTime,
}: UsePredictStreamAddressProps) {
  // console.log(
  //   encodeCallData(
  //     {
  //       abi,
  //       address: config.addresses.nounsStreamFactory ?? '',
  //       method: 'predictStreamAddress',
  //       args: [msgSender, payer, recipient, tokenAddress, tokenAddress, startTime, endTime],
  //     },
  //     5,
  //   ),
  // );

  const [predictedAddress] =
    useContractCall<[string]>({
      abi,
      address: config.addresses.nounsStreamFactory ?? '',
      method: 'predictStreamAddress',
      args: [msgSender, payer, recipient, tokenAmount, tokenAddress, startTime, endTime],
    }) || [];
  return predictedAddress?.toString();
}
