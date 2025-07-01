import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

import {
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// mETH
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const mEthAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'NotStakingContract' },
  { type: 'error', inputs: [], name: 'NotUnstakeRequestsManagerContract' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'spender', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'blockList', internalType: 'address', type: 'address', indexed: true }],
    name: 'BlockListContractAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'blockList', internalType: 'address', type: 'address', indexed: true }],
    name: 'BlockListContractRemoved',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'uint8', type: 'uint8', indexed: false }],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'previousAdminRole', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'newAdminRole', internalType: 'bytes32', type: 'bytes32', indexed: true },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ADD_BLOCK_LIST_CONTRACT_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'BURNER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MINTER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'REMOVE_BLOCK_LIST_CONTRACT_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'blockListAddress', internalType: 'address', type: 'address' }],
    name: 'addBlockListContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'forceBurn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'excludeBlockList', internalType: 'bool', type: 'bool' },
    ],
    name: 'forceMint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBlockLists',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRoleMember',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleMemberCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'init',
        internalType: 'struct METH.Init',
        type: 'tuple',
        components: [
          { name: 'admin', internalType: 'address', type: 'address' },
          { name: 'staking', internalType: 'contract IStaking', type: 'address' },
          {
            name: 'unstakeRequestsManager',
            internalType: 'contract IUnstakeRequestsManager',
            type: 'address',
          },
        ],
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'isBlocked',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'staker', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'blockListAddress', internalType: 'address', type: 'address' }],
    name: 'removeBlockListContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stakingContract',
    outputs: [{ name: '', internalType: 'contract IStaking', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unstakeRequestsManagerContract',
    outputs: [{ name: '', internalType: 'contract IUnstakeRequestsManager', type: 'address' }],
    stateMutability: 'view',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const mEthAddress = {
  1: '0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa',
  11155111: '0x072d71b257ECa6B60b5333626F6a55ea1B0c451c',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const mEthConfig = { address: mEthAddress, abi: mEthAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEth = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"ADD_BLOCK_LIST_CONTRACT_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthAddBlockListContractRole = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'ADD_BLOCK_LIST_CONTRACT_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"BURNER_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthBurnerRole = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'BURNER_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthDefaultAdminRole = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'DEFAULT_ADMIN_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthDomainSeparator = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'DOMAIN_SEPARATOR',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"MINTER_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthMinterRole = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'MINTER_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"REMOVE_BLOCK_LIST_CONTRACT_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthRemoveBlockListContractRole = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'REMOVE_BLOCK_LIST_CONTRACT_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"allowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthAllowance = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"balanceOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"decimals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthDecimals = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"eip712Domain"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthEip712Domain = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'eip712Domain',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"getBlockLists"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthGetBlockLists = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'getBlockLists',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"getRoleAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthGetRoleAdmin = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'getRoleAdmin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"getRoleMember"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthGetRoleMember = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'getRoleMember',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"getRoleMemberCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthGetRoleMemberCount = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'getRoleMemberCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"hasRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthHasRole = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'hasRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"isBlocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthIsBlocked = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'isBlocked',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"name"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthName = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"nonces"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthNonces = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'nonces',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"stakingContract"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthStakingContract = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'stakingContract',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"supportsInterface"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthSupportsInterface = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"symbol"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthSymbol = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"totalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"unstakeRequestsManagerContract"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthUnstakeRequestsManagerContract = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'unstakeRequestsManagerContract',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWriteMEth = /*#__PURE__*/ createUseWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"addBlockListContract"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWriteMEthAddBlockListContract = /*#__PURE__*/ createUseWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'addBlockListContract',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWriteMEthApprove = /*#__PURE__*/ createUseWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"burn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWriteMEthBurn = /*#__PURE__*/ createUseWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"decreaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWriteMEthDecreaseAllowance = /*#__PURE__*/ createUseWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'decreaseAllowance',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"forceBurn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWriteMEthForceBurn = /*#__PURE__*/ createUseWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'forceBurn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"forceMint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWriteMEthForceMint = /*#__PURE__*/ createUseWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'forceMint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"grantRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWriteMEthGrantRole = /*#__PURE__*/ createUseWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'grantRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"increaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWriteMEthIncreaseAllowance = /*#__PURE__*/ createUseWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'increaseAllowance',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWriteMEthInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"mint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWriteMEthMint = /*#__PURE__*/ createUseWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"permit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWriteMEthPermit = /*#__PURE__*/ createUseWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'permit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"removeBlockListContract"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWriteMEthRemoveBlockListContract = /*#__PURE__*/ createUseWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'removeBlockListContract',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"renounceRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWriteMEthRenounceRole = /*#__PURE__*/ createUseWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'renounceRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"revokeRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWriteMEthRevokeRole = /*#__PURE__*/ createUseWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'revokeRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWriteMEthTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWriteMEthTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useSimulateMEth = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"addBlockListContract"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useSimulateMEthAddBlockListContract = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'addBlockListContract',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useSimulateMEthApprove = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"burn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useSimulateMEthBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'burn',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"decreaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useSimulateMEthDecreaseAllowance = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'decreaseAllowance',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"forceBurn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useSimulateMEthForceBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'forceBurn',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"forceMint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useSimulateMEthForceMint = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'forceMint',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"grantRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useSimulateMEthGrantRole = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'grantRole',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"increaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useSimulateMEthIncreaseAllowance = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'increaseAllowance',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useSimulateMEthInitialize = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"mint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useSimulateMEthMint = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'mint',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"permit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useSimulateMEthPermit = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'permit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"removeBlockListContract"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useSimulateMEthRemoveBlockListContract = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'removeBlockListContract',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"renounceRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useSimulateMEthRenounceRole = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'renounceRole',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"revokeRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useSimulateMEthRevokeRole = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'revokeRole',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useSimulateMEthTransfer = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useSimulateMEthTransferFrom = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWatchMEthEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthAbi}__ and `eventName` set to `"Approval"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWatchMEthApprovalEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
  eventName: 'Approval',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthAbi}__ and `eventName` set to `"BlockListContractAdded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWatchMEthBlockListContractAddedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
  eventName: 'BlockListContractAdded',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthAbi}__ and `eventName` set to `"BlockListContractRemoved"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWatchMEthBlockListContractRemovedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
  eventName: 'BlockListContractRemoved',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWatchMEthEip712DomainChangedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
  eventName: 'EIP712DomainChanged',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthAbi}__ and `eventName` set to `"Initialized"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWatchMEthInitializedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
  eventName: 'Initialized',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthAbi}__ and `eventName` set to `"RoleAdminChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWatchMEthRoleAdminChangedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
  eventName: 'RoleAdminChanged',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthAbi}__ and `eventName` set to `"RoleGranted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWatchMEthRoleGrantedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
  eventName: 'RoleGranted',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthAbi}__ and `eventName` set to `"RoleRevoked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWatchMEthRoleRevokedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
  eventName: 'RoleRevoked',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthAbi}__ and `eventName` set to `"Transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useWatchMEthTransferEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
  eventName: 'Transfer',
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEth = /*#__PURE__*/ createReadContract({ abi: mEthAbi, address: mEthAddress })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"ADD_BLOCK_LIST_CONTRACT_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthAddBlockListContractRole = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'ADD_BLOCK_LIST_CONTRACT_ROLE',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"BURNER_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthBurnerRole = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'BURNER_ROLE',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthDefaultAdminRole = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'DEFAULT_ADMIN_ROLE',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthDomainSeparator = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'DOMAIN_SEPARATOR',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"MINTER_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthMinterRole = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'MINTER_ROLE',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"REMOVE_BLOCK_LIST_CONTRACT_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthRemoveBlockListContractRole = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'REMOVE_BLOCK_LIST_CONTRACT_ROLE',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"allowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthAllowance = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"balanceOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthBalanceOf = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"decimals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthDecimals = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"eip712Domain"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthEip712Domain = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'eip712Domain',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"getBlockLists"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthGetBlockLists = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'getBlockLists',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"getRoleAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthGetRoleAdmin = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'getRoleAdmin',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"getRoleMember"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthGetRoleMember = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'getRoleMember',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"getRoleMemberCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthGetRoleMemberCount = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'getRoleMemberCount',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"hasRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthHasRole = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'hasRole',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"isBlocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthIsBlocked = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'isBlocked',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"name"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthName = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"nonces"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthNonces = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'nonces',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"stakingContract"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthStakingContract = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'stakingContract',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"supportsInterface"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthSupportsInterface = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"symbol"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthSymbol = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"totalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthTotalSupply = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"unstakeRequestsManagerContract"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const readMEthUnstakeRequestsManagerContract = /*#__PURE__*/ createReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'unstakeRequestsManagerContract',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const writeMEth = /*#__PURE__*/ createWriteContract({ abi: mEthAbi, address: mEthAddress })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"addBlockListContract"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const writeMEthAddBlockListContract = /*#__PURE__*/ createWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'addBlockListContract',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const writeMEthApprove = /*#__PURE__*/ createWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"burn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const writeMEthBurn = /*#__PURE__*/ createWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'burn',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"decreaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const writeMEthDecreaseAllowance = /*#__PURE__*/ createWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'decreaseAllowance',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"forceBurn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const writeMEthForceBurn = /*#__PURE__*/ createWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'forceBurn',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"forceMint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const writeMEthForceMint = /*#__PURE__*/ createWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'forceMint',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"grantRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const writeMEthGrantRole = /*#__PURE__*/ createWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'grantRole',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"increaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const writeMEthIncreaseAllowance = /*#__PURE__*/ createWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'increaseAllowance',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const writeMEthInitialize = /*#__PURE__*/ createWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"mint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const writeMEthMint = /*#__PURE__*/ createWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'mint',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"permit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const writeMEthPermit = /*#__PURE__*/ createWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'permit',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"removeBlockListContract"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const writeMEthRemoveBlockListContract = /*#__PURE__*/ createWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'removeBlockListContract',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"renounceRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const writeMEthRenounceRole = /*#__PURE__*/ createWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'renounceRole',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"revokeRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const writeMEthRevokeRole = /*#__PURE__*/ createWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'revokeRole',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const writeMEthTransfer = /*#__PURE__*/ createWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const writeMEthTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const simulateMEth = /*#__PURE__*/ createSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"addBlockListContract"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const simulateMEthAddBlockListContract = /*#__PURE__*/ createSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'addBlockListContract',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const simulateMEthApprove = /*#__PURE__*/ createSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"burn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const simulateMEthBurn = /*#__PURE__*/ createSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'burn',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"decreaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const simulateMEthDecreaseAllowance = /*#__PURE__*/ createSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'decreaseAllowance',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"forceBurn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const simulateMEthForceBurn = /*#__PURE__*/ createSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'forceBurn',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"forceMint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const simulateMEthForceMint = /*#__PURE__*/ createSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'forceMint',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"grantRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const simulateMEthGrantRole = /*#__PURE__*/ createSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'grantRole',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"increaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const simulateMEthIncreaseAllowance = /*#__PURE__*/ createSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'increaseAllowance',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const simulateMEthInitialize = /*#__PURE__*/ createSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"mint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const simulateMEthMint = /*#__PURE__*/ createSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'mint',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"permit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const simulateMEthPermit = /*#__PURE__*/ createSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'permit',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"removeBlockListContract"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const simulateMEthRemoveBlockListContract = /*#__PURE__*/ createSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'removeBlockListContract',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"renounceRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const simulateMEthRenounceRole = /*#__PURE__*/ createSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'renounceRole',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"revokeRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const simulateMEthRevokeRole = /*#__PURE__*/ createSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'revokeRole',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const simulateMEthTransfer = /*#__PURE__*/ createSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const simulateMEthTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const watchMEthEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthAbi}__ and `eventName` set to `"Approval"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const watchMEthApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthAbi}__ and `eventName` set to `"BlockListContractAdded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const watchMEthBlockListContractAddedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
  eventName: 'BlockListContractAdded',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthAbi}__ and `eventName` set to `"BlockListContractRemoved"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const watchMEthBlockListContractRemovedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
  eventName: 'BlockListContractRemoved',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const watchMEthEip712DomainChangedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
  eventName: 'EIP712DomainChanged',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthAbi}__ and `eventName` set to `"Initialized"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const watchMEthInitializedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
  eventName: 'Initialized',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthAbi}__ and `eventName` set to `"RoleAdminChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const watchMEthRoleAdminChangedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
  eventName: 'RoleAdminChanged',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthAbi}__ and `eventName` set to `"RoleGranted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const watchMEthRoleGrantedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
  eventName: 'RoleGranted',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthAbi}__ and `eventName` set to `"RoleRevoked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const watchMEthRoleRevokedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
  eventName: 'RoleRevoked',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthAbi}__ and `eventName` set to `"Transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const watchMEthTransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthAbi,
  address: mEthAddress,
  eventName: 'Transfer',
})
