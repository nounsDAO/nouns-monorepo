import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen';

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
] as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const nounsLegacyTreasuryAddress = {
  1: '0x0BC3807Ec262cB779b38D65b38158acC3bfedE10',
  11155111: '0x332db58b51393f3a6b28d4DD8964234967e1aD33',
} as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const nounsLegacyTreasuryConfig = {
  address: nounsLegacyTreasuryAddress,
  abi: nounsLegacyTreasuryAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useReadNounsLegacyTreasury = /*#__PURE__*/ createUseReadContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"GRACE_PERIOD"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useReadNounsLegacyTreasuryGracePeriod = /*#__PURE__*/ createUseReadContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'GRACE_PERIOD',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"MAXIMUM_DELAY"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useReadNounsLegacyTreasuryMaximumDelay = /*#__PURE__*/ createUseReadContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'MAXIMUM_DELAY',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"MINIMUM_DELAY"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useReadNounsLegacyTreasuryMinimumDelay = /*#__PURE__*/ createUseReadContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'MINIMUM_DELAY',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"admin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useReadNounsLegacyTreasuryAdmin = /*#__PURE__*/ createUseReadContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'admin',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"delay"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useReadNounsLegacyTreasuryDelay = /*#__PURE__*/ createUseReadContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'delay',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"pendingAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useReadNounsLegacyTreasuryPendingAdmin = /*#__PURE__*/ createUseReadContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'pendingAdmin',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"queuedTransactions"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useReadNounsLegacyTreasuryQueuedTransactions = /*#__PURE__*/ createUseReadContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'queuedTransactions',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useWriteNounsLegacyTreasury = /*#__PURE__*/ createUseWriteContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"acceptAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useWriteNounsLegacyTreasuryAcceptAdmin = /*#__PURE__*/ createUseWriteContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'acceptAdmin',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"cancelTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useWriteNounsLegacyTreasuryCancelTransaction = /*#__PURE__*/ createUseWriteContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'cancelTransaction',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"executeTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useWriteNounsLegacyTreasuryExecuteTransaction = /*#__PURE__*/ createUseWriteContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'executeTransaction',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"queueTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useWriteNounsLegacyTreasuryQueueTransaction = /*#__PURE__*/ createUseWriteContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'queueTransaction',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"setDelay"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useWriteNounsLegacyTreasurySetDelay = /*#__PURE__*/ createUseWriteContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'setDelay',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"setPendingAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useWriteNounsLegacyTreasurySetPendingAdmin = /*#__PURE__*/ createUseWriteContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'setPendingAdmin',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useSimulateNounsLegacyTreasury = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"acceptAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useSimulateNounsLegacyTreasuryAcceptAdmin = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'acceptAdmin',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"cancelTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useSimulateNounsLegacyTreasuryCancelTransaction =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsLegacyTreasuryAbi,
    address: nounsLegacyTreasuryAddress,
    functionName: 'cancelTransaction',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"executeTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useSimulateNounsLegacyTreasuryExecuteTransaction =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsLegacyTreasuryAbi,
    address: nounsLegacyTreasuryAddress,
    functionName: 'executeTransaction',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"queueTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useSimulateNounsLegacyTreasuryQueueTransaction =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsLegacyTreasuryAbi,
    address: nounsLegacyTreasuryAddress,
    functionName: 'queueTransaction',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"setDelay"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useSimulateNounsLegacyTreasurySetDelay = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  functionName: 'setDelay',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `functionName` set to `"setPendingAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useSimulateNounsLegacyTreasurySetPendingAdmin =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsLegacyTreasuryAbi,
    address: nounsLegacyTreasuryAddress,
    functionName: 'setPendingAdmin',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useWatchNounsLegacyTreasuryEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `eventName` set to `"CancelTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useWatchNounsLegacyTreasuryCancelTransactionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsLegacyTreasuryAbi,
    address: nounsLegacyTreasuryAddress,
    eventName: 'CancelTransaction',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `eventName` set to `"ExecuteTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useWatchNounsLegacyTreasuryExecuteTransactionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsLegacyTreasuryAbi,
    address: nounsLegacyTreasuryAddress,
    eventName: 'ExecuteTransaction',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `eventName` set to `"NewAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useWatchNounsLegacyTreasuryNewAdminEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  eventName: 'NewAdmin',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `eventName` set to `"NewDelay"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useWatchNounsLegacyTreasuryNewDelayEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsLegacyTreasuryAbi,
  address: nounsLegacyTreasuryAddress,
  eventName: 'NewDelay',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `eventName` set to `"NewPendingAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useWatchNounsLegacyTreasuryNewPendingAdminEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsLegacyTreasuryAbi,
    address: nounsLegacyTreasuryAddress,
    eventName: 'NewPendingAdmin',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsLegacyTreasuryAbi}__ and `eventName` set to `"QueueTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0BC3807Ec262cB779b38D65b38158acC3bfedE10)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x332db58b51393f3a6b28d4DD8964234967e1aD33)
 */
export const useWatchNounsLegacyTreasuryQueueTransactionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsLegacyTreasuryAbi,
    address: nounsLegacyTreasuryAddress,
    eventName: 'QueueTransaction',
  });
