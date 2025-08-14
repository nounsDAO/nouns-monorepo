import React from 'react';

import { Form } from 'react-bootstrap';

import classes from './abi-upload.module.css';

interface ABIUploadProps {
  abiFileName?: string;
  isValid: boolean | undefined;
  isInvalid: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ABIUpload: React.FC<ABIUploadProps> = ({ abiFileName, isValid, isInvalid, onChange }) => {
  const displayLabel = abiFileName === 'etherscan-abi-download.json' ? abiFileName : 'ABI';

  return (
    <div className={classes.wrapper}>
      <label htmlFor="import-abi" className={classes.label}>
        {displayLabel}
      </label>
      <Form.Control
        className={classes.form}
        type="file"
        id="import-abi"
        size="lg"
        accept="application/JSON"
        isValid={isValid}
        isInvalid={isInvalid}
        onChange={onChange}
      />
    </div>
  );
};

export default ABIUpload;
