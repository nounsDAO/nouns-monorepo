import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen';

import {
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
} from 'wagmi/codegen';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// USDC
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const usdcAbi = [
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
    inputs: [
      { name: 'authorizer', internalType: 'address', type: 'address', indexed: true },
      { name: 'nonce', internalType: 'bytes32', type: 'bytes32', indexed: true },
    ],
    name: 'AuthorizationCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'authorizer', internalType: 'address', type: 'address', indexed: true },
      { name: 'nonce', internalType: 'bytes32', type: 'bytes32', indexed: true },
    ],
    name: 'AuthorizationUsed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: '_account', internalType: 'address', type: 'address', indexed: true }],
    name: 'Blacklisted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'newBlacklister', internalType: 'address', type: 'address', indexed: true }],
    name: 'BlacklisterChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'burner', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Burn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'newMasterMinter', internalType: 'address', type: 'address', indexed: true }],
    name: 'MasterMinterChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'minter', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Mint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'minter', internalType: 'address', type: 'address', indexed: true },
      { name: 'minterAllowedAmount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'MinterConfigured',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'oldMinter', internalType: 'address', type: 'address', indexed: true }],
    name: 'MinterRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: false },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'OwnershipTransferred',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'Pause' },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'newAddress', internalType: 'address', type: 'address', indexed: true }],
    name: 'PauserChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'newRescuer', internalType: 'address', type: 'address', indexed: true }],
    name: 'RescuerChanged',
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
    type: 'event',
    anonymous: false,
    inputs: [{ name: '_account', internalType: 'address', type: 'address', indexed: true }],
    name: 'UnBlacklisted',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'Unpause' },
  {
    type: 'function',
    inputs: [],
    name: 'CANCEL_AUTHORIZATION_TYPEHASH',
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
    name: 'PERMIT_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'RECEIVE_WITH_AUTHORIZATION_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TRANSFER_WITH_AUTHORIZATION_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
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
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'authorizer', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'authorizationState',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
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
    inputs: [{ name: '_account', internalType: 'address', type: 'address' }],
    name: 'blacklist',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'blacklister',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'authorizer', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'bytes32', type: 'bytes32' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'cancelAuthorization',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'authorizer', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'bytes32', type: 'bytes32' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancelAuthorization',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'minter', internalType: 'address', type: 'address' },
      { name: 'minterAllowedAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'configureMinter',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'currency',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
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
      { name: 'decrement', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'increment', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenName', internalType: 'string', type: 'string' },
      { name: 'tokenSymbol', internalType: 'string', type: 'string' },
      { name: 'tokenCurrency', internalType: 'string', type: 'string' },
      { name: 'tokenDecimals', internalType: 'uint8', type: 'uint8' },
      { name: 'newMasterMinter', internalType: 'address', type: 'address' },
      { name: 'newPauser', internalType: 'address', type: 'address' },
      { name: 'newBlacklister', internalType: 'address', type: 'address' },
      { name: 'newOwner', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newName', internalType: 'string', type: 'string' }],
    name: 'initializeV2',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'lostAndFound', internalType: 'address', type: 'address' }],
    name: 'initializeV2_1',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accountsToBlacklist', internalType: 'address[]', type: 'address[]' },
      { name: 'newSymbol', internalType: 'string', type: 'string' },
    ],
    name: 'initializeV2_2',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_account', internalType: 'address', type: 'address' }],
    name: 'isBlacklisted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'isMinter',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'masterMinter',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'minter', internalType: 'address', type: 'address' }],
    name: 'minterAllowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
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
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  { type: 'function', inputs: [], name: 'pause', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pauser',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'validAfter', internalType: 'uint256', type: 'uint256' },
      { name: 'validBefore', internalType: 'uint256', type: 'uint256' },
      { name: 'nonce', internalType: 'bytes32', type: 'bytes32' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'receiveWithAuthorization',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'validAfter', internalType: 'uint256', type: 'uint256' },
      { name: 'validBefore', internalType: 'uint256', type: 'uint256' },
      { name: 'nonce', internalType: 'bytes32', type: 'bytes32' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'receiveWithAuthorization',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'minter', internalType: 'address', type: 'address' }],
    name: 'removeMinter',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenContract', internalType: 'contract IERC20', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'rescueERC20',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rescuer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
      { name: 'value', internalType: 'uint256', type: 'uint256' },
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
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
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
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'validAfter', internalType: 'uint256', type: 'uint256' },
      { name: 'validBefore', internalType: 'uint256', type: 'uint256' },
      { name: 'nonce', internalType: 'bytes32', type: 'bytes32' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'transferWithAuthorization',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'validAfter', internalType: 'uint256', type: 'uint256' },
      { name: 'validBefore', internalType: 'uint256', type: 'uint256' },
      { name: 'nonce', internalType: 'bytes32', type: 'bytes32' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'transferWithAuthorization',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_account', internalType: 'address', type: 'address' }],
    name: 'unBlacklist',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'function', inputs: [], name: 'unpause', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [{ name: '_newBlacklister', internalType: 'address', type: 'address' }],
    name: 'updateBlacklister',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_newMasterMinter', internalType: 'address', type: 'address' }],
    name: 'updateMasterMinter',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_newPauser', internalType: 'address', type: 'address' }],
    name: 'updatePauser',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newRescuer', internalType: 'address', type: 'address' }],
    name: 'updateRescuer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
] as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const usdcAddress = {
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  11155111: '0xEbCC972B6B3eB15C0592BE1871838963d0B94278',
} as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const usdcConfig = { address: usdcAddress, abi: usdcAbi } as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdc = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"CANCEL_AUTHORIZATION_TYPEHASH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcCancelAuthorizationTypehash = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'CANCEL_AUTHORIZATION_TYPEHASH',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcDomainSeparator = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'DOMAIN_SEPARATOR',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"PERMIT_TYPEHASH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcPermitTypehash = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'PERMIT_TYPEHASH',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"RECEIVE_WITH_AUTHORIZATION_TYPEHASH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcReceiveWithAuthorizationTypehash = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'RECEIVE_WITH_AUTHORIZATION_TYPEHASH',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"TRANSFER_WITH_AUTHORIZATION_TYPEHASH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcTransferWithAuthorizationTypehash = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'TRANSFER_WITH_AUTHORIZATION_TYPEHASH',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"allowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcAllowance = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'allowance',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"authorizationState"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcAuthorizationState = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'authorizationState',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"balanceOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'balanceOf',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"blacklister"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcBlacklister = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'blacklister',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"currency"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcCurrency = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'currency',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"decimals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcDecimals = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'decimals',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"isBlacklisted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcIsBlacklisted = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'isBlacklisted',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"isMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcIsMinter = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'isMinter',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"masterMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcMasterMinter = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'masterMinter',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"minterAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcMinterAllowance = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'minterAllowance',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"name"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcName = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'name',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"nonces"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcNonces = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'nonces',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcOwner = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'owner',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcPaused = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'paused',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"pauser"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcPauser = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'pauser',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"rescuer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcRescuer = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'rescuer',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"symbol"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcSymbol = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'symbol',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"totalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'totalSupply',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"version"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useReadUsdcVersion = /*#__PURE__*/ createUseReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'version',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdc = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcApprove = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'approve',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"blacklist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcBlacklist = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'blacklist',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"burn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcBurn = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'burn',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"cancelAuthorization"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcCancelAuthorization = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'cancelAuthorization',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"configureMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcConfigureMinter = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'configureMinter',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"decreaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcDecreaseAllowance = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'decreaseAllowance',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"increaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcIncreaseAllowance = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'increaseAllowance',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"initializeV2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcInitializeV2 = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'initializeV2',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"initializeV2_1"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcInitializeV2_1 = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'initializeV2_1',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"initializeV2_2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcInitializeV2_2 = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'initializeV2_2',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"mint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcMint = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'mint',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcPause = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'pause',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"permit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcPermit = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'permit',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"receiveWithAuthorization"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcReceiveWithAuthorization = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'receiveWithAuthorization',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"removeMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcRemoveMinter = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'removeMinter',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"rescueERC20"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcRescueErc20 = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'rescueERC20',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'transfer',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'transferFrom',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcTransferOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"transferWithAuthorization"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcTransferWithAuthorization = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'transferWithAuthorization',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"unBlacklist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcUnBlacklist = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'unBlacklist',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcUnpause = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'unpause',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"updateBlacklister"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcUpdateBlacklister = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'updateBlacklister',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"updateMasterMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcUpdateMasterMinter = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'updateMasterMinter',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"updatePauser"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcUpdatePauser = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'updatePauser',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"updateRescuer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWriteUsdcUpdateRescuer = /*#__PURE__*/ createUseWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'updateRescuer',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdc = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcApprove = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'approve',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"blacklist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcBlacklist = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'blacklist',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"burn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'burn',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"cancelAuthorization"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcCancelAuthorization = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'cancelAuthorization',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"configureMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcConfigureMinter = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'configureMinter',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"decreaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcDecreaseAllowance = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'decreaseAllowance',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"increaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcIncreaseAllowance = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'increaseAllowance',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcInitialize = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"initializeV2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcInitializeV2 = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'initializeV2',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"initializeV2_1"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcInitializeV2_1 = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'initializeV2_1',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"initializeV2_2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcInitializeV2_2 = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'initializeV2_2',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"mint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcMint = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'mint',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcPause = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'pause',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"permit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcPermit = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'permit',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"receiveWithAuthorization"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcReceiveWithAuthorization = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'receiveWithAuthorization',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"removeMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcRemoveMinter = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'removeMinter',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"rescueERC20"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcRescueErc20 = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'rescueERC20',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcTransfer = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'transfer',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcTransferFrom = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'transferFrom',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcTransferOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"transferWithAuthorization"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcTransferWithAuthorization = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'transferWithAuthorization',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"unBlacklist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcUnBlacklist = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'unBlacklist',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcUnpause = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'unpause',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"updateBlacklister"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcUpdateBlacklister = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'updateBlacklister',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"updateMasterMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcUpdateMasterMinter = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'updateMasterMinter',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"updatePauser"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcUpdatePauser = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'updatePauser',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"updateRescuer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useSimulateUsdcUpdateRescuer = /*#__PURE__*/ createUseSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'updateRescuer',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdcAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWatchUsdcEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"Approval"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWatchUsdcApprovalEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'Approval',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"AuthorizationCanceled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWatchUsdcAuthorizationCanceledEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'AuthorizationCanceled',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"AuthorizationUsed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWatchUsdcAuthorizationUsedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'AuthorizationUsed',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"Blacklisted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWatchUsdcBlacklistedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'Blacklisted',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"BlacklisterChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWatchUsdcBlacklisterChangedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'BlacklisterChanged',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"Burn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWatchUsdcBurnEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'Burn',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"MasterMinterChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWatchUsdcMasterMinterChangedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'MasterMinterChanged',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"Mint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWatchUsdcMintEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'Mint',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"MinterConfigured"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWatchUsdcMinterConfiguredEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'MinterConfigured',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"MinterRemoved"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWatchUsdcMinterRemovedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'MinterRemoved',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWatchUsdcOwnershipTransferredEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'OwnershipTransferred',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"Pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWatchUsdcPauseEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'Pause',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"PauserChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWatchUsdcPauserChangedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'PauserChanged',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"RescuerChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWatchUsdcRescuerChangedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'RescuerChanged',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"Transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWatchUsdcTransferEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'Transfer',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"UnBlacklisted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWatchUsdcUnBlacklistedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'UnBlacklisted',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"Unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const useWatchUsdcUnpauseEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'Unpause',
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdc = /*#__PURE__*/ createReadContract({ abi: usdcAbi, address: usdcAddress });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"CANCEL_AUTHORIZATION_TYPEHASH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcCancelAuthorizationTypehash = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'CANCEL_AUTHORIZATION_TYPEHASH',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcDomainSeparator = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'DOMAIN_SEPARATOR',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"PERMIT_TYPEHASH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcPermitTypehash = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'PERMIT_TYPEHASH',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"RECEIVE_WITH_AUTHORIZATION_TYPEHASH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcReceiveWithAuthorizationTypehash = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'RECEIVE_WITH_AUTHORIZATION_TYPEHASH',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"TRANSFER_WITH_AUTHORIZATION_TYPEHASH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcTransferWithAuthorizationTypehash = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'TRANSFER_WITH_AUTHORIZATION_TYPEHASH',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"allowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcAllowance = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'allowance',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"authorizationState"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcAuthorizationState = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'authorizationState',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"balanceOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcBalanceOf = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'balanceOf',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"blacklister"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcBlacklister = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'blacklister',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"currency"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcCurrency = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'currency',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"decimals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcDecimals = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'decimals',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"isBlacklisted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcIsBlacklisted = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'isBlacklisted',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"isMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcIsMinter = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'isMinter',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"masterMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcMasterMinter = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'masterMinter',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"minterAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcMinterAllowance = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'minterAllowance',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"name"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcName = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'name',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"nonces"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcNonces = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'nonces',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcOwner = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'owner',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcPaused = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'paused',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"pauser"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcPauser = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'pauser',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"rescuer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcRescuer = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'rescuer',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"symbol"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcSymbol = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'symbol',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"totalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcTotalSupply = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'totalSupply',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"version"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const readUsdcVersion = /*#__PURE__*/ createReadContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'version',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdc = /*#__PURE__*/ createWriteContract({ abi: usdcAbi, address: usdcAddress });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcApprove = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'approve',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"blacklist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcBlacklist = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'blacklist',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"burn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcBurn = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'burn',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"cancelAuthorization"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcCancelAuthorization = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'cancelAuthorization',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"configureMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcConfigureMinter = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'configureMinter',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"decreaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcDecreaseAllowance = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'decreaseAllowance',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"increaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcIncreaseAllowance = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'increaseAllowance',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcInitialize = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"initializeV2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcInitializeV2 = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'initializeV2',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"initializeV2_1"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcInitializeV2_1 = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'initializeV2_1',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"initializeV2_2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcInitializeV2_2 = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'initializeV2_2',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"mint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcMint = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'mint',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcPause = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'pause',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"permit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcPermit = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'permit',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"receiveWithAuthorization"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcReceiveWithAuthorization = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'receiveWithAuthorization',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"removeMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcRemoveMinter = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'removeMinter',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"rescueERC20"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcRescueErc20 = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'rescueERC20',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcTransfer = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'transfer',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'transferFrom',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"transferWithAuthorization"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcTransferWithAuthorization = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'transferWithAuthorization',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"unBlacklist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcUnBlacklist = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'unBlacklist',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcUnpause = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'unpause',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"updateBlacklister"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcUpdateBlacklister = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'updateBlacklister',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"updateMasterMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcUpdateMasterMinter = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'updateMasterMinter',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"updatePauser"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcUpdatePauser = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'updatePauser',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"updateRescuer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const writeUsdcUpdateRescuer = /*#__PURE__*/ createWriteContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'updateRescuer',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdc = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcApprove = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'approve',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"blacklist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcBlacklist = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'blacklist',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"burn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcBurn = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'burn',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"cancelAuthorization"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcCancelAuthorization = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'cancelAuthorization',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"configureMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcConfigureMinter = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'configureMinter',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"decreaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcDecreaseAllowance = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'decreaseAllowance',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"increaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcIncreaseAllowance = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'increaseAllowance',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcInitialize = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"initializeV2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcInitializeV2 = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'initializeV2',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"initializeV2_1"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcInitializeV2_1 = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'initializeV2_1',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"initializeV2_2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcInitializeV2_2 = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'initializeV2_2',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"mint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcMint = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'mint',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcPause = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'pause',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"permit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcPermit = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'permit',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"receiveWithAuthorization"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcReceiveWithAuthorization = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'receiveWithAuthorization',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"removeMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcRemoveMinter = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'removeMinter',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"rescueERC20"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcRescueErc20 = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'rescueERC20',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcTransfer = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'transfer',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'transferFrom',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"transferWithAuthorization"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcTransferWithAuthorization = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'transferWithAuthorization',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"unBlacklist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcUnBlacklist = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'unBlacklist',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcUnpause = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'unpause',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"updateBlacklister"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcUpdateBlacklister = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'updateBlacklister',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"updateMasterMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcUpdateMasterMinter = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'updateMasterMinter',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"updatePauser"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcUpdatePauser = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'updatePauser',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link usdcAbi}__ and `functionName` set to `"updateRescuer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const simulateUsdcUpdateRescuer = /*#__PURE__*/ createSimulateContract({
  abi: usdcAbi,
  address: usdcAddress,
  functionName: 'updateRescuer',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link usdcAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const watchUsdcEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"Approval"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const watchUsdcApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'Approval',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"AuthorizationCanceled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const watchUsdcAuthorizationCanceledEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'AuthorizationCanceled',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"AuthorizationUsed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const watchUsdcAuthorizationUsedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'AuthorizationUsed',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"Blacklisted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const watchUsdcBlacklistedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'Blacklisted',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"BlacklisterChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const watchUsdcBlacklisterChangedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'BlacklisterChanged',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"Burn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const watchUsdcBurnEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'Burn',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"MasterMinterChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const watchUsdcMasterMinterChangedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'MasterMinterChanged',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"Mint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const watchUsdcMintEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'Mint',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"MinterConfigured"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const watchUsdcMinterConfiguredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'MinterConfigured',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"MinterRemoved"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const watchUsdcMinterRemovedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'MinterRemoved',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const watchUsdcOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'OwnershipTransferred',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"Pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const watchUsdcPauseEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'Pause',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"PauserChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const watchUsdcPauserChangedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'PauserChanged',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"RescuerChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const watchUsdcRescuerChangedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'RescuerChanged',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"Transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const watchUsdcTransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'Transfer',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"UnBlacklisted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const watchUsdcUnBlacklistedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'UnBlacklisted',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link usdcAbi}__ and `eventName` set to `"Unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xEbCC972B6B3eB15C0592BE1871838963d0B94278)
 */
export const watchUsdcUnpauseEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: usdcAbi,
  address: usdcAddress,
  eventName: 'Unpause',
});
