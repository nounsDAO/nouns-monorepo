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
// NounsTokenBuyer
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const nounsTokenBuyerAbi = [
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
] as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const nounsTokenBuyerAddress = {
  1: '0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5',
  11155111: '0x821176470cFeF1dB78F1e2dbae136f73c36ddd48',
} as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const nounsTokenBuyerConfig = {
  address: nounsTokenBuyerAddress,
  abi: nounsTokenBuyerAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyer = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"MAX_BPS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerMaxBps = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'MAX_BPS',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"admin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerAdmin = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'admin',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"baselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerBaselinePaymentTokenAmount = /*#__PURE__*/ createUseReadContract(
  {
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'baselinePaymentTokenAmount',
  },
);

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"botDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerBotDiscountBPs = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'botDiscountBPs',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"ethAmountPerTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerEthAmountPerTokenAmount = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'ethAmountPerTokenAmount',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"ethNeeded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerEthNeeded = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'ethNeeded',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"maxAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerMaxAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'maxAdminBaselinePaymentTokenAmount',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"maxAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerMaxAdminBotDiscountBPs = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'maxAdminBotDiscountBPs',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"minAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerMinAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'minAdminBaselinePaymentTokenAmount',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"minAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerMinAdminBotDiscountBPs = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'minAdminBotDiscountBPs',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerOwner = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'owner',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerPaused = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'paused',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"payer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerPayer = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'payer',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"paymentToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerPaymentToken = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'paymentToken',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"paymentTokenDecimalsDigits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerPaymentTokenDecimalsDigits = /*#__PURE__*/ createUseReadContract(
  {
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'paymentTokenDecimalsDigits',
  },
);

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"price"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerPrice = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'price',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"priceFeed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerPriceFeed = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'priceFeed',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"tokenAmountNeeded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerTokenAmountNeeded = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'tokenAmountNeeded',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"tokenAmountNeededAndETHPayout"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerTokenAmountNeededAndEthPayout =
  /*#__PURE__*/ createUseReadContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'tokenAmountNeededAndETHPayout',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"tokenAmountPerEthAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useReadNounsTokenBuyerTokenAmountPerEthAmount = /*#__PURE__*/ createUseReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'tokenAmountPerEthAmount',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsTokenBuyer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"buyETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsTokenBuyerBuyEth = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'buyETH',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsTokenBuyerPause = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'pause',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsTokenBuyerRenounceOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsTokenBuyerSetAdmin = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'setAdmin',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsTokenBuyerSetBaselinePaymentTokenAmount =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'setBaselinePaymentTokenAmount',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsTokenBuyerSetBotDiscountBPs = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'setBotDiscountBPs',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setMaxAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsTokenBuyerSetMaxAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'setMaxAdminBaselinePaymentTokenAmount',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setMaxAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsTokenBuyerSetMaxAdminBotDiscountBPs =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'setMaxAdminBotDiscountBPs',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setMinAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsTokenBuyerSetMinAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'setMinAdminBaselinePaymentTokenAmount',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setMinAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsTokenBuyerSetMinAdminBotDiscountBPs =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'setMinAdminBotDiscountBPs',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setPayer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsTokenBuyerSetPayer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'setPayer',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setPriceFeed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsTokenBuyerSetPriceFeed = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'setPriceFeed',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsTokenBuyerTransferOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsTokenBuyerUnpause = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'unpause',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"withdrawETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWriteNounsTokenBuyerWithdrawEth = /*#__PURE__*/ createUseWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'withdrawETH',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsTokenBuyer = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"buyETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsTokenBuyerBuyEth = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'buyETH',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsTokenBuyerPause = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'pause',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsTokenBuyerRenounceOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsTokenBuyerSetAdmin = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'setAdmin',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsTokenBuyerSetBaselinePaymentTokenAmount =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'setBaselinePaymentTokenAmount',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsTokenBuyerSetBotDiscountBPs = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'setBotDiscountBPs',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setMaxAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsTokenBuyerSetMaxAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'setMaxAdminBaselinePaymentTokenAmount',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setMaxAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsTokenBuyerSetMaxAdminBotDiscountBPs =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'setMaxAdminBotDiscountBPs',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setMinAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsTokenBuyerSetMinAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'setMinAdminBaselinePaymentTokenAmount',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setMinAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsTokenBuyerSetMinAdminBotDiscountBPs =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'setMinAdminBotDiscountBPs',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setPayer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsTokenBuyerSetPayer = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'setPayer',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setPriceFeed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsTokenBuyerSetPriceFeed = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'setPriceFeed',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsTokenBuyerTransferOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsTokenBuyerUnpause = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'unpause',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"withdrawETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useSimulateNounsTokenBuyerWithdrawEth = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'withdrawETH',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsTokenBuyerEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"AdminSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsTokenBuyerAdminSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  eventName: 'AdminSet',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"BaselinePaymentTokenAmountSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsTokenBuyerBaselinePaymentTokenAmountSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    eventName: 'BaselinePaymentTokenAmountSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"BotDiscountBPsSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsTokenBuyerBotDiscountBPsSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    eventName: 'BotDiscountBPsSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"ETHWithdrawn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsTokenBuyerEthWithdrawnEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  eventName: 'ETHWithdrawn',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"MaxAdminBaselinePaymentTokenAmountSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsTokenBuyerMaxAdminBaselinePaymentTokenAmountSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    eventName: 'MaxAdminBaselinePaymentTokenAmountSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"MaxAdminBotDiscountBPsSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsTokenBuyerMaxAdminBotDiscountBPsSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    eventName: 'MaxAdminBotDiscountBPsSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"MinAdminBaselinePaymentTokenAmountSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsTokenBuyerMinAdminBaselinePaymentTokenAmountSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    eventName: 'MinAdminBaselinePaymentTokenAmountSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"MinAdminBotDiscountBPsSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsTokenBuyerMinAdminBotDiscountBPsSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    eventName: 'MinAdminBotDiscountBPsSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsTokenBuyerOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    eventName: 'OwnershipTransferred',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"Paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsTokenBuyerPausedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  eventName: 'Paused',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"PayerSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsTokenBuyerPayerSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  eventName: 'PayerSet',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"PriceFeedSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsTokenBuyerPriceFeedSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  eventName: 'PriceFeedSet',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"SoldETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsTokenBuyerSoldEthEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  eventName: 'SoldETH',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"Unpaused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const useWatchNounsTokenBuyerUnpausedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  eventName: 'Unpaused',
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyer = /*#__PURE__*/ createReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"MAX_BPS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerMaxBps = /*#__PURE__*/ createReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'MAX_BPS',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"admin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerAdmin = /*#__PURE__*/ createReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'admin',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"baselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerBaselinePaymentTokenAmount = /*#__PURE__*/ createReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'baselinePaymentTokenAmount',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"botDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerBotDiscountBPs = /*#__PURE__*/ createReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'botDiscountBPs',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"ethAmountPerTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerEthAmountPerTokenAmount = /*#__PURE__*/ createReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'ethAmountPerTokenAmount',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"ethNeeded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerEthNeeded = /*#__PURE__*/ createReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'ethNeeded',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"maxAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerMaxAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createReadContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'maxAdminBaselinePaymentTokenAmount',
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"maxAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerMaxAdminBotDiscountBPs = /*#__PURE__*/ createReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'maxAdminBotDiscountBPs',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"minAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerMinAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createReadContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'minAdminBaselinePaymentTokenAmount',
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"minAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerMinAdminBotDiscountBPs = /*#__PURE__*/ createReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'minAdminBotDiscountBPs',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerOwner = /*#__PURE__*/ createReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'owner',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerPaused = /*#__PURE__*/ createReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'paused',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"payer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerPayer = /*#__PURE__*/ createReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'payer',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"paymentToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerPaymentToken = /*#__PURE__*/ createReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'paymentToken',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"paymentTokenDecimalsDigits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerPaymentTokenDecimalsDigits = /*#__PURE__*/ createReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'paymentTokenDecimalsDigits',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"price"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerPrice = /*#__PURE__*/ createReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'price',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"priceFeed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerPriceFeed = /*#__PURE__*/ createReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'priceFeed',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"tokenAmountNeeded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerTokenAmountNeeded = /*#__PURE__*/ createReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'tokenAmountNeeded',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"tokenAmountNeededAndETHPayout"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerTokenAmountNeededAndEthPayout = /*#__PURE__*/ createReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'tokenAmountNeededAndETHPayout',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"tokenAmountPerEthAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const readNounsTokenBuyerTokenAmountPerEthAmount = /*#__PURE__*/ createReadContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'tokenAmountPerEthAmount',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsTokenBuyer = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"buyETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsTokenBuyerBuyEth = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'buyETH',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsTokenBuyerPause = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'pause',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsTokenBuyerRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsTokenBuyerSetAdmin = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'setAdmin',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsTokenBuyerSetBaselinePaymentTokenAmount = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'setBaselinePaymentTokenAmount',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsTokenBuyerSetBotDiscountBPs = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'setBotDiscountBPs',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setMaxAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsTokenBuyerSetMaxAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createWriteContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'setMaxAdminBaselinePaymentTokenAmount',
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setMaxAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsTokenBuyerSetMaxAdminBotDiscountBPs = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'setMaxAdminBotDiscountBPs',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setMinAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsTokenBuyerSetMinAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createWriteContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'setMinAdminBaselinePaymentTokenAmount',
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setMinAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsTokenBuyerSetMinAdminBotDiscountBPs = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'setMinAdminBotDiscountBPs',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setPayer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsTokenBuyerSetPayer = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'setPayer',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setPriceFeed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsTokenBuyerSetPriceFeed = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'setPriceFeed',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsTokenBuyerTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsTokenBuyerUnpause = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'unpause',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"withdrawETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const writeNounsTokenBuyerWithdrawEth = /*#__PURE__*/ createWriteContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'withdrawETH',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsTokenBuyer = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"buyETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsTokenBuyerBuyEth = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'buyETH',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsTokenBuyerPause = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'pause',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsTokenBuyerRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsTokenBuyerSetAdmin = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'setAdmin',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsTokenBuyerSetBaselinePaymentTokenAmount =
  /*#__PURE__*/ createSimulateContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'setBaselinePaymentTokenAmount',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsTokenBuyerSetBotDiscountBPs = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'setBotDiscountBPs',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setMaxAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsTokenBuyerSetMaxAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createSimulateContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'setMaxAdminBaselinePaymentTokenAmount',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setMaxAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsTokenBuyerSetMaxAdminBotDiscountBPs =
  /*#__PURE__*/ createSimulateContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'setMaxAdminBotDiscountBPs',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setMinAdminBaselinePaymentTokenAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsTokenBuyerSetMinAdminBaselinePaymentTokenAmount =
  /*#__PURE__*/ createSimulateContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'setMinAdminBaselinePaymentTokenAmount',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setMinAdminBotDiscountBPs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsTokenBuyerSetMinAdminBotDiscountBPs =
  /*#__PURE__*/ createSimulateContract({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    functionName: 'setMinAdminBotDiscountBPs',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setPayer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsTokenBuyerSetPayer = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'setPayer',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"setPriceFeed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsTokenBuyerSetPriceFeed = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'setPriceFeed',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsTokenBuyerTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsTokenBuyerUnpause = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'unpause',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `functionName` set to `"withdrawETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const simulateNounsTokenBuyerWithdrawEth = /*#__PURE__*/ createSimulateContract({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  functionName: 'withdrawETH',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsTokenBuyerEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"AdminSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsTokenBuyerAdminSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  eventName: 'AdminSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"BaselinePaymentTokenAmountSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsTokenBuyerBaselinePaymentTokenAmountSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    eventName: 'BaselinePaymentTokenAmountSet',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"BotDiscountBPsSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsTokenBuyerBotDiscountBPsSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  eventName: 'BotDiscountBPsSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"ETHWithdrawn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsTokenBuyerEthWithdrawnEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  eventName: 'ETHWithdrawn',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"MaxAdminBaselinePaymentTokenAmountSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsTokenBuyerMaxAdminBaselinePaymentTokenAmountSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    eventName: 'MaxAdminBaselinePaymentTokenAmountSet',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"MaxAdminBotDiscountBPsSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsTokenBuyerMaxAdminBotDiscountBPsSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    eventName: 'MaxAdminBotDiscountBPsSet',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"MinAdminBaselinePaymentTokenAmountSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsTokenBuyerMinAdminBaselinePaymentTokenAmountSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    eventName: 'MinAdminBaselinePaymentTokenAmountSet',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"MinAdminBotDiscountBPsSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsTokenBuyerMinAdminBotDiscountBPsSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: nounsTokenBuyerAbi,
    address: nounsTokenBuyerAddress,
    eventName: 'MinAdminBotDiscountBPsSet',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsTokenBuyerOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: nounsTokenBuyerAbi, address: nounsTokenBuyerAddress, eventName: 'OwnershipTransferred' },
);

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"Paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsTokenBuyerPausedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  eventName: 'Paused',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"PayerSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsTokenBuyerPayerSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  eventName: 'PayerSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"PriceFeedSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsTokenBuyerPriceFeedSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  eventName: 'PriceFeedSet',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"SoldETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsTokenBuyerSoldEthEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  eventName: 'SoldETH',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenBuyerAbi}__ and `eventName` set to `"Unpaused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x821176470cFeF1dB78F1e2dbae136f73c36ddd48)
 */
export const watchNounsTokenBuyerUnpausedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsTokenBuyerAbi,
  address: nounsTokenBuyerAddress,
  eventName: 'Unpaused',
});
