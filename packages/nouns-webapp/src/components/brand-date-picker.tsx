import React from 'react';

import { cn } from '@/lib/utils';

interface BrandDatePickerProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  placeholder?: string;
  label?: string;
  isInvalid?: boolean;
}

const BrandDatePicker: React.FC<BrandDatePickerProps> = ({
  onChange,
  value,
  label,
  isInvalid = false,
}) => {
  return (
    <div className="relative mt-4 w-full">
      {label && <span className="opacity-50">{label}</span>}
      <input
        onChange={onChange}
        value={value}
        type="date"
        className={cn(
          'text-brand-cool-dark-text mb-2 mt-1 h-12 w-full rounded-[15px] border border-black/10 px-4 py-2 text-[22px] font-bold outline-none',
          isInvalid ? '!border-brand-color-red !border-2' : '',
        )}
      />
    </div>
  );
};

export default BrandDatePicker;
