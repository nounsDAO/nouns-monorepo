import React from 'react';

import classes from './abi-upload.module.css';

interface ABIUploadProps {
  abiFileName?: string;
  isInvalid: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ABIUpload: React.FC<ABIUploadProps> = ({ abiFileName, isInvalid, onChange }) => {
  const displayLabel = abiFileName === 'etherscan-abi-download.json' ? abiFileName : 'ABI';

  return (
    <div className={classes.wrapper}>
      <label htmlFor="import-abi" className={classes.label}>
        {displayLabel}
      </label>
      <input
        className={classes.form}
        type="file"
        id="import-abi"
        accept="application/JSON"
        aria-invalid={isInvalid || undefined}
        onChange={onChange}
      />
    </div>
  );
};

export default ABIUpload;
