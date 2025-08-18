import { createReadContract } from '@wagmi/core/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// stETH
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const stEthAbi = [
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const stEthAddress = {
  1: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  11155111: '0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const stEthConfig = { address: stEthAddress, abi: stEthAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link stEthAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af)
 */
export const readStEth = /*#__PURE__*/ createReadContract({ abi: stEthAbi, address: stEthAddress })

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
})
