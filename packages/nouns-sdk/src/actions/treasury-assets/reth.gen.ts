import { createReadContract } from '@wagmi/core/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// rETH
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae78736cd615f374d3085123a210448e74fc6393)
 */
export const rEthAbi = [
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getExchangeRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae78736cd615f374d3085123a210448e74fc6393)
 */
export const rEthAddress = {
  1: '0xae78736Cd615f374D3085123A210448E74Fc6393',
} as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae78736cd615f374d3085123a210448e74fc6393)
 */
export const rEthConfig = { address: rEthAddress, abi: rEthAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link rEthAbi}__
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae78736cd615f374d3085123a210448e74fc6393)
 */
export const readREth = /*#__PURE__*/ createReadContract({ abi: rEthAbi, address: rEthAddress })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link rEthAbi}__ and `functionName` set to `"balanceOf"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae78736cd615f374d3085123a210448e74fc6393)
 */
export const readREthBalanceOf = /*#__PURE__*/ createReadContract({
  abi: rEthAbi,
  address: rEthAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link rEthAbi}__ and `functionName` set to `"getExchangeRate"`
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xae78736cd615f374d3085123a210448e74fc6393)
 */
export const readREthGetExchangeRate = /*#__PURE__*/ createReadContract({
  abi: rEthAbi,
  address: rEthAddress,
  functionName: 'getExchangeRate',
})
