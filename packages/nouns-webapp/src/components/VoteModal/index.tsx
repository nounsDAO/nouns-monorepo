import { Button, Modal, Spinner } from 'react-bootstrap';
import classes from './VoteModal.module.css';
import { Vote } from '../../wrappers/nounsDao';

interface VoteModalProps {
  show: boolean;
  onHide: () => void;
  onVote: () => void;
  isLoading: boolean;
  proposalId: string | undefined;
  availableVotes: number | undefined;
  vote: Vote | undefined;
}

const voteActionText = (vote: Vote | undefined, proposalId: string | undefined) => {
  switch (vote) {
    case Vote.FOR:
      return `Vote For Proposal ${proposalId}`;
    case Vote.AGAINST:
      return `Vote Against Proposal ${proposalId}`;
    case Vote.ABSTAIN:
      return `Vote to Abstain on Proposal ${proposalId}`;
  }
};

const VoteModal = ({
  show,
  onHide,
  onVote,
  proposalId,
  availableVotes,
  vote,
  isLoading,
}: VoteModalProps) => {
  return (
    <Modal show={show} onHide={onHide} dialogClassName={classes.voteModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>{voteActionText(vote, proposalId)}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center d-grid gap-2">
        <p className={classes.voteModalText}>
          {availableVotes && `${availableVotes} ${availableVotes > 1 ? 'Votes' : 'Vote'}`} Available
        </p>
        <Button onClick={onVote}>
          {isLoading ? <Spinner animation="border" /> : voteActionText(vote, proposalId)}
        </Button>
      </Modal.Body>
    </Modal>
  );
};
export default VoteModal;
