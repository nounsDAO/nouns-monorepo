import { Button } from 'react-bootstrap';

const CreateProposalButton = ({
  className,
  proposalThreshold,
  hasActiveOrPendingProposal,
  hasEnoughVote,
  isFormInvalid,
  handleCreateProposal,
}: {
  className?: string;
  proposalThreshold?: number;
  hasActiveOrPendingProposal: boolean;
  hasEnoughVote: boolean;
  isFormInvalid: boolean;
  handleCreateProposal: () => void;
}) => {
  return (
    <Button
      className={className}
      variant={hasActiveOrPendingProposal || !hasEnoughVote ? 'danger' : 'primary'}
      disabled={isFormInvalid || hasActiveOrPendingProposal || !hasEnoughVote}
      onClick={handleCreateProposal}
      block
    >
      {hasActiveOrPendingProposal ? (
        'You already have an active or pending proposal'
      ) : !hasEnoughVote ? (
        <>
          {proposalThreshold
            ? 'You must have {proposalThreshold} votes to submit a proposal'
            : "You don't have enough votes to submit a proposal"}
        </>
      ) : (
        'Create Proposal'
      )}
    </Button>
  );
};
export default CreateProposalButton;
