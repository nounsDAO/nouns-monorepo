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
// mETHStaking
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const mEthStakingAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'DoesNotReceiveETH' },
  { type: 'error', inputs: [], name: 'InvalidConfiguration' },
  {
    type: 'error',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'InvalidDepositRoot',
  },
  {
    type: 'error',
    inputs: [{ name: '', internalType: 'bytes12', type: 'bytes12' }],
    name: 'InvalidWithdrawalCredentialsNotETH1',
  },
  {
    type: 'error',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'InvalidWithdrawalCredentialsWrongAddress',
  },
  {
    type: 'error',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'InvalidWithdrawalCredentialsWrongLength',
  },
  { type: 'error', inputs: [], name: 'MaximumMETHSupplyExceeded' },
  { type: 'error', inputs: [], name: 'MaximumValidatorDepositExceeded' },
  { type: 'error', inputs: [], name: 'MinimumStakeBoundNotSatisfied' },
  { type: 'error', inputs: [], name: 'MinimumUnstakeBoundNotSatisfied' },
  { type: 'error', inputs: [], name: 'MinimumValidatorDepositNotSatisfied' },
  { type: 'error', inputs: [], name: 'NotEnoughDepositETH' },
  { type: 'error', inputs: [], name: 'NotEnoughUnallocatedETH' },
  { type: 'error', inputs: [], name: 'NotReturnsAggregator' },
  { type: 'error', inputs: [], name: 'NotUnstakeRequestsManager' },
  { type: 'error', inputs: [], name: 'Paused' },
  { type: 'error', inputs: [], name: 'PreviouslyUsedValidator' },
  {
    type: 'error',
    inputs: [
      { name: 'methAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'expectedMinimum', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'StakeBelowMinimumMETHAmount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'ethAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'expectedMinimum', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'UnstakeBelowMinimumETHAmount',
  },
  { type: 'error', inputs: [], name: 'ZeroAddress' },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'AllocatedETHToDeposits',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'AllocatedETHToUnstakeRequestsManager',
  },
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
      { name: 'setterSelector', internalType: 'bytes4', type: 'bytes4', indexed: true },
      { name: 'setterSignature', internalType: 'string', type: 'string', indexed: false },
      { name: 'value', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'ProtocolConfigChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'ReturnsReceived',
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
      { name: 'staker', internalType: 'address', type: 'address', indexed: true },
      { name: 'ethAmount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'mETHAmount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Staked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'staker', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'UnstakeRequestClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'staker', internalType: 'address', type: 'address', indexed: true },
      { name: 'ethAmount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'mETHLocked', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'UnstakeRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'operatorID', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'pubkey', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'amountDeposited', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ValidatorInitiated',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'ALLOCATOR_SERVICE_ROLE',
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
    name: 'INITIATOR_SERVICE_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'STAKING_ALLOWLIST_MANAGER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'STAKING_ALLOWLIST_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'STAKING_MANAGER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TOP_UP_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'allocateToUnstakeRequestsManager', internalType: 'uint256', type: 'uint256' },
      { name: 'allocateToDeposits', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'allocateETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allocatedETHForDeposits',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'unstakeRequestID', internalType: 'uint256', type: 'uint256' }],
    name: 'claimUnstakeRequest',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'depositContract',
    outputs: [{ name: '', internalType: 'contract IDepositContract', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'ethAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'ethToMETH',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'exchangeAdjustmentRate',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
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
    inputs: [],
    name: 'initializationBlockNumber',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'init',
        internalType: 'struct Staking.Init',
        type: 'tuple',
        components: [
          { name: 'admin', internalType: 'address', type: 'address' },
          { name: 'manager', internalType: 'address', type: 'address' },
          { name: 'allocatorService', internalType: 'address', type: 'address' },
          { name: 'initiatorService', internalType: 'address', type: 'address' },
          { name: 'returnsAggregator', internalType: 'address', type: 'address' },
          { name: 'withdrawalWallet', internalType: 'address', type: 'address' },
          { name: 'mETH', internalType: 'contract IMETH', type: 'address' },
          { name: 'depositContract', internalType: 'contract IDepositContract', type: 'address' },
          { name: 'oracle', internalType: 'contract IOracleReadRecord', type: 'address' },
          { name: 'pauser', internalType: 'contract IPauserRead', type: 'address' },
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
    inputs: [
      {
        name: 'validators',
        internalType: 'struct Staking.ValidatorParams[]',
        type: 'tuple[]',
        components: [
          { name: 'operatorID', internalType: 'uint256', type: 'uint256' },
          { name: 'depositAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'pubkey', internalType: 'bytes', type: 'bytes' },
          { name: 'withdrawalCredentials', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
          { name: 'depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: 'expectedDepositRoot', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'initiateValidatorsWithDeposits',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isStakingAllowlist',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'mETH',
    outputs: [{ name: '', internalType: 'contract IMETH', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'mETHAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'mETHToETH',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maximumDepositAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maximumMETHSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minimumDepositAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minimumStakeBound',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minimumUnstakeBound',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'numInitiatedValidators',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'oracle',
    outputs: [{ name: '', internalType: 'contract IOracleReadRecord', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pauser',
    outputs: [{ name: '', internalType: 'contract IPauserRead', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'receiveFromUnstakeRequestsManager',
    outputs: [],
    stateMutability: 'payable',
  },
  { type: 'function', inputs: [], name: 'receiveReturns', outputs: [], stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'reclaimAllocatedETHSurplus',
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
    inputs: [],
    name: 'returnsAggregator',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
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
    inputs: [{ name: 'exchangeAdjustmentRate_', internalType: 'uint16', type: 'uint16' }],
    name: 'setExchangeAdjustmentRate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'maximumDepositAmount_', internalType: 'uint256', type: 'uint256' }],
    name: 'setMaximumDepositAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'maximumMETHSupply_', internalType: 'uint256', type: 'uint256' }],
    name: 'setMaximumMETHSupply',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'minimumDepositAmount_', internalType: 'uint256', type: 'uint256' }],
    name: 'setMinimumDepositAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'minimumStakeBound_', internalType: 'uint256', type: 'uint256' }],
    name: 'setMinimumStakeBound',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'minimumUnstakeBound_', internalType: 'uint256', type: 'uint256' }],
    name: 'setMinimumUnstakeBound',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'isStakingAllowlist_', internalType: 'bool', type: 'bool' }],
    name: 'setStakingAllowlist',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'withdrawalWallet_', internalType: 'address', type: 'address' }],
    name: 'setWithdrawalWallet',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'minMETHAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'stake',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  { type: 'function', inputs: [], name: 'topUp', outputs: [], stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'totalControlled',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalDepositedInValidators',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unallocatedETH',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'methAmount', internalType: 'uint128', type: 'uint128' },
      { name: 'minETHAmount', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'unstakeRequest',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'unstakeRequestID', internalType: 'uint256', type: 'uint256' }],
    name: 'unstakeRequestInfo',
    outputs: [
      { name: '', internalType: 'bool', type: 'bool' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'methAmount', internalType: 'uint128', type: 'uint128' },
      { name: 'minETHAmount', internalType: 'uint128', type: 'uint128' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'unstakeRequestWithPermit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unstakeRequestsManager',
    outputs: [{ name: '', internalType: 'contract IUnstakeRequestsManager', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'pubkey', internalType: 'bytes', type: 'bytes' }],
    name: 'usedValidators',
    outputs: [{ name: 'exists', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdrawalWallet',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const mEthStakingAddress = {
  1: '0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f',
  11155111: '0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const mEthStakingConfig = { address: mEthStakingAddress, abi: mEthStakingAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStaking = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"ALLOCATOR_SERVICE_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingAllocatorServiceRole = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'ALLOCATOR_SERVICE_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingDefaultAdminRole = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'DEFAULT_ADMIN_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"INITIATOR_SERVICE_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingInitiatorServiceRole = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'INITIATOR_SERVICE_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"STAKING_ALLOWLIST_MANAGER_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingStakingAllowlistManagerRole = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'STAKING_ALLOWLIST_MANAGER_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"STAKING_ALLOWLIST_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingStakingAllowlistRole = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'STAKING_ALLOWLIST_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"STAKING_MANAGER_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingStakingManagerRole = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'STAKING_MANAGER_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"TOP_UP_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingTopUpRole = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'TOP_UP_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"allocatedETHForDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingAllocatedEthForDeposits = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'allocatedETHForDeposits',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"depositContract"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingDepositContract = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'depositContract',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"ethToMETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingEthToMeth = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'ethToMETH',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"exchangeAdjustmentRate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingExchangeAdjustmentRate = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'exchangeAdjustmentRate',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"getRoleAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingGetRoleAdmin = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'getRoleAdmin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"getRoleMember"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingGetRoleMember = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'getRoleMember',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"getRoleMemberCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingGetRoleMemberCount = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'getRoleMemberCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"hasRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingHasRole = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'hasRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"initializationBlockNumber"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingInitializationBlockNumber = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'initializationBlockNumber',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"isStakingAllowlist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingIsStakingAllowlist = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'isStakingAllowlist',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"mETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingMEth = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'mETH',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"mETHToETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingMEthToEth = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'mETHToETH',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"maximumDepositAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingMaximumDepositAmount = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'maximumDepositAmount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"maximumMETHSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingMaximumMethSupply = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'maximumMETHSupply',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"minimumDepositAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingMinimumDepositAmount = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'minimumDepositAmount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"minimumStakeBound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingMinimumStakeBound = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'minimumStakeBound',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"minimumUnstakeBound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingMinimumUnstakeBound = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'minimumUnstakeBound',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"numInitiatedValidators"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingNumInitiatedValidators = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'numInitiatedValidators',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"oracle"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingOracle = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'oracle',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"pauser"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingPauser = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'pauser',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"returnsAggregator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingReturnsAggregator = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'returnsAggregator',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"supportsInterface"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingSupportsInterface = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"totalControlled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingTotalControlled = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'totalControlled',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"totalDepositedInValidators"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingTotalDepositedInValidators = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'totalDepositedInValidators',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"unallocatedETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingUnallocatedEth = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'unallocatedETH',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"unstakeRequestInfo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingUnstakeRequestInfo = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'unstakeRequestInfo',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"unstakeRequestsManager"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingUnstakeRequestsManager = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'unstakeRequestsManager',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"usedValidators"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingUsedValidators = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'usedValidators',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"withdrawalWallet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingWithdrawalWallet = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'withdrawalWallet',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStaking = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"allocateETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingAllocateEth = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'allocateETH',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"claimUnstakeRequest"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingClaimUnstakeRequest = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'claimUnstakeRequest',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"grantRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingGrantRole = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'grantRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"initiateValidatorsWithDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingInitiateValidatorsWithDeposits =
  /*#__PURE__*/ createUseWriteContract({
    abi: mEthStakingAbi,
    address: mEthStakingAddress,
    functionName: 'initiateValidatorsWithDeposits',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"receiveFromUnstakeRequestsManager"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingReceiveFromUnstakeRequestsManager =
  /*#__PURE__*/ createUseWriteContract({
    abi: mEthStakingAbi,
    address: mEthStakingAddress,
    functionName: 'receiveFromUnstakeRequestsManager',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"receiveReturns"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingReceiveReturns = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'receiveReturns',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"reclaimAllocatedETHSurplus"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingReclaimAllocatedEthSurplus = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'reclaimAllocatedETHSurplus',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"renounceRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingRenounceRole = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'renounceRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"revokeRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingRevokeRole = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'revokeRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setExchangeAdjustmentRate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingSetExchangeAdjustmentRate = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setExchangeAdjustmentRate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMaximumDepositAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingSetMaximumDepositAmount = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setMaximumDepositAmount',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMaximumMETHSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingSetMaximumMethSupply = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setMaximumMETHSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMinimumDepositAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingSetMinimumDepositAmount = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setMinimumDepositAmount',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMinimumStakeBound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingSetMinimumStakeBound = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setMinimumStakeBound',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMinimumUnstakeBound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingSetMinimumUnstakeBound = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setMinimumUnstakeBound',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setStakingAllowlist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingSetStakingAllowlist = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setStakingAllowlist',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setWithdrawalWallet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingSetWithdrawalWallet = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setWithdrawalWallet',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"stake"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingStake = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'stake',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"topUp"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingTopUp = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'topUp',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"unstakeRequest"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingUnstakeRequest = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'unstakeRequest',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"unstakeRequestWithPermit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWriteMEthStakingUnstakeRequestWithPermit = /*#__PURE__*/ createUseWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'unstakeRequestWithPermit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStaking = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"allocateETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingAllocateEth = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'allocateETH',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"claimUnstakeRequest"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingClaimUnstakeRequest = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'claimUnstakeRequest',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"grantRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingGrantRole = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'grantRole',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingInitialize = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"initiateValidatorsWithDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingInitiateValidatorsWithDeposits =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mEthStakingAbi,
    address: mEthStakingAddress,
    functionName: 'initiateValidatorsWithDeposits',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"receiveFromUnstakeRequestsManager"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingReceiveFromUnstakeRequestsManager =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mEthStakingAbi,
    address: mEthStakingAddress,
    functionName: 'receiveFromUnstakeRequestsManager',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"receiveReturns"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingReceiveReturns = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'receiveReturns',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"reclaimAllocatedETHSurplus"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingReclaimAllocatedEthSurplus =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mEthStakingAbi,
    address: mEthStakingAddress,
    functionName: 'reclaimAllocatedETHSurplus',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"renounceRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingRenounceRole = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'renounceRole',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"revokeRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingRevokeRole = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'revokeRole',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setExchangeAdjustmentRate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingSetExchangeAdjustmentRate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mEthStakingAbi,
    address: mEthStakingAddress,
    functionName: 'setExchangeAdjustmentRate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMaximumDepositAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingSetMaximumDepositAmount =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mEthStakingAbi,
    address: mEthStakingAddress,
    functionName: 'setMaximumDepositAmount',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMaximumMETHSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingSetMaximumMethSupply = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setMaximumMETHSupply',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMinimumDepositAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingSetMinimumDepositAmount =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mEthStakingAbi,
    address: mEthStakingAddress,
    functionName: 'setMinimumDepositAmount',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMinimumStakeBound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingSetMinimumStakeBound = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setMinimumStakeBound',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMinimumUnstakeBound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingSetMinimumUnstakeBound = /*#__PURE__*/ createUseSimulateContract(
  { abi: mEthStakingAbi, address: mEthStakingAddress, functionName: 'setMinimumUnstakeBound' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setStakingAllowlist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingSetStakingAllowlist = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setStakingAllowlist',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setWithdrawalWallet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingSetWithdrawalWallet = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setWithdrawalWallet',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"stake"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingStake = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'stake',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"topUp"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingTopUp = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'topUp',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"unstakeRequest"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingUnstakeRequest = /*#__PURE__*/ createUseSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'unstakeRequest',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"unstakeRequestWithPermit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useSimulateMEthStakingUnstakeRequestWithPermit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mEthStakingAbi,
    address: mEthStakingAddress,
    functionName: 'unstakeRequestWithPermit',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWatchMEthStakingEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"AllocatedETHToDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWatchMEthStakingAllocatedEthToDepositsEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mEthStakingAbi,
    address: mEthStakingAddress,
    eventName: 'AllocatedETHToDeposits',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"AllocatedETHToUnstakeRequestsManager"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWatchMEthStakingAllocatedEthToUnstakeRequestsManagerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mEthStakingAbi,
    address: mEthStakingAddress,
    eventName: 'AllocatedETHToUnstakeRequestsManager',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"Initialized"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWatchMEthStakingInitializedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  eventName: 'Initialized',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"ProtocolConfigChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWatchMEthStakingProtocolConfigChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mEthStakingAbi,
    address: mEthStakingAddress,
    eventName: 'ProtocolConfigChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"ReturnsReceived"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWatchMEthStakingReturnsReceivedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  eventName: 'ReturnsReceived',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"RoleAdminChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWatchMEthStakingRoleAdminChangedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  eventName: 'RoleAdminChanged',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"RoleGranted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWatchMEthStakingRoleGrantedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  eventName: 'RoleGranted',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"RoleRevoked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWatchMEthStakingRoleRevokedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  eventName: 'RoleRevoked',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"Staked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWatchMEthStakingStakedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  eventName: 'Staked',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"UnstakeRequestClaimed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWatchMEthStakingUnstakeRequestClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mEthStakingAbi,
    address: mEthStakingAddress,
    eventName: 'UnstakeRequestClaimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"UnstakeRequested"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWatchMEthStakingUnstakeRequestedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  eventName: 'UnstakeRequested',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"ValidatorInitiated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useWatchMEthStakingValidatorInitiatedEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: mEthStakingAbi, address: mEthStakingAddress, eventName: 'ValidatorInitiated' },
)

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStaking = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"ALLOCATOR_SERVICE_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingAllocatorServiceRole = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'ALLOCATOR_SERVICE_ROLE',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingDefaultAdminRole = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'DEFAULT_ADMIN_ROLE',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"INITIATOR_SERVICE_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingInitiatorServiceRole = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'INITIATOR_SERVICE_ROLE',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"STAKING_ALLOWLIST_MANAGER_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingStakingAllowlistManagerRole = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'STAKING_ALLOWLIST_MANAGER_ROLE',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"STAKING_ALLOWLIST_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingStakingAllowlistRole = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'STAKING_ALLOWLIST_ROLE',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"STAKING_MANAGER_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingStakingManagerRole = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'STAKING_MANAGER_ROLE',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"TOP_UP_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingTopUpRole = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'TOP_UP_ROLE',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"allocatedETHForDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingAllocatedEthForDeposits = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'allocatedETHForDeposits',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"depositContract"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingDepositContract = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'depositContract',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"ethToMETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingEthToMeth = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'ethToMETH',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"exchangeAdjustmentRate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingExchangeAdjustmentRate = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'exchangeAdjustmentRate',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"getRoleAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingGetRoleAdmin = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'getRoleAdmin',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"getRoleMember"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingGetRoleMember = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'getRoleMember',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"getRoleMemberCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingGetRoleMemberCount = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'getRoleMemberCount',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"hasRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingHasRole = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'hasRole',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"initializationBlockNumber"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingInitializationBlockNumber = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'initializationBlockNumber',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"isStakingAllowlist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingIsStakingAllowlist = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'isStakingAllowlist',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"mETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingMEth = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'mETH',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"mETHToETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingMEthToEth = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'mETHToETH',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"maximumDepositAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingMaximumDepositAmount = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'maximumDepositAmount',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"maximumMETHSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingMaximumMethSupply = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'maximumMETHSupply',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"minimumDepositAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingMinimumDepositAmount = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'minimumDepositAmount',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"minimumStakeBound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingMinimumStakeBound = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'minimumStakeBound',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"minimumUnstakeBound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingMinimumUnstakeBound = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'minimumUnstakeBound',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"numInitiatedValidators"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingNumInitiatedValidators = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'numInitiatedValidators',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"oracle"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingOracle = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'oracle',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"pauser"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingPauser = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'pauser',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"returnsAggregator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingReturnsAggregator = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'returnsAggregator',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"supportsInterface"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingSupportsInterface = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"totalControlled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingTotalControlled = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'totalControlled',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"totalDepositedInValidators"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingTotalDepositedInValidators = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'totalDepositedInValidators',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"unallocatedETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingUnallocatedEth = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'unallocatedETH',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"unstakeRequestInfo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingUnstakeRequestInfo = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'unstakeRequestInfo',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"unstakeRequestsManager"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingUnstakeRequestsManager = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'unstakeRequestsManager',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"usedValidators"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingUsedValidators = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'usedValidators',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"withdrawalWallet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const readMEthStakingWithdrawalWallet = /*#__PURE__*/ createReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'withdrawalWallet',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStaking = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"allocateETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingAllocateEth = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'allocateETH',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"claimUnstakeRequest"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingClaimUnstakeRequest = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'claimUnstakeRequest',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"grantRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingGrantRole = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'grantRole',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingInitialize = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"initiateValidatorsWithDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingInitiateValidatorsWithDeposits = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'initiateValidatorsWithDeposits',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"receiveFromUnstakeRequestsManager"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingReceiveFromUnstakeRequestsManager = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'receiveFromUnstakeRequestsManager',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"receiveReturns"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingReceiveReturns = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'receiveReturns',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"reclaimAllocatedETHSurplus"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingReclaimAllocatedEthSurplus = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'reclaimAllocatedETHSurplus',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"renounceRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingRenounceRole = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'renounceRole',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"revokeRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingRevokeRole = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'revokeRole',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setExchangeAdjustmentRate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingSetExchangeAdjustmentRate = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setExchangeAdjustmentRate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMaximumDepositAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingSetMaximumDepositAmount = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setMaximumDepositAmount',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMaximumMETHSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingSetMaximumMethSupply = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setMaximumMETHSupply',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMinimumDepositAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingSetMinimumDepositAmount = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setMinimumDepositAmount',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMinimumStakeBound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingSetMinimumStakeBound = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setMinimumStakeBound',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMinimumUnstakeBound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingSetMinimumUnstakeBound = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setMinimumUnstakeBound',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setStakingAllowlist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingSetStakingAllowlist = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setStakingAllowlist',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setWithdrawalWallet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingSetWithdrawalWallet = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setWithdrawalWallet',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"stake"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingStake = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'stake',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"topUp"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingTopUp = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'topUp',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"unstakeRequest"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingUnstakeRequest = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'unstakeRequest',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"unstakeRequestWithPermit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const writeMEthStakingUnstakeRequestWithPermit = /*#__PURE__*/ createWriteContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'unstakeRequestWithPermit',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStaking = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"allocateETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingAllocateEth = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'allocateETH',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"claimUnstakeRequest"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingClaimUnstakeRequest = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'claimUnstakeRequest',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"grantRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingGrantRole = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'grantRole',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingInitialize = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"initiateValidatorsWithDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingInitiateValidatorsWithDeposits =
  /*#__PURE__*/ createSimulateContract({
    abi: mEthStakingAbi,
    address: mEthStakingAddress,
    functionName: 'initiateValidatorsWithDeposits',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"receiveFromUnstakeRequestsManager"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingReceiveFromUnstakeRequestsManager =
  /*#__PURE__*/ createSimulateContract({
    abi: mEthStakingAbi,
    address: mEthStakingAddress,
    functionName: 'receiveFromUnstakeRequestsManager',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"receiveReturns"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingReceiveReturns = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'receiveReturns',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"reclaimAllocatedETHSurplus"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingReclaimAllocatedEthSurplus = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'reclaimAllocatedETHSurplus',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"renounceRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingRenounceRole = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'renounceRole',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"revokeRole"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingRevokeRole = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'revokeRole',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setExchangeAdjustmentRate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingSetExchangeAdjustmentRate = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setExchangeAdjustmentRate',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMaximumDepositAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingSetMaximumDepositAmount = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setMaximumDepositAmount',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMaximumMETHSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingSetMaximumMethSupply = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setMaximumMETHSupply',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMinimumDepositAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingSetMinimumDepositAmount = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setMinimumDepositAmount',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMinimumStakeBound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingSetMinimumStakeBound = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setMinimumStakeBound',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setMinimumUnstakeBound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingSetMinimumUnstakeBound = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setMinimumUnstakeBound',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setStakingAllowlist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingSetStakingAllowlist = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setStakingAllowlist',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"setWithdrawalWallet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingSetWithdrawalWallet = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'setWithdrawalWallet',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"stake"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingStake = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'stake',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"topUp"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingTopUp = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'topUp',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"unstakeRequest"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingUnstakeRequest = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'unstakeRequest',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"unstakeRequestWithPermit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const simulateMEthStakingUnstakeRequestWithPermit = /*#__PURE__*/ createSimulateContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'unstakeRequestWithPermit',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const watchMEthStakingEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"AllocatedETHToDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const watchMEthStakingAllocatedEthToDepositsEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  eventName: 'AllocatedETHToDeposits',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"AllocatedETHToUnstakeRequestsManager"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const watchMEthStakingAllocatedEthToUnstakeRequestsManagerEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: mEthStakingAbi,
    address: mEthStakingAddress,
    eventName: 'AllocatedETHToUnstakeRequestsManager',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"Initialized"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const watchMEthStakingInitializedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  eventName: 'Initialized',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"ProtocolConfigChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const watchMEthStakingProtocolConfigChangedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  eventName: 'ProtocolConfigChanged',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"ReturnsReceived"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const watchMEthStakingReturnsReceivedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  eventName: 'ReturnsReceived',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"RoleAdminChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const watchMEthStakingRoleAdminChangedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  eventName: 'RoleAdminChanged',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"RoleGranted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const watchMEthStakingRoleGrantedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  eventName: 'RoleGranted',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"RoleRevoked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const watchMEthStakingRoleRevokedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  eventName: 'RoleRevoked',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"Staked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const watchMEthStakingStakedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  eventName: 'Staked',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"UnstakeRequestClaimed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const watchMEthStakingUnstakeRequestClaimedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  eventName: 'UnstakeRequestClaimed',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"UnstakeRequested"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const watchMEthStakingUnstakeRequestedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  eventName: 'UnstakeRequested',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mEthStakingAbi}__ and `eventName` set to `"ValidatorInitiated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const watchMEthStakingValidatorInitiatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  eventName: 'ValidatorInitiated',
})
