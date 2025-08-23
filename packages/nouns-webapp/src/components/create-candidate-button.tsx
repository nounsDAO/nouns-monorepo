import { Trans } from '@lingui/react/macro';
import { Button, Spinner } from 'react-bootstrap';

interface CreateCandidateButtonProps {
  className?: string;
  isLoading: boolean;
  proposalThreshold?: number;
  hasActiveOrPendingProposal: boolean;
  isFormInvalid: boolean;
  handleCreateProposal: () => void;
}

const CreateCandidateButton = ({
  className,
  isLoading,
  hasActiveOrPendingProposal,
  isFormInvalid,
  handleCreateProposal,
}: CreateCandidateButtonProps) => {
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
