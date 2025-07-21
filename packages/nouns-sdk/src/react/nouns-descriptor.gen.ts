import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NounsDescriptor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const nounsDescriptorAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_art', internalType: 'contract INounsArt', type: 'address' },
      { name: '_renderer', internalType: 'contract ISVGRenderer', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'BadPaletteLength' },
  { type: 'error', inputs: [], name: 'EmptyPalette' },
  { type: 'error', inputs: [], name: 'IndexNotFound' },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'art', internalType: 'contract INounsArt', type: 'address', indexed: false }],
    name: 'ArtUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'baseURI', internalType: 'string', type: 'string', indexed: false }],
    name: 'BaseURIUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'enabled', internalType: 'bool', type: 'bool', indexed: false }],
    name: 'DataURIToggled',
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
  { type: 'event', anonymous: false, inputs: [], name: 'PartsLocked' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'renderer', internalType: 'contract ISVGRenderer', type: 'address', indexed: false },
    ],
    name: 'RendererUpdated',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'accessories',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'accessoryCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addAccessories',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addAccessoriesFromPointer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_background', internalType: 'string', type: 'string' }],
    name: 'addBackground',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addBodies',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addBodiesFromPointer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addGlasses',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addGlassesFromPointer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addHeads',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addHeadsFromPointer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_backgrounds', internalType: 'string[]', type: 'string[]' }],
    name: 'addManyBackgrounds',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'arePartsLocked',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'art',
    outputs: [{ name: '', internalType: 'contract INounsArt', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'backgroundCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'backgrounds',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'baseURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'bodies',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'bodyCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'seed',
        internalType: 'struct INounsSeeder.Seed',
        type: 'tuple',
        components: [
          { name: 'background', internalType: 'uint48', type: 'uint48' },
          { name: 'body', internalType: 'uint48', type: 'uint48' },
          { name: 'accessory', internalType: 'uint48', type: 'uint48' },
          { name: 'head', internalType: 'uint48', type: 'uint48' },
          { name: 'glasses', internalType: 'uint48', type: 'uint48' },
        ],
      },
    ],
    name: 'dataURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'seed',
        internalType: 'struct INounsSeeder.Seed',
        type: 'tuple',
        components: [
          { name: 'background', internalType: 'uint48', type: 'uint48' },
          { name: 'body', internalType: 'uint48', type: 'uint48' },
          { name: 'accessory', internalType: 'uint48', type: 'uint48' },
          { name: 'head', internalType: 'uint48', type: 'uint48' },
          { name: 'glasses', internalType: 'uint48', type: 'uint48' },
        ],
      },
    ],
    name: 'generateSVGImage',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'description', internalType: 'string', type: 'string' },
      {
        name: 'seed',
        internalType: 'struct INounsSeeder.Seed',
        type: 'tuple',
        components: [
          { name: 'background', internalType: 'uint48', type: 'uint48' },
          { name: 'body', internalType: 'uint48', type: 'uint48' },
          { name: 'accessory', internalType: 'uint48', type: 'uint48' },
          { name: 'head', internalType: 'uint48', type: 'uint48' },
          { name: 'glasses', internalType: 'uint48', type: 'uint48' },
        ],
      },
    ],
    name: 'genericDataURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'seed',
        internalType: 'struct INounsSeeder.Seed',
        type: 'tuple',
        components: [
          { name: 'background', internalType: 'uint48', type: 'uint48' },
          { name: 'body', internalType: 'uint48', type: 'uint48' },
          { name: 'accessory', internalType: 'uint48', type: 'uint48' },
          { name: 'head', internalType: 'uint48', type: 'uint48' },
          { name: 'glasses', internalType: 'uint48', type: 'uint48' },
        ],
      },
    ],
    name: 'getPartsForSeed',
    outputs: [
      {
        name: '',
        internalType: 'struct ISVGRenderer.Part[]',
        type: 'tuple[]',
        components: [
          { name: 'image', internalType: 'bytes', type: 'bytes' },
          { name: 'palette', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'glasses',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'glassesCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'headCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'heads',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isDataURIEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  { type: 'function', inputs: [], name: 'lockParts', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint8', type: 'uint8' }],
    name: 'palettes',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renderer',
    outputs: [{ name: '', internalType: 'contract ISVGRenderer', type: 'address' }],
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
    inputs: [{ name: '_art', internalType: 'contract INounsArt', type: 'address' }],
    name: 'setArt',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'descriptor', internalType: 'address', type: 'address' }],
    name: 'setArtDescriptor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'inflator', internalType: 'contract IInflator', type: 'address' }],
    name: 'setArtInflator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_baseURI', internalType: 'string', type: 'string' }],
    name: 'setBaseURI',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'paletteIndex', internalType: 'uint8', type: 'uint8' },
      { name: 'palette', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'setPalette',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'paletteIndex', internalType: 'uint8', type: 'uint8' },
      { name: 'pointer', internalType: 'address', type: 'address' },
    ],
    name: 'setPalettePointer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_renderer', internalType: 'contract ISVGRenderer', type: 'address' }],
    name: 'setRenderer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'toggleDataURIEnabled',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'seed',
        internalType: 'struct INounsSeeder.Seed',
        type: 'tuple',
        components: [
          { name: 'background', internalType: 'uint48', type: 'uint48' },
          { name: 'body', internalType: 'uint48', type: 'uint48' },
          { name: 'accessory', internalType: 'uint48', type: 'uint48' },
          { name: 'head', internalType: 'uint48', type: 'uint48' },
          { name: 'glasses', internalType: 'uint48', type: 'uint48' },
        ],
      },
    ],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'updateAccessories',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'updateAccessoriesFromPointer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'updateBodies',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'updateBodiesFromPointer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'updateGlasses',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'updateGlassesFromPointer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'updateHeads',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'updateHeadsFromPointer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const nounsDescriptorAddress = {
  1: '0x33A9c445fb4FB21f2c030A6b2d3e2F12D017BFAC',
  11155111: '0x79E04ebCDf1ac2661697B23844149b43acc002d5',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const nounsDescriptorConfig = {
  address: nounsDescriptorAddress,
  abi: nounsDescriptorAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptor = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"accessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorAccessories = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'accessories',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"accessoryCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorAccessoryCount = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'accessoryCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"arePartsLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorArePartsLocked = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'arePartsLocked',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"art"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorArt = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'art',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"backgroundCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorBackgroundCount = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'backgroundCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"backgrounds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorBackgrounds = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'backgrounds',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"baseURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorBaseUri = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'baseURI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"bodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorBodies = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'bodies',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"bodyCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorBodyCount = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'bodyCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"dataURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorDataUri = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'dataURI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"generateSVGImage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorGenerateSvgImage = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'generateSVGImage',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"genericDataURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorGenericDataUri = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'genericDataURI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"getPartsForSeed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorGetPartsForSeed = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'getPartsForSeed',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"glasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorGlasses = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'glasses',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"glassesCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorGlassesCount = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'glassesCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"headCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorHeadCount = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'headCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"heads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorHeads = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'heads',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"isDataURIEnabled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorIsDataUriEnabled = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'isDataURIEnabled',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorOwner = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"palettes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorPalettes = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'palettes',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"renderer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorRenderer = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'renderer',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"tokenURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useReadNounsDescriptorTokenUri = /*#__PURE__*/ createUseReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptor = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addAccessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddAccessories = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addAccessories',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addAccessoriesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddAccessoriesFromPointer =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'addAccessoriesFromPointer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBackground"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddBackground = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBackground',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddBodies = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBodies',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBodiesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddBodiesFromPointer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBodiesFromPointer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addGlasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddGlasses = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addGlasses',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addGlassesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddGlassesFromPointer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addGlassesFromPointer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addHeads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddHeads = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addHeads',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addHeadsFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddHeadsFromPointer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addHeadsFromPointer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addManyBackgrounds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorAddManyBackgrounds = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addManyBackgrounds',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"lockParts"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorLockParts = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'lockParts',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorRenounceOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorSetArt = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArt',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArtDescriptor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorSetArtDescriptor = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArtDescriptor',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArtInflator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorSetArtInflator = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArtInflator',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setBaseURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorSetBaseUri = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setBaseURI',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setPalette"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorSetPalette = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setPalette',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setPalettePointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorSetPalettePointer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setPalettePointer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setRenderer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorSetRenderer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setRenderer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"toggleDataURIEnabled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorToggleDataUriEnabled = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'toggleDataURIEnabled',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorTransferOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateAccessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorUpdateAccessories = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateAccessories',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateAccessoriesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorUpdateAccessoriesFromPointer =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'updateAccessoriesFromPointer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateBodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorUpdateBodies = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateBodies',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateBodiesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorUpdateBodiesFromPointer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateBodiesFromPointer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateGlasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorUpdateGlasses = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateGlasses',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateGlassesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorUpdateGlassesFromPointer = /*#__PURE__*/ createUseWriteContract(
  {
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'updateGlassesFromPointer',
  },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateHeads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorUpdateHeads = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateHeads',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateHeadsFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWriteNounsDescriptorUpdateHeadsFromPointer = /*#__PURE__*/ createUseWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateHeadsFromPointer',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptor = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addAccessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddAccessories = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addAccessories',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addAccessoriesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddAccessoriesFromPointer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'addAccessoriesFromPointer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBackground"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddBackground = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBackground',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddBodies = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBodies',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBodiesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddBodiesFromPointer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'addBodiesFromPointer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addGlasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddGlasses = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addGlasses',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addGlassesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddGlassesFromPointer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'addGlassesFromPointer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addHeads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddHeads = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addHeads',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addHeadsFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddHeadsFromPointer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'addHeadsFromPointer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addManyBackgrounds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorAddManyBackgrounds = /*#__PURE__*/ createUseSimulateContract(
  { abi: nounsDescriptorAbi, address: nounsDescriptorAddress, functionName: 'addManyBackgrounds' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"lockParts"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorLockParts = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'lockParts',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorRenounceOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorSetArt = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArt',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArtDescriptor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorSetArtDescriptor = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArtDescriptor',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArtInflator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorSetArtInflator = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArtInflator',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setBaseURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorSetBaseUri = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setBaseURI',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setPalette"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorSetPalette = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setPalette',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setPalettePointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorSetPalettePointer = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setPalettePointer',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setRenderer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorSetRenderer = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setRenderer',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"toggleDataURIEnabled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorToggleDataUriEnabled =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'toggleDataURIEnabled',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorTransferOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateAccessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorUpdateAccessories = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateAccessories',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateAccessoriesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorUpdateAccessoriesFromPointer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'updateAccessoriesFromPointer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateBodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorUpdateBodies = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateBodies',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateBodiesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorUpdateBodiesFromPointer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'updateBodiesFromPointer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateGlasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorUpdateGlasses = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateGlasses',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateGlassesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorUpdateGlassesFromPointer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'updateGlassesFromPointer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateHeads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorUpdateHeads = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateHeads',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateHeadsFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useSimulateNounsDescriptorUpdateHeadsFromPointer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'updateHeadsFromPointer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWatchNounsDescriptorEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"ArtUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWatchNounsDescriptorArtUpdatedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  eventName: 'ArtUpdated',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"BaseURIUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWatchNounsDescriptorBaseUriUpdatedEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: nounsDescriptorAbi, address: nounsDescriptorAddress, eventName: 'BaseURIUpdated' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"DataURIToggled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWatchNounsDescriptorDataUriToggledEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: nounsDescriptorAbi, address: nounsDescriptorAddress, eventName: 'DataURIToggled' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWatchNounsDescriptorOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"PartsLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWatchNounsDescriptorPartsLockedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  eventName: 'PartsLocked',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"RendererUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const useWatchNounsDescriptorRendererUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    eventName: 'RendererUpdated',
  })
