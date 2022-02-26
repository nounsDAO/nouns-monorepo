import { Badge } from 'react-bootstrap';
import { ProposalState } from '../../wrappers/nounsDao';

const statusVariant = (status: ProposalState | undefined) => {
  switch (status) {
    case ProposalState.PENDING:
    case ProposalState.ACTIVE:
      return 'primary';
    case ProposalState.SUCCEEDED:
    case ProposalState.EXECUTED:
      return 'success';
    case ProposalState.DEFEATED:
    case ProposalState.VETOED:
      return 'danger';
    case ProposalState.QUEUED:
    case ProposalState.CANCELED:
    case ProposalState.EXPIRED:
    default:
      return 'secondary';
  }
};

const statusText = (status: ProposalState | undefined) => {
  switch (status) {
    case ProposalState.PENDING:
      return 'Pending';
    case ProposalState.ACTIVE:
      return 'Active';
    case ProposalState.SUCCEEDED:
      return 'Succeeded';
    case ProposalState.EXECUTED:
      return 'Executed';
    case ProposalState.DEFEATED:
      return 'Defeated';
    case ProposalState.QUEUED:
      return 'Queued';
    case ProposalState.CANCELED:
      return 'Canceled';
    case ProposalState.VETOED:
      return 'Vetoed';
    case ProposalState.EXPIRED:
      return 'Expired';
    default:
      return 'Undetermined';
  }
};

const ProposalStatus = ({ status }: { status: ProposalState | undefined }) => {
  return <Badge bg={statusVariant(status)}>{statusText(status)}</Badge>;
};

export default ProposalStatus;
