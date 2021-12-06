# @nouns/assets

## Development

### Install dependencies

```sh
yarn
```

## Usage

**Access Noun RLE Image Data**

```ts
import { ImageData } from '@nouns/assets';

const { bgcolors, palette, images } = ImageData;
const { bodies, accessories, heads, glasses } = images;
```

**Get Noun Part & Background Data**

```ts
import { getNounData } from '@nouns/assets';

const seed = {
  background: 0,
  body: 17,
  accessory: 41,
  head: 71,
  glasses: 2,
};
const { parts, background } = getNounData(seed);
```

**Emulate `NounSeeder.sol` Pseudorandom seed generation**

```ts
import { getNounSeedFromBlockHash } from '@nouns/assets';

const blockHash = '0x5014101691e81d79a2eba711e698118e1a90c9be7acb2f40d7f200134ee53e01';
const nounId = 116;

/**
 {
    background: 1,
    body: 28,
    accessory: 120,
    head: 95,
    glasses: 15
  }
*/
const seed = getNounSeedFromBlockHash(nounId, blockHash);
```

## Examples

**Almost off-chain Noun Crystal Ball**
Generate a Noun using only a block hash, which saves calls to `NounSeeder` and `NounDescriptor` contracts. This can be used for a faster crystal ball.

```ts
/**
 * For you to implement:
   - hook up providers with ether/web3.js
   - get currently auctioned Noun Id from the NounsAuctionHouse contract
   - add 1 to the current Noun Id to get the next Noun Id (named `nextNounId` below)
   - get the latest block hash from your provider (named `latestBlockHash` below)
*/

import { ImageData, getNounSeedFromBlockHash, getNounData } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
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
const seed = getNounSeedFromBlockHash(nextNounId, latestBlockHash);

/** 
 * OUTPUT:
   {
     parts: [
       {
         filename: 'body-teal',
         data: '...'
       },
       {
         filename: 'accessory-txt-noun-multicolor',
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
const { parts, background } = getNounData(seed);

const svgBinary = buildSVG(parts, palette, background);
const svgBase64 = btoa(svgBinary);
```

The Noun SVG can then be displayed. Here's a dummy example using React

```ts
function SVG({ svgBase64 }) {
  return <img src={`data:image/svg+xml;base64,${svgBase64}`} />;
}
```
