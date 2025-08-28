import React from 'react';

import { cn } from '@/lib/utils';

interface BrandTextEntryProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  placeholder?: string;
  type?: string;
  min?: string;
  label?: string;
  isInvalid?: boolean;
}

const BrandTextEntry: React.FC<BrandTextEntryProps> = props => {
  const { onChange, value, placeholder, type, min, label, isInvalid = false } = props;

  return (
    <div className="relative mt-4 w-full">
      {label && <span className="opacity-50">{label}</span>}
      <input
        onChange={onChange}
        value={value}
        type={type ? type : 'string'}
        min={min}
        placeholder={placeholder}
        className={cn(
          'text-brand-cool-dark-text mb-2 mt-1 h-12 w-full rounded-[15px] border border-black/10 px-4 py-2 text-[22px] font-bold outline-none',
          isInvalid ? '!border-brand-color-red !border-2' : '',
        )}
      />
    </div>
  );
};

export default BrandTextEntry;
