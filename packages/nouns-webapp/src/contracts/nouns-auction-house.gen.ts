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
