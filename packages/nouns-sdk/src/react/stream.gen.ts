import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NounsStream
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const nounsStreamAbi = [
  { type: 'error', inputs: [], name: 'AmountExceedsBalance' },
  { type: 'error', inputs: [], name: 'CallerNotPayer' },
  { type: 'error', inputs: [], name: 'CallerNotPayerOrRecipient' },
  { type: 'error', inputs: [], name: 'CantWithdrawZero' },
  { type: 'error', inputs: [], name: 'ETHRescueFailed' },
  { type: 'error', inputs: [], name: 'OnlyFactory' },
  { type: 'error', inputs: [], name: 'RescueTokenAmountExceedsExcessBalance' },
  { type: 'error', inputs: [], name: 'StreamNotActive' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'payer', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ETHRescued',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address', indexed: true },
      { name: 'payer', internalType: 'address', type: 'address', indexed: true },
      { name: 'recipient', internalType: 'address', type: 'address', indexed: true },
      { name: 'recipientBalance', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'StreamCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'payer', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenAddress', internalType: 'address', type: 'address', indexed: false },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'TokensRecovered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address', indexed: true },
      { name: 'recipient', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'TokensWithdrawn',
  },
  { type: 'function', inputs: [], name: 'cancel', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'elapsedTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  { type: 'function', inputs: [], name: 'initialize', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'payer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'recipient',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'recipientActiveBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'recipientBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'recipientCancelBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'to', internalType: 'address', type: 'address' }],
    name: 'recoverTokens',
    outputs: [{ name: 'tokensToWithdraw', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'to', internalType: 'address', type: 'address' },
    ],
    name: 'recoverTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'remainingBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'rescueETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'startTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stopTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tokenAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tokenAndOutstandingBalance',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'withdrawAfterCancel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'withdrawFromActiveBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsStreamAbi}__
 */
export const useReadNounsStream = /*#__PURE__*/ createUseReadContract({ abi: nounsStreamAbi });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"elapsedTime"`
 */
export const useReadNounsStreamElapsedTime = /*#__PURE__*/ createUseReadContract({
  abi: nounsStreamAbi,
  functionName: 'elapsedTime',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"factory"`
 */
export const useReadNounsStreamFactory = /*#__PURE__*/ createUseReadContract({
  abi: nounsStreamAbi,
  functionName: 'factory',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"payer"`
 */
export const useReadNounsStreamPayer = /*#__PURE__*/ createUseReadContract({
  abi: nounsStreamAbi,
  functionName: 'payer',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"recipient"`
 */
export const useReadNounsStreamRecipient = /*#__PURE__*/ createUseReadContract({
  abi: nounsStreamAbi,
  functionName: 'recipient',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"recipientActiveBalance"`
 */
export const useReadNounsStreamRecipientActiveBalance = /*#__PURE__*/ createUseReadContract({
  abi: nounsStreamAbi,
  functionName: 'recipientActiveBalance',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"recipientBalance"`
 */
export const useReadNounsStreamRecipientBalance = /*#__PURE__*/ createUseReadContract({
  abi: nounsStreamAbi,
  functionName: 'recipientBalance',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"recipientCancelBalance"`
 */
export const useReadNounsStreamRecipientCancelBalance = /*#__PURE__*/ createUseReadContract({
  abi: nounsStreamAbi,
  functionName: 'recipientCancelBalance',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"remainingBalance"`
 */
export const useReadNounsStreamRemainingBalance = /*#__PURE__*/ createUseReadContract({
  abi: nounsStreamAbi,
  functionName: 'remainingBalance',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"startTime"`
 */
export const useReadNounsStreamStartTime = /*#__PURE__*/ createUseReadContract({
  abi: nounsStreamAbi,
  functionName: 'startTime',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"stopTime"`
 */
export const useReadNounsStreamStopTime = /*#__PURE__*/ createUseReadContract({
  abi: nounsStreamAbi,
  functionName: 'stopTime',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"token"`
 */
export const useReadNounsStreamToken = /*#__PURE__*/ createUseReadContract({
  abi: nounsStreamAbi,
  functionName: 'token',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"tokenAmount"`
 */
export const useReadNounsStreamTokenAmount = /*#__PURE__*/ createUseReadContract({
  abi: nounsStreamAbi,
  functionName: 'tokenAmount',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"tokenAndOutstandingBalance"`
 */
export const useReadNounsStreamTokenAndOutstandingBalance = /*#__PURE__*/ createUseReadContract({
  abi: nounsStreamAbi,
  functionName: 'tokenAndOutstandingBalance',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsStreamAbi}__
 */
export const useWriteNounsStream = /*#__PURE__*/ createUseWriteContract({ abi: nounsStreamAbi });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"cancel"`
 */
export const useWriteNounsStreamCancel = /*#__PURE__*/ createUseWriteContract({
  abi: nounsStreamAbi,
  functionName: 'cancel',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteNounsStreamInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: nounsStreamAbi,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"recoverTokens"`
 */
export const useWriteNounsStreamRecoverTokens = /*#__PURE__*/ createUseWriteContract({
  abi: nounsStreamAbi,
  functionName: 'recoverTokens',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"rescueETH"`
 */
export const useWriteNounsStreamRescueEth = /*#__PURE__*/ createUseWriteContract({
  abi: nounsStreamAbi,
  functionName: 'rescueETH',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteNounsStreamWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: nounsStreamAbi,
  functionName: 'withdraw',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"withdrawAfterCancel"`
 */
export const useWriteNounsStreamWithdrawAfterCancel = /*#__PURE__*/ createUseWriteContract({
  abi: nounsStreamAbi,
  functionName: 'withdrawAfterCancel',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"withdrawFromActiveBalance"`
 */
export const useWriteNounsStreamWithdrawFromActiveBalance = /*#__PURE__*/ createUseWriteContract({
  abi: nounsStreamAbi,
  functionName: 'withdrawFromActiveBalance',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsStreamAbi}__
 */
export const useSimulateNounsStream = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsStreamAbi,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"cancel"`
 */
export const useSimulateNounsStreamCancel = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsStreamAbi,
  functionName: 'cancel',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateNounsStreamInitialize = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsStreamAbi,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"recoverTokens"`
 */
export const useSimulateNounsStreamRecoverTokens = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsStreamAbi,
  functionName: 'recoverTokens',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"rescueETH"`
 */
export const useSimulateNounsStreamRescueEth = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsStreamAbi,
  functionName: 'rescueETH',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateNounsStreamWithdraw = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsStreamAbi,
  functionName: 'withdraw',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"withdrawAfterCancel"`
 */
export const useSimulateNounsStreamWithdrawAfterCancel = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsStreamAbi,
  functionName: 'withdrawAfterCancel',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"withdrawFromActiveBalance"`
 */
export const useSimulateNounsStreamWithdrawFromActiveBalance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsStreamAbi,
    functionName: 'withdrawFromActiveBalance',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsStreamAbi}__
 */
export const useWatchNounsStreamEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsStreamAbi,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsStreamAbi}__ and `eventName` set to `"ETHRescued"`
 */
export const useWatchNounsStreamEthRescuedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsStreamAbi,
  eventName: 'ETHRescued',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsStreamAbi}__ and `eventName` set to `"StreamCancelled"`
 */
export const useWatchNounsStreamStreamCancelledEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsStreamAbi,
  eventName: 'StreamCancelled',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsStreamAbi}__ and `eventName` set to `"TokensRecovered"`
 */
export const useWatchNounsStreamTokensRecoveredEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsStreamAbi,
  eventName: 'TokensRecovered',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsStreamAbi}__ and `eventName` set to `"TokensWithdrawn"`
 */
export const useWatchNounsStreamTokensWithdrawnEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsStreamAbi,
  eventName: 'TokensWithdrawn',
});
