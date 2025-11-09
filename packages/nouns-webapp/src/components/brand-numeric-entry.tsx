import React from 'react';

import { NumericFormat, OnValueChange } from 'react-number-format';

import { cn } from '@/lib/utils';

interface BrandNumericEntryProps {
  onValueChange?: OnValueChange;
  value?: string | number;
  placeholder?: string;
  label?: string;
  isInvalid?: boolean;
}

const BrandNumericEntry: React.FC<BrandNumericEntryProps> = props => {
  const { onValueChange, value, placeholder, label, isInvalid = false } = props;

  return (
    <div className="relative mt-4 w-full">
      {label && <span className="opacity-50">{label}</span>}
      <NumericFormat
        onValueChange={onValueChange}
        value={value}
        placeholder={placeholder}
        className={cn(
          'text-brand-cool-dark-text mb-2 mt-1 h-12 w-full rounded-[15px] border border-black/10 px-4 py-2 text-[22px] font-bold outline-none',
          isInvalid ? '!border-brand-color-red !border-2' : '',
        )}
        allowNegative={false}
        thousandSeparator=","
      />
    </div>
  );
};

export default BrandNumericEntry;
