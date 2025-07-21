import {
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
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
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptor = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"accessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorAccessories = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'accessories',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"accessoryCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorAccessoryCount = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'accessoryCount',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"arePartsLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorArePartsLocked = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'arePartsLocked',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"art"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorArt = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'art',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"backgroundCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorBackgroundCount = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'backgroundCount',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"backgrounds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorBackgrounds = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'backgrounds',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"baseURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorBaseUri = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'baseURI',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"bodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorBodies = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'bodies',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"bodyCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorBodyCount = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'bodyCount',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"dataURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorDataUri = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'dataURI',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"generateSVGImage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorGenerateSvgImage = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'generateSVGImage',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"genericDataURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorGenericDataUri = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'genericDataURI',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"getPartsForSeed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorGetPartsForSeed = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'getPartsForSeed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"glasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorGlasses = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'glasses',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"glassesCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorGlassesCount = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'glassesCount',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"headCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorHeadCount = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'headCount',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"heads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorHeads = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'heads',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"isDataURIEnabled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorIsDataUriEnabled = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'isDataURIEnabled',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorOwner = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"palettes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorPalettes = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'palettes',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"renderer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorRenderer = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'renderer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"tokenURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const readNounsDescriptorTokenUri = /*#__PURE__*/ createReadContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptor = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addAccessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddAccessories = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addAccessories',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addAccessoriesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddAccessoriesFromPointer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addAccessoriesFromPointer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBackground"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddBackground = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBackground',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddBodies = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBodies',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBodiesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddBodiesFromPointer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBodiesFromPointer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addGlasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddGlasses = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addGlasses',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addGlassesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddGlassesFromPointer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addGlassesFromPointer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addHeads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddHeads = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addHeads',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addHeadsFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddHeadsFromPointer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addHeadsFromPointer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addManyBackgrounds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorAddManyBackgrounds = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addManyBackgrounds',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"lockParts"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorLockParts = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'lockParts',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorSetArt = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArt',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArtDescriptor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorSetArtDescriptor = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArtDescriptor',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArtInflator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorSetArtInflator = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArtInflator',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setBaseURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorSetBaseUri = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setBaseURI',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setPalette"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorSetPalette = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setPalette',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setPalettePointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorSetPalettePointer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setPalettePointer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setRenderer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorSetRenderer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setRenderer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"toggleDataURIEnabled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorToggleDataUriEnabled = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'toggleDataURIEnabled',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateAccessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorUpdateAccessories = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateAccessories',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateAccessoriesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorUpdateAccessoriesFromPointer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateAccessoriesFromPointer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateBodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorUpdateBodies = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateBodies',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateBodiesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorUpdateBodiesFromPointer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateBodiesFromPointer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateGlasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorUpdateGlasses = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateGlasses',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateGlassesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorUpdateGlassesFromPointer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateGlassesFromPointer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateHeads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorUpdateHeads = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateHeads',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateHeadsFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const writeNounsDescriptorUpdateHeadsFromPointer = /*#__PURE__*/ createWriteContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateHeadsFromPointer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptor = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addAccessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddAccessories = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addAccessories',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addAccessoriesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddAccessoriesFromPointer =
  /*#__PURE__*/ createSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'addAccessoriesFromPointer',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBackground"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddBackground = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBackground',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddBodies = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBodies',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addBodiesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddBodiesFromPointer = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addBodiesFromPointer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addGlasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddGlasses = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addGlasses',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addGlassesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddGlassesFromPointer = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addGlassesFromPointer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addHeads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddHeads = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addHeads',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addHeadsFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddHeadsFromPointer = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addHeadsFromPointer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"addManyBackgrounds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorAddManyBackgrounds = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'addManyBackgrounds',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"lockParts"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorLockParts = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'lockParts',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorSetArt = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArt',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArtDescriptor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorSetArtDescriptor = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArtDescriptor',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setArtInflator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorSetArtInflator = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setArtInflator',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setBaseURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorSetBaseUri = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setBaseURI',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setPalette"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorSetPalette = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setPalette',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setPalettePointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorSetPalettePointer = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setPalettePointer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"setRenderer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorSetRenderer = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'setRenderer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"toggleDataURIEnabled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorToggleDataUriEnabled = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'toggleDataURIEnabled',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateAccessories"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorUpdateAccessories = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateAccessories',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateAccessoriesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorUpdateAccessoriesFromPointer =
  /*#__PURE__*/ createSimulateContract({
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'updateAccessoriesFromPointer',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateBodies"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorUpdateBodies = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateBodies',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateBodiesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorUpdateBodiesFromPointer = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateBodiesFromPointer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateGlasses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorUpdateGlasses = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateGlasses',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateGlassesFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorUpdateGlassesFromPointer = /*#__PURE__*/ createSimulateContract(
  {
    abi: nounsDescriptorAbi,
    address: nounsDescriptorAddress,
    functionName: 'updateGlassesFromPointer',
  },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateHeads"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorUpdateHeads = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateHeads',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `functionName` set to `"updateHeadsFromPointer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const simulateNounsDescriptorUpdateHeadsFromPointer = /*#__PURE__*/ createSimulateContract({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  functionName: 'updateHeadsFromPointer',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const watchNounsDescriptorEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"ArtUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const watchNounsDescriptorArtUpdatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  eventName: 'ArtUpdated',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"BaseURIUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const watchNounsDescriptorBaseUriUpdatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  eventName: 'BaseURIUpdated',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"DataURIToggled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const watchNounsDescriptorDataUriToggledEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  eventName: 'DataURIToggled',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const watchNounsDescriptorOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: nounsDescriptorAbi, address: nounsDescriptorAddress, eventName: 'OwnershipTransferred' },
)

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"PartsLocked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const watchNounsDescriptorPartsLockedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  eventName: 'PartsLocked',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDescriptorAbi}__ and `eventName` set to `"RendererUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x79e04ebcdf1ac2661697b23844149b43acc002d5)
 */
export const watchNounsDescriptorRendererUpdatedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nounsDescriptorAbi,
  address: nounsDescriptorAddress,
  eventName: 'RendererUpdated',
})
