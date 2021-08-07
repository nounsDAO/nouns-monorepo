import { Modal } from 'react-bootstrap';
import { Vote } from '../../wrappers/nounsDao';

interface VoteModalProps {
  show: boolean;
  onHide: () => void;
  proposalId: string | undefined;
  vote: Vote | undefined;
}

const modalTitle = (vote: Vote | undefined, proposalId: string | undefined) => {
  switch (vote) {
    case Vote.FOR:
      return `Vote for proposal ${proposalId}`;
    case Vote.AGAINST:
      return `Vote against proposal ${proposalId}`;
    case Vote.ABSTAIN:
      return `Vote to abstain on proposal ${proposalId}`;
  }
};

const VoteModal = ({ show, onHide, proposalId, vote }: VoteModalProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>{modalTitle(vote, proposalId)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>Coming soon!</Modal.Body>
    </Modal>
  );
};
export default VoteModal;
