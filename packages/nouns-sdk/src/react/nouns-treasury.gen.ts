import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NounsTreasury
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const nounsTreasuryAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'beacon', internalType: 'address', type: 'address', indexed: true }],
    name: 'BeaconUpgraded',
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
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'erc20Token', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ERC20Sent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ETHSent',
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
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address', indexed: true }],
    name: 'Upgraded',
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
  {
    type: 'function',
    inputs: [],
    name: 'NAME',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
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
    inputs: [
      { name: 'admin_', internalType: 'address', type: 'address' },
      { name: 'delay_', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'initialize',
    outputs: [],
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
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'erc20Token', internalType: 'address', type: 'address' },
      { name: 'tokensToSend', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'sendERC20',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address payable', type: 'address' },
      { name: 'ethToSend', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'sendETH',
    outputs: [],
    stateMutability: 'nonpayable',
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
  {
    type: 'function',
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const nounsTreasuryAddress = {
  1: '0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71',
  11155111: '0x07e5D6a1550aD5E597A9b0698A474AA080A2fB28',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const nounsTreasuryConfig = { address: nounsTreasuryAddress, abi: nounsTreasuryAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useReadNounsTreasury = /*#__PURE__*/ createUseReadContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"GRACE_PERIOD"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useReadNounsTreasuryGracePeriod = /*#__PURE__*/ createUseReadContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'GRACE_PERIOD',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"MAXIMUM_DELAY"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useReadNounsTreasuryMaximumDelay = /*#__PURE__*/ createUseReadContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'MAXIMUM_DELAY',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"MINIMUM_DELAY"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useReadNounsTreasuryMinimumDelay = /*#__PURE__*/ createUseReadContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'MINIMUM_DELAY',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"NAME"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useReadNounsTreasuryName = /*#__PURE__*/ createUseReadContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'NAME',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"admin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useReadNounsTreasuryAdmin = /*#__PURE__*/ createUseReadContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'admin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"delay"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useReadNounsTreasuryDelay = /*#__PURE__*/ createUseReadContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'delay',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"pendingAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useReadNounsTreasuryPendingAdmin = /*#__PURE__*/ createUseReadContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'pendingAdmin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"queuedTransactions"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useReadNounsTreasuryQueuedTransactions = /*#__PURE__*/ createUseReadContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'queuedTransactions',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWriteNounsTreasury = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"acceptAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWriteNounsTreasuryAcceptAdmin = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'acceptAdmin',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"cancelTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWriteNounsTreasuryCancelTransaction = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'cancelTransaction',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"executeTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWriteNounsTreasuryExecuteTransaction = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'executeTransaction',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWriteNounsTreasuryInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"queueTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWriteNounsTreasuryQueueTransaction = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'queueTransaction',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"sendERC20"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWriteNounsTreasurySendErc20 = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'sendERC20',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"sendETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWriteNounsTreasurySendEth = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'sendETH',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"setDelay"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWriteNounsTreasurySetDelay = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'setDelay',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"setPendingAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWriteNounsTreasurySetPendingAdmin = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'setPendingAdmin',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWriteNounsTreasuryUpgradeTo = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWriteNounsTreasuryUpgradeToAndCall = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'upgradeToAndCall',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useSimulateNounsTreasury = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"acceptAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useSimulateNounsTreasuryAcceptAdmin = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'acceptAdmin',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"cancelTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useSimulateNounsTreasuryCancelTransaction = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'cancelTransaction',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"executeTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useSimulateNounsTreasuryExecuteTransaction = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'executeTransaction',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useSimulateNounsTreasuryInitialize = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"queueTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useSimulateNounsTreasuryQueueTransaction = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'queueTransaction',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"sendERC20"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useSimulateNounsTreasurySendErc20 = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'sendERC20',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"sendETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useSimulateNounsTreasurySendEth = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'sendETH',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"setDelay"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useSimulateNounsTreasurySetDelay = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'setDelay',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"setPendingAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useSimulateNounsTreasurySetPendingAdmin = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'setPendingAdmin',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useSimulateNounsTreasuryUpgradeTo = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useSimulateNounsTreasuryUpgradeToAndCall = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'upgradeToAndCall',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWatchNounsTreasuryEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWatchNounsTreasuryAdminChangedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  eventName: 'AdminChanged',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"BeaconUpgraded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWatchNounsTreasuryBeaconUpgradedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  eventName: 'BeaconUpgraded',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"CancelTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWatchNounsTreasuryCancelTransactionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsTreasuryAbi,
    address: nounsTreasuryAddress,
    eventName: 'CancelTransaction',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"ERC20Sent"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWatchNounsTreasuryErc20SentEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  eventName: 'ERC20Sent',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"ETHSent"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWatchNounsTreasuryEthSentEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  eventName: 'ETHSent',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"ExecuteTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWatchNounsTreasuryExecuteTransactionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsTreasuryAbi,
    address: nounsTreasuryAddress,
    eventName: 'ExecuteTransaction',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"NewAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWatchNounsTreasuryNewAdminEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  eventName: 'NewAdmin',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"NewDelay"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWatchNounsTreasuryNewDelayEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  eventName: 'NewDelay',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"NewPendingAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWatchNounsTreasuryNewPendingAdminEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  eventName: 'NewPendingAdmin',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"QueueTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWatchNounsTreasuryQueueTransactionEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: nounsTreasuryAbi, address: nounsTreasuryAddress, eventName: 'QueueTransaction' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"Upgraded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWatchNounsTreasuryUpgradedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  eventName: 'Upgraded',
})
