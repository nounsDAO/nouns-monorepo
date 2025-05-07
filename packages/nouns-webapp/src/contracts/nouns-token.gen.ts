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
// NounsToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const nounsTokenAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_noundersDAO', internalType: 'address', type: 'address' },
      { name: '_minter', internalType: 'address', type: 'address' },
      { name: '_descriptor', internalType: 'contract INounsDescriptor', type: 'address' },
      { name: '_seeder', internalType: 'contract INounsSeeder', type: 'address' },
      { name: '_proxyRegistry', internalType: 'contract IProxyRegistry', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'delegator', internalType: 'address', type: 'address', indexed: true },
      { name: 'fromDelegate', internalType: 'address', type: 'address', indexed: true },
      { name: 'toDelegate', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'DelegateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'delegate', internalType: 'address', type: 'address', indexed: true },
      { name: 'previousBalance', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newBalance', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'DelegateVotesChanged',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'DescriptorLocked' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'descriptor',
        internalType: 'contract INounsDescriptor',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'DescriptorUpdated',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'MinterLocked' },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'minter', internalType: 'address', type: 'address', indexed: false }],
    name: 'MinterUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true }],
    name: 'NounBurned',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'seed',
        internalType: 'struct INounsSeeder.Seed',
        type: 'tuple',
        components: [
          { name: 'background', internalType: 'uint48', type: 'uint48' },
          { name: 'body', internalType: 'uint48', type: 'uint48' },
          { name: 'accessory', internalType: 'uint48', type: 'uint48' },
          { name: 'head', internalType: 'uint48', type: 'uint48' },
          { name: 'glasses', internalType: 'uint48', type: 'uint48' },
        ],
        indexed: false,
      },
    ],
    name: 'NounCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'noundersDAO', internalType: 'address', type: 'address', indexed: false }],
    name: 'NoundersDAOUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'SeederLocked' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'seeder', internalType: 'contract INounsSeeder', type: 'address', indexed: false },
    ],
    name: 'SeederUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DELEGATION_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DOMAIN_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'nounId', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'checkpoints',
    outputs: [
      { name: 'fromBlock', internalType: 'uint32', type: 'uint32' },
      { name: 'votes', internalType: 'uint96', type: 'uint96' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'contractURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'dataURI',
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
    inputs: [{ name: 'delegatee', internalType: 'address', type: 'address' }],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegatee', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'delegator', internalType: 'address', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'descriptor',
    outputs: [{ name: '', internalType: 'contract INounsDescriptor', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getCurrentVotes',
    outputs: [{ name: '', internalType: 'uint96', type: 'uint96' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPriorVotes',
    outputs: [{ name: '', internalType: 'uint96', type: 'uint96' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isDescriptorLocked',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isMinterLocked',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isSeederLocked',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lockDescriptor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'function', inputs: [], name: 'lockMinter', outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', inputs: [], name: 'lockSeeder', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'mint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minter',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'noundersDAO',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'numCheckpoints',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
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
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxyRegistry',
    outputs: [{ name: '', internalType: 'contract IProxyRegistry', type: 'address' }],
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
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'seeder',
    outputs: [{ name: '', internalType: 'contract INounsSeeder', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'seeds',
    outputs: [
      { name: 'background', internalType: 'uint48', type: 'uint48' },
      { name: 'body', internalType: 'uint48', type: 'uint48' },
      { name: 'accessory', internalType: 'uint48', type: 'uint48' },
      { name: 'head', internalType: 'uint48', type: 'uint48' },
      { name: 'glasses', internalType: 'uint48', type: 'uint48' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newContractURIHash', internalType: 'string', type: 'string' }],
    name: 'setContractURIHash',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_descriptor', internalType: 'contract INounsDescriptor', type: 'address' }],
    name: 'setDescriptor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_minter', internalType: 'address', type: 'address' }],
    name: 'setMinter',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_noundersDAO', internalType: 'address', type: 'address' }],
    name: 'setNoundersDAO',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_seeder', internalType: 'contract INounsSeeder', type: 'address' }],
    name: 'setSeeder',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
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
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
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
    inputs: [{ name: 'delegator', internalType: 'address', type: 'address' }],
    name: 'votesToDelegate',
    outputs: [{ name: '', internalType: 'uint96', type: 'uint96' }],
    stateMutability: 'view',
  },
] as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const nounsTokenAddress = {
  1: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
  11155111: '0x4C4674bb72a096855496a7204962297bd7e12b85',
} as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const nounsTokenConfig = { address: nounsTokenAddress, abi: nounsTokenAbi } as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsToken = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"DELEGATION_TYPEHASH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenDelegationTypehash = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'DELEGATION_TYPEHASH',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"DOMAIN_TYPEHASH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenDomainTypehash = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'DOMAIN_TYPEHASH',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"balanceOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'balanceOf',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"checkpoints"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenCheckpoints = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'checkpoints',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"contractURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenContractUri = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'contractURI',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"dataURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenDataUri = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'dataURI',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"decimals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenDecimals = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'decimals',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"delegates"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenDelegates = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'delegates',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"descriptor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenDescriptor = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'descriptor',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"getApproved"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenGetApproved = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'getApproved',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"getCurrentVotes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenGetCurrentVotes = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'getCurrentVotes',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"getPriorVotes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenGetPriorVotes = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'getPriorVotes',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"isApprovedForAll"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenIsApprovedForAll = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'isApprovedForAll',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"isDescriptorLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenIsDescriptorLocked = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'isDescriptorLocked',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"isMinterLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenIsMinterLocked = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'isMinterLocked',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"isSeederLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenIsSeederLocked = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'isSeederLocked',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"minter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenMinter = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'minter',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"name"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenName = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'name',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"nonces"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenNonces = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'nonces',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"noundersDAO"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenNoundersDao = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'noundersDAO',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"numCheckpoints"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenNumCheckpoints = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'numCheckpoints',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenOwner = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'owner',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"ownerOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenOwnerOf = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'ownerOf',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"proxyRegistry"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenProxyRegistry = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'proxyRegistry',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"seeder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenSeeder = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'seeder',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"seeds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenSeeds = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'seeds',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"supportsInterface"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenSupportsInterface = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'supportsInterface',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"symbol"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenSymbol = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'symbol',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"tokenByIndex"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenTokenByIndex = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'tokenByIndex',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"tokenOfOwnerByIndex"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenTokenOfOwnerByIndex = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'tokenOfOwnerByIndex',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"tokenURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenTokenUri = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'tokenURI',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"totalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'totalSupply',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"votesToDelegate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useReadNounsTokenVotesToDelegate = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'votesToDelegate',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWriteNounsToken = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWriteNounsTokenApprove = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'approve',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"burn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWriteNounsTokenBurn = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'burn',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"delegate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWriteNounsTokenDelegate = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'delegate',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"delegateBySig"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWriteNounsTokenDelegateBySig = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'delegateBySig',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"lockDescriptor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWriteNounsTokenLockDescriptor = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'lockDescriptor',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"lockMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWriteNounsTokenLockMinter = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'lockMinter',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"lockSeeder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWriteNounsTokenLockSeeder = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'lockSeeder',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"mint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWriteNounsTokenMint = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'mint',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWriteNounsTokenRenounceOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"safeTransferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWriteNounsTokenSafeTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'safeTransferFrom',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setApprovalForAll"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWriteNounsTokenSetApprovalForAll = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setApprovalForAll',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setContractURIHash"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWriteNounsTokenSetContractUriHash = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setContractURIHash',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setDescriptor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWriteNounsTokenSetDescriptor = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setDescriptor',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWriteNounsTokenSetMinter = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setMinter',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setNoundersDAO"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWriteNounsTokenSetNoundersDao = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setNoundersDAO',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setSeeder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWriteNounsTokenSetSeeder = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setSeeder',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWriteNounsTokenTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'transferFrom',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWriteNounsTokenTransferOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useSimulateNounsToken = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useSimulateNounsTokenApprove = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'approve',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"burn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useSimulateNounsTokenBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'burn',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"delegate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useSimulateNounsTokenDelegate = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'delegate',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"delegateBySig"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useSimulateNounsTokenDelegateBySig = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'delegateBySig',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"lockDescriptor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useSimulateNounsTokenLockDescriptor = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'lockDescriptor',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"lockMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useSimulateNounsTokenLockMinter = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'lockMinter',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"lockSeeder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useSimulateNounsTokenLockSeeder = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'lockSeeder',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"mint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useSimulateNounsTokenMint = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'mint',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useSimulateNounsTokenRenounceOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"safeTransferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useSimulateNounsTokenSafeTransferFrom = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'safeTransferFrom',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setApprovalForAll"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useSimulateNounsTokenSetApprovalForAll = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setApprovalForAll',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setContractURIHash"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useSimulateNounsTokenSetContractUriHash = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setContractURIHash',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setDescriptor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useSimulateNounsTokenSetDescriptor = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setDescriptor',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useSimulateNounsTokenSetMinter = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setMinter',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setNoundersDAO"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useSimulateNounsTokenSetNoundersDao = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setNoundersDAO',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setSeeder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useSimulateNounsTokenSetSeeder = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setSeeder',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useSimulateNounsTokenTransferFrom = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'transferFrom',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useSimulateNounsTokenTransferOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWatchNounsTokenEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"Approval"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWatchNounsTokenApprovalEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'Approval',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"ApprovalForAll"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWatchNounsTokenApprovalForAllEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'ApprovalForAll',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"DelegateChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWatchNounsTokenDelegateChangedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'DelegateChanged',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"DelegateVotesChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWatchNounsTokenDelegateVotesChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsTokenAbi,
    address: nounsTokenAddress,
    eventName: 'DelegateVotesChanged',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"DescriptorLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWatchNounsTokenDescriptorLockedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'DescriptorLocked',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"DescriptorUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWatchNounsTokenDescriptorUpdatedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'DescriptorUpdated',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"MinterLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWatchNounsTokenMinterLockedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'MinterLocked',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"MinterUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWatchNounsTokenMinterUpdatedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'MinterUpdated',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"NounBurned"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWatchNounsTokenNounBurnedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'NounBurned',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"NounCreated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWatchNounsTokenNounCreatedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'NounCreated',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"NoundersDAOUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWatchNounsTokenNoundersDaoUpdatedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'NoundersDAOUpdated',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWatchNounsTokenOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsTokenAbi,
    address: nounsTokenAddress,
    eventName: 'OwnershipTransferred',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"SeederLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWatchNounsTokenSeederLockedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'SeederLocked',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"SeederUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWatchNounsTokenSeederUpdatedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'SeederUpdated',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"Transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const useWatchNounsTokenTransferEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'Transfer',
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsToken = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"DELEGATION_TYPEHASH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenDelegationTypehash = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'DELEGATION_TYPEHASH',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"DOMAIN_TYPEHASH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenDomainTypehash = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'DOMAIN_TYPEHASH',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"balanceOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenBalanceOf = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'balanceOf',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"checkpoints"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenCheckpoints = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'checkpoints',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"contractURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenContractUri = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'contractURI',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"dataURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenDataUri = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'dataURI',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"decimals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenDecimals = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'decimals',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"delegates"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenDelegates = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'delegates',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"descriptor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenDescriptor = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'descriptor',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"getApproved"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenGetApproved = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'getApproved',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"getCurrentVotes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenGetCurrentVotes = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'getCurrentVotes',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"getPriorVotes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenGetPriorVotes = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'getPriorVotes',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"isApprovedForAll"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenIsApprovedForAll = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'isApprovedForAll',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"isDescriptorLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenIsDescriptorLocked = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'isDescriptorLocked',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"isMinterLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenIsMinterLocked = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'isMinterLocked',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"isSeederLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenIsSeederLocked = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'isSeederLocked',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"minter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenMinter = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'minter',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"name"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenName = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'name',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"nonces"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenNonces = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'nonces',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"noundersDAO"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenNoundersDao = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'noundersDAO',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"numCheckpoints"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenNumCheckpoints = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'numCheckpoints',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenOwner = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'owner',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"ownerOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenOwnerOf = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'ownerOf',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"proxyRegistry"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenProxyRegistry = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'proxyRegistry',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"seeder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenSeeder = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'seeder',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"seeds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenSeeds = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'seeds',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"supportsInterface"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenSupportsInterface = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'supportsInterface',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"symbol"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenSymbol = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'symbol',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"tokenByIndex"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenTokenByIndex = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'tokenByIndex',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"tokenOfOwnerByIndex"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenTokenOfOwnerByIndex = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'tokenOfOwnerByIndex',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"tokenURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenTokenUri = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'tokenURI',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"totalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenTotalSupply = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'totalSupply',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"votesToDelegate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const readNounsTokenVotesToDelegate = /*#__PURE__*/ createReadContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'votesToDelegate',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const writeNounsToken = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const writeNounsTokenApprove = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'approve',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"burn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const writeNounsTokenBurn = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'burn',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"delegate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const writeNounsTokenDelegate = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'delegate',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"delegateBySig"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const writeNounsTokenDelegateBySig = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'delegateBySig',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"lockDescriptor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const writeNounsTokenLockDescriptor = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'lockDescriptor',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"lockMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const writeNounsTokenLockMinter = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'lockMinter',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"lockSeeder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const writeNounsTokenLockSeeder = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'lockSeeder',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"mint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const writeNounsTokenMint = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'mint',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const writeNounsTokenRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"safeTransferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const writeNounsTokenSafeTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'safeTransferFrom',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setApprovalForAll"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const writeNounsTokenSetApprovalForAll = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setApprovalForAll',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setContractURIHash"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const writeNounsTokenSetContractUriHash = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setContractURIHash',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setDescriptor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const writeNounsTokenSetDescriptor = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setDescriptor',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const writeNounsTokenSetMinter = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setMinter',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setNoundersDAO"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const writeNounsTokenSetNoundersDao = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setNoundersDAO',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setSeeder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const writeNounsTokenSetSeeder = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setSeeder',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const writeNounsTokenTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'transferFrom',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const writeNounsTokenTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const simulateNounsToken = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const simulateNounsTokenApprove = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'approve',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"burn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const simulateNounsTokenBurn = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'burn',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"delegate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const simulateNounsTokenDelegate = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'delegate',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"delegateBySig"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const simulateNounsTokenDelegateBySig = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'delegateBySig',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"lockDescriptor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const simulateNounsTokenLockDescriptor = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'lockDescriptor',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"lockMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const simulateNounsTokenLockMinter = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'lockMinter',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"lockSeeder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const simulateNounsTokenLockSeeder = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'lockSeeder',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"mint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const simulateNounsTokenMint = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'mint',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const simulateNounsTokenRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"safeTransferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const simulateNounsTokenSafeTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'safeTransferFrom',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setApprovalForAll"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const simulateNounsTokenSetApprovalForAll = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setApprovalForAll',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setContractURIHash"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const simulateNounsTokenSetContractUriHash = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setContractURIHash',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setDescriptor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const simulateNounsTokenSetDescriptor = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setDescriptor',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setMinter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const simulateNounsTokenSetMinter = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setMinter',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setNoundersDAO"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const simulateNounsTokenSetNoundersDao = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setNoundersDAO',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"setSeeder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const simulateNounsTokenSetSeeder = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'setSeeder',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const simulateNounsTokenTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'transferFrom',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const simulateNounsTokenTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const watchNounsTokenEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"Approval"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const watchNounsTokenApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'Approval',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"ApprovalForAll"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const watchNounsTokenApprovalForAllEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'ApprovalForAll',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"DelegateChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const watchNounsTokenDelegateChangedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'DelegateChanged',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"DelegateVotesChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const watchNounsTokenDelegateVotesChangedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'DelegateVotesChanged',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"DescriptorLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const watchNounsTokenDescriptorLockedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'DescriptorLocked',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"DescriptorUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const watchNounsTokenDescriptorUpdatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'DescriptorUpdated',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"MinterLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const watchNounsTokenMinterLockedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'MinterLocked',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"MinterUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const watchNounsTokenMinterUpdatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'MinterUpdated',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"NounBurned"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const watchNounsTokenNounBurnedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'NounBurned',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"NounCreated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const watchNounsTokenNounCreatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'NounCreated',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"NoundersDAOUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const watchNounsTokenNoundersDaoUpdatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'NoundersDAOUpdated',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const watchNounsTokenOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'OwnershipTransferred',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"SeederLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const watchNounsTokenSeederLockedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'SeederLocked',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"SeederUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const watchNounsTokenSeederUpdatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'SeederUpdated',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenAbi}__ and `eventName` set to `"Transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x4c4674bb72a096855496a7204962297bd7e12b85)
 */
export const watchNounsTokenTransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenAbi,
  address: nounsTokenAddress,
  eventName: 'Transfer',
});
