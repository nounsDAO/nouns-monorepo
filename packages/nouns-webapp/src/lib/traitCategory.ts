import { ImageData } from '@noundry/nouns-assets';

import { INounSeed } from '@/wrappers/nounToken';

export const traitCategory: Record<
  Exclude<keyof INounSeed, 'background'>,
  keyof (typeof ImageData)['images']
> = {
  body: 'bodies',
  accessory: 'accessories',
  head: 'heads',
  glasses: 'glasses',
};
