import React from 'react';

import { NumericFormat, OnValueChange } from 'react-number-format';

import { cn } from '@/lib/utils';

import classes from './brand-numeric-entry.module.css';

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
    <div className={classes.container}>
      {label && <span className={classes.label}>{label}</span>}
      <NumericFormat
        onValueChange={onValueChange}
        value={value}
        placeholder={placeholder}
        className={cn(classes.entry, isInvalid ? classes.invalid : '')}
        allowNegative={false}
        thousandSeparator=","
      />
    </div>
  );
};

export default BrandNumericEntry;
