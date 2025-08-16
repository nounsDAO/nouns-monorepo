import { ImageData } from '@noundry/nouns-assets';

import { traitCategory } from '@/lib/trait-category';
import { INounSeed } from '@/wrappers/noun-token';

const capitalizeFirstLetter = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

export const traitName = (type: keyof INounSeed, seed: number) => {
  if (type === 'background') {
    return ['Cool', 'Warm'][seed];
  }

  let filename = ImageData.images[traitCategory[type]][seed].filename;

  if (type === 'glasses') {
    filename = filename.replace('square-', '');
  }

  if (type === 'accessory') {
    filename = filename.replace('body-', '');
  }

  return capitalizeFirstLetter(filename.substring(filename.indexOf('-') + 1).replace(/-/g, ' '));
};
