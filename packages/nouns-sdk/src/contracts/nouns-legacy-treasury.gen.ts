import {
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NounsLegacyTreasury
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const nounsLegacyTreasuryAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'admin_', internalType: 'address', type: 'address' },
      { name: 'delay_', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'txHash', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'target', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'signature', internalType: 'string', type: 'string', indexed: false },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'eta', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'CancelTransaction',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'txHash', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'target', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'signature', internalType: 'string', type: 'string', indexed: false },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'eta', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ExecuteTransaction',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'newAdmin', internalType: 'address', type: 'address', indexed: true }],
    name: 'NewAdmin',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'newDelay', internalType: 'uint256', type: 'uint256', indexed: true }],
    name: 'NewDelay',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'newPendingAdmin', internalType: 'address', type: 'address', indexed: true }],
    name: 'NewPendingAdmin',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'txHash', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'target', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'signature', internalType: 'string', type: 'string', indexed: false },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'eta', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'QueueTransaction',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'GRACE_PERIOD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAXIMUM_DELAY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MINIMUM_DELAY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  { type: 'function', inputs: [], name: 'acceptAdmin', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'admin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'signature', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'eta', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'cancelTransaction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'delay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'signature', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'eta', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'executeTransaction',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pendingAdmin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'signature', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'eta', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'queueTransaction',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'queuedTransactions',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'delay_', internalType: 'uint256', type: 'uint256' }],
    name: 'setDelay',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'pendingAdmin_', internalType: 'address', type: 'address' }],
    name: 'setPendingAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const nounsLegacyTreasuryAddress = {
  1: '0x0BC3807Ec262cB779b38D65b38158acC3bfedE10',
  11155111: '0x332db58b51393f3a6b28d4DD8964234967e1aD33',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const nounsLegacyTreasuryConfig = {
  address: nounsLegacyTreasuryAddress,
  abi: nounsLegacyTreasuryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const readNounsLegacyTreasury = /*#__PURE__*/ createReadContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"GRACE_PERIOD"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const readNounsLegacyTreasuryGracePeriod = /*#__PURE__*/ createReadContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'GRACE_PERIOD',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"MAXIMUM_DELAY"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const readNounsLegacyTreasuryMaximumDelay = /*#__PURE__*/ createReadContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'MAXIMUM_DELAY',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"MINIMUM_DELAY"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const readNounsLegacyTreasuryMinimumDelay = /*#__PURE__*/ createReadContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'MINIMUM_DELAY',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"admin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const readNounsLegacyTreasuryAdmin = /*#__PURE__*/ createReadContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'admin',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"delay"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const readNounsLegacyTreasuryDelay = /*#__PURE__*/ createReadContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'delay',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"pendingAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const readNounsLegacyTreasuryPendingAdmin = /*#__PURE__*/ createReadContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'pendingAdmin',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"queuedTransactions"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const readNounsLegacyTreasuryQueuedTransactions = /*#__PURE__*/ createReadContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'queuedTransactions',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const writeNounsLegacyTreasury = /*#__PURE__*/ createWriteContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"acceptAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const writeNounsLegacyTreasuryAcceptAdmin = /*#__PURE__*/ createWriteContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'acceptAdmin',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"cancelTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const writeNounsLegacyTreasuryCancelTransaction = /*#__PURE__*/ createWriteContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'cancelTransaction',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"executeTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const writeNounsLegacyTreasuryExecuteTransaction = /*#__PURE__*/ createWriteContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'executeTransaction',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"queueTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const writeNounsLegacyTreasuryQueueTransaction = /*#__PURE__*/ createWriteContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'queueTransaction',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"setDelay"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const writeNounsLegacyTreasurySetDelay = /*#__PURE__*/ createWriteContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'setDelay',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"setPendingAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const writeNounsLegacyTreasurySetPendingAdmin = /*#__PURE__*/ createWriteContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'setPendingAdmin',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const simulateNounsLegacyTreasury = /*#__PURE__*/ createSimulateContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"acceptAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const simulateNounsLegacyTreasuryAcceptAdmin = /*#__PURE__*/ createSimulateContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'acceptAdmin',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"cancelTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const simulateNounsLegacyTreasuryCancelTransaction = /*#__PURE__*/ createSimulateContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'cancelTransaction',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"executeTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const simulateNounsLegacyTreasuryExecuteTransaction = /*#__PURE__*/ createSimulateContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'executeTransaction',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"queueTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const simulateNounsLegacyTreasuryQueueTransaction = /*#__PURE__*/ createSimulateContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'queueTransaction',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"setDelay"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const simulateNounsLegacyTreasurySetDelay = /*#__PURE__*/ createSimulateContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'setDelay',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"setPendingAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const simulateNounsLegacyTreasurySetPendingAdmin = /*#__PURE__*/ createSimulateContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'setPendingAdmin',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const watchNounsLegacyTreasuryEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `eventName` set to `"CancelTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const watchNounsLegacyTreasuryCancelTransactionEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsLegacyTreasuryAbi,
    address: nounsLegacyTreasuryAddress,
    eventName: 'CancelTransaction',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `eventName` set to `"ExecuteTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const watchNounsLegacyTreasuryExecuteTransactionEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsLegacyTreasuryAbi,
    address: nounsLegacyTreasuryAddress,
    eventName: 'ExecuteTransaction',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `eventName` set to `"NewAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const watchNounsLegacyTreasuryNewAdminEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  eventName: 'NewAdmin',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `eventName` set to `"NewDelay"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const watchNounsLegacyTreasuryNewDelayEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  eventName: 'NewDelay',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `eventName` set to `"NewPendingAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const watchNounsLegacyTreasuryNewPendingAdminEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  eventName: 'NewPendingAdmin',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `eventName` set to `"QueueTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const watchNounsLegacyTreasuryQueueTransactionEvent = /*#__PURE__*/ createWatchContractEvent(
  {
    abi: nounsLegacyTreasuryAbi,
    address: nounsLegacyTreasuryAddress,
    eventName: 'QueueTransaction',
  },
)
