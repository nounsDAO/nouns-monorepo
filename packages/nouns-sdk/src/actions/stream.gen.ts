import {
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
} from '@wagmi/core/codegen';

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
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsStreamAbi}__
 */
export const readNounsStream = /*#__PURE__*/ createReadContract({ abi: nounsStreamAbi });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"elapsedTime"`
 */
export const readNounsStreamElapsedTime = /*#__PURE__*/ createReadContract({
  abi: nounsStreamAbi,
  functionName: 'elapsedTime',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"factory"`
 */
export const readNounsStreamFactory = /*#__PURE__*/ createReadContract({
  abi: nounsStreamAbi,
  functionName: 'factory',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"payer"`
 */
export const readNounsStreamPayer = /*#__PURE__*/ createReadContract({
  abi: nounsStreamAbi,
  functionName: 'payer',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"recipient"`
 */
export const readNounsStreamRecipient = /*#__PURE__*/ createReadContract({
  abi: nounsStreamAbi,
  functionName: 'recipient',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"recipientActiveBalance"`
 */
export const readNounsStreamRecipientActiveBalance = /*#__PURE__*/ createReadContract({
  abi: nounsStreamAbi,
  functionName: 'recipientActiveBalance',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"recipientBalance"`
 */
export const readNounsStreamRecipientBalance = /*#__PURE__*/ createReadContract({
  abi: nounsStreamAbi,
  functionName: 'recipientBalance',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"recipientCancelBalance"`
 */
export const readNounsStreamRecipientCancelBalance = /*#__PURE__*/ createReadContract({
  abi: nounsStreamAbi,
  functionName: 'recipientCancelBalance',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"remainingBalance"`
 */
export const readNounsStreamRemainingBalance = /*#__PURE__*/ createReadContract({
  abi: nounsStreamAbi,
  functionName: 'remainingBalance',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"startTime"`
 */
export const readNounsStreamStartTime = /*#__PURE__*/ createReadContract({
  abi: nounsStreamAbi,
  functionName: 'startTime',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"stopTime"`
 */
export const readNounsStreamStopTime = /*#__PURE__*/ createReadContract({
  abi: nounsStreamAbi,
  functionName: 'stopTime',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"token"`
 */
export const readNounsStreamToken = /*#__PURE__*/ createReadContract({
  abi: nounsStreamAbi,
  functionName: 'token',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"tokenAmount"`
 */
export const readNounsStreamTokenAmount = /*#__PURE__*/ createReadContract({
  abi: nounsStreamAbi,
  functionName: 'tokenAmount',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"tokenAndOutstandingBalance"`
 */
export const readNounsStreamTokenAndOutstandingBalance = /*#__PURE__*/ createReadContract({
  abi: nounsStreamAbi,
  functionName: 'tokenAndOutstandingBalance',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsStreamAbi}__
 */
export const writeNounsStream = /*#__PURE__*/ createWriteContract({ abi: nounsStreamAbi });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"cancel"`
 */
export const writeNounsStreamCancel = /*#__PURE__*/ createWriteContract({
  abi: nounsStreamAbi,
  functionName: 'cancel',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"initialize"`
 */
export const writeNounsStreamInitialize = /*#__PURE__*/ createWriteContract({
  abi: nounsStreamAbi,
  functionName: 'initialize',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"recoverTokens"`
 */
export const writeNounsStreamRecoverTokens = /*#__PURE__*/ createWriteContract({
  abi: nounsStreamAbi,
  functionName: 'recoverTokens',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"rescueETH"`
 */
export const writeNounsStreamRescueEth = /*#__PURE__*/ createWriteContract({
  abi: nounsStreamAbi,
  functionName: 'rescueETH',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"withdraw"`
 */
export const writeNounsStreamWithdraw = /*#__PURE__*/ createWriteContract({
  abi: nounsStreamAbi,
  functionName: 'withdraw',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"withdrawAfterCancel"`
 */
export const writeNounsStreamWithdrawAfterCancel = /*#__PURE__*/ createWriteContract({
  abi: nounsStreamAbi,
  functionName: 'withdrawAfterCancel',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"withdrawFromActiveBalance"`
 */
export const writeNounsStreamWithdrawFromActiveBalance = /*#__PURE__*/ createWriteContract({
  abi: nounsStreamAbi,
  functionName: 'withdrawFromActiveBalance',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsStreamAbi}__
 */
export const simulateNounsStream = /*#__PURE__*/ createSimulateContract({ abi: nounsStreamAbi });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"cancel"`
 */
export const simulateNounsStreamCancel = /*#__PURE__*/ createSimulateContract({
  abi: nounsStreamAbi,
  functionName: 'cancel',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateNounsStreamInitialize = /*#__PURE__*/ createSimulateContract({
  abi: nounsStreamAbi,
  functionName: 'initialize',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"recoverTokens"`
 */
export const simulateNounsStreamRecoverTokens = /*#__PURE__*/ createSimulateContract({
  abi: nounsStreamAbi,
  functionName: 'recoverTokens',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"rescueETH"`
 */
export const simulateNounsStreamRescueEth = /*#__PURE__*/ createSimulateContract({
  abi: nounsStreamAbi,
  functionName: 'rescueETH',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"withdraw"`
 */
export const simulateNounsStreamWithdraw = /*#__PURE__*/ createSimulateContract({
  abi: nounsStreamAbi,
  functionName: 'withdraw',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"withdrawAfterCancel"`
 */
export const simulateNounsStreamWithdrawAfterCancel = /*#__PURE__*/ createSimulateContract({
  abi: nounsStreamAbi,
  functionName: 'withdrawAfterCancel',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsStreamAbi}__ and `functionName` set to `"withdrawFromActiveBalance"`
 */
export const simulateNounsStreamWithdrawFromActiveBalance = /*#__PURE__*/ createSimulateContract({
  abi: nounsStreamAbi,
  functionName: 'withdrawFromActiveBalance',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsStreamAbi}__
 */
export const watchNounsStreamEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsStreamAbi,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsStreamAbi}__ and `eventName` set to `"ETHRescued"`
 */
export const watchNounsStreamEthRescuedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsStreamAbi,
  eventName: 'ETHRescued',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsStreamAbi}__ and `eventName` set to `"StreamCancelled"`
 */
export const watchNounsStreamStreamCancelledEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsStreamAbi,
  eventName: 'StreamCancelled',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsStreamAbi}__ and `eventName` set to `"TokensRecovered"`
 */
export const watchNounsStreamTokensRecoveredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsStreamAbi,
  eventName: 'TokensRecovered',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsStreamAbi}__ and `eventName` set to `"TokensWithdrawn"`
 */
export const watchNounsStreamTokensWithdrawnEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsStreamAbi,
  eventName: 'TokensWithdrawn',
});
