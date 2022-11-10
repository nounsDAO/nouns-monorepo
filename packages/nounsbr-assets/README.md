# @nounsbr/assets

## Development

### Install dependencies

```sh
yarn
```

## Usage

**Access NounBR RLE Image Data**

```ts
import { ImageData } from '@nounsbr/assets';

const { bgcolors, palette, images } = ImageData;
const { bodies, accessories, heads, glasses } = images;
```

**Get NounBR Part & Background Data**

```ts
import { getNounBRData } from '@nounsbr/assets';

const seed = {
  background: 0,
  body: 17,
  accessory: 41,
  head: 71,
  glasses: 2,
};
const { parts, background } = getNounBRData(seed);
```

**Emulate `NounBRSeeder.sol` Pseudorandom seed generation**

```ts
import { getNounBRSeedFromBlockHash } from '@nounsbr/assets';

const blockHash = '0x5014101691e81d79a2eba711e698118e1a90c9be7acb2f40d7f200134ee53e01';
const nounbrId = 116;

/**
 {
    background: 1,
    body: 28,
    accessory: 120,
    head: 95,
    glasses: 15
  }
*/
const seed = getNounBRSeedFromBlockHash(nounbrId, blockHash);
```

## Examples

**Almost off-chain NounBR Crystal Ball**
Generate a NounBR using only a block hash, which saves calls to `NounBRSeeder` and `NounBRDescriptor` contracts. This can be used for a faster crystal ball.

```ts
/**
 * For you to implement:
   - hook up providers with ether/web3.js
   - get currently auctioned NounBR Id from the NounsBRAuctionHouse contract
   - add 1 to the current NounBR Id to get the next NounBR Id (named `nextNounBRId` below)
   - get the latest block hash from your provider (named `latestBlockHash` below)
*/

import { ImageData, getNounBRSeedFromBlockHash, getNounBRData } from '@nounsbr/assets';
import { buildSVG } from '@nounsbr/sdk';
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
const seed = getNounBRSeedFromBlockHash(nextNounBRId, latestBlockHash);

/** 
 * OUTPUT:
   {
     parts: [
       {
         filename: 'body-teal',
         data: '...'
       },
       {
         filename: 'accessory-txt-nounbr-multicolor',
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
const { parts, background } = getNounBRData(seed);

const svgBinary = buildSVG(parts, palette, background);
const svgBase64 = btoa(svgBinary);
```

The NounBR SVG can then be displayed. Here's a dummy example using React

```ts
function SVG({ svgBase64 }) {
  return <img src={`data:image/svg+xml;base64,${svgBase64}`} />;
}
```
