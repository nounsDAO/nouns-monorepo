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
