import classes from './ABIUpload.module.css';
import React from 'react';
import { Form } from 'react-bootstrap';

interface ABIUploadProps {
  abiFileName?: string;
  isValid: boolean | undefined;
  isInvalid: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ABIUpload: React.FC<ABIUploadProps> = props => {
  const { abiFileName, isValid, isInvalid, onChange } = props;
  return (
    <div className={classes.wrapper}>
      <span className={classes.label}>
        {abiFileName === 'etherscan-abi-download.json' ? abiFileName : 'ABI'}
      </span>
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
