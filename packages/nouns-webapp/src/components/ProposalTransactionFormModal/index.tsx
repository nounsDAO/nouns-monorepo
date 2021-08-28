import { utils } from 'ethers';
import { FormControl, Modal } from 'react-bootstrap';
import StepProgressBar from 'react-step-progress';
import 'react-step-progress/dist/index.css';

interface ProposalTransactionFormModalProps {
  show: boolean;
  onHide: () => void;
  onProposalTransactionAdded: (transaction: any /* TODO */) => void;
}

const addressContent = (() => {
  return (
    <>
      <label htmlFor="callee-address">Address to call</label>
      <FormControl id="callee-address"></FormControl>
    </>
  );
})();
const valuesContent = (() => {
  return (
    <>
      <label htmlFor="eth-value">Value in ETH (optional)</label>
      <FormControl id="eth-value"></FormControl>
    </>
  );
})();
const functionContent = (() => {
  return (
    <>
      <label htmlFor="function">Function</label>
      <FormControl as="select" id="function"></FormControl>
    </>
  );
})();
const calldataContent = <h1>Call Data Content</h1>;
const summaryContent = <h1>Summary Content</h1>;

const addressValidator = (s: string) => utils.isAddress(s);

const valuesValidator = () => true;

const ProposalTransactionFormModal = ({
  show,
  onHide,
  onProposalTransactionAdded,
}: ProposalTransactionFormModalProps) => {
  return (
    <Modal size="lg" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add a Proposal Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <StepProgressBar
          startingStep={0}
          onSubmit={() => onProposalTransactionAdded({})}
          submitBtnName="Add Transaction"
          steps={[
            {
              label: 'Address',
              name: 'address',
              content: addressContent,
              validator: addressValidator,
            },
            {
              label: 'Values',
              name: 'values',
              content: valuesContent,
              validator: valuesValidator,
            },
            {
              label: 'Function',
              name: 'function',
              content: functionContent,
            },
            {
              label: 'Call Data',
              name: 'calldata',
              content: calldataContent,
            },
            {
              label: 'Summary',
              name: 'summary',
              content: summaryContent,
            },
          ]}
        />
      </Modal.Body>
    </Modal>
  );
};
export default ProposalTransactionFormModal;
