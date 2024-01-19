import { Button, Spinner } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';

const EditProposalButton = ({
  className,
  isLoading,
  proposalThreshold,
  hasActiveOrPendingProposal,
  hasEnoughVote,
  isFormInvalid,
  isCandidate = false,
  handleCreateProposal,
}: {
  className?: string;
  isLoading: boolean;
  proposalThreshold?: number;
  hasActiveOrPendingProposal: boolean;
  hasEnoughVote: boolean;
  isFormInvalid: boolean;
  isCandidate?: boolean;
  handleCreateProposal: () => void;
}) => {
  const buttonText = () => {
    if (hasActiveOrPendingProposal) {
      return <Trans>You already have an active or pending proposal</Trans>;
    }
    if (!hasEnoughVote) {
      if (proposalThreshold) {
        return (
          <Trans>
            You must have {i18n.number((proposalThreshold || 0) + 1)} votes to submit a proposal
          </Trans>
        );
      }
      return <Trans>You don't have enough votes to submit a proposal</Trans>;
    }
    if (isCandidate) {
      return <Trans>Update Proposal Candidate</Trans>;
    }
    return <Trans>Update Proposal</Trans>;
  };

  return (
    <div className="d-grid gap-2">
      <Button
        className={className}
        variant={hasActiveOrPendingProposal || !hasEnoughVote ? 'danger' : 'primary'}
        disabled={isFormInvalid || hasActiveOrPendingProposal || !hasEnoughVote}
        onClick={handleCreateProposal}
      >
        {isLoading ? <Spinner animation="border" /> : buttonText()}
      </Button>
    </div>
  );
};
export default EditProposalButton;
