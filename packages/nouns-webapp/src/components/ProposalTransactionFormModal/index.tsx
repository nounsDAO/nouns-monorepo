import { utils } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import { useState } from 'react';
import { Button, FormControl, Modal } from 'react-bootstrap';
import { useStepProgress, Step, StepProgressBar } from 'react-stepz';
import { buildEtherscanApiQuery } from '../../utils/etherscan';
import classes from './ProposalTransactionFormModal.module.css';
import BigNumber from 'bignumber.js';
import 'react-stepz/dist/index.css';

interface ProposalTransactionFormModalProps {
  show: boolean;
  onHide: () => void;
  onProposalTransactionAdded: (transaction: any /* TODO */) => void;
}

const ProposalTransactionFormModal = ({
  show,
  onHide,
  onProposalTransactionAdded,
}: ProposalTransactionFormModalProps) => {
  const [address, setAddress] = useState('');
  const [abi, setABI] = useState<Interface>();
  const [value, setValue] = useState('0');
  const [func, setFunction] = useState('');

  const addressValidator = (s: string) => {
    if (!utils.isAddress(s)) {
      return false;
    }
    // To avoid blocking stepper progress, do not `await`
    populateABIIfExists(s);
    return true;
  };

  const valueValidator = (v: string) => !v || !new BigNumber(v).isNaN();

  const getABI = async (address: string) => {
    const response = await fetch(buildEtherscanApiQuery(address));
    const json = await response.json();
    return json?.result;
  };

  const populateABIIfExists = async (address: string) => {
    try {
      const result = await getABI(address);
      setABI(new Interface(JSON.parse(result)));
    } catch {}
  };

  const steps = [
    {
      label: 'Address',
      name: 'address',
      validator: () => addressValidator(address),
    },
    {
      label: 'Value',
      name: 'value',
      validator: () => valueValidator(value),
    },
    {
      label: 'Function',
      name: 'function',
    },
    {
      label: 'Calldata',
      name: 'calldata',
    },
    {
      label: 'Summary',
      name: 'summary',
    },
  ];

  const { stepForward, stepBackwards } = useStepProgress({
    steps,
    startingStep: 0,
  });

  return (
    <Modal show={show} onHide={onHide} dialogClassName={classes.transactionFormModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add a Proposal Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <StepProgressBar className={classes.stepProgressBar} steps={steps} />
        <Step step={0}>
          <label htmlFor="callee-address">Address to Call</label>
          <FormControl
            type="text"
            id="callee-address"
            onChange={e => setAddress(e.target.value)}
          ></FormControl>
        </Step>
        <Step step={1}>
          <label htmlFor="eth-value">Value in ETH (Optional)</label>
          <FormControl id="eth-value" onChange={e => setValue(e.target.value)}></FormControl>
        </Step>
        <Step step={2}>
          <label htmlFor="function">Function</label>
          <FormControl as="select" id="function" onChange={e => setFunction(e.target.value)}>
            <option className="text-muted">Select Contract Function (Optional)</option>
            {abi && Object.keys(abi.functions).map(func => <option value={func}>{func}</option>)}
          </FormControl>
        </Step>
        <Step step={3}>
          <h1>Calldata Content</h1>
        </Step>
        <Step step={4}>
          <h1>Summary Content</h1>;
        </Step>
        <div className="d-flex justify-content-between align-items-center pt-3">
          <Button onClick={stepBackwards} variant="outline-secondary" size="lg">
            Back
          </Button>
          <Button onClick={stepForward} variant="primary" size="lg">
            Next
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default ProposalTransactionFormModal;
