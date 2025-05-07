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
// ETHToUSDPriceOracle
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const ethToUsdPriceOracleAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_aggregator', internalType: 'address', type: 'address' },
      { name: '_accessController', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'current', internalType: 'int256', type: 'int256', indexed: true },
      { name: 'roundId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'updatedAt', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'AnswerUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'roundId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'startedBy', internalType: 'address', type: 'address', indexed: true },
      { name: 'startedAt', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'NewRound',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'accessController',
    outputs: [{ name: '', internalType: 'contract AccessControllerInterface', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'aggregator',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_aggregator', internalType: 'address', type: 'address' }],
    name: 'confirmAggregator',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [],
    name: 'description',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_roundId', internalType: 'uint256', type: 'uint256' }],
    name: 'getAnswer',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_roundId', internalType: 'uint80', type: 'uint80' }],
    name: 'getRoundData',
    outputs: [
      { name: 'roundId', internalType: 'uint80', type: 'uint80' },
      { name: 'answer', internalType: 'int256', type: 'int256' },
      { name: 'startedAt', internalType: 'uint256', type: 'uint256' },
      { name: 'updatedAt', internalType: 'uint256', type: 'uint256' },
      { name: 'answeredInRound', internalType: 'uint80', type: 'uint80' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_roundId', internalType: 'uint256', type: 'uint256' }],
    name: 'getTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'latestAnswer',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'latestRound',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'latestRoundData',
    outputs: [
      { name: 'roundId', internalType: 'uint80', type: 'uint80' },
      { name: 'answer', internalType: 'int256', type: 'int256' },
      { name: 'startedAt', internalType: 'uint256', type: 'uint256' },
      { name: 'updatedAt', internalType: 'uint256', type: 'uint256' },
      { name: 'answeredInRound', internalType: 'uint80', type: 'uint80' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'latestTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    name: 'phaseAggregators',
    outputs: [{ name: '', internalType: 'contract AggregatorV2V3Interface', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'phaseId',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_aggregator', internalType: 'address', type: 'address' }],
    name: 'proposeAggregator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposedAggregator',
    outputs: [{ name: '', internalType: 'contract AggregatorV2V3Interface', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_roundId', internalType: 'uint80', type: 'uint80' }],
    name: 'proposedGetRoundData',
    outputs: [
      { name: 'roundId', internalType: 'uint80', type: 'uint80' },
      { name: 'answer', internalType: 'int256', type: 'int256' },
      { name: 'startedAt', internalType: 'uint256', type: 'uint256' },
      { name: 'updatedAt', internalType: 'uint256', type: 'uint256' },
      { name: 'answeredInRound', internalType: 'uint80', type: 'uint80' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposedLatestRoundData',
    outputs: [
      { name: 'roundId', internalType: 'uint80', type: 'uint80' },
      { name: 'answer', internalType: 'int256', type: 'int256' },
      { name: 'startedAt', internalType: 'uint256', type: 'uint256' },
      { name: 'updatedAt', internalType: 'uint256', type: 'uint256' },
      { name: 'answeredInRound', internalType: 'uint80', type: 'uint80' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_accessController', internalType: 'address', type: 'address' }],
    name: 'setController',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_to', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const ethToUsdPriceOracleAddress = {
  1: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  11155111: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
} as const;

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const ethToUsdPriceOracleConfig = {
  address: ethToUsdPriceOracleAddress,
  abi: ethToUsdPriceOracleAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useReadEthToUsdPriceOracle = /*#__PURE__*/ createUseReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"accessController"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useReadEthToUsdPriceOracleAccessController = /*#__PURE__*/ createUseReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'accessController',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"aggregator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useReadEthToUsdPriceOracleAggregator = /*#__PURE__*/ createUseReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'aggregator',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"decimals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useReadEthToUsdPriceOracleDecimals = /*#__PURE__*/ createUseReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'decimals',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"description"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useReadEthToUsdPriceOracleDescription = /*#__PURE__*/ createUseReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'description',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"getAnswer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useReadEthToUsdPriceOracleGetAnswer = /*#__PURE__*/ createUseReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'getAnswer',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"getRoundData"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useReadEthToUsdPriceOracleGetRoundData = /*#__PURE__*/ createUseReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'getRoundData',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"getTimestamp"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useReadEthToUsdPriceOracleGetTimestamp = /*#__PURE__*/ createUseReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'getTimestamp',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"latestAnswer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useReadEthToUsdPriceOracleLatestAnswer = /*#__PURE__*/ createUseReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'latestAnswer',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"latestRound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useReadEthToUsdPriceOracleLatestRound = /*#__PURE__*/ createUseReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'latestRound',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"latestRoundData"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useReadEthToUsdPriceOracleLatestRoundData = /*#__PURE__*/ createUseReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'latestRoundData',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"latestTimestamp"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useReadEthToUsdPriceOracleLatestTimestamp = /*#__PURE__*/ createUseReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'latestTimestamp',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useReadEthToUsdPriceOracleOwner = /*#__PURE__*/ createUseReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'owner',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"phaseAggregators"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useReadEthToUsdPriceOraclePhaseAggregators = /*#__PURE__*/ createUseReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'phaseAggregators',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"phaseId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useReadEthToUsdPriceOraclePhaseId = /*#__PURE__*/ createUseReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'phaseId',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"proposedAggregator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useReadEthToUsdPriceOracleProposedAggregator = /*#__PURE__*/ createUseReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'proposedAggregator',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"proposedGetRoundData"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useReadEthToUsdPriceOracleProposedGetRoundData = /*#__PURE__*/ createUseReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'proposedGetRoundData',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"proposedLatestRoundData"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useReadEthToUsdPriceOracleProposedLatestRoundData =
  /*#__PURE__*/ createUseReadContract({
    abi: ethToUsdPriceOracleAbi,
    address: ethToUsdPriceOracleAddress,
    functionName: 'proposedLatestRoundData',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"version"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useReadEthToUsdPriceOracleVersion = /*#__PURE__*/ createUseReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'version',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useWriteEthToUsdPriceOracle = /*#__PURE__*/ createUseWriteContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useWriteEthToUsdPriceOracleAcceptOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'acceptOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"confirmAggregator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useWriteEthToUsdPriceOracleConfirmAggregator = /*#__PURE__*/ createUseWriteContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'confirmAggregator',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"proposeAggregator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useWriteEthToUsdPriceOracleProposeAggregator = /*#__PURE__*/ createUseWriteContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'proposeAggregator',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"setController"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useWriteEthToUsdPriceOracleSetController = /*#__PURE__*/ createUseWriteContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'setController',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useWriteEthToUsdPriceOracleTransferOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useSimulateEthToUsdPriceOracle = /*#__PURE__*/ createUseSimulateContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useSimulateEthToUsdPriceOracleAcceptOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethToUsdPriceOracleAbi,
    address: ethToUsdPriceOracleAddress,
    functionName: 'acceptOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"confirmAggregator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useSimulateEthToUsdPriceOracleConfirmAggregator =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethToUsdPriceOracleAbi,
    address: ethToUsdPriceOracleAddress,
    functionName: 'confirmAggregator',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"proposeAggregator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useSimulateEthToUsdPriceOracleProposeAggregator =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethToUsdPriceOracleAbi,
    address: ethToUsdPriceOracleAddress,
    functionName: 'proposeAggregator',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"setController"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useSimulateEthToUsdPriceOracleSetController = /*#__PURE__*/ createUseSimulateContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'setController',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useSimulateEthToUsdPriceOracleTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethToUsdPriceOracleAbi,
    address: ethToUsdPriceOracleAddress,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useWatchEthToUsdPriceOracleEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `eventName` set to `"AnswerUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useWatchEthToUsdPriceOracleAnswerUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethToUsdPriceOracleAbi,
    address: ethToUsdPriceOracleAddress,
    eventName: 'AnswerUpdated',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `eventName` set to `"NewRound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useWatchEthToUsdPriceOracleNewRoundEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  eventName: 'NewRound',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `eventName` set to `"OwnershipTransferRequested"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useWatchEthToUsdPriceOracleOwnershipTransferRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethToUsdPriceOracleAbi,
    address: ethToUsdPriceOracleAddress,
    eventName: 'OwnershipTransferRequested',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const useWatchEthToUsdPriceOracleOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethToUsdPriceOracleAbi,
    address: ethToUsdPriceOracleAddress,
    eventName: 'OwnershipTransferred',
  });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const readEthToUsdPriceOracle = /*#__PURE__*/ createReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"accessController"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const readEthToUsdPriceOracleAccessController = /*#__PURE__*/ createReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'accessController',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"aggregator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const readEthToUsdPriceOracleAggregator = /*#__PURE__*/ createReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'aggregator',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"decimals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const readEthToUsdPriceOracleDecimals = /*#__PURE__*/ createReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'decimals',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"description"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const readEthToUsdPriceOracleDescription = /*#__PURE__*/ createReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'description',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"getAnswer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const readEthToUsdPriceOracleGetAnswer = /*#__PURE__*/ createReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'getAnswer',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"getRoundData"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const readEthToUsdPriceOracleGetRoundData = /*#__PURE__*/ createReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'getRoundData',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"getTimestamp"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const readEthToUsdPriceOracleGetTimestamp = /*#__PURE__*/ createReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'getTimestamp',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"latestAnswer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const readEthToUsdPriceOracleLatestAnswer = /*#__PURE__*/ createReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'latestAnswer',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"latestRound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const readEthToUsdPriceOracleLatestRound = /*#__PURE__*/ createReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'latestRound',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"latestRoundData"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const readEthToUsdPriceOracleLatestRoundData = /*#__PURE__*/ createReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'latestRoundData',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"latestTimestamp"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const readEthToUsdPriceOracleLatestTimestamp = /*#__PURE__*/ createReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'latestTimestamp',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const readEthToUsdPriceOracleOwner = /*#__PURE__*/ createReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'owner',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"phaseAggregators"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const readEthToUsdPriceOraclePhaseAggregators = /*#__PURE__*/ createReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'phaseAggregators',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"phaseId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const readEthToUsdPriceOraclePhaseId = /*#__PURE__*/ createReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'phaseId',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"proposedAggregator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const readEthToUsdPriceOracleProposedAggregator = /*#__PURE__*/ createReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'proposedAggregator',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"proposedGetRoundData"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const readEthToUsdPriceOracleProposedGetRoundData = /*#__PURE__*/ createReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'proposedGetRoundData',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"proposedLatestRoundData"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const readEthToUsdPriceOracleProposedLatestRoundData = /*#__PURE__*/ createReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'proposedLatestRoundData',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"version"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const readEthToUsdPriceOracleVersion = /*#__PURE__*/ createReadContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'version',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const writeEthToUsdPriceOracle = /*#__PURE__*/ createWriteContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const writeEthToUsdPriceOracleAcceptOwnership = /*#__PURE__*/ createWriteContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'acceptOwnership',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"confirmAggregator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const writeEthToUsdPriceOracleConfirmAggregator = /*#__PURE__*/ createWriteContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'confirmAggregator',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"proposeAggregator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const writeEthToUsdPriceOracleProposeAggregator = /*#__PURE__*/ createWriteContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'proposeAggregator',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"setController"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const writeEthToUsdPriceOracleSetController = /*#__PURE__*/ createWriteContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'setController',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const writeEthToUsdPriceOracleTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const simulateEthToUsdPriceOracle = /*#__PURE__*/ createSimulateContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const simulateEthToUsdPriceOracleAcceptOwnership = /*#__PURE__*/ createSimulateContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'acceptOwnership',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"confirmAggregator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const simulateEthToUsdPriceOracleConfirmAggregator = /*#__PURE__*/ createSimulateContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'confirmAggregator',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"proposeAggregator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const simulateEthToUsdPriceOracleProposeAggregator = /*#__PURE__*/ createSimulateContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'proposeAggregator',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"setController"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const simulateEthToUsdPriceOracleSetController = /*#__PURE__*/ createSimulateContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'setController',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const simulateEthToUsdPriceOracleTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const watchEthToUsdPriceOracleEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `eventName` set to `"AnswerUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const watchEthToUsdPriceOracleAnswerUpdatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  eventName: 'AnswerUpdated',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `eventName` set to `"NewRound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const watchEthToUsdPriceOracleNewRoundEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ethToUsdPriceOracleAbi,
  address: ethToUsdPriceOracleAddress,
  eventName: 'NewRound',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `eventName` set to `"OwnershipTransferRequested"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const watchEthToUsdPriceOracleOwnershipTransferRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ethToUsdPriceOracleAbi,
    address: ethToUsdPriceOracleAddress,
    eventName: 'OwnershipTransferRequested',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethToUsdPriceOracleAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const watchEthToUsdPriceOracleOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ethToUsdPriceOracleAbi,
    address: ethToUsdPriceOracleAddress,
    eventName: 'OwnershipTransferred',
  });
