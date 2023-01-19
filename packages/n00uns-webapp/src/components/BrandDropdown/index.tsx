import { ChevronDownIcon } from '@heroicons/react/solid';
import React from 'react';
import classes from './BrandDropdown.module.css';

interface BrandDropdownProps {
  onChange: (e: any) => void;
  label?: string;
  value: any;
  chevonRight?: number;
  chevronTop?: number;
}

const BrandDropdown: React.FC<BrandDropdownProps> = props => {
  const { children, onChange, value, label, chevonRight = 10, chevronTop = 10 } = props;

  return (
    <div className={classes.dropdownContainer}>
      {label && <span className={classes.label}>{label}</span>}
      <select onChange={onChange} className={classes.select} value={value}>
        {children}
      </select>
      <div
        className={classes.chevronWrapper}
        style={{
          right: `${chevonRight}px`,
          top: `${chevronTop}px`,
        }}
      >
        <ChevronDownIcon className={classes.chevron} />
      </div>
    </div>
  );
};

export default BrandDropdown;
