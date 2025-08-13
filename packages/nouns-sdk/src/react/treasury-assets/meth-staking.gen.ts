import { createUseReadContract } from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// mETHStaking
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const mEthStakingAbi = [
  {
    type: 'function',
    inputs: [{ name: 'mETHAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'mETHToETH',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const mEthStakingAddress = {
  1: '0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f',
  11155111: '0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const mEthStakingConfig = { address: mEthStakingAddress, abi: mEthStakingAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStaking = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mEthStakingAbi}__ and `functionName` set to `"mETHToETH"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D)
 */
export const useReadMEthStakingMEthToEth = /*#__PURE__*/ createUseReadContract({
  abi: mEthStakingAbi,
  address: mEthStakingAddress,
  functionName: 'mETHToETH',
})
