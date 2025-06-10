import { FC, HTMLAttributes } from 'react';

import { ImageData } from '@noundry/nouns-assets';
import { buildSVG } from '@nouns/sdk';
import { useQuery } from '@tanstack/react-query';

import { traitCategory } from '@/lib/traitCategory';
import { INounSeed } from '@/wrappers/nounToken';

export interface TraitProps extends HTMLAttributes<HTMLImageElement> {
  type: keyof INounSeed;
  seed?: number;
}

const fallbackTransparentPixel =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

export const Trait: FC<TraitProps> = ({ type, seed, ...props }) => {
  const { data: svg } = useQuery({
    queryKey: ['trait-svg', type, seed] as const,
    queryFn: () => {
      return type === 'background'
        ? buildSVG([], ImageData.palette, ImageData.bgcolors[seed!])
        : buildSVG([ImageData.images[traitCategory[type]][seed!]], ImageData.palette, '');
    },
    enabled: seed !== undefined,
  });

  return (
    <img
      {...props}
      src={svg ? `data:image/svg+xml;base64,${btoa(svg)}` : fallbackTransparentPixel}
    />
  );
};
