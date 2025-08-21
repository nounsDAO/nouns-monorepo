import React from 'react';

import { cn } from '@/lib/utils';

import classes from './brand-text-entry.module.css';

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
    <div className={classes.container}>
      {label && <span className={classes.label}>{label}</span>}
      <input
        onChange={onChange}
        value={value}
        type={type ? type : 'string'}
        min={min}
        placeholder={placeholder}
        className={cn(classes.entry, isInvalid ? classes.invalid : '')}
      />
    </div>
  );
};

export default BrandTextEntry;
