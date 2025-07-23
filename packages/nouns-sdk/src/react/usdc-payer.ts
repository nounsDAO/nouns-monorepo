import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NounsUSDCPayer
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const nounsUsdcPayerAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: '_paymentToken', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'CastError' },
  { type: 'error', inputs: [], name: 'Empty' },
  { type: 'error', inputs: [], name: 'OutOfBounds' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'remainingDebt', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'PaidBackDebt',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'RegisteredDebt',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'TokensWithdrawn',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'debtOf',
    outputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'payBackDebt',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paymentToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'queue',
    outputs: [
      { name: '_begin', internalType: 'int128', type: 'int128' },
      { name: '_end', internalType: 'int128', type: 'int128' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'queueAt',
    outputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'sendOrRegisterDebt',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalDebt',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdrawPaymentToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const nounsUsdcPayerAddress = {
  1: '0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D',
  11155111: '0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94',
} as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const nounsUsdcPayerConfig = {
  address: nounsUsdcPayerAddress,
  abi: nounsUsdcPayerAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcPayerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useReadNounsUsdcPayer = /*#__PURE__*/ createUseReadContract({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `functionName` set to `"debtOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useReadNounsUsdcPayerDebtOf = /*#__PURE__*/ createUseReadContract({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
  functionName: 'debtOf',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useReadNounsUsdcPayerOwner = /*#__PURE__*/ createUseReadContract({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
  functionName: 'owner',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `functionName` set to `"paymentToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useReadNounsUsdcPayerPaymentToken = /*#__PURE__*/ createUseReadContract({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
  functionName: 'paymentToken',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `functionName` set to `"queue"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useReadNounsUsdcPayerQueue = /*#__PURE__*/ createUseReadContract({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
  functionName: 'queue',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `functionName` set to `"queueAt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useReadNounsUsdcPayerQueueAt = /*#__PURE__*/ createUseReadContract({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
  functionName: 'queueAt',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `functionName` set to `"totalDebt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useReadNounsUsdcPayerTotalDebt = /*#__PURE__*/ createUseReadContract({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
  functionName: 'totalDebt',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcPayerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useWriteNounsUsdcPayer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `functionName` set to `"payBackDebt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useWriteNounsUsdcPayerPayBackDebt = /*#__PURE__*/ createUseWriteContract({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
  functionName: 'payBackDebt',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useWriteNounsUsdcPayerRenounceOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `functionName` set to `"sendOrRegisterDebt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useWriteNounsUsdcPayerSendOrRegisterDebt = /*#__PURE__*/ createUseWriteContract({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
  functionName: 'sendOrRegisterDebt',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useWriteNounsUsdcPayerTransferOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `functionName` set to `"withdrawPaymentToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useWriteNounsUsdcPayerWithdrawPaymentToken = /*#__PURE__*/ createUseWriteContract({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
  functionName: 'withdrawPaymentToken',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcPayerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useSimulateNounsUsdcPayer = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `functionName` set to `"payBackDebt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useSimulateNounsUsdcPayerPayBackDebt = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
  functionName: 'payBackDebt',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useSimulateNounsUsdcPayerRenounceOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `functionName` set to `"sendOrRegisterDebt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useSimulateNounsUsdcPayerSendOrRegisterDebt = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
  functionName: 'sendOrRegisterDebt',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useSimulateNounsUsdcPayerTransferOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `functionName` set to `"withdrawPaymentToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useSimulateNounsUsdcPayerWithdrawPaymentToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsUsdcPayerAbi,
    address: nounsUsdcPayerAddress,
    functionName: 'withdrawPaymentToken',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcPayerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useWatchNounsUsdcPayerEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useWatchNounsUsdcPayerOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsUsdcPayerAbi,
    address: nounsUsdcPayerAddress,
    eventName: 'OwnershipTransferred',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `eventName` set to `"PaidBackDebt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useWatchNounsUsdcPayerPaidBackDebtEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
  eventName: 'PaidBackDebt',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `eventName` set to `"RegisteredDebt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useWatchNounsUsdcPayerRegisteredDebtEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsUsdcPayerAbi,
  address: nounsUsdcPayerAddress,
  eventName: 'RegisteredDebt',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcPayerAbi}__ and `eventName` set to `"TokensWithdrawn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94)
 */
export const useWatchNounsUsdcPayerTokensWithdrawnEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: nounsUsdcPayerAbi, address: nounsUsdcPayerAddress, eventName: 'TokensWithdrawn' },
);
