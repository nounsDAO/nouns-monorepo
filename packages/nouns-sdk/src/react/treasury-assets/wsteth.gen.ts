import { createUseReadContract } from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// wstETH
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xB82381A3fBD3FaFA77B3a7bE693342618240067b)
 */
export const wstEthAbi = [
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xB82381A3fBD3FaFA77B3a7bE693342618240067b)
 */
export const wstEthAddress = {
  1: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
  11155111: '0xB82381A3fBD3FaFA77B3a7bE693342618240067b',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xB82381A3fBD3FaFA77B3a7bE693342618240067b)
 */
export const wstEthConfig = { address: wstEthAddress, abi: wstEthAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link wstEthAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xB82381A3fBD3FaFA77B3a7bE693342618240067b)
 */
export const useReadWstEth = /*#__PURE__*/ createUseReadContract({
  abi: wstEthAbi,
  address: wstEthAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link wstEthAbi}__ and `functionName` set to `"balanceOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xB82381A3fBD3FaFA77B3a7bE693342618240067b)
 */
export const useReadWstEthBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: wstEthAbi,
  address: wstEthAddress,
  functionName: 'balanceOf',
})
