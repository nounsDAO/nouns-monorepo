import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
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
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyer = /*#__PURE__*/ createUseReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"MAX_BPS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerMaxBps = /*#__PURE__*/ createUseReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'MAX_BPS',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"admin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerAdmin = /*#__PURE__*/ createUseReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'admin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"baselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerBaselinePaymentTokenAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'baselinePaymentTokenAmount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"botDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerBotDiscountBPs = /*#__PURE__*/ createUseReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'botDiscountBPs',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"ethAmountPerTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerEthAmountPerTokenAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'ethAmountPerTokenAmount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"ethNeeded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerEthNeeded = /*#__PURE__*/ createUseReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'ethNeeded',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"maxAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerMaxAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'maxAdminBaselinePaymentTokenAmount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"maxAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerMaxAdminBotDiscountBPs = /*#__PURE__*/ createUseReadContract(
  {
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'maxAdminBotDiscountBPs',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"minAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerMinAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'minAdminBaselinePaymentTokenAmount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"minAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerMinAdminBotDiscountBPs = /*#__PURE__*/ createUseReadContract(
  {
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'minAdminBotDiscountBPs',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerOwner = /*#__PURE__*/ createUseReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerPaused = /*#__PURE__*/ createUseReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'paused',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"payer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerPayer = /*#__PURE__*/ createUseReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'payer',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"paymentToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerPaymentToken = /*#__PURE__*/ createUseReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'paymentToken',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"paymentTokenDecimalsDigits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerPaymentTokenDecimalsDigits =
  /*#__PURE__*/ createUseReadContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'paymentTokenDecimalsDigits',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"price"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerPrice = /*#__PURE__*/ createUseReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'price',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"priceFeed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerPriceFeed = /*#__PURE__*/ createUseReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'priceFeed',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"tokenAmountNeeded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerTokenAmountNeeded = /*#__PURE__*/ createUseReadContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'tokenAmountNeeded',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"tokenAmountNeededAndETHPayout"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerTokenAmountNeededAndEthPayout =
  /*#__PURE__*/ createUseReadContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'tokenAmountNeededAndETHPayout',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"tokenAmountPerEthAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsUsdcTokenBuyerTokenAmountPerEthAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'tokenAmountPerEthAmount',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsUsdcTokenBuyer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"buyETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsUsdcTokenBuyerBuyEth = /*#__PURE__*/ createUseWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'buyETH',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsUsdcTokenBuyerPause = /*#__PURE__*/ createUseWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'pause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsUsdcTokenBuyerRenounceOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsUsdcTokenBuyerSetAdmin = /*#__PURE__*/ createUseWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'setAdmin',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsUsdcTokenBuyerSetBaselinePaymentTokenAmount =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'setBaselinePaymentTokenAmount',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsUsdcTokenBuyerSetBotDiscountBPs = /*#__PURE__*/ createUseWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'setBotDiscountBPs',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setMaxAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsUsdcTokenBuyerSetMaxAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'setMaxAdminBaselinePaymentTokenAmount',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setMaxAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsUsdcTokenBuyerSetMaxAdminBotDiscountBPs =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'setMaxAdminBotDiscountBPs',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setMinAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsUsdcTokenBuyerSetMinAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'setMinAdminBaselinePaymentTokenAmount',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setMinAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsUsdcTokenBuyerSetMinAdminBotDiscountBPs =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'setMinAdminBotDiscountBPs',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setPayer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsUsdcTokenBuyerSetPayer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'setPayer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setPriceFeed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsUsdcTokenBuyerSetPriceFeed = /*#__PURE__*/ createUseWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'setPriceFeed',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsUsdcTokenBuyerTransferOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsUsdcTokenBuyerUnpause = /*#__PURE__*/ createUseWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'unpause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"withdrawETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsUsdcTokenBuyerWithdrawEth = /*#__PURE__*/ createUseWriteContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'withdrawETH',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsUsdcTokenBuyer = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"buyETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsUsdcTokenBuyerBuyEth = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'buyETH',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsUsdcTokenBuyerPause = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'pause',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsUsdcTokenBuyerRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsUsdcTokenBuyerSetAdmin = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'setAdmin',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsUsdcTokenBuyerSetBaselinePaymentTokenAmount =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'setBaselinePaymentTokenAmount',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsUsdcTokenBuyerSetBotDiscountBPs =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'setBotDiscountBPs',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setMaxAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsUsdcTokenBuyerSetMaxAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'setMaxAdminBaselinePaymentTokenAmount',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setMaxAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsUsdcTokenBuyerSetMaxAdminBotDiscountBPs =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'setMaxAdminBotDiscountBPs',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setMinAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsUsdcTokenBuyerSetMinAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'setMinAdminBaselinePaymentTokenAmount',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setMinAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsUsdcTokenBuyerSetMinAdminBotDiscountBPs =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'setMinAdminBotDiscountBPs',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setPayer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsUsdcTokenBuyerSetPayer = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'setPayer',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"setPriceFeed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsUsdcTokenBuyerSetPriceFeed = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'setPriceFeed',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsUsdcTokenBuyerTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsUsdcTokenBuyerUnpause = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'unpause',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `functionName` set to `"withdrawETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsUsdcTokenBuyerWithdrawEth = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  functionName: 'withdrawETH',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsUsdcTokenBuyerEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"AdminSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsUsdcTokenBuyerAdminSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  eventName: 'AdminSet',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"BaselinePaymentTokenAmountSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsUsdcTokenBuyerBaselinePaymentTokenAmountSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    eventName: 'BaselinePaymentTokenAmountSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"BotDiscountBPsSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsUsdcTokenBuyerBotDiscountBPsSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    eventName: 'BotDiscountBPsSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"ETHWithdrawn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsUsdcTokenBuyerEthWithdrawnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    eventName: 'ETHWithdrawn',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"MaxAdminBaselinePaymentTokenAmountSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsUsdcTokenBuyerMaxAdminBaselinePaymentTokenAmountSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    eventName: 'MaxAdminBaselinePaymentTokenAmountSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"MaxAdminBotDiscountBPsSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsUsdcTokenBuyerMaxAdminBotDiscountBPsSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    eventName: 'MaxAdminBotDiscountBPsSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"MinAdminBaselinePaymentTokenAmountSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsUsdcTokenBuyerMinAdminBaselinePaymentTokenAmountSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    eventName: 'MinAdminBaselinePaymentTokenAmountSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"MinAdminBotDiscountBPsSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsUsdcTokenBuyerMinAdminBotDiscountBPsSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    eventName: 'MinAdminBotDiscountBPsSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsUsdcTokenBuyerOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"Paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsUsdcTokenBuyerPausedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  eventName: 'Paused',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"PayerSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsUsdcTokenBuyerPayerSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  eventName: 'PayerSet',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"PriceFeedSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsUsdcTokenBuyerPriceFeedSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsUsdcTokenBuyerAbi,
    address: nounsUsdcTokenBuyerAddress,
    eventName: 'PriceFeedSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"SoldETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsUsdcTokenBuyerSoldEthEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  eventName: 'SoldETH',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsUsdcTokenBuyerAbi}__ and `eventName` set to `"Unpaused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsUsdcTokenBuyerUnpausedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsUsdcTokenBuyerAbi,
  address: nounsUsdcTokenBuyerAddress,
  eventName: 'Unpaused',
})
