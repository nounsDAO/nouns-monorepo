# @n00uns/assets

## Development

### Install dependencies

```sh
yarn
```

## Usage

**Access N00un RLE Image Data**

```ts
import { ImageData } from '@n00uns/assets';

const { bgcolors, palette, images } = ImageData;
const { bodies, accessories, heads, glasses } = images;
```

**Get N00un Part & Background Data**

```ts
import { getN00unData } from '@n00uns/assets';

const seed = {
  background: 0,
  body: 17,
  accessory: 41,
  head: 71,
  glasses: 2,
};
const { parts, background } = getN00unData(seed);
```

**Emulate `N00unSeeder.sol` Pseudorandom seed generation**

```ts
import { getN00unSeedFromBlockHash } from '@n00uns/assets';

const blockHash = '0x5014101691e81d79a2eba711e698118e1a90c9be7acb2f40d7f200134ee53e01';
const n00unId = 116;

/**
 {
    background: 1,
    body: 28,
    accessory: 120,
    head: 95,
    glasses: 15
  }
*/
const seed = getN00unSeedFromBlockHash(n00unId, blockHash);
```

## Examples

**Almost off-chain N00un Crystal Ball**
Generate a N00un using only a block hash, which saves calls to `N00unSeeder` and `N00unDescriptor` contracts. This can be used for a faster crystal ball.

```ts
/**
 * For you to implement:
   - hook up providers with ether/web3.js
   - get currently auctioned N00un Id from the N00unsAuctionHouse contract
   - add 1 to the current N00un Id to get the next N00un Id (named `nextN00unId` below)
   - get the latest block hash from your provider (named `latestBlockHash` below)
*/

import { ImageData, getN00unSeedFromBlockHash, getN00unData } from '@n00uns/assets';
import { buildSVG } from '@n00uns/sdk';
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
const seed = getN00unSeedFromBlockHash(nextN00unId, latestBlockHash);

/** 
 * OUTPUT:
   {
     parts: [
       {
         filename: 'body-teal',
         data: '...'
       },
       {
         filename: 'accessory-txt-n00un-multicolor',
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
const { parts, background } = getN00unData(seed);

const svgBinary = buildSVG(parts, palette, background);
const svgBase64 = btoa(svgBinary);
```

The N00un SVG can then be displayed. Here's a dummy example using React

```ts
function SVG({ svgBase64 }) {
  return <img src={`data:image/svg+xml;base64,${svgBase64}`} />;
}
```
