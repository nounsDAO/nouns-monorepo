import React from 'react';

import { ChevronDownIcon } from '@heroicons/react/solid';

import classes from './brand-dropdown.module.css';

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
