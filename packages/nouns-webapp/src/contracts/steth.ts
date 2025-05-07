import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
} from 'wagmi/codegen';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// stETH
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const stEthAbi = [
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'resume',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'stop',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'hasInitialized',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'STAKING_CONTROL_ROLE',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [{ name: '_ethAmount', type: 'uint256' }],
    name: 'getSharesByPooledEth',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'isStakingPaused',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: '_sender', type: 'address' },
      { name: '_recipient', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [{ name: '_script', type: 'bytes' }],
    name: 'getEVMScriptExecutor',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: '_maxStakeLimit', type: 'uint256' },
      { name: '_stakeLimitIncreasePerBlock', type: 'uint256' },
    ],
    name: 'setStakingLimit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'RESUME_ROLE',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: '_lidoLocator', type: 'address' },
      { name: '_eip712StETH', type: 'address' },
    ],
    name: 'finalizeUpgrade_v2',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'pure',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'getRecoveryVault',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'getTotalPooledEther',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [{ name: '_newDepositedValidators', type: 'uint256' }],
    name: 'unsafeChangeDepositedValidators',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'PAUSE_ROLE',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_addedValue', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'getTreasury',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'isStopped',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'getBufferedEther',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: true,
    type: 'function',
    inputs: [
      { name: '_lidoLocator', type: 'address' },
      { name: '_eip712StETH', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    constant: false,
    payable: true,
    type: 'function',
    inputs: [],
    name: 'receiveELRewards',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'getWithdrawalCredentials',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'getCurrentStakeLimit',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'getStakeLimitFullInfo',
    outputs: [
      { name: 'isStakingPaused', type: 'bool' },
      { name: 'isStakingLimitSet', type: 'bool' },
      { name: 'currentStakeLimit', type: 'uint256' },
      { name: 'maxStakeLimit', type: 'uint256' },
      { name: 'maxStakeLimitGrowthBlocks', type: 'uint256' },
      { name: 'prevStakeLimit', type: 'uint256' },
      { name: 'prevStakeBlockNumber', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: '_sender', type: 'address' },
      { name: '_recipient', type: 'address' },
      { name: '_sharesAmount', type: 'uint256' },
    ],
    name: 'transferSharesFrom',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [{ name: '_account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'resumeStaking',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'getFeeDistribution',
    outputs: [
      { name: 'treasuryFeeBasisPoints', type: 'uint16' },
      { name: 'insuranceFeeBasisPoints', type: 'uint16' },
      { name: 'operatorsFeeBasisPoints', type: 'uint16' },
    ],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: true,
    type: 'function',
    inputs: [],
    name: 'receiveWithdrawals',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [{ name: '_sharesAmount', type: 'uint256' }],
    name: 'getPooledEthByShares',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [{ name: 'token', type: 'address' }],
    name: 'allowRecoverability',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'appId',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'getOracle',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'getContractVersion',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'getInitializationBlock',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: '_recipient', type: 'address' },
      { name: '_sharesAmount', type: 'uint256' },
    ],
    name: 'transferShares',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'getEIP712StETH',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [{ name: '', type: 'address' }],
    name: 'transferToVault',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [
      { name: '_sender', type: 'address' },
      { name: '_role', type: 'bytes32' },
      { name: '_params', type: 'uint256[]' },
    ],
    name: 'canPerform',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: true,
    type: 'function',
    inputs: [{ name: '_referral', type: 'address' }],
    name: 'submit',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_subtractedValue', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'getEVMScriptRegistry',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: '_recipient', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: '_maxDepositsCount', type: 'uint256' },
      { name: '_stakingModuleId', type: 'uint256' },
      { name: '_depositCalldata', type: 'bytes' },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'UNSAFE_CHANGE_DEPOSITED_VALIDATORS_ROLE',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'getBeaconStat',
    outputs: [
      { name: 'depositedValidators', type: 'uint256' },
      { name: 'beaconValidators', type: 'uint256' },
      { name: 'beaconBalance', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'removeStakingLimit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: '_reportTimestamp', type: 'uint256' },
      { name: '_timeElapsed', type: 'uint256' },
      { name: '_clValidators', type: 'uint256' },
      { name: '_clBalance', type: 'uint256' },
      { name: '_withdrawalVaultBalance', type: 'uint256' },
      { name: '_elRewardsVaultBalance', type: 'uint256' },
      { name: '_sharesRequestedToBurn', type: 'uint256' },
      { name: '_withdrawalFinalizationBatches', type: 'uint256[]' },
      { name: '_simulatedShareRate', type: 'uint256' },
    ],
    name: 'handleOracleReport',
    outputs: [{ name: 'postRebaseAmounts', type: 'uint256[4]' }],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'getFee',
    outputs: [{ name: 'totalFee', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'kernel',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'getTotalShares',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
      { name: '_deadline', type: 'uint256' },
      { name: '_v', type: 'uint8' },
      { name: '_r', type: 'bytes32' },
      { name: '_s', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'isPetrified',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'getLidoLocator',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'canDeposit',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'STAKING_PAUSE_ROLE',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'getDepositableEther',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [{ name: '_account', type: 'address' }],
    name: 'sharesOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: false,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'pauseStaking',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'getTotalELRewardsCollected',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  { payable: true, type: 'fallback', stateMutability: 'payable' },
  { type: 'event', anonymous: false, inputs: [], name: 'StakingPaused' },
  { type: 'event', anonymous: false, inputs: [], name: 'StakingResumed' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'maxStakeLimit', type: 'uint256', indexed: false },
      { name: 'stakeLimitIncreasePerBlock', type: 'uint256', indexed: false },
    ],
    name: 'StakingLimitSet',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'StakingLimitRemoved' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'reportTimestamp', type: 'uint256', indexed: true },
      { name: 'preCLValidators', type: 'uint256', indexed: false },
      { name: 'postCLValidators', type: 'uint256', indexed: false },
    ],
    name: 'CLValidatorsUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'depositedValidators', type: 'uint256', indexed: false }],
    name: 'DepositedValidatorsChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'reportTimestamp', type: 'uint256', indexed: true },
      { name: 'preCLBalance', type: 'uint256', indexed: false },
      { name: 'postCLBalance', type: 'uint256', indexed: false },
      { name: 'withdrawalsWithdrawn', type: 'uint256', indexed: false },
      { name: 'executionLayerRewardsWithdrawn', type: 'uint256', indexed: false },
      { name: 'postBufferedEther', type: 'uint256', indexed: false },
    ],
    name: 'ETHDistributed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'reportTimestamp', type: 'uint256', indexed: true },
      { name: 'timeElapsed', type: 'uint256', indexed: false },
      { name: 'preTotalShares', type: 'uint256', indexed: false },
      { name: 'preTotalEther', type: 'uint256', indexed: false },
      { name: 'postTotalShares', type: 'uint256', indexed: false },
      { name: 'postTotalEther', type: 'uint256', indexed: false },
      { name: 'sharesMintedAsFees', type: 'uint256', indexed: false },
    ],
    name: 'TokenRebased',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'lidoLocator', type: 'address', indexed: false }],
    name: 'LidoLocatorSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'amount', type: 'uint256', indexed: false }],
    name: 'ELRewardsReceived',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'amount', type: 'uint256', indexed: false }],
    name: 'WithdrawalsReceived',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'sender', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'referral', type: 'address', indexed: false },
    ],
    name: 'Submitted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'amount', type: 'uint256', indexed: false }],
    name: 'Unbuffered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'executor', type: 'address', indexed: true },
      { name: 'script', type: 'bytes', indexed: false },
      { name: 'input', type: 'bytes', indexed: false },
      { name: 'returnData', type: 'bytes', indexed: false },
    ],
    name: 'ScriptResult',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'vault', type: 'address', indexed: true },
      { name: 'token', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
    name: 'RecoverToVault',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'eip712StETH', type: 'address', indexed: false }],
    name: 'EIP712StETHInitialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'sharesValue', type: 'uint256', indexed: false },
    ],
    name: 'TransferShares',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'account', type: 'address', indexed: true },
      { name: 'preRebaseTokenAmount', type: 'uint256', indexed: false },
      { name: 'postRebaseTokenAmount', type: 'uint256', indexed: false },
      { name: 'sharesAmount', type: 'uint256', indexed: false },
    ],
    name: 'SharesBurnt',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'Stopped' },
  { type: 'event', anonymous: false, inputs: [], name: 'Resumed' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', type: 'uint256', indexed: false }],
    name: 'ContractVersionSet',
  },
] as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const stEthAddress = {
  1: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  11155111: '0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af',
} as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const stEthConfig = { address: stEthAddress, abi: stEthAbi } as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEth = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"name"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthName = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'name',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"hasInitialized"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthHasInitialized = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'hasInitialized',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"STAKING_CONTROL_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthStakingControlRole = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'STAKING_CONTROL_ROLE',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"totalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'totalSupply',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getSharesByPooledEth"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetSharesByPooledEth = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getSharesByPooledEth',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"isStakingPaused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthIsStakingPaused = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'isStakingPaused',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getEVMScriptExecutor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetEvmScriptExecutor = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getEVMScriptExecutor',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"RESUME_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthResumeRole = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'RESUME_ROLE',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"decimals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthDecimals = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'decimals',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getRecoveryVault"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetRecoveryVault = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getRecoveryVault',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthDomainSeparator = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'DOMAIN_SEPARATOR',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getTotalPooledEther"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetTotalPooledEther = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getTotalPooledEther',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"PAUSE_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthPauseRole = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'PAUSE_ROLE',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getTreasury"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetTreasury = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getTreasury',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"isStopped"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthIsStopped = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'isStopped',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getBufferedEther"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetBufferedEther = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getBufferedEther',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getWithdrawalCredentials"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetWithdrawalCredentials = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getWithdrawalCredentials',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getCurrentStakeLimit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetCurrentStakeLimit = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getCurrentStakeLimit',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getStakeLimitFullInfo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetStakeLimitFullInfo = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getStakeLimitFullInfo',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"balanceOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'balanceOf',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getFeeDistribution"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetFeeDistribution = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getFeeDistribution',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getPooledEthByShares"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetPooledEthByShares = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getPooledEthByShares',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"allowRecoverability"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthAllowRecoverability = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'allowRecoverability',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"nonces"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthNonces = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'nonces',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"appId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthAppId = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'appId',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getOracle"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetOracle = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getOracle',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"eip712Domain"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthEip712Domain = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'eip712Domain',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getContractVersion"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetContractVersion = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getContractVersion',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getInitializationBlock"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetInitializationBlock = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getInitializationBlock',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"symbol"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthSymbol = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'symbol',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getEIP712StETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetEip712StEth = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getEIP712StETH',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"canPerform"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthCanPerform = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'canPerform',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getEVMScriptRegistry"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetEvmScriptRegistry = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getEVMScriptRegistry',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"UNSAFE_CHANGE_DEPOSITED_VALIDATORS_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthUnsafeChangeDepositedValidatorsRole = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'UNSAFE_CHANGE_DEPOSITED_VALIDATORS_ROLE',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getBeaconStat"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetBeaconStat = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getBeaconStat',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getFee"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetFee = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getFee',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"kernel"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthKernel = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'kernel',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getTotalShares"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetTotalShares = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getTotalShares',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"allowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthAllowance = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'allowance',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"isPetrified"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthIsPetrified = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'isPetrified',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getLidoLocator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetLidoLocator = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getLidoLocator',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"canDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthCanDeposit = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'canDeposit',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"STAKING_PAUSE_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthStakingPauseRole = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'STAKING_PAUSE_ROLE',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getDepositableEther"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetDepositableEther = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getDepositableEther',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"sharesOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthSharesOf = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'sharesOf',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getTotalELRewardsCollected"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useReadStEthGetTotalElRewardsCollected = /*#__PURE__*/ createUseReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getTotalELRewardsCollected',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEth = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"resume"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthResume = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'resume',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"stop"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthStop = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'stop',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthApprove = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'approve',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transferFrom',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"setStakingLimit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthSetStakingLimit = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'setStakingLimit',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"finalizeUpgrade_v2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthFinalizeUpgradeV2 = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'finalizeUpgrade_v2',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"unsafeChangeDepositedValidators"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthUnsafeChangeDepositedValidators = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'unsafeChangeDepositedValidators',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"increaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthIncreaseAllowance = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'increaseAllowance',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"receiveELRewards"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthReceiveElRewards = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'receiveELRewards',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transferSharesFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthTransferSharesFrom = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transferSharesFrom',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"resumeStaking"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthResumeStaking = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'resumeStaking',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"receiveWithdrawals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthReceiveWithdrawals = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'receiveWithdrawals',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transferShares"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthTransferShares = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transferShares',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transferToVault"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthTransferToVault = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transferToVault',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"submit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthSubmit = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'submit',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"decreaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthDecreaseAllowance = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'decreaseAllowance',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transfer',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"deposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'deposit',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"removeStakingLimit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthRemoveStakingLimit = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'removeStakingLimit',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"handleOracleReport"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthHandleOracleReport = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'handleOracleReport',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"permit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthPermit = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'permit',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"pauseStaking"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWriteStEthPauseStaking = /*#__PURE__*/ createUseWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'pauseStaking',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEth = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"resume"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthResume = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'resume',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"stop"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthStop = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'stop',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthApprove = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'approve',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthTransferFrom = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transferFrom',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"setStakingLimit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthSetStakingLimit = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'setStakingLimit',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"finalizeUpgrade_v2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthFinalizeUpgradeV2 = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'finalizeUpgrade_v2',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"unsafeChangeDepositedValidators"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthUnsafeChangeDepositedValidators =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stEthAbi,
    address: stEthAddress,
    functionName: 'unsafeChangeDepositedValidators',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"increaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthIncreaseAllowance = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'increaseAllowance',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthInitialize = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"receiveELRewards"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthReceiveElRewards = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'receiveELRewards',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transferSharesFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthTransferSharesFrom = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transferSharesFrom',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"resumeStaking"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthResumeStaking = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'resumeStaking',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"receiveWithdrawals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthReceiveWithdrawals = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'receiveWithdrawals',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transferShares"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthTransferShares = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transferShares',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transferToVault"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthTransferToVault = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transferToVault',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"submit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthSubmit = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'submit',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"decreaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthDecreaseAllowance = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'decreaseAllowance',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthTransfer = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transfer',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"deposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthDeposit = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'deposit',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"removeStakingLimit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthRemoveStakingLimit = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'removeStakingLimit',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"handleOracleReport"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthHandleOracleReport = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'handleOracleReport',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"permit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthPermit = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'permit',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"pauseStaking"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useSimulateStEthPauseStaking = /*#__PURE__*/ createUseSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'pauseStaking',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"StakingPaused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthStakingPausedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'StakingPaused',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"StakingResumed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthStakingResumedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'StakingResumed',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"StakingLimitSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthStakingLimitSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'StakingLimitSet',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"StakingLimitRemoved"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthStakingLimitRemovedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'StakingLimitRemoved',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"CLValidatorsUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthClValidatorsUpdatedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'CLValidatorsUpdated',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"DepositedValidatorsChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthDepositedValidatorsChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stEthAbi,
    address: stEthAddress,
    eventName: 'DepositedValidatorsChanged',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"ETHDistributed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthEthDistributedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'ETHDistributed',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"TokenRebased"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthTokenRebasedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'TokenRebased',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"LidoLocatorSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthLidoLocatorSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'LidoLocatorSet',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"ELRewardsReceived"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthElRewardsReceivedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'ELRewardsReceived',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"WithdrawalsReceived"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthWithdrawalsReceivedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'WithdrawalsReceived',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"Submitted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthSubmittedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'Submitted',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"Unbuffered"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthUnbufferedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'Unbuffered',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"ScriptResult"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthScriptResultEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'ScriptResult',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"RecoverToVault"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthRecoverToVaultEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'RecoverToVault',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"EIP712StETHInitialized"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthEip712StEthInitializedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'EIP712StETHInitialized',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"TransferShares"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthTransferSharesEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'TransferShares',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"SharesBurnt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthSharesBurntEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'SharesBurnt',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"Stopped"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthStoppedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'Stopped',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"Resumed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthResumedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'Resumed',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"Transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthTransferEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'Transfer',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"Approval"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthApprovalEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'Approval',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"ContractVersionSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const useWatchStEthContractVersionSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'ContractVersionSet',
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEth = /*#__PURE__*/ createReadContract({ abi: stEthAbi, address: stEthAddress });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"name"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthName = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'name',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"hasInitialized"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthHasInitialized = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'hasInitialized',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"STAKING_CONTROL_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthStakingControlRole = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'STAKING_CONTROL_ROLE',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"totalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthTotalSupply = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'totalSupply',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getSharesByPooledEth"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetSharesByPooledEth = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getSharesByPooledEth',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"isStakingPaused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthIsStakingPaused = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'isStakingPaused',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getEVMScriptExecutor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetEvmScriptExecutor = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getEVMScriptExecutor',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"RESUME_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthResumeRole = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'RESUME_ROLE',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"decimals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthDecimals = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'decimals',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getRecoveryVault"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetRecoveryVault = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getRecoveryVault',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthDomainSeparator = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'DOMAIN_SEPARATOR',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getTotalPooledEther"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetTotalPooledEther = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getTotalPooledEther',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"PAUSE_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthPauseRole = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'PAUSE_ROLE',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getTreasury"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetTreasury = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getTreasury',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"isStopped"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthIsStopped = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'isStopped',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getBufferedEther"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetBufferedEther = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getBufferedEther',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getWithdrawalCredentials"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetWithdrawalCredentials = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getWithdrawalCredentials',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getCurrentStakeLimit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetCurrentStakeLimit = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getCurrentStakeLimit',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getStakeLimitFullInfo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetStakeLimitFullInfo = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getStakeLimitFullInfo',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"balanceOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthBalanceOf = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'balanceOf',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getFeeDistribution"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetFeeDistribution = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getFeeDistribution',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getPooledEthByShares"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetPooledEthByShares = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getPooledEthByShares',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"allowRecoverability"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthAllowRecoverability = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'allowRecoverability',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"nonces"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthNonces = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'nonces',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"appId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthAppId = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'appId',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getOracle"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetOracle = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getOracle',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"eip712Domain"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthEip712Domain = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'eip712Domain',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getContractVersion"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetContractVersion = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getContractVersion',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getInitializationBlock"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetInitializationBlock = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getInitializationBlock',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"symbol"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthSymbol = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'symbol',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getEIP712StETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetEip712StEth = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getEIP712StETH',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"canPerform"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthCanPerform = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'canPerform',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getEVMScriptRegistry"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetEvmScriptRegistry = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getEVMScriptRegistry',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"UNSAFE_CHANGE_DEPOSITED_VALIDATORS_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthUnsafeChangeDepositedValidatorsRole = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'UNSAFE_CHANGE_DEPOSITED_VALIDATORS_ROLE',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getBeaconStat"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetBeaconStat = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getBeaconStat',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getFee"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetFee = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getFee',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"kernel"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthKernel = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'kernel',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getTotalShares"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetTotalShares = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getTotalShares',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"allowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthAllowance = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'allowance',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"isPetrified"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthIsPetrified = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'isPetrified',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getLidoLocator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetLidoLocator = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getLidoLocator',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"canDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthCanDeposit = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'canDeposit',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"STAKING_PAUSE_ROLE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthStakingPauseRole = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'STAKING_PAUSE_ROLE',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getDepositableEther"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetDepositableEther = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getDepositableEther',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"sharesOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthSharesOf = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'sharesOf',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"getTotalELRewardsCollected"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEthGetTotalElRewardsCollected = /*#__PURE__*/ createReadContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'getTotalELRewardsCollected',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEth = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"resume"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthResume = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'resume',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"stop"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthStop = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'stop',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthApprove = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'approve',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transferFrom',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"setStakingLimit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthSetStakingLimit = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'setStakingLimit',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"finalizeUpgrade_v2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthFinalizeUpgradeV2 = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'finalizeUpgrade_v2',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"unsafeChangeDepositedValidators"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthUnsafeChangeDepositedValidators = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'unsafeChangeDepositedValidators',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"increaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthIncreaseAllowance = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'increaseAllowance',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthInitialize = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"receiveELRewards"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthReceiveElRewards = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'receiveELRewards',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transferSharesFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthTransferSharesFrom = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transferSharesFrom',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"resumeStaking"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthResumeStaking = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'resumeStaking',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"receiveWithdrawals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthReceiveWithdrawals = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'receiveWithdrawals',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transferShares"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthTransferShares = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transferShares',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transferToVault"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthTransferToVault = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transferToVault',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"submit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthSubmit = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'submit',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"decreaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthDecreaseAllowance = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'decreaseAllowance',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthTransfer = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transfer',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"deposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthDeposit = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'deposit',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"removeStakingLimit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthRemoveStakingLimit = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'removeStakingLimit',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"handleOracleReport"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthHandleOracleReport = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'handleOracleReport',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"permit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthPermit = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'permit',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"pauseStaking"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const writeStEthPauseStaking = /*#__PURE__*/ createWriteContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'pauseStaking',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEth = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"resume"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthResume = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'resume',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"stop"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthStop = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'stop',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthApprove = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'approve',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transferFrom',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"setStakingLimit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthSetStakingLimit = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'setStakingLimit',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"finalizeUpgrade_v2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthFinalizeUpgradeV2 = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'finalizeUpgrade_v2',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"unsafeChangeDepositedValidators"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthUnsafeChangeDepositedValidators = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'unsafeChangeDepositedValidators',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"increaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthIncreaseAllowance = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'increaseAllowance',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthInitialize = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"receiveELRewards"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthReceiveElRewards = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'receiveELRewards',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transferSharesFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthTransferSharesFrom = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transferSharesFrom',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"resumeStaking"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthResumeStaking = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'resumeStaking',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"receiveWithdrawals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthReceiveWithdrawals = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'receiveWithdrawals',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transferShares"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthTransferShares = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transferShares',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transferToVault"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthTransferToVault = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transferToVault',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"submit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthSubmit = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'submit',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"decreaseAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthDecreaseAllowance = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'decreaseAllowance',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthTransfer = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'transfer',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"deposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthDeposit = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'deposit',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"removeStakingLimit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthRemoveStakingLimit = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'removeStakingLimit',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"handleOracleReport"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthHandleOracleReport = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'handleOracleReport',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"permit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthPermit = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'permit',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link stEthAbi}__ and `functionName` set to `"pauseStaking"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const simulateStEthPauseStaking = /*#__PURE__*/ createSimulateContract({
  abi: stEthAbi,
  address: stEthAddress,
  functionName: 'pauseStaking',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"StakingPaused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthStakingPausedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'StakingPaused',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"StakingResumed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthStakingResumedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'StakingResumed',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"StakingLimitSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthStakingLimitSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'StakingLimitSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"StakingLimitRemoved"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthStakingLimitRemovedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'StakingLimitRemoved',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"CLValidatorsUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthClValidatorsUpdatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'CLValidatorsUpdated',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"DepositedValidatorsChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthDepositedValidatorsChangedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'DepositedValidatorsChanged',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"ETHDistributed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthEthDistributedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'ETHDistributed',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"TokenRebased"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthTokenRebasedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'TokenRebased',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"LidoLocatorSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthLidoLocatorSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'LidoLocatorSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"ELRewardsReceived"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthElRewardsReceivedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'ELRewardsReceived',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"WithdrawalsReceived"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthWithdrawalsReceivedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'WithdrawalsReceived',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"Submitted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthSubmittedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'Submitted',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"Unbuffered"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthUnbufferedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'Unbuffered',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"ScriptResult"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthScriptResultEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'ScriptResult',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"RecoverToVault"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthRecoverToVaultEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'RecoverToVault',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"EIP712StETHInitialized"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthEip712StEthInitializedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'EIP712StETHInitialized',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"TransferShares"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthTransferSharesEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'TransferShares',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"SharesBurnt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthSharesBurntEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'SharesBurnt',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"Stopped"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthStoppedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'Stopped',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"Resumed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthResumedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'Resumed',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"Transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthTransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'Transfer',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"Approval"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'Approval',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link stEthAbi}__ and `eventName` set to `"ContractVersionSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const watchStEthContractVersionSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: stEthAbi,
  address: stEthAddress,
  eventName: 'ContractVersionSet',
});
