import {
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NounsUSDCTokenBuyer
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const nounsUsdcTokenBuyerAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_priceFeed', internalType: 'contract IPriceFeed', type: 'address' },
      { name: '_baselinePaymentTokenAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_minAdminBaselinePaymentTokenAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_maxAdminBaselinePaymentTokenAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_botDiscountBPs', internalType: 'uint16', type: 'uint16' },
      { name: '_minAdminBotDiscountBPs', internalType: 'uint16', type: 'uint16' },
      { name: '_maxAdminBotDiscountBPs', internalType: 'uint16', type: 'uint16' },
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: '_admin', internalType: 'address', type: 'address' },
      { name: '_payer', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    name: 'FailedSendingETH',
  },
  {
    type: 'error',
    inputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    name: 'FailedWithdrawingETH',
  },
  { type: 'error', inputs: [], name: 'InvalidBaselinePaymentTokenAmount' },
  { type: 'error', inputs: [], name: 'InvalidBotDiscountBPs' },
  { type: 'error', inputs: [], name: 'OnlyAdminOrOwner' },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
      { name: 'actual', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ReceivedInsufficientTokens',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldAmount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newAmount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'BaselinePaymentTokenAmountSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldBPs', internalType: 'uint16', type: 'uint16', indexed: false },
      { name: 'newBPs', internalType: 'uint16', type: 'uint16', indexed: false },
    ],
    name: 'BotDiscountBPsSet',
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
      { name: 'oldAmount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newAmount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'MaxAdminBaselinePaymentTokenAmountSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldBPs', internalType: 'uint16', type: 'uint16', indexed: false },
      { name: 'newBPs', internalType: 'uint16', type: 'uint16', indexed: false },
    ],
    name: 'MaxAdminBotDiscountBPsSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldAmount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newAmount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'MinAdminBaselinePaymentTokenAmountSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldBPs', internalType: 'uint16', type: 'uint16', indexed: false },
      { name: 'newBPs', internalType: 'uint16', type: 'uint16', indexed: false },
    ],
    name: 'MinAdminBotDiscountBPsSet',
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
      { name: 'oldPayer', internalType: 'address', type: 'address', indexed: false },
      { name: 'newPayer', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'PayerSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldFeed', internalType: 'address', type: 'address', indexed: false },
      { name: 'newFeed', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'PriceFeedSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'ethOut', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'tokenIn', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'SoldETH',
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
    name: 'MAX_BPS',
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
    inputs: [],
    name: 'baselinePaymentTokenAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'botDiscountBPs',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'buyETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'buyETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'ethAmountPerTokenAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'additionalTokens', internalType: 'uint256', type: 'uint256' },
      { name: 'bufferBPs', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ethNeeded',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxAdminBaselinePaymentTokenAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxAdminBotDiscountBPs',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minAdminBaselinePaymentTokenAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minAdminBotDiscountBPs',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
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
    name: 'payer',
    outputs: [{ name: '', internalType: 'contract IPayer', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paymentToken',
    outputs: [{ name: '', internalType: 'contract IERC20Metadata', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paymentTokenDecimalsDigits',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'price',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'priceFeed',
    outputs: [{ name: '', internalType: 'contract IPriceFeed', type: 'address' }],
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
    inputs: [{ name: 'newAdmin', internalType: 'address', type: 'address' }],
    name: 'setAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newBaselinePaymentTokenAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'setBaselinePaymentTokenAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newBotDiscountBPs', internalType: 'uint16', type: 'uint16' }],
    name: 'setBotDiscountBPs',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newMaxAdminBaselinePaymentTokenAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setMaxAdminBaselinePaymentTokenAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newMaxAdminBotDiscountBPs', internalType: 'uint16', type: 'uint16' }],
    name: 'setMaxAdminBotDiscountBPs',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newMinAdminBaselinePaymentTokenAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setMinAdminBaselinePaymentTokenAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newMinAdminBotDiscountBPs', internalType: 'uint16', type: 'uint16' }],
    name: 'setMinAdminBotDiscountBPs',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newPayer', internalType: 'address', type: 'address' }],
    name: 'setPayer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newPriceFeed', internalType: 'contract IPriceFeed', type: 'address' }],
    name: 'setPriceFeed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tokenAmountNeeded',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tokenAmountNeededAndETHPayout',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'ethAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenAmountPerEthAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
  { type: 'function', inputs: [], name: 'withdrawETH', outputs: [], stateMutability: 'nonpayable' },
  { type: 'receive', stateMutability: 'payable' },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const nounsUsdcTokenBuyerAddress = {
  1: '0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5',
  11155111: '0x821176470cFeF1dB78F1e2dbae136f73c36ddd48',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const nounsUsdcTokenBuyerConfig = {
  address: nounsUsdcTokenBuyerAddress,
  abi: nounsUsdcTokenBuyerAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyer = /*#__PURE__*/ createReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"MAX_BPS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerMaxBps = /*#__PURE__*/ createReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'MAX_BPS',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"admin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerAdmin = /*#__PURE__*/ createReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'admin',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"baselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerBaselinePaymentTokenAmount = /*#__PURE__*/ createReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'baselinePaymentTokenAmount',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"botDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerBotDiscountBPs = /*#__PURE__*/ createReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'botDiscountBPs',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"ethAmountPerTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerEthAmountPerTokenAmount = /*#__PURE__*/ createReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'ethAmountPerTokenAmount',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"ethNeeded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerEthNeeded = /*#__PURE__*/ createReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'ethNeeded',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"maxAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerMaxAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createReadContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'maxAdminBaselinePaymentTokenAmount',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"maxAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerMaxAdminBotDiscountBPs = /*#__PURE__*/ createReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'maxAdminBotDiscountBPs',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"minAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerMinAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createReadContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'minAdminBaselinePaymentTokenAmount',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"minAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerMinAdminBotDiscountBPs = /*#__PURE__*/ createReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'minAdminBotDiscountBPs',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerOwner = /*#__PURE__*/ createReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerPaused = /*#__PURE__*/ createReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'paused',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"payer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerPayer = /*#__PURE__*/ createReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'payer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"paymentToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerPaymentToken = /*#__PURE__*/ createReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'paymentToken',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"paymentTokenDecimalsDigits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerPaymentTokenDecimalsDigits = /*#__PURE__*/ createReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'paymentTokenDecimalsDigits',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"price"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerPrice = /*#__PURE__*/ createReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'price',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"priceFeed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerPriceFeed = /*#__PURE__*/ createReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'priceFeed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"tokenAmountNeeded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerTokenAmountNeeded = /*#__PURE__*/ createReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'tokenAmountNeeded',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"tokenAmountNeededAndETHPayout"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerTokenAmountNeededAndEthPayout =
  /*#__PURE__*/ createReadContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'tokenAmountNeededAndETHPayout',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"tokenAmountPerEthAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsUsdcTokenBuyerTokenAmountPerEthAmount = /*#__PURE__*/ createReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'tokenAmountPerEthAmount',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsUsdcTokenBuyer = /*#__PURE__*/ createWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"buyETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsUsdcTokenBuyerBuyEth = /*#__PURE__*/ createWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'buyETH',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsUsdcTokenBuyerPause = /*#__PURE__*/ createWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'pause',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsUsdcTokenBuyerRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsUsdcTokenBuyerSetAdmin = /*#__PURE__*/ createWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'setAdmin',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsUsdcTokenBuyerSetBaselinePaymentTokenAmount =
  /*#__PURE__*/ createWriteContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'setBaselinePaymentTokenAmount',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsUsdcTokenBuyerSetBotDiscountBPs = /*#__PURE__*/ createWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'setBotDiscountBPs',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setMaxAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsUsdcTokenBuyerSetMaxAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createWriteContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'setMaxAdminBaselinePaymentTokenAmount',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setMaxAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsUsdcTokenBuyerSetMaxAdminBotDiscountBPs = /*#__PURE__*/ createWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'setMaxAdminBotDiscountBPs',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setMinAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsUsdcTokenBuyerSetMinAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createWriteContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'setMinAdminBaselinePaymentTokenAmount',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setMinAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsUsdcTokenBuyerSetMinAdminBotDiscountBPs = /*#__PURE__*/ createWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'setMinAdminBotDiscountBPs',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setPayer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsUsdcTokenBuyerSetPayer = /*#__PURE__*/ createWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'setPayer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setPriceFeed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsUsdcTokenBuyerSetPriceFeed = /*#__PURE__*/ createWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'setPriceFeed',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsUsdcTokenBuyerTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsUsdcTokenBuyerUnpause = /*#__PURE__*/ createWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'unpause',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"withdrawETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsUsdcTokenBuyerWithdrawEth = /*#__PURE__*/ createWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'withdrawETH',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsUsdcTokenBuyer = /*#__PURE__*/ createSimulateContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"buyETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsUsdcTokenBuyerBuyEth = /*#__PURE__*/ createSimulateContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'buyETH',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsUsdcTokenBuyerPause = /*#__PURE__*/ createSimulateContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'pause',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsUsdcTokenBuyerRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsUsdcTokenBuyerSetAdmin = /*#__PURE__*/ createSimulateContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'setAdmin',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsUsdcTokenBuyerSetBaselinePaymentTokenAmount =
  /*#__PURE__*/ createSimulateContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'setBaselinePaymentTokenAmount',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsUsdcTokenBuyerSetBotDiscountBPs = /*#__PURE__*/ createSimulateContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'setBotDiscountBPs',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setMaxAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsUsdcTokenBuyerSetMaxAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createSimulateContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'setMaxAdminBaselinePaymentTokenAmount',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setMaxAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsUsdcTokenBuyerSetMaxAdminBotDiscountBPs =
  /*#__PURE__*/ createSimulateContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'setMaxAdminBotDiscountBPs',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setMinAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsUsdcTokenBuyerSetMinAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createSimulateContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'setMinAdminBaselinePaymentTokenAmount',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setMinAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsUsdcTokenBuyerSetMinAdminBotDiscountBPs =
  /*#__PURE__*/ createSimulateContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'setMinAdminBotDiscountBPs',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setPayer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsUsdcTokenBuyerSetPayer = /*#__PURE__*/ createSimulateContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'setPayer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setPriceFeed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsUsdcTokenBuyerSetPriceFeed = /*#__PURE__*/ createSimulateContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'setPriceFeed',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsUsdcTokenBuyerTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsUsdcTokenBuyerUnpause = /*#__PURE__*/ createSimulateContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'unpause',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"withdrawETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsUsdcTokenBuyerWithdrawEth = /*#__PURE__*/ createSimulateContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'withdrawETH',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsUsdcTokenBuyerEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"AdminSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsUsdcTokenBuyerAdminSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  eventName: 'AdminSet',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"BaselinePaymentTokenAmountSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsUsdcTokenBuyerBaselinePaymentTokenAmountSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    eventName: 'BaselinePaymentTokenAmountSet',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"BotDiscountBPsSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsUsdcTokenBuyerBotDiscountBPsSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    eventName: 'BotDiscountBPsSet',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"ETHWithdrawn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsUsdcTokenBuyerEthWithdrawnEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  eventName: 'ETHWithdrawn',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"MaxAdminBaselinePaymentTokenAmountSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsUsdcTokenBuyerMaxAdminBaselinePaymentTokenAmountSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    eventName: 'MaxAdminBaselinePaymentTokenAmountSet',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"MaxAdminBotDiscountBPsSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsUsdcTokenBuyerMaxAdminBotDiscountBPsSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    eventName: 'MaxAdminBotDiscountBPsSet',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"MinAdminBaselinePaymentTokenAmountSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsUsdcTokenBuyerMinAdminBaselinePaymentTokenAmountSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    eventName: 'MinAdminBaselinePaymentTokenAmountSet',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"MinAdminBotDiscountBPsSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsUsdcTokenBuyerMinAdminBotDiscountBPsSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    eventName: 'MinAdminBotDiscountBPsSet',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsUsdcTokenBuyerOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"Paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsUsdcTokenBuyerPausedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  eventName: 'Paused',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"PayerSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsUsdcTokenBuyerPayerSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  eventName: 'PayerSet',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"PriceFeedSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsUsdcTokenBuyerPriceFeedSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  eventName: 'PriceFeedSet',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"SoldETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsUsdcTokenBuyerSoldEthEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  eventName: 'SoldETH',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"Unpaused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsUsdcTokenBuyerUnpausedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  eventName: 'Unpaused',
})
