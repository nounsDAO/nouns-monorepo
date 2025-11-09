import React from 'react';

import NextLink from 'next/link';

import { cn } from '@/lib/utils';

const NavBarLink: React.FC<{
  children: React.ReactNode;
  to: string;
  className?: string;
}> = props => {
  const { to, children, className } = props;
  const isExternal = /^https?:/i.test(to);
  const cls = cn(
    'text-brand-black hover:text-brand-dark-green max-lg:bg-transparent max-lg:text-brand-black max-lg:hover:bg-transparent max-lg:hover:text-brand-dark-green mr-4 flex h-8 cursor-pointer items-center justify-center rounded-[50px] border-0 bg-white p-7 text-lg font-normal no-underline hover:bg-brand-surface',
    className,
  );
  if (isExternal) {
    return (
      <a href={to} className={cls} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <NextLink href={to} className={cls}>
      {children}
    </NextLink>
  );
};
export default NavBarLink;
