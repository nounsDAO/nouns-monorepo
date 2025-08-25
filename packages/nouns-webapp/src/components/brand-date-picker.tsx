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
          'mb-2 mt-1 h-12 w-full rounded-[15px] border border-[rgba(0,0,0,0.1)] px-4 py-2 text-[22px] font-bold text-[var(--brand-cool-dark-text)] outline-none',
          isInvalid ? '!border-2 !border-[var(--brand-color-red)]' : '',
        )}
      />
    </div>
  );
};

export default BrandDatePicker;
