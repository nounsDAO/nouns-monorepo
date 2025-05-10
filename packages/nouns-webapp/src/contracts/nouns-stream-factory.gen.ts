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
// NounsStreamFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const nounsStreamFactoryAbi = [
  {
    type: 'constructor',
    inputs: [{ name: '_streamImplementation', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'DurationMustBePositive' },
  { type: 'error', inputs: [], name: 'PayerIsAddressZero' },
  { type: 'error', inputs: [], name: 'RecipientIsAddressZero' },
  { type: 'error', inputs: [], name: 'StopTimeNotInTheFuture' },
  { type: 'error', inputs: [], name: 'TokenAmountIsZero' },
  { type: 'error', inputs: [], name: 'UnexpectedStreamAddress' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address', indexed: true },
      { name: 'payer', internalType: 'address', type: 'address', indexed: true },
      { name: 'recipient', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenAmount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'tokenAddress', internalType: 'address', type: 'address', indexed: false },
      { name: 'startTime', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'stopTime', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'streamAddress', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'StreamCreated',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tokenAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'startTime', internalType: 'uint256', type: 'uint256' },
      { name: 'stopTime', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createAndFundStream',
    outputs: [{ name: 'stream', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'payer', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tokenAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'startTime', internalType: 'uint256', type: 'uint256' },
      { name: 'stopTime', internalType: 'uint256', type: 'uint256' },
      { name: 'nonce', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'createStream',
    outputs: [{ name: 'stream', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tokenAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'startTime', internalType: 'uint256', type: 'uint256' },
      { name: 'stopTime', internalType: 'uint256', type: 'uint256' },
      { name: 'nonce', internalType: 'uint8', type: 'uint8' },
      { name: 'predictedStreamAddress', internalType: 'address', type: 'address' },
    ],
    name: 'createStream',
    outputs: [{ name: 'stream', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tokenAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'startTime', internalType: 'uint256', type: 'uint256' },
      { name: 'stopTime', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createStream',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'payer', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tokenAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'startTime', internalType: 'uint256', type: 'uint256' },
      { name: 'stopTime', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createStream',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address' },
      { name: 'payer', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tokenAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'startTime', internalType: 'uint256', type: 'uint256' },
      { name: 'stopTime', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'predictStreamAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address' },
      { name: 'payer', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tokenAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'startTime', internalType: 'uint256', type: 'uint256' },
      { name: 'stopTime', internalType: 'uint256', type: 'uint256' },
      { name: 'nonce', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'predictStreamAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'streamImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const nounsStreamFactoryAddress = {
  1: '0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff',
  11155111: '0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const nounsStreamFactoryConfig = {
  address: nounsStreamFactoryAddress,
  abi: nounsStreamFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsStreamFactoryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const useReadNounsStreamFactory = /*#__PURE__*/ createUseReadContract({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsStreamFactoryAbi}__ and `functionName` set to `"predictStreamAddress"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const useReadNounsStreamFactoryPredictStreamAddress = /*#__PURE__*/ createUseReadContract({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
  functionName: 'predictStreamAddress',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsStreamFactoryAbi}__ and `functionName` set to `"streamImplementation"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const useReadNounsStreamFactoryStreamImplementation = /*#__PURE__*/ createUseReadContract({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
  functionName: 'streamImplementation',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsStreamFactoryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const useWriteNounsStreamFactory = /*#__PURE__*/ createUseWriteContract({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsStreamFactoryAbi}__ and `functionName` set to `"createAndFundStream"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const useWriteNounsStreamFactoryCreateAndFundStream = /*#__PURE__*/ createUseWriteContract({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
  functionName: 'createAndFundStream',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsStreamFactoryAbi}__ and `functionName` set to `"createStream"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const useWriteNounsStreamFactoryCreateStream = /*#__PURE__*/ createUseWriteContract({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
  functionName: 'createStream',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsStreamFactoryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const useSimulateNounsStreamFactory = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsStreamFactoryAbi}__ and `functionName` set to `"createAndFundStream"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const useSimulateNounsStreamFactoryCreateAndFundStream =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsStreamFactoryAbi,
    address: nounsStreamFactoryAddress,
    functionName: 'createAndFundStream',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsStreamFactoryAbi}__ and `functionName` set to `"createStream"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const useSimulateNounsStreamFactoryCreateStream = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
  functionName: 'createStream',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsStreamFactoryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const useWatchNounsStreamFactoryEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsStreamFactoryAbi}__ and `eventName` set to `"StreamCreated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const useWatchNounsStreamFactoryStreamCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsStreamFactoryAbi,
    address: nounsStreamFactoryAddress,
    eventName: 'StreamCreated',
  })

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsStreamFactoryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const readNounsStreamFactory = /*#__PURE__*/ createReadContract({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsStreamFactoryAbi}__ and `functionName` set to `"predictStreamAddress"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const readNounsStreamFactoryPredictStreamAddress = /*#__PURE__*/ createReadContract({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
  functionName: 'predictStreamAddress',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsStreamFactoryAbi}__ and `functionName` set to `"streamImplementation"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const readNounsStreamFactoryStreamImplementation = /*#__PURE__*/ createReadContract({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
  functionName: 'streamImplementation',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsStreamFactoryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const writeNounsStreamFactory = /*#__PURE__*/ createWriteContract({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsStreamFactoryAbi}__ and `functionName` set to `"createAndFundStream"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const writeNounsStreamFactoryCreateAndFundStream = /*#__PURE__*/ createWriteContract({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
  functionName: 'createAndFundStream',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsStreamFactoryAbi}__ and `functionName` set to `"createStream"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const writeNounsStreamFactoryCreateStream = /*#__PURE__*/ createWriteContract({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
  functionName: 'createStream',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsStreamFactoryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const simulateNounsStreamFactory = /*#__PURE__*/ createSimulateContract({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsStreamFactoryAbi}__ and `functionName` set to `"createAndFundStream"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const simulateNounsStreamFactoryCreateAndFundStream = /*#__PURE__*/ createSimulateContract({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
  functionName: 'createAndFundStream',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsStreamFactoryAbi}__ and `functionName` set to `"createStream"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const simulateNounsStreamFactoryCreateStream = /*#__PURE__*/ createSimulateContract({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
  functionName: 'createStream',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsStreamFactoryAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const watchNounsStreamFactoryEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsStreamFactoryAbi}__ and `eventName` set to `"StreamCreated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5)
 */
export const watchNounsStreamFactoryStreamCreatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsStreamFactoryAbi,
  address: nounsStreamFactoryAddress,
  eventName: 'StreamCreated',
})
