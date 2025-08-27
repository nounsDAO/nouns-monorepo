import type { StaticImageData } from 'next/image';

import React from 'react';

import Image from 'react-bootstrap/Image';
import { cn } from '@/lib/utils';

import loadingNoun from '@/assets/loading-skull-noun.gif';

export const LoadingNoun = () => {
  return (
    <div className="relative h-0 w-full pt-[100%]">
      <Image
        className="absolute left-0 top-0 h-auto w-full align-middle"
        src={(loadingNoun as StaticImageData).src}
        alt={'loading noun'}
        fluid
      />
    </div>
  );
};

const LegacyNoun: React.FC<{
  imgPath: string | StaticImageData;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}> = props => {
  const { imgPath, alt, className, wrapperClassName } = props;

  const resolvedSrc =
    typeof imgPath === 'string'
      ? imgPath.trim() || (loadingNoun as StaticImageData).src
      : (imgPath as StaticImageData | undefined)?.src || (loadingNoun as StaticImageData).src;

  return (
    <div className={cn('relative h-0 w-full pt-[100%]', wrapperClassName)}>
      <Image
        className={cn('absolute left-0 top-0 h-auto w-full align-middle', className)}
        src={resolvedSrc}
        alt={alt}
        fluid
      />
    </div>
  );
};

export default LegacyNoun;
