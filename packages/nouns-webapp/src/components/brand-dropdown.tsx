import React from 'react';

import { ChevronDownIcon } from '@heroicons/react/solid';

interface BrandDropdownProps {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  value: string | number;
  chevonRight?: number;
  chevronTop?: number;
  children: React.ReactNode;
}

const BrandDropdown: React.FC<BrandDropdownProps> = ({
  children,
  onChange,
  value,
  label,
  chevonRight = 10,
  chevronTop = 10,
}) => {
  return (
    <div className="relative mt-4 w-full cursor-pointer">
      {label && <span className="opacity-50">{label}</span>}
      <select
        onChange={onChange}
        className="text-brand-cool-dark-text h-12 w-full cursor-pointer appearance-none rounded-[15px] border border-black/10 px-4 py-2 text-[22px] font-bold outline-none"
        value={value}
      >
        {children}
      </select>
      <div
        className="absolute"
        style={{
          right: `${chevonRight}px`,
          top: `${chevronTop}px`,
        }}
      >
        <ChevronDownIcon className="text-brand-cool-dark-text size-7" />
      </div>
    </div>
  );
};

export default BrandDropdown;
