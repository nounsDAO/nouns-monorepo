import { utils } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import { useState } from 'react';
import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  InputGroup,
  Modal,
  Row,
} from 'react-bootstrap';
import { useStepProgress, Step, StepProgressBar } from 'react-stepz';
import { buildEtherscanAddressLink, buildEtherscanApiQuery } from '../../utils/etherscan';
import { ProposalTransaction } from '../../wrappers/nounsDao';
import classes from './ProposalTransactionFormModal.module.css';
import BigNumber from 'bignumber.js';
import 'react-stepz/dist/index.css';

interface ProposalTransactionFormModalProps {
  show: boolean;
  onHide: () => void;
  onProposalTransactionAdded: (transaction: ProposalTransaction) => void;
}

const ProposalTransactionFormModal = ({
  show,
  onHide,
  onProposalTransactionAdded,
}: ProposalTransactionFormModalProps) => {
  const [address, setAddress] = useState('');
  const [abi, setABI] = useState<Interface>();
  const [value, setValue] = useState('');
  const [func, setFunction] = useState('');
  const [args, setArguments] = useState<string[]>([]);

  const addressValidator = (s: string) => {
    if (!utils.isAddress(s)) {
      return false;
    }
    // To avoid blocking stepper progress, do not `await`
    populateABIIfExists(s);
    return true;
  };

  const valueValidator = (v: string) => !v || !new BigNumber(v).isNaN();

  const argumentsValidator = (a: string[]) => {
    if (!func) {
      return true;
    }

    try {
      return !!abi?.encodeFunctionData(func, args);
    } catch {
      return false;
    }
  };

  const setArgument = (index: number, value: string) => {
    const values = [...args];
    values[index] = value;
    setArguments(values);
  };

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

  const stepForwardOrCallback = () => {
    if (currentStep !== steps.length - 1) {
      return stepForward();
    }
    onProposalTransactionAdded({
      address,
      value: value ? utils.parseEther(value).toString() : '0',
      signature: func,
      calldata: abi?.encodeFunctionData(func, args) ?? '0x',
    });
    clearState();
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
      label: 'Arguments',
      name: 'arguments',
      validator: () => argumentsValidator(args),
    },
    {
      label: 'Summary',
      name: 'summary',
    },
  ];

  const { stepForward, stepBackwards, currentStep } = useStepProgress({
    steps,
    startingStep: 0,
  });

  const clearState = () => {
    setAddress('');
    setABI(undefined);
    setValue('');
    setFunction('');
    setArguments([]);

    for (let i = 1; i < steps.length; i++) {
      stepBackwards();
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        onHide();
        clearState();
      }}
      dialogClassName={classes.transactionFormModal}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Add a Proposal Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <StepProgressBar className={classes.stepProgressBar} steps={steps} />
        <Step step={0}>
          <label htmlFor="callee-address">Address (Callee or Recipient)</label>
          <FormControl
            value={address}
            type="text"
            id="callee-address"
            onChange={e => setAddress(e.target.value)}
          />
        </Step>
        <Step step={1}>
          <label htmlFor="eth-value">Value in ETH (Optional)</label>
          <FormControl value={value} id="eth-value" onChange={e => setValue(e.target.value)} />
        </Step>
        <Step step={2}>
          <label htmlFor="function">Function (Optional)</label>
          <FormControl
            value={func}
            as="select"
            id="function"
            onChange={e => setFunction(e.target.value)}
          >
            <option className="text-muted">Select Contract Function</option>
            {abi && Object.keys(abi.functions).map(func => <option value={func}>{func}</option>)}
          </FormControl>
        </Step>
        <Step step={3}>
          {abi?.functions[func]?.inputs?.length ? (
            <FormGroup as={Row}>
              {abi?.functions[func]?.inputs.map((input, i) => (
                <>
                  <FormLabel column sm="3">
                    {input.name}
                  </FormLabel>
                  <Col sm="9">
                    <InputGroup className="mb-2">
                      <InputGroup.Text className={classes.inputGroupText}>
                        {input.type}
                      </InputGroup.Text>
                      <FormControl
                        value={args[i] ?? ''}
                        onChange={e => setArgument(i, e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                </>
              ))}
            </FormGroup>
          ) : (
            'No arguments required'
          )}
        </Step>
        <Step step={4}>
          <Row>
            <Col sm="3">
              <b>Address</b>
            </Col>
            <Col sm="9">
              <a href={buildEtherscanAddressLink(address)} target="_blank" rel="noreferrer">
                {address}
              </a>
            </Col>
          </Row>
          <Row>
            <Col sm="3">
              <b>Value</b>
            </Col>
            <Col sm="9">{value ? `${value} ETH` : 'None'}</Col>
          </Row>
          <Row>
            <Col sm="3">
              <b>Function</b>
            </Col>
            <Col sm="9">{func || 'None'}</Col>
          </Row>
          <Row>
            <Col sm="3">
              <b>Arguments</b>
            </Col>
            <Col sm="9">
              <hr />
            </Col>
            <Col sm="9">{abi?.functions[func]?.inputs?.length ? '' : 'None'}</Col>
          </Row>
          {abi?.functions[func]?.inputs.map((input, i) => (
            <Row>
              <Col sm="3" className={classes.functionName}>
                {i + 1}. {input.name}
              </Col>
              <Col sm="9">{args[i]}</Col>
            </Row>
          ))}
        </Step>
        <div className="d-flex justify-content-between align-items-center pt-3">
          <Button
            onClick={stepBackwards}
            variant="outline-secondary"
            size="lg"
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button onClick={stepForwardOrCallback} variant="primary" size="lg">
            {currentStep !== steps.length - 1 ? 'Next' : 'Add Transaction'}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default ProposalTransactionFormModal;
