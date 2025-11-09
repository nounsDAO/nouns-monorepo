import { ImageData } from '@noundry/nouns-assets';

import { INounSeed } from '@/wrappers/noun-token';

export const traitCategory: Record<
  Exclude<keyof INounSeed, 'background'>,
  keyof (typeof ImageData)['images']
> = {
  body: 'bodies',
  accessory: 'accessories',
  head: 'heads',
  glasses: 'glasses',
};
