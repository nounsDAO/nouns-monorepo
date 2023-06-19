# @vrbs/assets

## Development

### Install dependencies

```sh
yarn
```

## Usage

**Access Vrb RLE Image Data**

```ts
import { ImageData } from '@vrbs/assets';

const { bgcolors, palette, images } = ImageData;
const { bodies, accessories, heads, glasses } = images;
```

**Get Vrb Part & Background Data**

```ts
import { getVrbData } from '@vrbs/assets';

const seed = {
  background: 0,
  body: 17,
  accessory: 41,
  head: 71,
  glasses: 2,
};
const { parts, background } = getVrbData(seed);
```

**Emulate `VrbSeeder.sol` Pseudorandom seed generation**

```ts
import { getVrbSeedFromBlockHash } from '@vrbs/assets';

const blockHash = '0x5014101691e81d79a2eba711e698118e1a90c9be7acb2f40d7f200134ee53e01';
const vrbId = 116;

/**
 {
    background: 1,
    body: 28,
    accessory: 120,
    head: 95,
    glasses: 15
  }
*/
const seed = getVrbSeedFromBlockHash(vrbId, blockHash);
```

## Examples

**Almost off-chain Vrb Crystal Ball**
Generate a Vrb using only a block hash, which saves calls to `VrbSeeder` and `VrbDescriptor` contracts. This can be used for a faster crystal ball.

```ts
/**
 * For you to implement:
   - hook up providers with ether/web3.js
   - get currently auctioned Vrb Id from the AuctionHouse contract
   - add 1 to the current Vrb Id to get the next Vrb Id (named `nextVrbId` below)
   - get the latest block hash from your provider (named `latestBlockHash` below)
*/

import { ImageData, getVrbSeedFromBlockHash, getVrbData } from '@vrbs/assets';
import { buildSVG } from '@vrbs/sdk';
const { palette } = ImageData; // Used with `buildSVG``

/**
 * OUTPUT:
   {
      background: 1,
      body: 28,
      accessory: 120,
      head: 95,
      glasses: 15
    }
*/
const seed = getVrbSeedFromBlockHash(nextVrbId, latestBlockHash);

/** 
 * OUTPUT:
   {
     parts: [
       {
         filename: 'body-teal',
         data: '...'
       },
       {
         filename: 'accessory-txt-vrb-multicolor',
         data: '...'
       },
       {
         filename: 'head-goat',
         data: '...'
       },
       {
         filename: 'glasses-square-red',
         data: '...'
       }
     ],
     background: 'e1d7d5'
   }
*/
const { parts, background } = getVrbData(seed);

const svgBinary = buildSVG(parts, palette, background);
const svgBase64 = btoa(svgBinary);
```

The Vrb SVG can then be displayed. Here's a dummy example using React

```ts
function SVG({ svgBase64 }) {
  return <img src={`data:image/svg+xml;base64,${svgBase64}`} />;
}
```
