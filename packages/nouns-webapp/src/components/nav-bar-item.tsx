import React from 'react';
import { cn } from '@/lib/utils';

const NavBarItem: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = props => {
  const { onClick, children, className } = props;
  return (
    <div
      className={cn(
        'lg-max:!bg-transparent lg-max:!text-brand-black lg-max:hover:!bg-transparent [&a]:text-brand-black [&a:hover]:text-brand-dark-red mr-4 flex items-center justify-center',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
export default NavBarItem;
