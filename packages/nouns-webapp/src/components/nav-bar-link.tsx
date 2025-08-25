import React from 'react';

import { cn } from '@/lib/utils';
import { Link } from 'react-router';

const NavBarLink: React.FC<{
  children: React.ReactNode;
  to: string;
  className?: string;
}> = props => {
  const { to, children, className } = props;
  // hacks to make React Router work with external links
  const onClick = () => (/http/.test(to) ? (window.location.href = to) : null);
  const target = /http/.test(to) ? '_blank' : '';
  return (
    <Link
      to={to}
      className={cn(
        `text-brand-black hover:text-brand-dark-green lg-max:bg-transparent lg-max:text-brand-black lg-max:hover:bg-transparent lg-max:hover:text-brand-dark-green mr-4 flex h-8 cursor-pointer items-center justify-center rounded-[50px] border-0 bg-white p-7 text-lg font-normal no-underline hover:bg-[#f2f2f2]`,
        className,
      )}
      onClick={onClick}
      target={target}
    >
      {children}
    </Link>
  );
};
export default NavBarLink;
