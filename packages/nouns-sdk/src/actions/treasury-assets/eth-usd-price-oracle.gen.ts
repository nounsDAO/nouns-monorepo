import { createReadContract } from '@wagmi/core/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ETHToUSDPriceOracle
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const ethToUsdPriceOracleAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'latestAnswer',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const ethToUsdPriceOracleAddress = {
  1: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  11155111: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)
 */
export const ethToUsdPriceOracleConfig = {
  address: ethToUsdPriceOracleAddress,
  abi: ethToUsdPriceOracleAbi,
} as const

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
})

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
})
