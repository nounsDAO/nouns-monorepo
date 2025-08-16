import React from 'react';

import clsx from 'clsx';

import classes from './BrandDatePicker.module.css';

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
    <div className={classes.container}>
      {label && <span className={classes.label}>{label}</span>}
      <input
        onChange={onChange}
        value={value}
        type={'date'}
        className={clsx(classes.entry, isInvalid ? classes.invalid : '')}
      />
    </div>
  );
};

export default BrandDatePicker;
