import { Button, Spinner } from 'react-bootstrap';
import { Trans } from '@lingui/macro';

const CreateCandidateButton = ({
  className,
  isLoading,
  hasActiveOrPendingProposal,
  isFormInvalid,
  handleCreateProposal,
}: {
  className?: string;
  isLoading: boolean;
  proposalThreshold?: number;
  hasActiveOrPendingProposal: boolean;
  isFormInvalid: boolean;
  handleCreateProposal: () => void;
}) => {
  const buttonText = () => {
    if (hasActiveOrPendingProposal) {
      return <Trans>You already have an active or pending proposal</Trans>;
    }
    return <Trans>Create proposal candidate</Trans>;
  };

  return (
    <div className="d-grid gap-2">
      <Button
        className={className}
        variant={hasActiveOrPendingProposal ? 'danger' : 'primary'}
        disabled={isFormInvalid || hasActiveOrPendingProposal}
        onClick={handleCreateProposal}
      >
        {isLoading ? <Spinner animation="border" /> : buttonText()}
      </Button>
    </div>
  );
};
export default CreateCandidateButton;
