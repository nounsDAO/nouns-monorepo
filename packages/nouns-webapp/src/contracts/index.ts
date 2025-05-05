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
// NounsAuctionHouse
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const nounsAuctionHouseAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_nouns', internalType: 'contract INounsToken', type: 'address' },
      { name: '_weth', internalType: 'address', type: 'address' },
      { name: '_duration', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nounId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: false },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'extended', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'AuctionBid',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nounId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'clientId', internalType: 'uint32', type: 'uint32', indexed: true },
    ],
    name: 'AuctionBidWithClientId',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nounId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'startTime', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'endTime', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'AuctionCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nounId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'endTime', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'AuctionExtended',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minBidIncrementPercentage',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'AuctionMinBidIncrementPercentageUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'reservePrice', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'AuctionReservePriceUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nounId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'winner', internalType: 'address', type: 'address', indexed: false },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'AuctionSettled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'nounId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'clientId', internalType: 'uint32', type: 'uint32', indexed: true },
    ],
    name: 'AuctionSettledWithClientId',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'timeBuffer', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'AuctionTimeBufferUpdated',
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
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'account', internalType: 'address', type: 'address', indexed: false }],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'newSanctionsOracle', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'SanctionsOracleSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'account', internalType: 'address', type: 'address', indexed: false }],
    name: 'Unpaused',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_TIME_BUFFER',
    outputs: [{ name: '', internalType: 'uint56', type: 'uint56' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'auction',
    outputs: [
      {
        name: '',
        internalType: 'struct INounsAuctionHouseV3.AuctionV2View',
        type: 'tuple',
        components: [
          { name: 'nounId', internalType: 'uint96', type: 'uint96' },
          { name: 'amount', internalType: 'uint128', type: 'uint128' },
          { name: 'startTime', internalType: 'uint40', type: 'uint40' },
          { name: 'endTime', internalType: 'uint40', type: 'uint40' },
          { name: 'bidder', internalType: 'address payable', type: 'address' },
          { name: 'settled', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'auctionStorage',
    outputs: [
      { name: 'nounId', internalType: 'uint96', type: 'uint96' },
      { name: 'clientId', internalType: 'uint32', type: 'uint32' },
      { name: 'amount', internalType: 'uint128', type: 'uint128' },
      { name: 'startTime', internalType: 'uint40', type: 'uint40' },
      { name: 'endTime', internalType: 'uint40', type: 'uint40' },
      { name: 'bidder', internalType: 'address payable', type: 'address' },
      { name: 'settled', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'nounId', internalType: 'uint256', type: 'uint256' }],
    name: 'biddingClient',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'nounId', internalType: 'uint256', type: 'uint256' }],
    name: 'createBid',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nounId', internalType: 'uint256', type: 'uint256' },
      { name: 'clientId', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'createBid',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'duration',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'auctionCount', internalType: 'uint256', type: 'uint256' }],
    name: 'getPrices',
    outputs: [{ name: 'prices', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionCount', internalType: 'uint256', type: 'uint256' },
      { name: 'skipEmptyValues', internalType: 'bool', type: 'bool' },
    ],
    name: 'getSettlements',
    outputs: [
      {
        name: 'settlements',
        internalType: 'struct INounsAuctionHouseV3.Settlement[]',
        type: 'tuple[]',
        components: [
          { name: 'blockTimestamp', internalType: 'uint32', type: 'uint32' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'nounId', internalType: 'uint256', type: 'uint256' },
          { name: 'clientId', internalType: 'uint32', type: 'uint32' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'startId', internalType: 'uint256', type: 'uint256' },
      { name: 'endId', internalType: 'uint256', type: 'uint256' },
      { name: 'skipEmptyValues', internalType: 'bool', type: 'bool' },
    ],
    name: 'getSettlements',
    outputs: [
      {
        name: 'settlements',
        internalType: 'struct INounsAuctionHouseV3.Settlement[]',
        type: 'tuple[]',
        components: [
          { name: 'blockTimestamp', internalType: 'uint32', type: 'uint32' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'nounId', internalType: 'uint256', type: 'uint256' },
          { name: 'clientId', internalType: 'uint32', type: 'uint32' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'startId', internalType: 'uint256', type: 'uint256' },
      { name: 'endTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: 'skipEmptyValues', internalType: 'bool', type: 'bool' },
    ],
    name: 'getSettlementsFromIdtoTimestamp',
    outputs: [
      {
        name: 'settlements',
        internalType: 'struct INounsAuctionHouseV3.Settlement[]',
        type: 'tuple[]',
        components: [
          { name: 'blockTimestamp', internalType: 'uint32', type: 'uint32' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'nounId', internalType: 'uint256', type: 'uint256' },
          { name: 'clientId', internalType: 'uint32', type: 'uint32' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_reservePrice', internalType: 'uint192', type: 'uint192' },
      { name: '_timeBuffer', internalType: 'uint56', type: 'uint56' },
      { name: '_minBidIncrementPercentage', internalType: 'uint8', type: 'uint8' },
      {
        name: '_sanctionsOracle',
        internalType: 'contract IChainalysisSanctionsList',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minBidIncrementPercentage',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nouns',
    outputs: [{ name: '', internalType: 'contract INounsToken', type: 'address' }],
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
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'reservePrice',
    outputs: [{ name: '', internalType: 'uint192', type: 'uint192' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sanctionsOracle',
    outputs: [{ name: '', internalType: 'contract IChainalysisSanctionsList', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_minBidIncrementPercentage', internalType: 'uint8', type: 'uint8' }],
    name: 'setMinBidIncrementPercentage',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'settlements',
        internalType: 'struct INounsAuctionHouseV3.SettlementNoClientId[]',
        type: 'tuple[]',
        components: [
          { name: 'blockTimestamp', internalType: 'uint32', type: 'uint32' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'winner', internalType: 'address', type: 'address' },
          { name: 'nounId', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'setPrices',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_reservePrice', internalType: 'uint192', type: 'uint192' }],
    name: 'setReservePrice',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newSanctionsOracle', internalType: 'address', type: 'address' }],
    name: 'setSanctionsOracle',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_timeBuffer', internalType: 'uint56', type: 'uint56' }],
    name: 'setTimeBuffer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'settleAuction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'settleCurrentAndCreateNewAuction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'timeBuffer',
    outputs: [{ name: '', internalType: 'uint56', type: 'uint56' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'function', inputs: [], name: 'unpause', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [
      { name: 'startId', internalType: 'uint256', type: 'uint256' },
      { name: 'endId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'warmUpSettlementState',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'weth',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
] as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const nounsAuctionHouseAddress = {
  1: '0x830BD73E4184ceF73443C15111a1DF14e495C706',
  11155111: '0x488609b7113FCf3B761A05956300d605E8f6BcAf',
} as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const nounsAuctionHouseConfig = {
  address: nounsAuctionHouseAddress,
  abi: nounsAuctionHouseAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NounsData
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const nounsDataAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'nounsToken_', internalType: 'address', type: 'address' },
      { name: 'nounsDao_', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'AmountExceedsBalance' },
  {
    type: 'error',
    inputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    name: 'FailedWithdrawingETH',
  },
  { type: 'error', inputs: [], name: 'InvalidSignature' },
  { type: 'error', inputs: [], name: 'InvalidSupportValue' },
  { type: 'error', inputs: [], name: 'MustBeDunaAdmin' },
  { type: 'error', inputs: [], name: 'MustBeDunaAdminOrOwner' },
  { type: 'error', inputs: [], name: 'MustBeNounerOrPaySufficientFee' },
  { type: 'error', inputs: [], name: 'MustHaveVotes' },
  { type: 'error', inputs: [], name: 'MustProvideActions' },
  { type: 'error', inputs: [], name: 'OnlyProposerCanCreateUpdateCandidate' },
  { type: 'error', inputs: [], name: 'ProposalInfoArityMismatch' },
  { type: 'error', inputs: [], name: 'ProposalToUpdateMustBeUpdatable' },
  { type: 'error', inputs: [], name: 'SlugAlreadyUsed' },
  { type: 'error', inputs: [], name: 'SlugDoesNotExist' },
  { type: 'error', inputs: [], name: 'TooManyActions' },
  { type: 'error', inputs: [], name: 'UpdateProposalCandidatesOnlyWorkWithProposalsBySigs' },
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
      { name: 'msgSender', internalType: 'address', type: 'address', indexed: true },
      { name: 'proposer', internalType: 'address', type: 'address', indexed: true },
      { name: 'slug', internalType: 'string', type: 'string', indexed: false },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      { name: 'reason', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'CandidateFeedbackSent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldCreateCandidateCost', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newCreateCandidateCost', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'CreateCandidateCostSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'message', internalType: 'string', type: 'string', indexed: false },
      { name: 'relatedProposals', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
    ],
    name: 'DunaAdminMessagePosted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldDunaAdmin', internalType: 'address', type: 'address', indexed: true },
      { name: 'newDunaAdmin', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'DunaAdminSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ETHWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldFeeRecipient', internalType: 'address', type: 'address', indexed: true },
      { name: 'newFeeRecipient', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'FeeRecipientSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address', indexed: true },
      { name: 'proposalId', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      { name: 'reason', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'FeedbackSent',
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
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address', indexed: true },
      { name: 'slug', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ProposalCandidateCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address', indexed: true },
      { name: 'targets', internalType: 'address[]', type: 'address[]', indexed: false },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'signatures', internalType: 'string[]', type: 'string[]', indexed: false },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]', indexed: false },
      { name: 'description', internalType: 'string', type: 'string', indexed: false },
      { name: 'slug', internalType: 'string', type: 'string', indexed: false },
      { name: 'proposalIdToUpdate', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'encodedProposalHash', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'ProposalCandidateCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address', indexed: true },
      { name: 'targets', internalType: 'address[]', type: 'address[]', indexed: false },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'signatures', internalType: 'string[]', type: 'string[]', indexed: false },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]', indexed: false },
      { name: 'description', internalType: 'string', type: 'string', indexed: false },
      { name: 'slug', internalType: 'string', type: 'string', indexed: false },
      { name: 'proposalIdToUpdate', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'encodedProposalHash', internalType: 'bytes32', type: 'bytes32', indexed: false },
      { name: 'reason', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ProposalCandidateUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'signal', internalType: 'uint8', type: 'uint8', indexed: false },
      { name: 'reason', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ProposalComplianceSignaled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'signer', internalType: 'address', type: 'address', indexed: true },
      { name: 'sig', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'expirationTimestamp', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'proposer', internalType: 'address', type: 'address', indexed: false },
      { name: 'slug', internalType: 'string', type: 'string', indexed: false },
      { name: 'proposalIdToUpdate', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'encodedPropHash', internalType: 'bytes32', type: 'bytes32', indexed: false },
      { name: 'sigDigest', internalType: 'bytes32', type: 'bytes32', indexed: false },
      { name: 'reason', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'SignatureAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldUpdateCandidateCost', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newUpdateCandidateCost', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'UpdateCandidateCostSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address', indexed: true }],
    name: 'Upgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'message', internalType: 'string', type: 'string', indexed: false },
      { name: 'relatedProposals', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
    ],
    name: 'VoterMessageToDunaAdminPosted',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PRIOR_VOTES_BLOCKS_AGO',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sig', internalType: 'bytes', type: 'bytes' },
      { name: 'expirationTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: 'proposer', internalType: 'address', type: 'address' },
      { name: 'slug', internalType: 'string', type: 'string' },
      { name: 'proposalIdToUpdate', internalType: 'uint256', type: 'uint256' },
      { name: 'encodedProp', internalType: 'bytes', type: 'bytes' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'addSignature',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'slug', internalType: 'string', type: 'string' }],
    name: 'cancelProposalCandidate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'createCandidateCost',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'slug', internalType: 'string', type: 'string' },
      { name: 'proposalIdToUpdate', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createProposalCandidate',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'dunaAdmin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeRecipient',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'admin', internalType: 'address', type: 'address' },
      { name: 'createCandidateCost_', internalType: 'uint256', type: 'uint256' },
      { name: 'updateCandidateCost_', internalType: 'uint256', type: 'uint256' },
      { name: 'feeRecipient_', internalType: 'address payable', type: 'address' },
      { name: 'dunaAdmin_', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nounsDao',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nounsToken',
    outputs: [{ name: '', internalType: 'contract NounsTokenLike', type: 'address' }],
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
    inputs: [
      { name: 'message', internalType: 'string', type: 'string' },
      { name: 'relatedProposals', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'postDunaAdminMessage',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'message', internalType: 'string', type: 'string' },
      { name: 'relatedProposals', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'postVoterMessageToDunaAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'propCandidates',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
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
      { name: 'proposer', internalType: 'address', type: 'address' },
      { name: 'slug', internalType: 'string', type: 'string' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'sendCandidateFeedback',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'sendFeedback',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newCreateCandidateCost', internalType: 'uint256', type: 'uint256' }],
    name: 'setCreateCandidateCost',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newDunaAdmin', internalType: 'address', type: 'address' }],
    name: 'setDunaAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newFeeRecipient', internalType: 'address payable', type: 'address' }],
    name: 'setFeeRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newUpdateCandidateCost', internalType: 'uint256', type: 'uint256' }],
    name: 'setUpdateCandidateCost',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'signal', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'signalProposalCompliance',
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
    inputs: [],
    name: 'updateCandidateCost',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'slug', internalType: 'string', type: 'string' },
      { name: 'proposalIdToUpdate', internalType: 'uint256', type: 'uint256' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'updateProposalCandidate',
    outputs: [],
    stateMutability: 'payable',
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
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const nounsDataAddress = {
  1: '0xf790A5f59678dd733fb3De93493A91f472ca1365',
  11155111: '0x9040f720AA8A693F950B9cF94764b4b06079D002',
} as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const nounsDataConfig = { address: nounsDataAddress, abi: nounsDataAbi } as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NounsDescriptor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const nounsDescriptorAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_art', internalType: 'contract INounsArt', type: 'address' },
      { name: '_renderer', internalType: 'contract ISVGRenderer', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'BadPaletteLength' },
  { type: 'error', inputs: [], name: 'EmptyPalette' },
  { type: 'error', inputs: [], name: 'IndexNotFound' },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'art', internalType: 'contract INounsArt', type: 'address', indexed: false }],
    name: 'ArtUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'baseURI', internalType: 'string', type: 'string', indexed: false }],
    name: 'BaseURIUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'enabled', internalType: 'bool', type: 'bool', indexed: false }],
    name: 'DataURIToggled',
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
  { type: 'event', anonymous: false, inputs: [], name: 'PartsLocked' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'renderer', internalType: 'contract ISVGRenderer', type: 'address', indexed: false },
    ],
    name: 'RendererUpdated',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'accessories',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'accessoryCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addAccessories',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addAccessoriesFromPointer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_background', internalType: 'string', type: 'string' }],
    name: 'addBackground',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addBodies',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addBodiesFromPointer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addGlasses',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addGlassesFromPointer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addHeads',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addHeadsFromPointer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_backgrounds', internalType: 'string[]', type: 'string[]' }],
    name: 'addManyBackgrounds',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'arePartsLocked',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'art',
    outputs: [{ name: '', internalType: 'contract INounsArt', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'backgroundCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'backgrounds',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'baseURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'bodies',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'bodyCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
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
      },
    ],
    name: 'dataURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
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
      },
    ],
    name: 'generateSVGImage',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'description', internalType: 'string', type: 'string' },
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
      },
    ],
    name: 'genericDataURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
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
      },
    ],
    name: 'getPartsForSeed',
    outputs: [
      {
        name: '',
        internalType: 'struct ISVGRenderer.Part[]',
        type: 'tuple[]',
        components: [
          { name: 'image', internalType: 'bytes', type: 'bytes' },
          { name: 'palette', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'glasses',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'glassesCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'headCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'heads',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isDataURIEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  { type: 'function', inputs: [], name: 'lockParts', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint8', type: 'uint8' }],
    name: 'palettes',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renderer',
    outputs: [{ name: '', internalType: 'contract ISVGRenderer', type: 'address' }],
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
    inputs: [{ name: '_art', internalType: 'contract INounsArt', type: 'address' }],
    name: 'setArt',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'descriptor', internalType: 'address', type: 'address' }],
    name: 'setArtDescriptor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'inflator', internalType: 'contract IInflator', type: 'address' }],
    name: 'setArtInflator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_baseURI', internalType: 'string', type: 'string' }],
    name: 'setBaseURI',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'paletteIndex', internalType: 'uint8', type: 'uint8' },
      { name: 'palette', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'setPalette',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'paletteIndex', internalType: 'uint8', type: 'uint8' },
      { name: 'pointer', internalType: 'address', type: 'address' },
    ],
    name: 'setPalettePointer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_renderer', internalType: 'contract ISVGRenderer', type: 'address' }],
    name: 'setRenderer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'toggleDataURIEnabled',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
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
      },
    ],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
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
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'updateAccessories',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'updateAccessoriesFromPointer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'updateBodies',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'updateBodiesFromPointer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'updateGlasses',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'updateGlassesFromPointer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'updateHeads',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'updateHeadsFromPointer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const nounsDescriptorAddress = {
  1: '0x33A9c445fb4FB21f2c030A6b2d3e2F12D017BFAC',
  11155111: '0x79E04ebCDf1ac2661697B23844149b43acc002d5',
} as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const nounsDescriptorConfig = {
  address: nounsDescriptorAddress,
  abi: nounsDescriptorAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NounsGovernor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const nounsGovernorAbi = [
  { type: 'error', inputs: [], name: 'AdminOnly' },
  { type: 'error', inputs: [], name: 'CanOnlyInitializeOnce' },
  { type: 'error', inputs: [], name: 'InvalidNounsAddress' },
  { type: 'error', inputs: [], name: 'InvalidTimelockAddress' },
  { type: 'error', inputs: [], name: 'MustProvideActions' },
  { type: 'error', inputs: [], name: 'ProposalInfoArityMismatch' },
  { type: 'error', inputs: [], name: 'ProposerAlreadyHasALiveProposal' },
  { type: 'error', inputs: [], name: 'TooManyActions' },
  { type: 'error', inputs: [], name: 'UnsafeUint16Cast' },
  { type: 'error', inputs: [], name: 'VotesBelowProposalThreshold' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'numTokens', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'DAONounsSupplyIncreasedFromEscrow',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'DAOWithdrawNounsFromEscrow',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldErc20Tokens', internalType: 'address[]', type: 'address[]', indexed: false },
      { name: 'newErc20tokens', internalType: 'address[]', type: 'address[]', indexed: false },
    ],
    name: 'ERC20TokensToIncludeInForkSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'forkId', internalType: 'uint32', type: 'uint32', indexed: true },
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'proposalIds', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'reason', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'EscrowedToFork',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'forkId', internalType: 'uint32', type: 'uint32', indexed: true },
      { name: 'forkTreasury', internalType: 'address', type: 'address', indexed: false },
      { name: 'forkToken', internalType: 'address', type: 'address', indexed: false },
      { name: 'forkEndTimestamp', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'tokensInEscrow', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ExecuteFork',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldForkDAODeployer', internalType: 'address', type: 'address', indexed: false },
      { name: 'newForkDAODeployer', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'ForkDAODeployerSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldForkPeriod', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newForkPeriod', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ForkPeriodSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldForkThreshold', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newForkThreshold', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ForkThresholdSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'forkId', internalType: 'uint32', type: 'uint32', indexed: true },
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'proposalIds', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'reason', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'JoinFork',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldLastMinuteWindowInBlocks',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'newLastMinuteWindowInBlocks',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'LastMinuteWindowSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldMaxQuorumVotesBPS', internalType: 'uint16', type: 'uint16', indexed: false },
      { name: 'newMaxQuorumVotesBPS', internalType: 'uint16', type: 'uint16', indexed: false },
    ],
    name: 'MaxQuorumVotesBPSSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldMinQuorumVotesBPS', internalType: 'uint16', type: 'uint16', indexed: false },
      { name: 'newMinQuorumVotesBPS', internalType: 'uint16', type: 'uint16', indexed: false },
    ],
    name: 'MinQuorumVotesBPSSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'NewAdmin',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldPendingAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newPendingAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'NewPendingAdmin',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldPendingVetoer', internalType: 'address', type: 'address', indexed: false },
      { name: 'newPendingVetoer', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'NewPendingVetoer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldVetoer', internalType: 'address', type: 'address', indexed: false },
      { name: 'newVetoer', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'NewVetoer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldObjectionPeriodDurationInBlocks',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'newObjectionPeriodDurationInBlocks',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'ObjectionPeriodDurationSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'ProposalCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'proposer', internalType: 'address', type: 'address', indexed: false },
      { name: 'targets', internalType: 'address[]', type: 'address[]', indexed: false },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'signatures', internalType: 'string[]', type: 'string[]', indexed: false },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]', indexed: false },
      { name: 'startBlock', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'endBlock', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'description', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ProposalCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'ProposalCreatedOnTimelockV1',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'proposer', internalType: 'address', type: 'address', indexed: false },
      { name: 'targets', internalType: 'address[]', type: 'address[]', indexed: false },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'signatures', internalType: 'string[]', type: 'string[]', indexed: false },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]', indexed: false },
      { name: 'startBlock', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'endBlock', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'proposalThreshold', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'quorumVotes', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'description', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ProposalCreatedWithRequirements',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'signers', internalType: 'address[]', type: 'address[]', indexed: false },
      { name: 'updatePeriodEndBlock', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'proposalThreshold', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'quorumVotes', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'clientId', internalType: 'uint32', type: 'uint32', indexed: true },
    ],
    name: 'ProposalCreatedWithRequirements',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'proposer', internalType: 'address', type: 'address', indexed: true },
      { name: 'description', internalType: 'string', type: 'string', indexed: false },
      { name: 'updateMessage', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ProposalDescriptionUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'ProposalExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'objectionPeriodEndBlock', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ProposalObjectionPeriodSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'eta', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ProposalQueued',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldProposalThresholdBPS', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newProposalThresholdBPS', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ProposalThresholdBPSSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'proposer', internalType: 'address', type: 'address', indexed: true },
      { name: 'targets', internalType: 'address[]', type: 'address[]', indexed: false },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'signatures', internalType: 'string[]', type: 'string[]', indexed: false },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]', indexed: false },
      { name: 'updateMessage', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ProposalTransactionsUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldProposalUpdatablePeriodInBlocks',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'newProposalUpdatablePeriodInBlocks',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'ProposalUpdatablePeriodSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'proposer', internalType: 'address', type: 'address', indexed: true },
      { name: 'targets', internalType: 'address[]', type: 'address[]', indexed: false },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'signatures', internalType: 'string[]', type: 'string[]', indexed: false },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]', indexed: false },
      { name: 'description', internalType: 'string', type: 'string', indexed: false },
      { name: 'updateMessage', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ProposalUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'ProposalVetoed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldQuorumCoefficient', internalType: 'uint32', type: 'uint32', indexed: false },
      { name: 'newQuorumCoefficient', internalType: 'uint32', type: 'uint32', indexed: false },
    ],
    name: 'QuorumCoefficientSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldQuorumVotesBPS', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newQuorumVotesBPS', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'QuorumVotesBPSSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'voter', internalType: 'address', type: 'address', indexed: true },
      { name: 'refundAmount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'refundSent', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'RefundableVote',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'signer', internalType: 'address', type: 'address', indexed: true },
      { name: 'sig', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'SignatureCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'timelock', internalType: 'address', type: 'address', indexed: false },
      { name: 'timelockV1', internalType: 'address', type: 'address', indexed: false },
      { name: 'admin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'TimelocksAndAdminSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'voter', internalType: 'address', type: 'address', indexed: true },
      { name: 'proposalId', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      { name: 'votes', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'reason', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'VoteCast',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'voter', internalType: 'address', type: 'address', indexed: true },
      { name: 'proposalId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'clientId', internalType: 'uint32', type: 'uint32', indexed: true },
    ],
    name: 'VoteCastWithClientId',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldVotingDelay', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newVotingDelay', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'VotingDelaySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldVotingPeriod', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newVotingPeriod', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'VotingPeriodSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'sent', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'Withdraw',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'forkId', internalType: 'uint32', type: 'uint32', indexed: true },
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
    ],
    name: 'WithdrawFromForkEscrow',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_PROPOSAL_THRESHOLD_BPS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_VOTING_DELAY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_VOTING_PERIOD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_PROPOSAL_THRESHOLD_BPS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_VOTING_DELAY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_VOTING_PERIOD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'adjustedTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'admin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'sig', internalType: 'bytes', type: 'bytes' }],
    name: 'cancelSig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'castRefundableVote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'clientId', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'castRefundableVote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'castRefundableVoteWithReason',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'clientId', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'castRefundableVoteWithReason',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'castVote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'castVoteBySig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'castVoteWithReason',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'againstVotes', internalType: 'uint256', type: 'uint256' },
      { name: 'adjustedTotalSupply_', internalType: 'uint256', type: 'uint256' },
      {
        name: 'params',
        internalType: 'struct NounsDAOTypes.DynamicQuorumParams',
        type: 'tuple',
        components: [
          { name: 'minQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
          { name: 'maxQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
          { name: 'quorumCoefficient', internalType: 'uint32', type: 'uint32' },
        ],
      },
    ],
    name: 'dynamicQuorumVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'erc20TokensToIncludeInFork',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'proposalIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'escrowToFork',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'executeFork',
    outputs: [
      { name: 'forkTreasury', internalType: 'address', type: 'address' },
      { name: 'forkToken', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'forkDAODeployer',
    outputs: [{ name: '', internalType: 'contract IForkDAODeployer', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'forkEndTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'forkEscrow',
    outputs: [{ name: '', internalType: 'contract INounsDAOForkEscrow', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'forkPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'forkThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'forkThresholdBPS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'getActions',
    outputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'blockNumber_', internalType: 'uint256', type: 'uint256' }],
    name: 'getDynamicQuorumParamsAt',
    outputs: [
      {
        name: '',
        internalType: 'struct NounsDAOTypes.DynamicQuorumParams',
        type: 'tuple',
        components: [
          { name: 'minQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
          { name: 'maxQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
          { name: 'quorumCoefficient', internalType: 'uint32', type: 'uint32' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'voter', internalType: 'address', type: 'address' },
    ],
    name: 'getReceipt',
    outputs: [
      {
        name: '',
        internalType: 'struct NounsDAOTypes.Receipt',
        type: 'tuple',
        components: [
          { name: 'hasVoted', internalType: 'bool', type: 'bool' },
          { name: 'support', internalType: 'uint8', type: 'uint8' },
          { name: 'votes', internalType: 'uint96', type: 'uint96' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'timelock_', internalType: 'address', type: 'address' },
      { name: 'nouns_', internalType: 'address', type: 'address' },
      { name: 'forkEscrow_', internalType: 'address', type: 'address' },
      { name: 'forkDAODeployer_', internalType: 'address', type: 'address' },
      { name: 'vetoer_', internalType: 'address', type: 'address' },
      {
        name: 'daoParams_',
        internalType: 'struct NounsDAOTypes.NounsDAOParams',
        type: 'tuple',
        components: [
          { name: 'votingPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'votingDelay', internalType: 'uint256', type: 'uint256' },
          { name: 'proposalThresholdBPS', internalType: 'uint256', type: 'uint256' },
          { name: 'lastMinuteWindowInBlocks', internalType: 'uint32', type: 'uint32' },
          { name: 'objectionPeriodDurationInBlocks', internalType: 'uint32', type: 'uint32' },
          { name: 'proposalUpdatablePeriodInBlocks', internalType: 'uint32', type: 'uint32' },
        ],
      },
      {
        name: 'dynamicQuorumParams_',
        internalType: 'struct NounsDAOTypes.DynamicQuorumParams',
        type: 'tuple',
        components: [
          { name: 'minQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
          { name: 'maxQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
          { name: 'quorumCoefficient', internalType: 'uint32', type: 'uint32' },
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
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'proposalIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'joinFork',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lastMinuteWindowInBlocks',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'latestProposalIds',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxQuorumVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minQuorumVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nouns',
    outputs: [{ name: '', internalType: 'contract NounsTokenLike', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'numTokensInForkEscrow',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'objectionPeriodDurationInBlocks',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pendingVetoer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposalCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'firstProposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'lastProposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'proposalEligibilityQuorumBps', internalType: 'uint16', type: 'uint16' },
      { name: 'excludeCanceled', internalType: 'bool', type: 'bool' },
      { name: 'requireVotingEnded', internalType: 'bool', type: 'bool' },
      { name: 'votingClientIds', internalType: 'uint32[]', type: 'uint32[]' },
    ],
    name: 'proposalDataForRewards',
    outputs: [
      {
        name: '',
        internalType: 'struct NounsDAOTypes.ProposalForRewards[]',
        type: 'tuple[]',
        components: [
          { name: 'endBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'objectionPeriodEndBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'forVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'againstVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'abstainVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'totalSupply', internalType: 'uint256', type: 'uint256' },
          { name: 'creationTimestamp', internalType: 'uint256', type: 'uint256' },
          { name: 'clientId', internalType: 'uint32', type: 'uint32' },
          {
            name: 'voteData',
            internalType: 'struct NounsDAOTypes.ClientVoteData[]',
            type: 'tuple[]',
            components: [
              { name: 'votes', internalType: 'uint32', type: 'uint32' },
              { name: 'txs', internalType: 'uint32', type: 'uint32' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposalMaxOperations',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposalThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposalThresholdBPS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposalUpdatablePeriodInBlocks',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposals',
    outputs: [
      {
        name: '',
        internalType: 'struct NounsDAOTypes.ProposalCondensedV2',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'proposer', internalType: 'address', type: 'address' },
          { name: 'proposalThreshold', internalType: 'uint256', type: 'uint256' },
          { name: 'quorumVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'eta', internalType: 'uint256', type: 'uint256' },
          { name: 'startBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'endBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'forVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'againstVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'abstainVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'canceled', internalType: 'bool', type: 'bool' },
          { name: 'vetoed', internalType: 'bool', type: 'bool' },
          { name: 'executed', internalType: 'bool', type: 'bool' },
          { name: 'totalSupply', internalType: 'uint256', type: 'uint256' },
          { name: 'creationBlock', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalsV3',
    outputs: [
      {
        name: '',
        internalType: 'struct NounsDAOTypes.ProposalCondensedV3',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'proposer', internalType: 'address', type: 'address' },
          { name: 'proposalThreshold', internalType: 'uint256', type: 'uint256' },
          { name: 'quorumVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'eta', internalType: 'uint256', type: 'uint256' },
          { name: 'startBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'endBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'forVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'againstVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'abstainVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'canceled', internalType: 'bool', type: 'bool' },
          { name: 'vetoed', internalType: 'bool', type: 'bool' },
          { name: 'executed', internalType: 'bool', type: 'bool' },
          { name: 'totalSupply', internalType: 'uint256', type: 'uint256' },
          { name: 'creationBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'signers', internalType: 'address[]', type: 'address[]' },
          { name: 'updatePeriodEndBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'objectionPeriodEndBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'executeOnTimelockV1', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'clientId', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'propose',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    name: 'propose',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'proposerSignatures',
        internalType: 'struct NounsDAOTypes.ProposerSignature[]',
        type: 'tuple[]',
        components: [
          { name: 'sig', internalType: 'bytes', type: 'bytes' },
          { name: 'signer', internalType: 'address', type: 'address' },
          { name: 'expirationTimestamp', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    name: 'proposeBySigs',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'proposerSignatures',
        internalType: 'struct NounsDAOTypes.ProposerSignature[]',
        type: 'tuple[]',
        components: [
          { name: 'sig', internalType: 'bytes', type: 'bytes' },
          { name: 'signer', internalType: 'address', type: 'address' },
          { name: 'expirationTimestamp', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'clientId', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'proposeBySigs',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    name: 'proposeOnTimelockV1',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'clientId', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'proposeOnTimelockV1',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'queue',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'quorumParamsCheckpoints',
    outputs: [
      {
        name: '',
        internalType: 'struct NounsDAOTypes.DynamicQuorumParamsCheckpoint[]',
        type: 'tuple[]',
        components: [
          { name: 'fromBlock', internalType: 'uint32', type: 'uint32' },
          {
            name: 'params',
            internalType: 'struct NounsDAOTypes.DynamicQuorumParams',
            type: 'tuple',
            components: [
              { name: 'minQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
              { name: 'maxQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
              { name: 'quorumCoefficient', internalType: 'uint32', type: 'uint32' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'quorumParamsCheckpoints',
    outputs: [
      {
        name: '',
        internalType: 'struct NounsDAOTypes.DynamicQuorumParamsCheckpoint',
        type: 'tuple',
        components: [
          { name: 'fromBlock', internalType: 'uint32', type: 'uint32' },
          {
            name: 'params',
            internalType: 'struct NounsDAOTypes.DynamicQuorumParams',
            type: 'tuple',
            components: [
              { name: 'minQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
              { name: 'maxQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
              { name: 'quorumCoefficient', internalType: 'uint32', type: 'uint32' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'quorumVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'quorumVotesBPS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'state',
    outputs: [{ name: '', internalType: 'enum NounsDAOTypes.ProposalState', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'timelock',
    outputs: [{ name: '', internalType: 'contract INounsDAOExecutor', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'timelockV1',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'updateMessage', internalType: 'string', type: 'string' },
    ],
    name: 'updateProposal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'proposerSignatures',
        internalType: 'struct NounsDAOTypes.ProposerSignature[]',
        type: 'tuple[]',
        components: [
          { name: 'sig', internalType: 'bytes', type: 'bytes' },
          { name: 'signer', internalType: 'address', type: 'address' },
          { name: 'expirationTimestamp', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'updateMessage', internalType: 'string', type: 'string' },
    ],
    name: 'updateProposalBySigs',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'updateMessage', internalType: 'string', type: 'string' },
    ],
    name: 'updateProposalDescription',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'updateMessage', internalType: 'string', type: 'string' },
    ],
    name: 'updateProposalTransactions',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'veto',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'vetoer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'voteSnapshotBlockSwitchProposalId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingDelay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'to', internalType: 'address', type: 'address' },
    ],
    name: 'withdrawDAONounsFromEscrowIncreasingTotalSupply',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]' }],
    name: 'withdrawDAONounsFromEscrowToTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]' }],
    name: 'withdrawFromForkEscrow',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const nounsGovernorAddress = {
  1: '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d',
  11155111: '0x35d2670d7C8931AACdd37C89Ddcb0638c3c44A57',
} as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const nounsGovernorConfig = {
  address: nounsGovernorAddress,
  abi: nounsGovernorAbi,
} as const;

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
] as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const nounsTreasuryAddress = {
  1: '0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71',
  11155111: '0x07e5D6a1550aD5E597A9b0698A474AA080A2fB28',
} as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const nounsTreasuryConfig = {
  address: nounsTreasuryAddress,
  abi: nounsTreasuryAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useReadNounsAuctionHouse = /*#__PURE__*/ createUseReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"MAX_TIME_BUFFER"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useReadNounsAuctionHouseMaxTimeBuffer = /*#__PURE__*/ createUseReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'MAX_TIME_BUFFER',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"auction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useReadNounsAuctionHouseAuction = /*#__PURE__*/ createUseReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'auction',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"auctionStorage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useReadNounsAuctionHouseAuctionStorage = /*#__PURE__*/ createUseReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'auctionStorage',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"biddingClient"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useReadNounsAuctionHouseBiddingClient = /*#__PURE__*/ createUseReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'biddingClient',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"duration"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useReadNounsAuctionHouseDuration = /*#__PURE__*/ createUseReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'duration',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"getPrices"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useReadNounsAuctionHouseGetPrices = /*#__PURE__*/ createUseReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'getPrices',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"getSettlements"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useReadNounsAuctionHouseGetSettlements = /*#__PURE__*/ createUseReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'getSettlements',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"getSettlementsFromIdtoTimestamp"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useReadNounsAuctionHouseGetSettlementsFromIdtoTimestamp =
  /*#__PURE__*/ createUseReadContract({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    functionName: 'getSettlementsFromIdtoTimestamp',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"minBidIncrementPercentage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useReadNounsAuctionHouseMinBidIncrementPercentage =
  /*#__PURE__*/ createUseReadContract({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    functionName: 'minBidIncrementPercentage',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"nouns"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useReadNounsAuctionHouseNouns = /*#__PURE__*/ createUseReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'nouns',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useReadNounsAuctionHouseOwner = /*#__PURE__*/ createUseReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'owner',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useReadNounsAuctionHousePaused = /*#__PURE__*/ createUseReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'paused',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"reservePrice"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useReadNounsAuctionHouseReservePrice = /*#__PURE__*/ createUseReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'reservePrice',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"sanctionsOracle"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useReadNounsAuctionHouseSanctionsOracle = /*#__PURE__*/ createUseReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'sanctionsOracle',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"timeBuffer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useReadNounsAuctionHouseTimeBuffer = /*#__PURE__*/ createUseReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'timeBuffer',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"weth"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useReadNounsAuctionHouseWeth = /*#__PURE__*/ createUseReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'weth',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWriteNounsAuctionHouse = /*#__PURE__*/ createUseWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"createBid"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWriteNounsAuctionHouseCreateBid = /*#__PURE__*/ createUseWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'createBid',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWriteNounsAuctionHouseInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWriteNounsAuctionHousePause = /*#__PURE__*/ createUseWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'pause',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWriteNounsAuctionHouseRenounceOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setMinBidIncrementPercentage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWriteNounsAuctionHouseSetMinBidIncrementPercentage =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    functionName: 'setMinBidIncrementPercentage',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setPrices"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWriteNounsAuctionHouseSetPrices = /*#__PURE__*/ createUseWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'setPrices',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setReservePrice"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWriteNounsAuctionHouseSetReservePrice = /*#__PURE__*/ createUseWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'setReservePrice',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setSanctionsOracle"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWriteNounsAuctionHouseSetSanctionsOracle = /*#__PURE__*/ createUseWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'setSanctionsOracle',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setTimeBuffer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWriteNounsAuctionHouseSetTimeBuffer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'setTimeBuffer',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"settleAuction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWriteNounsAuctionHouseSettleAuction = /*#__PURE__*/ createUseWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'settleAuction',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"settleCurrentAndCreateNewAuction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWriteNounsAuctionHouseSettleCurrentAndCreateNewAuction =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    functionName: 'settleCurrentAndCreateNewAuction',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWriteNounsAuctionHouseTransferOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWriteNounsAuctionHouseUnpause = /*#__PURE__*/ createUseWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'unpause',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"warmUpSettlementState"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWriteNounsAuctionHouseWarmUpSettlementState = /*#__PURE__*/ createUseWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'warmUpSettlementState',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useSimulateNounsAuctionHouse = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"createBid"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useSimulateNounsAuctionHouseCreateBid = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'createBid',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useSimulateNounsAuctionHouseInitialize = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useSimulateNounsAuctionHousePause = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'pause',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useSimulateNounsAuctionHouseRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setMinBidIncrementPercentage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useSimulateNounsAuctionHouseSetMinBidIncrementPercentage =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    functionName: 'setMinBidIncrementPercentage',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setPrices"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useSimulateNounsAuctionHouseSetPrices = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'setPrices',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setReservePrice"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useSimulateNounsAuctionHouseSetReservePrice = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'setReservePrice',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setSanctionsOracle"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useSimulateNounsAuctionHouseSetSanctionsOracle =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    functionName: 'setSanctionsOracle',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setTimeBuffer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useSimulateNounsAuctionHouseSetTimeBuffer = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'setTimeBuffer',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"settleAuction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useSimulateNounsAuctionHouseSettleAuction = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'settleAuction',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"settleCurrentAndCreateNewAuction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useSimulateNounsAuctionHouseSettleCurrentAndCreateNewAuction =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    functionName: 'settleCurrentAndCreateNewAuction',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useSimulateNounsAuctionHouseTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useSimulateNounsAuctionHouseUnpause = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'unpause',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"warmUpSettlementState"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useSimulateNounsAuctionHouseWarmUpSettlementState =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    functionName: 'warmUpSettlementState',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWatchNounsAuctionHouseEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"AuctionBid"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWatchNounsAuctionHouseAuctionBidEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  eventName: 'AuctionBid',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"AuctionBidWithClientId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWatchNounsAuctionHouseAuctionBidWithClientIdEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    eventName: 'AuctionBidWithClientId',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"AuctionCreated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWatchNounsAuctionHouseAuctionCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    eventName: 'AuctionCreated',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"AuctionExtended"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWatchNounsAuctionHouseAuctionExtendedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    eventName: 'AuctionExtended',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"AuctionMinBidIncrementPercentageUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWatchNounsAuctionHouseAuctionMinBidIncrementPercentageUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    eventName: 'AuctionMinBidIncrementPercentageUpdated',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"AuctionReservePriceUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWatchNounsAuctionHouseAuctionReservePriceUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    eventName: 'AuctionReservePriceUpdated',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"AuctionSettled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWatchNounsAuctionHouseAuctionSettledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    eventName: 'AuctionSettled',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"AuctionSettledWithClientId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWatchNounsAuctionHouseAuctionSettledWithClientIdEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    eventName: 'AuctionSettledWithClientId',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"AuctionTimeBufferUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWatchNounsAuctionHouseAuctionTimeBufferUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    eventName: 'AuctionTimeBufferUpdated',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWatchNounsAuctionHouseOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    eventName: 'OwnershipTransferred',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"Paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWatchNounsAuctionHousePausedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  eventName: 'Paused',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"SanctionsOracleSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWatchNounsAuctionHouseSanctionsOracleSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    eventName: 'SanctionsOracleSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"Unpaused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const useWatchNounsAuctionHouseUnpausedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  eventName: 'Unpaused',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDataAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useReadNounsData = /*#__PURE__*/ createUseReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"PRIOR_VOTES_BLOCKS_AGO"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useReadNounsDataPriorVotesBlocksAgo = /*#__PURE__*/ createUseReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'PRIOR_VOTES_BLOCKS_AGO',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"createCandidateCost"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useReadNounsDataCreateCandidateCost = /*#__PURE__*/ createUseReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'createCandidateCost',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"dunaAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useReadNounsDataDunaAdmin = /*#__PURE__*/ createUseReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'dunaAdmin',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"feeRecipient"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useReadNounsDataFeeRecipient = /*#__PURE__*/ createUseReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'feeRecipient',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"nounsDao"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useReadNounsDataNounsDao = /*#__PURE__*/ createUseReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'nounsDao',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"nounsToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useReadNounsDataNounsToken = /*#__PURE__*/ createUseReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'nounsToken',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useReadNounsDataOwner = /*#__PURE__*/ createUseReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'owner',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"propCandidates"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useReadNounsDataPropCandidates = /*#__PURE__*/ createUseReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'propCandidates',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"updateCandidateCost"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useReadNounsDataUpdateCandidateCost = /*#__PURE__*/ createUseReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'updateCandidateCost',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsData = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"addSignature"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsDataAddSignature = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'addSignature',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"cancelProposalCandidate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsDataCancelProposalCandidate = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'cancelProposalCandidate',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"createProposalCandidate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsDataCreateProposalCandidate = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'createProposalCandidate',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsDataInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"postDunaAdminMessage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsDataPostDunaAdminMessage = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'postDunaAdminMessage',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"postVoterMessageToDunaAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsDataPostVoterMessageToDunaAdmin = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'postVoterMessageToDunaAdmin',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsDataRenounceOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"sendCandidateFeedback"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsDataSendCandidateFeedback = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'sendCandidateFeedback',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"sendFeedback"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsDataSendFeedback = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'sendFeedback',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"setCreateCandidateCost"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsDataSetCreateCandidateCost = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'setCreateCandidateCost',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"setDunaAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsDataSetDunaAdmin = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'setDunaAdmin',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"setFeeRecipient"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsDataSetFeeRecipient = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'setFeeRecipient',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"setUpdateCandidateCost"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsDataSetUpdateCandidateCost = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'setUpdateCandidateCost',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"signalProposalCompliance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsDataSignalProposalCompliance = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'signalProposalCompliance',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsDataTransferOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"updateProposalCandidate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsDataUpdateProposalCandidate = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'updateProposalCandidate',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsDataUpgradeTo = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'upgradeTo',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsDataUpgradeToAndCall = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'upgradeToAndCall',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"withdrawETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWriteNounsDataWithdrawEth = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'withdrawETH',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsData = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"addSignature"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsDataAddSignature = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'addSignature',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"cancelProposalCandidate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsDataCancelProposalCandidate = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'cancelProposalCandidate',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"createProposalCandidate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsDataCreateProposalCandidate = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'createProposalCandidate',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsDataInitialize = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"postDunaAdminMessage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsDataPostDunaAdminMessage = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'postDunaAdminMessage',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"postVoterMessageToDunaAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsDataPostVoterMessageToDunaAdmin =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsDataAbi,
    address: nounsDataAddress,
    functionName: 'postVoterMessageToDunaAdmin',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsDataRenounceOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"sendCandidateFeedback"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsDataSendCandidateFeedback = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'sendCandidateFeedback',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"sendFeedback"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsDataSendFeedback = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'sendFeedback',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"setCreateCandidateCost"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsDataSetCreateCandidateCost = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'setCreateCandidateCost',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"setDunaAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsDataSetDunaAdmin = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'setDunaAdmin',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"setFeeRecipient"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsDataSetFeeRecipient = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'setFeeRecipient',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"setUpdateCandidateCost"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsDataSetUpdateCandidateCost = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'setUpdateCandidateCost',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"signalProposalCompliance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsDataSignalProposalCompliance = /*#__PURE__*/ createUseSimulateContract(
  { abi: nounsDataAbi, address: nounsDataAddress, functionName: 'signalProposalCompliance' },
);

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsDataTransferOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"updateProposalCandidate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsDataUpdateProposalCandidate = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'updateProposalCandidate',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsDataUpgradeTo = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'upgradeTo',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsDataUpgradeToAndCall = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'upgradeToAndCall',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"withdrawETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useSimulateNounsDataWithdrawEth = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'withdrawETH',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWatchNounsDataEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWatchNounsDataAdminChangedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'AdminChanged',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"BeaconUpgraded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWatchNounsDataBeaconUpgradedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'BeaconUpgraded',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"CandidateFeedbackSent"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWatchNounsDataCandidateFeedbackSentEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsDataAbi,
    address: nounsDataAddress,
    eventName: 'CandidateFeedbackSent',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"CreateCandidateCostSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWatchNounsDataCreateCandidateCostSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsDataAbi,
    address: nounsDataAddress,
    eventName: 'CreateCandidateCostSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"DunaAdminMessagePosted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWatchNounsDataDunaAdminMessagePostedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsDataAbi,
    address: nounsDataAddress,
    eventName: 'DunaAdminMessagePosted',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"DunaAdminSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWatchNounsDataDunaAdminSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'DunaAdminSet',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"ETHWithdrawn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWatchNounsDataEthWithdrawnEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'ETHWithdrawn',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"FeeRecipientSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWatchNounsDataFeeRecipientSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'FeeRecipientSet',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"FeedbackSent"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWatchNounsDataFeedbackSentEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'FeedbackSent',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWatchNounsDataOwnershipTransferredEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: nounsDataAbi, address: nounsDataAddress, eventName: 'OwnershipTransferred' },
);

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"ProposalCandidateCanceled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWatchNounsDataProposalCandidateCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsDataAbi,
    address: nounsDataAddress,
    eventName: 'ProposalCandidateCanceled',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"ProposalCandidateCreated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWatchNounsDataProposalCandidateCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsDataAbi,
    address: nounsDataAddress,
    eventName: 'ProposalCandidateCreated',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"ProposalCandidateUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWatchNounsDataProposalCandidateUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsDataAbi,
    address: nounsDataAddress,
    eventName: 'ProposalCandidateUpdated',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"ProposalComplianceSignaled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWatchNounsDataProposalComplianceSignaledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsDataAbi,
    address: nounsDataAddress,
    eventName: 'ProposalComplianceSignaled',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"SignatureAdded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWatchNounsDataSignatureAddedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'SignatureAdded',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"UpdateCandidateCostSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWatchNounsDataUpdateCandidateCostSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsDataAbi,
    address: nounsDataAddress,
    eventName: 'UpdateCandidateCostSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"Upgraded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWatchNounsDataUpgradedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'Upgraded',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"VoterMessageToDunaAdminPosted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const useWatchNounsDataVoterMessageToDunaAdminPostedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsDataAbi,
    address: nounsDataAddress,
    eventName: 'VoterMessageToDunaAdminPosted',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptor = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"accessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorAccessories = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'accessories',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"accessoryCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorAccessoryCount = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'accessoryCount',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"arePartsLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorArePartsLocked = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'arePartsLocked',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"art"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorArt = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'art',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"backgroundCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorBackgroundCount = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'backgroundCount',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"backgrounds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorBackgrounds = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'backgrounds',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"baseURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorBaseUri = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'baseURI',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"bodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorBodies = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'bodies',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"bodyCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorBodyCount = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'bodyCount',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"dataURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorDataUri = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'dataURI',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"generateSVGImage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorGenerateSvgImage = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'generateSVGImage',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"genericDataURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorGenericDataUri = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'genericDataURI',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"getPartsForSeed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorGetPartsForSeed = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'getPartsForSeed',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"glasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorGlasses = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'glasses',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"glassesCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorGlassesCount = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'glassesCount',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"headCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorHeadCount = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'headCount',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"heads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorHeads = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'heads',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"isDataURIEnabled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorIsDataUriEnabled = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'isDataURIEnabled',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorOwner = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'owner',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"palettes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorPalettes = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'palettes',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"renderer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorRenderer = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'renderer',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"tokenURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorTokenUri = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'tokenURI',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptor = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addAccessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddAccessories = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addAccessories',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addAccessoriesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddAccessoriesFromPointer =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'addAccessoriesFromPointer',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBackground"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddBackground = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBackground',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddBodies = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBodies',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBodiesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddBodiesFromPointer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBodiesFromPointer',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addGlasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddGlasses = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addGlasses',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addGlassesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddGlassesFromPointer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addGlassesFromPointer',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addHeads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddHeads = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addHeads',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addHeadsFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddHeadsFromPointer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addHeadsFromPointer',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addManyBackgrounds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddManyBackgrounds = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addManyBackgrounds',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"lockParts"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorLockParts = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'lockParts',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorRenounceOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorSetArt = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArt',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArtDescriptor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorSetArtDescriptor = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArtDescriptor',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArtInflator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorSetArtInflator = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArtInflator',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setBaseURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorSetBaseUri = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setBaseURI',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setPalette"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorSetPalette = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setPalette',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setPalettePointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorSetPalettePointer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setPalettePointer',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setRenderer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorSetRenderer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setRenderer',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"toggleDataURIEnabled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorToggleDataUriEnabled = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'toggleDataURIEnabled',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorTransferOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateAccessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorUpdateAccessories = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateAccessories',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateAccessoriesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorUpdateAccessoriesFromPointer =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'updateAccessoriesFromPointer',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateBodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorUpdateBodies = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateBodies',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateBodiesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorUpdateBodiesFromPointer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateBodiesFromPointer',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateGlasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorUpdateGlasses = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateGlasses',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateGlassesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorUpdateGlassesFromPointer = /*#__PURE__*/ createUseWriteContract(
  {
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'updateGlassesFromPointer',
  },
);

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateHeads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorUpdateHeads = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateHeads',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateHeadsFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorUpdateHeadsFromPointer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateHeadsFromPointer',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptor = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addAccessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddAccessories = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addAccessories',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addAccessoriesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddAccessoriesFromPointer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'addAccessoriesFromPointer',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBackground"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddBackground = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBackground',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddBodies = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBodies',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBodiesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddBodiesFromPointer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'addBodiesFromPointer',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addGlasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddGlasses = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addGlasses',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addGlassesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddGlassesFromPointer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'addGlassesFromPointer',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addHeads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddHeads = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addHeads',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addHeadsFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddHeadsFromPointer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'addHeadsFromPointer',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addManyBackgrounds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddManyBackgrounds = /*#__PURE__*/ createUseSimulateContract(
  { abi: nounsDescriptorAbi, address: nounsDescriptorAddress, functionName: 'addManyBackgrounds' },
);

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"lockParts"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorLockParts = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'lockParts',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorRenounceOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorSetArt = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArt',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArtDescriptor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorSetArtDescriptor = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArtDescriptor',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArtInflator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorSetArtInflator = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArtInflator',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setBaseURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorSetBaseUri = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setBaseURI',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setPalette"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorSetPalette = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setPalette',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setPalettePointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorSetPalettePointer = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setPalettePointer',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setRenderer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorSetRenderer = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setRenderer',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"toggleDataURIEnabled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorToggleDataUriEnabled =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'toggleDataURIEnabled',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorTransferOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateAccessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorUpdateAccessories = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateAccessories',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateAccessoriesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorUpdateAccessoriesFromPointer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'updateAccessoriesFromPointer',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateBodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorUpdateBodies = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateBodies',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateBodiesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorUpdateBodiesFromPointer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'updateBodiesFromPointer',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateGlasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorUpdateGlasses = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateGlasses',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateGlassesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorUpdateGlassesFromPointer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'updateGlassesFromPointer',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateHeads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorUpdateHeads = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateHeads',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateHeadsFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorUpdateHeadsFromPointer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'updateHeadsFromPointer',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWatchNounsDescriptorEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"ArtUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWatchNounsDescriptorArtUpdatedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  eventName: 'ArtUpdated',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"BaseURIUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWatchNounsDescriptorBaseUriUpdatedEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: nounsDescriptorAbi, address: nounsDescriptorAddress, eventName: 'BaseURIUpdated' },
);

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"DataURIToggled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWatchNounsDescriptorDataUriToggledEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: nounsDescriptorAbi, address: nounsDescriptorAddress, eventName: 'DataURIToggled' },
);

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWatchNounsDescriptorOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    eventName: 'OwnershipTransferred',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"PartsLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWatchNounsDescriptorPartsLockedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  eventName: 'PartsLocked',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"RendererUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWatchNounsDescriptorRendererUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    eventName: 'RendererUpdated',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernor = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"MAX_PROPOSAL_THRESHOLD_BPS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorMaxProposalThresholdBps = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'MAX_PROPOSAL_THRESHOLD_BPS',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"MAX_VOTING_DELAY"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorMaxVotingDelay = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'MAX_VOTING_DELAY',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"MAX_VOTING_PERIOD"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorMaxVotingPeriod = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'MAX_VOTING_PERIOD',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"MIN_PROPOSAL_THRESHOLD_BPS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorMinProposalThresholdBps = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'MIN_PROPOSAL_THRESHOLD_BPS',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"MIN_VOTING_DELAY"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorMinVotingDelay = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'MIN_VOTING_DELAY',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"MIN_VOTING_PERIOD"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorMinVotingPeriod = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'MIN_VOTING_PERIOD',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"adjustedTotalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorAdjustedTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'adjustedTotalSupply',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"admin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorAdmin = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'admin',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"dynamicQuorumVotes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorDynamicQuorumVotes = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'dynamicQuorumVotes',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"erc20TokensToIncludeInFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorErc20TokensToIncludeInFork = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'erc20TokensToIncludeInFork',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"forkDAODeployer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorForkDaoDeployer = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'forkDAODeployer',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"forkEndTimestamp"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorForkEndTimestamp = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'forkEndTimestamp',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"forkEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorForkEscrow = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'forkEscrow',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"forkPeriod"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorForkPeriod = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'forkPeriod',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"forkThreshold"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorForkThreshold = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'forkThreshold',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"forkThresholdBPS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorForkThresholdBps = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'forkThresholdBPS',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"getActions"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorGetActions = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'getActions',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"getDynamicQuorumParamsAt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorGetDynamicQuorumParamsAt = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'getDynamicQuorumParamsAt',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"getReceipt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorGetReceipt = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'getReceipt',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"lastMinuteWindowInBlocks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorLastMinuteWindowInBlocks = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'lastMinuteWindowInBlocks',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"latestProposalIds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorLatestProposalIds = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'latestProposalIds',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"maxQuorumVotes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorMaxQuorumVotes = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'maxQuorumVotes',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"minQuorumVotes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorMinQuorumVotes = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'minQuorumVotes',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"nouns"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorNouns = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'nouns',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"numTokensInForkEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorNumTokensInForkEscrow = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'numTokensInForkEscrow',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"objectionPeriodDurationInBlocks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorObjectionPeriodDurationInBlocks =
  /*#__PURE__*/ createUseReadContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'objectionPeriodDurationInBlocks',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"pendingVetoer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorPendingVetoer = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'pendingVetoer',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorProposalCount = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposalCount',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalDataForRewards"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorProposalDataForRewards = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposalDataForRewards',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalMaxOperations"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorProposalMaxOperations = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposalMaxOperations',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalThreshold"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorProposalThreshold = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposalThreshold',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalThresholdBPS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorProposalThresholdBps = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposalThresholdBPS',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalUpdatablePeriodInBlocks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorProposalUpdatablePeriodInBlocks =
  /*#__PURE__*/ createUseReadContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'proposalUpdatablePeriodInBlocks',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorProposals = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposals',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalsV3"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorProposalsV3 = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposalsV3',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"quorumParamsCheckpoints"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorQuorumParamsCheckpoints = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'quorumParamsCheckpoints',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"quorumVotes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorQuorumVotes = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'quorumVotes',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"quorumVotesBPS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorQuorumVotesBps = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'quorumVotesBPS',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"state"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorState = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'state',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"timelock"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorTimelock = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'timelock',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"timelockV1"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorTimelockV1 = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'timelockV1',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"vetoer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorVetoer = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'vetoer',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"voteSnapshotBlockSwitchProposalId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorVoteSnapshotBlockSwitchProposalId =
  /*#__PURE__*/ createUseReadContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'voteSnapshotBlockSwitchProposalId',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"votingDelay"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorVotingDelay = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'votingDelay',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"votingPeriod"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorVotingPeriod = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'votingPeriod',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernor = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"cancel"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorCancel = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'cancel',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"cancelSig"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorCancelSig = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'cancelSig',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castRefundableVote"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorCastRefundableVote = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castRefundableVote',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castRefundableVoteWithReason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorCastRefundableVoteWithReason =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'castRefundableVoteWithReason',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castVote"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorCastVote = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castVote',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castVoteBySig"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorCastVoteBySig = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castVoteBySig',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castVoteWithReason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorCastVoteWithReason = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castVoteWithReason',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"escrowToFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorEscrowToFork = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'escrowToFork',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"execute"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorExecute = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'execute',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"executeFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorExecuteFork = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'executeFork',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"joinFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorJoinFork = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'joinFork',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"propose"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorPropose = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'propose',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposeBySigs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorProposeBySigs = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposeBySigs',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposeOnTimelockV1"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorProposeOnTimelockV1 = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposeOnTimelockV1',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"queue"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorQueue = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'queue',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposal"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorUpdateProposal = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'updateProposal',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposalBySigs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorUpdateProposalBySigs = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'updateProposalBySigs',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposalDescription"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorUpdateProposalDescription = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'updateProposalDescription',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposalTransactions"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorUpdateProposalTransactions = /*#__PURE__*/ createUseWriteContract(
  {
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'updateProposalTransactions',
  },
);

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"veto"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorVeto = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'veto',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"withdrawDAONounsFromEscrowIncreasingTotalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorWithdrawDaoNounsFromEscrowIncreasingTotalSupply =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'withdrawDAONounsFromEscrowIncreasingTotalSupply',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"withdrawDAONounsFromEscrowToTreasury"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorWithdrawDaoNounsFromEscrowToTreasury =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'withdrawDAONounsFromEscrowToTreasury',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"withdrawFromForkEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorWithdrawFromForkEscrow = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'withdrawFromForkEscrow',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernor = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"cancel"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorCancel = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'cancel',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"cancelSig"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorCancelSig = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'cancelSig',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castRefundableVote"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorCastRefundableVote = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castRefundableVote',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castRefundableVoteWithReason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorCastRefundableVoteWithReason =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'castRefundableVoteWithReason',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castVote"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorCastVote = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castVote',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castVoteBySig"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorCastVoteBySig = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castVoteBySig',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castVoteWithReason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorCastVoteWithReason = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castVoteWithReason',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"escrowToFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorEscrowToFork = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'escrowToFork',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"execute"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorExecute = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'execute',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"executeFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorExecuteFork = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'executeFork',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorInitialize = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"joinFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorJoinFork = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'joinFork',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"propose"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorPropose = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'propose',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposeBySigs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorProposeBySigs = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposeBySigs',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposeOnTimelockV1"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorProposeOnTimelockV1 = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposeOnTimelockV1',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"queue"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorQueue = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'queue',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposal"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorUpdateProposal = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'updateProposal',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposalBySigs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorUpdateProposalBySigs = /*#__PURE__*/ createUseSimulateContract(
  { abi: nounsGovernorAbi, address: nounsGovernorAddress, functionName: 'updateProposalBySigs' },
);

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposalDescription"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorUpdateProposalDescription =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'updateProposalDescription',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposalTransactions"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorUpdateProposalTransactions =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'updateProposalTransactions',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"veto"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorVeto = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'veto',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"withdrawDAONounsFromEscrowIncreasingTotalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorWithdrawDaoNounsFromEscrowIncreasingTotalSupply =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'withdrawDAONounsFromEscrowIncreasingTotalSupply',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"withdrawDAONounsFromEscrowToTreasury"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorWithdrawDaoNounsFromEscrowToTreasury =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'withdrawDAONounsFromEscrowToTreasury',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"withdrawFromForkEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorWithdrawFromForkEscrow =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'withdrawFromForkEscrow',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"DAONounsSupplyIncreasedFromEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorDaoNounsSupplyIncreasedFromEscrowEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'DAONounsSupplyIncreasedFromEscrow',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"DAOWithdrawNounsFromEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorDaoWithdrawNounsFromEscrowEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'DAOWithdrawNounsFromEscrow',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ERC20TokensToIncludeInForkSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorErc20TokensToIncludeInForkSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ERC20TokensToIncludeInForkSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"EscrowedToFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorEscrowedToForkEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'EscrowedToFork',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ExecuteFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorExecuteForkEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ExecuteFork',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ForkDAODeployerSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorForkDaoDeployerSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ForkDAODeployerSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ForkPeriodSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorForkPeriodSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ForkPeriodSet',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ForkThresholdSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorForkThresholdSetEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: nounsGovernorAbi, address: nounsGovernorAddress, eventName: 'ForkThresholdSet' },
);

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"JoinFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorJoinForkEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'JoinFork',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"LastMinuteWindowSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorLastMinuteWindowSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'LastMinuteWindowSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"MaxQuorumVotesBPSSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorMaxQuorumVotesBpsSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'MaxQuorumVotesBPSSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"MinQuorumVotesBPSSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorMinQuorumVotesBpsSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'MinQuorumVotesBPSSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"NewAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorNewAdminEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'NewAdmin',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"NewPendingAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorNewPendingAdminEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'NewPendingAdmin',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"NewPendingVetoer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorNewPendingVetoerEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: nounsGovernorAbi, address: nounsGovernorAddress, eventName: 'NewPendingVetoer' },
);

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"NewVetoer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorNewVetoerEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'NewVetoer',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ObjectionPeriodDurationSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorObjectionPeriodDurationSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ObjectionPeriodDurationSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalCanceled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalCanceledEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: nounsGovernorAbi, address: nounsGovernorAddress, eventName: 'ProposalCanceled' },
);

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalCreated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalCreatedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ProposalCreated',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalCreatedOnTimelockV1"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalCreatedOnTimelockV1Event =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalCreatedOnTimelockV1',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalCreatedWithRequirements"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalCreatedWithRequirementsEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalCreatedWithRequirements',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalDescriptionUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalDescriptionUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalDescriptionUpdated',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalExecuted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalExecutedEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: nounsGovernorAbi, address: nounsGovernorAddress, eventName: 'ProposalExecuted' },
);

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalObjectionPeriodSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalObjectionPeriodSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalObjectionPeriodSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalQueued"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalQueuedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ProposalQueued',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalThresholdBPSSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalThresholdBpsSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalThresholdBPSSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalTransactionsUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalTransactionsUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalTransactionsUpdated',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalUpdatablePeriodSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalUpdatablePeriodSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalUpdatablePeriodSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalUpdatedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ProposalUpdated',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalVetoed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalVetoedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ProposalVetoed',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"QuorumCoefficientSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorQuorumCoefficientSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'QuorumCoefficientSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"QuorumVotesBPSSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorQuorumVotesBpsSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'QuorumVotesBPSSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"RefundableVote"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorRefundableVoteEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'RefundableVote',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"SignatureCancelled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorSignatureCancelledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'SignatureCancelled',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"TimelocksAndAdminSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorTimelocksAndAdminSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'TimelocksAndAdminSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"VoteCast"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorVoteCastEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'VoteCast',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"VoteCastWithClientId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorVoteCastWithClientIdEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'VoteCastWithClientId',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"VotingDelaySet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorVotingDelaySetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'VotingDelaySet',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"VotingPeriodSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorVotingPeriodSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'VotingPeriodSet',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"Withdraw"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorWithdrawEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'Withdraw',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"WithdrawFromForkEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorWithdrawFromForkEscrowEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'WithdrawFromForkEscrow',
  });

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

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useReadNounsTreasury = /*#__PURE__*/ createUseReadContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
});

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
});

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
});

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
});

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
});

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
});

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
});

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
});

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
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWriteNounsTreasury = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
});

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
});

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
});

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
});

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
});

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
});

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
});

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
});

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
});

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
});

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
});

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
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useSimulateNounsTreasury = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
});

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
});

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
});

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
});

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
});

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
});

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
});

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
});

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
});

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
});

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
});

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
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWatchNounsTreasuryEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
});

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
});

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
});

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
  });

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
});

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
});

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
  });

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
});

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
});

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
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"QueueTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const useWatchNounsTreasuryQueueTransactionEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: nounsTreasuryAbi, address: nounsTreasuryAddress, eventName: 'QueueTransaction' },
);

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
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const readNounsAuctionHouse = /*#__PURE__*/ createReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"MAX_TIME_BUFFER"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const readNounsAuctionHouseMaxTimeBuffer = /*#__PURE__*/ createReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'MAX_TIME_BUFFER',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"auction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const readNounsAuctionHouseAuction = /*#__PURE__*/ createReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'auction',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"auctionStorage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const readNounsAuctionHouseAuctionStorage = /*#__PURE__*/ createReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'auctionStorage',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"biddingClient"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const readNounsAuctionHouseBiddingClient = /*#__PURE__*/ createReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'biddingClient',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"duration"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const readNounsAuctionHouseDuration = /*#__PURE__*/ createReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'duration',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"getPrices"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const readNounsAuctionHouseGetPrices = /*#__PURE__*/ createReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'getPrices',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"getSettlements"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const readNounsAuctionHouseGetSettlements = /*#__PURE__*/ createReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'getSettlements',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"getSettlementsFromIdtoTimestamp"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const readNounsAuctionHouseGetSettlementsFromIdtoTimestamp =
  /*#__PURE__*/ createReadContract({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    functionName: 'getSettlementsFromIdtoTimestamp',
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"minBidIncrementPercentage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const readNounsAuctionHouseMinBidIncrementPercentage = /*#__PURE__*/ createReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'minBidIncrementPercentage',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"nouns"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const readNounsAuctionHouseNouns = /*#__PURE__*/ createReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'nouns',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const readNounsAuctionHouseOwner = /*#__PURE__*/ createReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'owner',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const readNounsAuctionHousePaused = /*#__PURE__*/ createReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'paused',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"reservePrice"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const readNounsAuctionHouseReservePrice = /*#__PURE__*/ createReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'reservePrice',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"sanctionsOracle"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const readNounsAuctionHouseSanctionsOracle = /*#__PURE__*/ createReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'sanctionsOracle',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"timeBuffer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const readNounsAuctionHouseTimeBuffer = /*#__PURE__*/ createReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'timeBuffer',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"weth"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const readNounsAuctionHouseWeth = /*#__PURE__*/ createReadContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'weth',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const writeNounsAuctionHouse = /*#__PURE__*/ createWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"createBid"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const writeNounsAuctionHouseCreateBid = /*#__PURE__*/ createWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'createBid',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const writeNounsAuctionHouseInitialize = /*#__PURE__*/ createWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const writeNounsAuctionHousePause = /*#__PURE__*/ createWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'pause',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const writeNounsAuctionHouseRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setMinBidIncrementPercentage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const writeNounsAuctionHouseSetMinBidIncrementPercentage = /*#__PURE__*/ createWriteContract(
  {
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    functionName: 'setMinBidIncrementPercentage',
  },
);

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setPrices"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const writeNounsAuctionHouseSetPrices = /*#__PURE__*/ createWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'setPrices',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setReservePrice"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const writeNounsAuctionHouseSetReservePrice = /*#__PURE__*/ createWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'setReservePrice',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setSanctionsOracle"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const writeNounsAuctionHouseSetSanctionsOracle = /*#__PURE__*/ createWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'setSanctionsOracle',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setTimeBuffer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const writeNounsAuctionHouseSetTimeBuffer = /*#__PURE__*/ createWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'setTimeBuffer',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"settleAuction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const writeNounsAuctionHouseSettleAuction = /*#__PURE__*/ createWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'settleAuction',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"settleCurrentAndCreateNewAuction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const writeNounsAuctionHouseSettleCurrentAndCreateNewAuction =
  /*#__PURE__*/ createWriteContract({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    functionName: 'settleCurrentAndCreateNewAuction',
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const writeNounsAuctionHouseTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const writeNounsAuctionHouseUnpause = /*#__PURE__*/ createWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'unpause',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"warmUpSettlementState"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const writeNounsAuctionHouseWarmUpSettlementState = /*#__PURE__*/ createWriteContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'warmUpSettlementState',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const simulateNounsAuctionHouse = /*#__PURE__*/ createSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"createBid"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const simulateNounsAuctionHouseCreateBid = /*#__PURE__*/ createSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'createBid',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const simulateNounsAuctionHouseInitialize = /*#__PURE__*/ createSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const simulateNounsAuctionHousePause = /*#__PURE__*/ createSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'pause',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const simulateNounsAuctionHouseRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setMinBidIncrementPercentage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const simulateNounsAuctionHouseSetMinBidIncrementPercentage =
  /*#__PURE__*/ createSimulateContract({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    functionName: 'setMinBidIncrementPercentage',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setPrices"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const simulateNounsAuctionHouseSetPrices = /*#__PURE__*/ createSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'setPrices',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setReservePrice"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const simulateNounsAuctionHouseSetReservePrice = /*#__PURE__*/ createSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'setReservePrice',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setSanctionsOracle"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const simulateNounsAuctionHouseSetSanctionsOracle = /*#__PURE__*/ createSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'setSanctionsOracle',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"setTimeBuffer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const simulateNounsAuctionHouseSetTimeBuffer = /*#__PURE__*/ createSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'setTimeBuffer',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"settleAuction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const simulateNounsAuctionHouseSettleAuction = /*#__PURE__*/ createSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'settleAuction',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"settleCurrentAndCreateNewAuction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const simulateNounsAuctionHouseSettleCurrentAndCreateNewAuction =
  /*#__PURE__*/ createSimulateContract({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    functionName: 'settleCurrentAndCreateNewAuction',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const simulateNounsAuctionHouseTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const simulateNounsAuctionHouseUnpause = /*#__PURE__*/ createSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'unpause',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `functionName` set to `"warmUpSettlementState"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const simulateNounsAuctionHouseWarmUpSettlementState = /*#__PURE__*/ createSimulateContract({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  functionName: 'warmUpSettlementState',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const watchNounsAuctionHouseEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"AuctionBid"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const watchNounsAuctionHouseAuctionBidEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  eventName: 'AuctionBid',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"AuctionBidWithClientId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const watchNounsAuctionHouseAuctionBidWithClientIdEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    eventName: 'AuctionBidWithClientId',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"AuctionCreated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const watchNounsAuctionHouseAuctionCreatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  eventName: 'AuctionCreated',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"AuctionExtended"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const watchNounsAuctionHouseAuctionExtendedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  eventName: 'AuctionExtended',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"AuctionMinBidIncrementPercentageUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const watchNounsAuctionHouseAuctionMinBidIncrementPercentageUpdatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    eventName: 'AuctionMinBidIncrementPercentageUpdated',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"AuctionReservePriceUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const watchNounsAuctionHouseAuctionReservePriceUpdatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    eventName: 'AuctionReservePriceUpdated',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"AuctionSettled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const watchNounsAuctionHouseAuctionSettledEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  eventName: 'AuctionSettled',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"AuctionSettledWithClientId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const watchNounsAuctionHouseAuctionSettledWithClientIdEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    eventName: 'AuctionSettledWithClientId',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"AuctionTimeBufferUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const watchNounsAuctionHouseAuctionTimeBufferUpdatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    eventName: 'AuctionTimeBufferUpdated',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const watchNounsAuctionHouseOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsAuctionHouseAbi,
    address: nounsAuctionHouseAddress,
    eventName: 'OwnershipTransferred',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"Paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const watchNounsAuctionHousePausedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  eventName: 'Paused',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"SanctionsOracleSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const watchNounsAuctionHouseSanctionsOracleSetEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: nounsAuctionHouseAbi, address: nounsAuctionHouseAddress, eventName: 'SanctionsOracleSet' },
);

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsAuctionHouseAbi}__ and `eventName` set to `"Unpaused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x830bd73e4184cef73443c15111a1df14e495c706)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x488609b7113fcf3b761a05956300d605e8f6bcaf)
 */
export const watchNounsAuctionHouseUnpausedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsAuctionHouseAbi,
  address: nounsAuctionHouseAddress,
  eventName: 'Unpaused',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDataAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const readNounsData = /*#__PURE__*/ createReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"PRIOR_VOTES_BLOCKS_AGO"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const readNounsDataPriorVotesBlocksAgo = /*#__PURE__*/ createReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'PRIOR_VOTES_BLOCKS_AGO',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"createCandidateCost"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const readNounsDataCreateCandidateCost = /*#__PURE__*/ createReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'createCandidateCost',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"dunaAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const readNounsDataDunaAdmin = /*#__PURE__*/ createReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'dunaAdmin',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"feeRecipient"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const readNounsDataFeeRecipient = /*#__PURE__*/ createReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'feeRecipient',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"nounsDao"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const readNounsDataNounsDao = /*#__PURE__*/ createReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'nounsDao',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"nounsToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const readNounsDataNounsToken = /*#__PURE__*/ createReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'nounsToken',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const readNounsDataOwner = /*#__PURE__*/ createReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'owner',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"propCandidates"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const readNounsDataPropCandidates = /*#__PURE__*/ createReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'propCandidates',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"updateCandidateCost"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const readNounsDataUpdateCandidateCost = /*#__PURE__*/ createReadContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'updateCandidateCost',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsData = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"addSignature"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsDataAddSignature = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'addSignature',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"cancelProposalCandidate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsDataCancelProposalCandidate = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'cancelProposalCandidate',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"createProposalCandidate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsDataCreateProposalCandidate = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'createProposalCandidate',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsDataInitialize = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"postDunaAdminMessage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsDataPostDunaAdminMessage = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'postDunaAdminMessage',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"postVoterMessageToDunaAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsDataPostVoterMessageToDunaAdmin = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'postVoterMessageToDunaAdmin',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsDataRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"sendCandidateFeedback"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsDataSendCandidateFeedback = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'sendCandidateFeedback',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"sendFeedback"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsDataSendFeedback = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'sendFeedback',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"setCreateCandidateCost"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsDataSetCreateCandidateCost = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'setCreateCandidateCost',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"setDunaAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsDataSetDunaAdmin = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'setDunaAdmin',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"setFeeRecipient"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsDataSetFeeRecipient = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'setFeeRecipient',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"setUpdateCandidateCost"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsDataSetUpdateCandidateCost = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'setUpdateCandidateCost',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"signalProposalCompliance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsDataSignalProposalCompliance = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'signalProposalCompliance',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsDataTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"updateProposalCandidate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsDataUpdateProposalCandidate = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'updateProposalCandidate',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsDataUpgradeTo = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'upgradeTo',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsDataUpgradeToAndCall = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'upgradeToAndCall',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"withdrawETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const writeNounsDataWithdrawEth = /*#__PURE__*/ createWriteContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'withdrawETH',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsData = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"addSignature"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsDataAddSignature = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'addSignature',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"cancelProposalCandidate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsDataCancelProposalCandidate = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'cancelProposalCandidate',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"createProposalCandidate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsDataCreateProposalCandidate = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'createProposalCandidate',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsDataInitialize = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"postDunaAdminMessage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsDataPostDunaAdminMessage = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'postDunaAdminMessage',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"postVoterMessageToDunaAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsDataPostVoterMessageToDunaAdmin = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'postVoterMessageToDunaAdmin',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsDataRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"sendCandidateFeedback"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsDataSendCandidateFeedback = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'sendCandidateFeedback',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"sendFeedback"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsDataSendFeedback = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'sendFeedback',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"setCreateCandidateCost"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsDataSetCreateCandidateCost = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'setCreateCandidateCost',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"setDunaAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsDataSetDunaAdmin = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'setDunaAdmin',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"setFeeRecipient"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsDataSetFeeRecipient = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'setFeeRecipient',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"setUpdateCandidateCost"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsDataSetUpdateCandidateCost = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'setUpdateCandidateCost',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"signalProposalCompliance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsDataSignalProposalCompliance = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'signalProposalCompliance',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsDataTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"updateProposalCandidate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsDataUpdateProposalCandidate = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'updateProposalCandidate',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsDataUpgradeTo = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'upgradeTo',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsDataUpgradeToAndCall = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'upgradeToAndCall',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDataAbi}__ and `functionName` set to `"withdrawETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const simulateNounsDataWithdrawEth = /*#__PURE__*/ createSimulateContract({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  functionName: 'withdrawETH',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const watchNounsDataEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const watchNounsDataAdminChangedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'AdminChanged',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"BeaconUpgraded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const watchNounsDataBeaconUpgradedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'BeaconUpgraded',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"CandidateFeedbackSent"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const watchNounsDataCandidateFeedbackSentEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'CandidateFeedbackSent',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"CreateCandidateCostSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const watchNounsDataCreateCandidateCostSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'CreateCandidateCostSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"DunaAdminMessagePosted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const watchNounsDataDunaAdminMessagePostedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'DunaAdminMessagePosted',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"DunaAdminSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const watchNounsDataDunaAdminSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'DunaAdminSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"ETHWithdrawn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const watchNounsDataEthWithdrawnEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'ETHWithdrawn',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"FeeRecipientSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const watchNounsDataFeeRecipientSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'FeeRecipientSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"FeedbackSent"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const watchNounsDataFeedbackSentEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'FeedbackSent',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const watchNounsDataOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'OwnershipTransferred',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"ProposalCandidateCanceled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const watchNounsDataProposalCandidateCanceledEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'ProposalCandidateCanceled',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"ProposalCandidateCreated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const watchNounsDataProposalCandidateCreatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'ProposalCandidateCreated',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"ProposalCandidateUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const watchNounsDataProposalCandidateUpdatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'ProposalCandidateUpdated',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"ProposalComplianceSignaled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const watchNounsDataProposalComplianceSignaledEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: nounsDataAbi, address: nounsDataAddress, eventName: 'ProposalComplianceSignaled' },
);

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"SignatureAdded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const watchNounsDataSignatureAddedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'SignatureAdded',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"UpdateCandidateCostSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const watchNounsDataUpdateCandidateCostSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'UpdateCandidateCostSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"Upgraded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const watchNounsDataUpgradedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDataAbi,
  address: nounsDataAddress,
  eventName: 'Upgraded',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataAbi}__ and `eventName` set to `"VoterMessageToDunaAdminPosted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790a5f59678dd733fb3de93493a91f472ca1365)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9040f720aa8a693f950b9cf94764b4b06079d002)
 */
export const watchNounsDataVoterMessageToDunaAdminPostedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsDataAbi,
    address: nounsDataAddress,
    eventName: 'VoterMessageToDunaAdminPosted',
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptor = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"accessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorAccessories = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'accessories',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"accessoryCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorAccessoryCount = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'accessoryCount',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"arePartsLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorArePartsLocked = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'arePartsLocked',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"art"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorArt = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'art',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"backgroundCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorBackgroundCount = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'backgroundCount',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"backgrounds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorBackgrounds = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'backgrounds',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"baseURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorBaseUri = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'baseURI',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"bodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorBodies = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'bodies',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"bodyCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorBodyCount = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'bodyCount',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"dataURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorDataUri = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'dataURI',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"generateSVGImage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorGenerateSvgImage = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'generateSVGImage',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"genericDataURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorGenericDataUri = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'genericDataURI',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"getPartsForSeed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorGetPartsForSeed = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'getPartsForSeed',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"glasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorGlasses = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'glasses',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"glassesCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorGlassesCount = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'glassesCount',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"headCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorHeadCount = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'headCount',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"heads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorHeads = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'heads',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"isDataURIEnabled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorIsDataUriEnabled = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'isDataURIEnabled',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorOwner = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'owner',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"palettes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorPalettes = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'palettes',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"renderer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorRenderer = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'renderer',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"tokenURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorTokenUri = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'tokenURI',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptor = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addAccessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddAccessories = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addAccessories',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addAccessoriesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddAccessoriesFromPointer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addAccessoriesFromPointer',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBackground"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddBackground = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBackground',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddBodies = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBodies',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBodiesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddBodiesFromPointer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBodiesFromPointer',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addGlasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddGlasses = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addGlasses',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addGlassesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddGlassesFromPointer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addGlassesFromPointer',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addHeads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddHeads = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addHeads',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addHeadsFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddHeadsFromPointer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addHeadsFromPointer',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addManyBackgrounds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddManyBackgrounds = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addManyBackgrounds',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"lockParts"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorLockParts = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'lockParts',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorSetArt = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArt',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArtDescriptor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorSetArtDescriptor = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArtDescriptor',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArtInflator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorSetArtInflator = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArtInflator',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setBaseURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorSetBaseUri = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setBaseURI',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setPalette"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorSetPalette = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setPalette',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setPalettePointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorSetPalettePointer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setPalettePointer',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setRenderer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorSetRenderer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setRenderer',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"toggleDataURIEnabled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorToggleDataUriEnabled = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'toggleDataURIEnabled',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateAccessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorUpdateAccessories = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateAccessories',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateAccessoriesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorUpdateAccessoriesFromPointer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateAccessoriesFromPointer',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateBodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorUpdateBodies = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateBodies',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateBodiesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorUpdateBodiesFromPointer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateBodiesFromPointer',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateGlasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorUpdateGlasses = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateGlasses',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateGlassesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorUpdateGlassesFromPointer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateGlassesFromPointer',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateHeads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorUpdateHeads = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateHeads',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateHeadsFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorUpdateHeadsFromPointer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateHeadsFromPointer',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptor = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addAccessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddAccessories = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addAccessories',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addAccessoriesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddAccessoriesFromPointer =
  /*#__PURE__*/ createSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'addAccessoriesFromPointer',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBackground"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddBackground = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBackground',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddBodies = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBodies',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBodiesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddBodiesFromPointer = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBodiesFromPointer',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addGlasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddGlasses = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addGlasses',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addGlassesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddGlassesFromPointer = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addGlassesFromPointer',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addHeads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddHeads = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addHeads',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addHeadsFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddHeadsFromPointer = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addHeadsFromPointer',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addManyBackgrounds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddManyBackgrounds = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addManyBackgrounds',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"lockParts"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorLockParts = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'lockParts',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorSetArt = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArt',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArtDescriptor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorSetArtDescriptor = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArtDescriptor',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArtInflator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorSetArtInflator = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArtInflator',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setBaseURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorSetBaseUri = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setBaseURI',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setPalette"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorSetPalette = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setPalette',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setPalettePointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorSetPalettePointer = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setPalettePointer',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setRenderer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorSetRenderer = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setRenderer',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"toggleDataURIEnabled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorToggleDataUriEnabled = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'toggleDataURIEnabled',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateAccessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorUpdateAccessories = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateAccessories',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateAccessoriesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorUpdateAccessoriesFromPointer =
  /*#__PURE__*/ createSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'updateAccessoriesFromPointer',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateBodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorUpdateBodies = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateBodies',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateBodiesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorUpdateBodiesFromPointer = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateBodiesFromPointer',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateGlasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorUpdateGlasses = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateGlasses',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateGlassesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorUpdateGlassesFromPointer = /*#__PURE__*/ createSimulateContract(
  {
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'updateGlassesFromPointer',
  },
);

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateHeads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorUpdateHeads = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateHeads',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateHeadsFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorUpdateHeadsFromPointer = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateHeadsFromPointer',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const watchNounsDescriptorEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"ArtUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const watchNounsDescriptorArtUpdatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  eventName: 'ArtUpdated',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"BaseURIUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const watchNounsDescriptorBaseUriUpdatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  eventName: 'BaseURIUpdated',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"DataURIToggled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const watchNounsDescriptorDataUriToggledEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  eventName: 'DataURIToggled',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const watchNounsDescriptorOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: nounsDescriptorAbi, address: nounsDescriptorAddress, eventName: 'OwnershipTransferred' },
);

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"PartsLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const watchNounsDescriptorPartsLockedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  eventName: 'PartsLocked',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"RendererUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const watchNounsDescriptorRendererUpdatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  eventName: 'RendererUpdated',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernor = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"MAX_PROPOSAL_THRESHOLD_BPS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorMaxProposalThresholdBps = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'MAX_PROPOSAL_THRESHOLD_BPS',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"MAX_VOTING_DELAY"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorMaxVotingDelay = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'MAX_VOTING_DELAY',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"MAX_VOTING_PERIOD"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorMaxVotingPeriod = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'MAX_VOTING_PERIOD',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"MIN_PROPOSAL_THRESHOLD_BPS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorMinProposalThresholdBps = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'MIN_PROPOSAL_THRESHOLD_BPS',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"MIN_VOTING_DELAY"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorMinVotingDelay = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'MIN_VOTING_DELAY',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"MIN_VOTING_PERIOD"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorMinVotingPeriod = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'MIN_VOTING_PERIOD',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"adjustedTotalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorAdjustedTotalSupply = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'adjustedTotalSupply',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"admin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorAdmin = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'admin',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"dynamicQuorumVotes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorDynamicQuorumVotes = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'dynamicQuorumVotes',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"erc20TokensToIncludeInFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorErc20TokensToIncludeInFork = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'erc20TokensToIncludeInFork',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"forkDAODeployer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorForkDaoDeployer = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'forkDAODeployer',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"forkEndTimestamp"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorForkEndTimestamp = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'forkEndTimestamp',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"forkEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorForkEscrow = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'forkEscrow',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"forkPeriod"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorForkPeriod = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'forkPeriod',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"forkThreshold"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorForkThreshold = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'forkThreshold',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"forkThresholdBPS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorForkThresholdBps = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'forkThresholdBPS',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"getActions"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorGetActions = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'getActions',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"getDynamicQuorumParamsAt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorGetDynamicQuorumParamsAt = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'getDynamicQuorumParamsAt',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"getReceipt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorGetReceipt = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'getReceipt',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"lastMinuteWindowInBlocks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorLastMinuteWindowInBlocks = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'lastMinuteWindowInBlocks',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"latestProposalIds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorLatestProposalIds = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'latestProposalIds',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"maxQuorumVotes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorMaxQuorumVotes = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'maxQuorumVotes',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"minQuorumVotes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorMinQuorumVotes = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'minQuorumVotes',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"nouns"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorNouns = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'nouns',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"numTokensInForkEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorNumTokensInForkEscrow = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'numTokensInForkEscrow',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"objectionPeriodDurationInBlocks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorObjectionPeriodDurationInBlocks = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'objectionPeriodDurationInBlocks',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"pendingVetoer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorPendingVetoer = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'pendingVetoer',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorProposalCount = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposalCount',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalDataForRewards"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorProposalDataForRewards = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposalDataForRewards',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalMaxOperations"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorProposalMaxOperations = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposalMaxOperations',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalThreshold"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorProposalThreshold = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposalThreshold',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalThresholdBPS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorProposalThresholdBps = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposalThresholdBPS',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalUpdatablePeriodInBlocks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorProposalUpdatablePeriodInBlocks = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposalUpdatablePeriodInBlocks',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorProposals = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposals',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalsV3"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorProposalsV3 = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposalsV3',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"quorumParamsCheckpoints"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorQuorumParamsCheckpoints = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'quorumParamsCheckpoints',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"quorumVotes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorQuorumVotes = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'quorumVotes',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"quorumVotesBPS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorQuorumVotesBps = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'quorumVotesBPS',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"state"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorState = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'state',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"timelock"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorTimelock = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'timelock',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"timelockV1"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorTimelockV1 = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'timelockV1',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"vetoer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorVetoer = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'vetoer',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"voteSnapshotBlockSwitchProposalId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorVoteSnapshotBlockSwitchProposalId = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'voteSnapshotBlockSwitchProposalId',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"votingDelay"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorVotingDelay = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'votingDelay',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"votingPeriod"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const readNounsGovernorVotingPeriod = /*#__PURE__*/ createReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'votingPeriod',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernor = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"cancel"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorCancel = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'cancel',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"cancelSig"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorCancelSig = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'cancelSig',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castRefundableVote"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorCastRefundableVote = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castRefundableVote',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castRefundableVoteWithReason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorCastRefundableVoteWithReason = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castRefundableVoteWithReason',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castVote"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorCastVote = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castVote',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castVoteBySig"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorCastVoteBySig = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castVoteBySig',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castVoteWithReason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorCastVoteWithReason = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castVoteWithReason',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"escrowToFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorEscrowToFork = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'escrowToFork',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"execute"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorExecute = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'execute',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"executeFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorExecuteFork = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'executeFork',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorInitialize = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"joinFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorJoinFork = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'joinFork',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"propose"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorPropose = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'propose',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposeBySigs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorProposeBySigs = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposeBySigs',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposeOnTimelockV1"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorProposeOnTimelockV1 = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposeOnTimelockV1',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"queue"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorQueue = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'queue',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposal"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorUpdateProposal = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'updateProposal',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposalBySigs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorUpdateProposalBySigs = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'updateProposalBySigs',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposalDescription"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorUpdateProposalDescription = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'updateProposalDescription',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposalTransactions"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorUpdateProposalTransactions = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'updateProposalTransactions',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"veto"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorVeto = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'veto',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"withdrawDAONounsFromEscrowIncreasingTotalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorWithdrawDaoNounsFromEscrowIncreasingTotalSupply =
  /*#__PURE__*/ createWriteContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'withdrawDAONounsFromEscrowIncreasingTotalSupply',
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"withdrawDAONounsFromEscrowToTreasury"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorWithdrawDaoNounsFromEscrowToTreasury =
  /*#__PURE__*/ createWriteContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'withdrawDAONounsFromEscrowToTreasury',
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"withdrawFromForkEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const writeNounsGovernorWithdrawFromForkEscrow = /*#__PURE__*/ createWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'withdrawFromForkEscrow',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernor = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"cancel"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorCancel = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'cancel',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"cancelSig"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorCancelSig = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'cancelSig',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castRefundableVote"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorCastRefundableVote = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castRefundableVote',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castRefundableVoteWithReason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorCastRefundableVoteWithReason =
  /*#__PURE__*/ createSimulateContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'castRefundableVoteWithReason',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castVote"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorCastVote = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castVote',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castVoteBySig"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorCastVoteBySig = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castVoteBySig',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castVoteWithReason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorCastVoteWithReason = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castVoteWithReason',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"escrowToFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorEscrowToFork = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'escrowToFork',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"execute"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorExecute = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'execute',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"executeFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorExecuteFork = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'executeFork',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorInitialize = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"joinFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorJoinFork = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'joinFork',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"propose"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorPropose = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'propose',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposeBySigs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorProposeBySigs = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposeBySigs',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposeOnTimelockV1"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorProposeOnTimelockV1 = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposeOnTimelockV1',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"queue"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorQueue = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'queue',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposal"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorUpdateProposal = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'updateProposal',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposalBySigs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorUpdateProposalBySigs = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'updateProposalBySigs',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposalDescription"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorUpdateProposalDescription = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'updateProposalDescription',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposalTransactions"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorUpdateProposalTransactions = /*#__PURE__*/ createSimulateContract(
  {
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'updateProposalTransactions',
  },
);

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"veto"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorVeto = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'veto',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"withdrawDAONounsFromEscrowIncreasingTotalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorWithdrawDaoNounsFromEscrowIncreasingTotalSupply =
  /*#__PURE__*/ createSimulateContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'withdrawDAONounsFromEscrowIncreasingTotalSupply',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"withdrawDAONounsFromEscrowToTreasury"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorWithdrawDaoNounsFromEscrowToTreasury =
  /*#__PURE__*/ createSimulateContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'withdrawDAONounsFromEscrowToTreasury',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"withdrawFromForkEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const simulateNounsGovernorWithdrawFromForkEscrow = /*#__PURE__*/ createSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'withdrawFromForkEscrow',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"DAONounsSupplyIncreasedFromEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorDaoNounsSupplyIncreasedFromEscrowEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'DAONounsSupplyIncreasedFromEscrow',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"DAOWithdrawNounsFromEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorDaoWithdrawNounsFromEscrowEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'DAOWithdrawNounsFromEscrow',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ERC20TokensToIncludeInForkSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorErc20TokensToIncludeInForkSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ERC20TokensToIncludeInForkSet',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"EscrowedToFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorEscrowedToForkEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'EscrowedToFork',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ExecuteFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorExecuteForkEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ExecuteFork',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ForkDAODeployerSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorForkDaoDeployerSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ForkDAODeployerSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ForkPeriodSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorForkPeriodSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ForkPeriodSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ForkThresholdSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorForkThresholdSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ForkThresholdSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"JoinFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorJoinForkEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'JoinFork',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"LastMinuteWindowSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorLastMinuteWindowSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'LastMinuteWindowSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"MaxQuorumVotesBPSSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorMaxQuorumVotesBpsSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'MaxQuorumVotesBPSSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"MinQuorumVotesBPSSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorMinQuorumVotesBpsSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'MinQuorumVotesBPSSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"NewAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorNewAdminEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'NewAdmin',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"NewPendingAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorNewPendingAdminEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'NewPendingAdmin',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"NewPendingVetoer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorNewPendingVetoerEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'NewPendingVetoer',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"NewVetoer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorNewVetoerEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'NewVetoer',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ObjectionPeriodDurationSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorObjectionPeriodDurationSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ObjectionPeriodDurationSet',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalCanceled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorProposalCanceledEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ProposalCanceled',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalCreated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorProposalCreatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ProposalCreated',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalCreatedOnTimelockV1"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorProposalCreatedOnTimelockV1Event =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalCreatedOnTimelockV1',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalCreatedWithRequirements"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorProposalCreatedWithRequirementsEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalCreatedWithRequirements',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalDescriptionUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorProposalDescriptionUpdatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalDescriptionUpdated',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalExecuted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorProposalExecutedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ProposalExecuted',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalObjectionPeriodSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorProposalObjectionPeriodSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalObjectionPeriodSet',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalQueued"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorProposalQueuedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ProposalQueued',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalThresholdBPSSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorProposalThresholdBpsSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalThresholdBPSSet',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalTransactionsUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorProposalTransactionsUpdatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalTransactionsUpdated',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalUpdatablePeriodSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorProposalUpdatablePeriodSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalUpdatablePeriodSet',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorProposalUpdatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ProposalUpdated',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalVetoed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorProposalVetoedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ProposalVetoed',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"QuorumCoefficientSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorQuorumCoefficientSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'QuorumCoefficientSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"QuorumVotesBPSSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorQuorumVotesBpsSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'QuorumVotesBPSSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"RefundableVote"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorRefundableVoteEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'RefundableVote',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"SignatureCancelled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorSignatureCancelledEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'SignatureCancelled',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"TimelocksAndAdminSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorTimelocksAndAdminSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'TimelocksAndAdminSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"VoteCast"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorVoteCastEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'VoteCast',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"VoteCastWithClientId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorVoteCastWithClientIdEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'VoteCastWithClientId',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"VotingDelaySet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorVotingDelaySetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'VotingDelaySet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"VotingPeriodSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorVotingPeriodSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'VotingPeriodSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"Withdraw"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorWithdrawEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'Withdraw',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"WithdrawFromForkEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const watchNounsGovernorWithdrawFromForkEscrowEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: nounsGovernorAbi, address: nounsGovernorAddress, eventName: 'WithdrawFromForkEscrow' },
);

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

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const readNounsTreasury = /*#__PURE__*/ createReadContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"GRACE_PERIOD"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const readNounsTreasuryGracePeriod = /*#__PURE__*/ createReadContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'GRACE_PERIOD',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"MAXIMUM_DELAY"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const readNounsTreasuryMaximumDelay = /*#__PURE__*/ createReadContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'MAXIMUM_DELAY',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"MINIMUM_DELAY"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const readNounsTreasuryMinimumDelay = /*#__PURE__*/ createReadContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'MINIMUM_DELAY',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"NAME"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const readNounsTreasuryName = /*#__PURE__*/ createReadContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'NAME',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"admin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const readNounsTreasuryAdmin = /*#__PURE__*/ createReadContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'admin',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"delay"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const readNounsTreasuryDelay = /*#__PURE__*/ createReadContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'delay',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"pendingAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const readNounsTreasuryPendingAdmin = /*#__PURE__*/ createReadContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'pendingAdmin',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"queuedTransactions"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const readNounsTreasuryQueuedTransactions = /*#__PURE__*/ createReadContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'queuedTransactions',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const writeNounsTreasury = /*#__PURE__*/ createWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"acceptAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const writeNounsTreasuryAcceptAdmin = /*#__PURE__*/ createWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'acceptAdmin',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"cancelTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const writeNounsTreasuryCancelTransaction = /*#__PURE__*/ createWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'cancelTransaction',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"executeTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const writeNounsTreasuryExecuteTransaction = /*#__PURE__*/ createWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'executeTransaction',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const writeNounsTreasuryInitialize = /*#__PURE__*/ createWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"queueTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const writeNounsTreasuryQueueTransaction = /*#__PURE__*/ createWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'queueTransaction',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"sendERC20"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const writeNounsTreasurySendErc20 = /*#__PURE__*/ createWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'sendERC20',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"sendETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const writeNounsTreasurySendEth = /*#__PURE__*/ createWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'sendETH',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"setDelay"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const writeNounsTreasurySetDelay = /*#__PURE__*/ createWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'setDelay',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"setPendingAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const writeNounsTreasurySetPendingAdmin = /*#__PURE__*/ createWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'setPendingAdmin',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const writeNounsTreasuryUpgradeTo = /*#__PURE__*/ createWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'upgradeTo',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const writeNounsTreasuryUpgradeToAndCall = /*#__PURE__*/ createWriteContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'upgradeToAndCall',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const simulateNounsTreasury = /*#__PURE__*/ createSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"acceptAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const simulateNounsTreasuryAcceptAdmin = /*#__PURE__*/ createSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'acceptAdmin',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"cancelTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const simulateNounsTreasuryCancelTransaction = /*#__PURE__*/ createSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'cancelTransaction',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"executeTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const simulateNounsTreasuryExecuteTransaction = /*#__PURE__*/ createSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'executeTransaction',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const simulateNounsTreasuryInitialize = /*#__PURE__*/ createSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"queueTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const simulateNounsTreasuryQueueTransaction = /*#__PURE__*/ createSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'queueTransaction',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"sendERC20"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const simulateNounsTreasurySendErc20 = /*#__PURE__*/ createSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'sendERC20',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"sendETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const simulateNounsTreasurySendEth = /*#__PURE__*/ createSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'sendETH',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"setDelay"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const simulateNounsTreasurySetDelay = /*#__PURE__*/ createSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'setDelay',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"setPendingAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const simulateNounsTreasurySetPendingAdmin = /*#__PURE__*/ createSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'setPendingAdmin',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const simulateNounsTreasuryUpgradeTo = /*#__PURE__*/ createSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'upgradeTo',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const simulateNounsTreasuryUpgradeToAndCall = /*#__PURE__*/ createSimulateContract({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  functionName: 'upgradeToAndCall',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const watchNounsTreasuryEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const watchNounsTreasuryAdminChangedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  eventName: 'AdminChanged',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"BeaconUpgraded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const watchNounsTreasuryBeaconUpgradedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  eventName: 'BeaconUpgraded',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"CancelTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const watchNounsTreasuryCancelTransactionEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  eventName: 'CancelTransaction',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"ERC20Sent"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const watchNounsTreasuryErc20SentEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  eventName: 'ERC20Sent',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"ETHSent"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const watchNounsTreasuryEthSentEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  eventName: 'ETHSent',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"ExecuteTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const watchNounsTreasuryExecuteTransactionEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  eventName: 'ExecuteTransaction',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"NewAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const watchNounsTreasuryNewAdminEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  eventName: 'NewAdmin',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"NewDelay"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const watchNounsTreasuryNewDelayEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  eventName: 'NewDelay',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"NewPendingAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const watchNounsTreasuryNewPendingAdminEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  eventName: 'NewPendingAdmin',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"QueueTransaction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const watchNounsTreasuryQueueTransactionEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  eventName: 'QueueTransaction',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTreasuryAbi}__ and `eventName` set to `"Upgraded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32fc9f9d8b2cf86c068cae13108809547ef71)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28)
 */
export const watchNounsTreasuryUpgradedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTreasuryAbi,
  address: nounsTreasuryAddress,
  eventName: 'Upgraded',
});
