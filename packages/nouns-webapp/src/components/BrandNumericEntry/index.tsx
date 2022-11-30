import clsx from 'clsx';
import classes from './BrandNumericEntry.module.css';
import { NumericFormat, OnValueChange } from 'react-number-format';

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
        className={clsx(classes.entry, isInvalid ? classes.invalid : '')}
        allowNegative={false}
        thousandSeparator=","
      />
    </div>
  );
};

export default BrandNumericEntry;
