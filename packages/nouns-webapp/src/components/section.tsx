import React, { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

type SectionProps = {
  fullWidth: boolean;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
};
const Section: React.FC<SectionProps> = props => {
  const { fullWidth, className, children, style } = props;
  return (
    <div className={cn('pt-8', className)} style={style}>
      <div className={cn('w-full', fullWidth ? '' : 'mx-auto px-4 lg:max-w-screen-lg')}>
        <div className="flex flex-wrap items-center">{children}</div>
      </div>
    </div>
  );
};
export default Section;
