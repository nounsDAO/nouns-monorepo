import { Button, Form } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import classes from './VerifySignature.module.css';
import { useState } from 'react';
import { verifyMessage } from '@ethersproject/wallet';
import clsx from 'clsx';

const VerifySignature: React.FC<{}> = props => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const [messageToVerify, setMessageToVerify] = useState('');
  const [signature, setSignature] = useState('');
  const [signerAddress, setSignerAddress] = useState('');
  const [validSignature, setValidSignature] = useState<boolean | undefined>(undefined);

  const attemptToVerify = () => {
    if (activeAccount === undefined) return;
    const recoveredAddress = verifyMessage(messageToVerify, signature);
    setValidSignature(
      recoveredAddress.toLocaleLowerCase().localeCompare(signerAddress.toLocaleLowerCase()) === 0,
    );
  };

  const verificationResult = () => {
    switch (validSignature) {
      case undefined:
        break;
      case true:
        return (
          <div className={clsx(classes.verifyMessage, classes.verifySuccess)}>
            Verification Success
          </div>
        );
      case false:
        return (
          <div className={clsx(classes.verifyMessage, classes.verifyFailure)}>
            Verification Failed
          </div>
        );
    }
  };

  return (
    <div className={classes.section}>
      <h2>Verify Signed Message</h2>
      {verificationResult()}
      <Form.Group className="mb-3" controlId="verifyForm.ControlAddress">
        <Form.Label>Address of Signer</Form.Label>
        <Form.Control onChange={e => setSignerAddress(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="verifyForm.Signature">
        <Form.Label>Signature</Form.Label>
        <Form.Control onChange={e => setSignature(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="verifyForm.ControlTextAreaMessage">
        <Form.Label>Signed Message</Form.Label>
        <Form.Control as="textarea" rows={5} onChange={e => setMessageToVerify(e.target.value)} />
      </Form.Group>
      {activeAccount ? (
        <Button onClick={() => attemptToVerify()}>Verify</Button>
      ) : (
        <div>Connect Wallet To Verify Message</div>
      )}
    </div>
  );
};

export default VerifySignature;
