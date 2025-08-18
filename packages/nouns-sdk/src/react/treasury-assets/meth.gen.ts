import { createUseReadContract } from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// mETH
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const mEthAbi = [
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const mEthAddress = {
  1: '0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa',
  11155111: '0x072d71b257ECa6B60b5333626F6a55ea1B0c451c',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const mEthConfig = { address: mEthAddress, abi: mEthAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEth = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthAbi}__ and `functionName` set to `"balanceOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x072d71b257ECa6B60b5333626F6a55ea1B0c451c)
 */
export const useReadMEthBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: mEthAbi,
  address: mEthAddress,
  functionName: 'balanceOf',
})
