import { ReactNode, useCallback, useEffect, useState } from 'react';

import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { Button, FloatingLabel, FormControl, Spinner } from 'react-bootstrap';

import NavBarButton, { NavBarButtonStyle } from '@/components/NavBarButton';
import SolidColorBackgroundModal from '@/components/SolidColorBackgroundModal';
import { cn } from '@/lib/utils';
import { useCastRefundableVote, useCastRefundableVoteWithReason, Vote } from '@/wrappers/nounsDao';

import classes from './VoteModal.module.css';

interface VoteModalProps {
  show: boolean;
  onHide: () => void;
  proposalId: string | undefined;
  availableVotes: number;
  isObjectionPeriod?: boolean;
}

const POST_SUCCESSFUL_VOTE_MODAL_CLOSE_TIME_MS = 3000;

const VoteModal = ({
  show,
  onHide,
  proposalId,
  availableVotes,
  isObjectionPeriod,
}: VoteModalProps) => {
  const { castRefundableVote, castRefundableVoteState } = useCastRefundableVote();
  const { castRefundableVoteWithReason, castRefundableVoteWithReasonState } =
    useCastRefundableVoteWithReason();
  const [vote, setVote] = useState<Vote>();
  const [voteReason, setVoteReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoteSucessful, setIsVoteSuccessful] = useState(false);
  const [isVoteFailed, setIsVoteFailed] = useState(false);
  const [failureCopy, setFailureCopy] = useState<ReactNode>('');
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');

  const getVoteErrorMessage = (error: string) => {
    if (RegExp(/voter already voted/).exec(error)) {
      return <Trans>User Already Voted</Trans>;
    }
    return <>{error}</>;
  };

  const handleVoteStateChange = useCallback(
    ({ errorMessage, status }: { errorMessage?: string; status: string }) => {
      switch (status) {
        case 'None':
          setIsLoading(false);
          break;
        case 'Mining':
          setIsLoading(true);
          break;
        case 'Success':
          setIsLoading(false);
          setIsVoteSuccessful(true);
          break;
        case 'Fail':
          setFailureCopy(<Trans>Transaction Failed</Trans>);
          setErrorMessage(errorMessage || <Trans>Please try again.</Trans>);
          setIsLoading(false);
          setIsVoteFailed(true);
          break;
        case 'Exception':
          setFailureCopy(<Trans>Error</Trans>);
          setErrorMessage(
            errorMessage ? getVoteErrorMessage(errorMessage) : <Trans>Please try again.</Trans>,
          );
          setIsLoading(false);
          setIsVoteFailed(true);
          break;
      }
    },
    [],
  );

  // Cast refundable vote transaction state hook
  useEffect(() => {
    handleVoteStateChange(castRefundableVoteState);
  }, [castRefundableVoteState, handleVoteStateChange]);

  // Cast refundable vote with reason transaction state hook
  useEffect(() => {
    handleVoteStateChange(castRefundableVoteWithReasonState);
  }, [castRefundableVoteWithReasonState, handleVoteStateChange]);

  // Auto close the modal after a transaction completes successfully
  // Leave failed transaction up until user closes manually to allow for debugging
  useEffect(() => {
    if (isVoteSucessful) {
      setTimeout(onHide, POST_SUCCESSFUL_VOTE_MODAL_CLOSE_TIME_MS);
    }
  }, [isVoteSucessful, onHide]);

  // If show is false (i.e. on hide) reset failure related state variables
  useEffect(() => {
    if (show) {
      return;
    }
    setIsVoteFailed(false);
  }, [show]);

  const voteModalContent = (
    <>
      <div className={classes.voteModalTitle}>
        <Trans>Vote on Prop {i18n.number(Number(proposalId || '0'))}</Trans>
      </div>
      <div className={classes.voteModalSubtitle}>
        {availableVotes === 1 ? (
          <Trans>
            Voting with <span className={classes.bold}>{i18n.number(availableVotes)}</span> Noun
          </Trans>
        ) : (
          <Trans>
            Voting with <span className={classes.bold}>{i18n.number(availableVotes)}</span> Nouns
          </Trans>
        )}
      </div>
      {isVoteSucessful && (
        <div className={classes.transactionStatus}>
          <p>
            <Trans>
              You&apos;ve successfully voted on on prop {i18n.number(Number(proposalId || '0'))}
            </Trans>
          </p>

          <div className={classes.voteSuccessBody}>
            <Trans>Thank you for voting.</Trans>
          </div>
        </div>
      )}
      {isVoteFailed && (
        <div className={classes.transactionStatus}>
          <p className={classes.voteFailureTitle}>
            <Trans>There was an error voting for your account.</Trans>
          </p>
          <div className={classes.voteFailureBody}>
            {failureCopy}: <span className={classes.voteFailureErrorMessage}>{errorMessage}</span>
          </div>
        </div>
      )}
      {!isVoteFailed && !isVoteSucessful && (
        <div className={clsx(classes.votingButtonsWrapper, isLoading ? classes.disabled : '')}>
          {!isObjectionPeriod && (
            <>
              <div onClick={() => setVote(Vote.FOR)}>
                <NavBarButton
                  buttonText={<Trans>For</Trans>}
                  buttonIcon={<></>}
                  buttonStyle={NavBarButtonStyle.FOR_VOTE_SUBMIT}
                  className={cn(
                    vote === undefined && classes.inactive,
                    vote !== Vote.FOR && classes.unselected,
                  )}
                />
              </div>
              <br />
            </>
          )}
          <div onClick={() => setVote(Vote.AGAINST)}>
            <NavBarButton
              buttonText={<Trans>Against</Trans>}
              buttonIcon={<></>}
              buttonStyle={NavBarButtonStyle.AGAINST_VOTE_SUBMIT}
              className={cn(
                vote === undefined && classes.inactive,
                vote !== Vote.AGAINST && classes.unselected,
              )}
            />
          </div>
          {!isObjectionPeriod && (
            <>
              <br />
              <div onClick={() => setVote(Vote.ABSTAIN)}>
                <NavBarButton
                  buttonText={<Trans>Abstain</Trans>}
                  buttonIcon={<></>}
                  buttonStyle={NavBarButtonStyle.ABSTAIN_VOTE_SUBMIT}
                  className={cn(
                    vote === undefined && classes.inactive,
                    vote !== Vote.ABSTAIN && classes.unselected,
                  )}
                />
              </div>
            </>
          )}
          <br />
          <FloatingLabel controlId="reasonTextarea" label={<Trans>Reason (Optional)</Trans>}>
            <FormControl
              as="textarea"
              placeholder={
                i18n.locale === 'en' ? `Reason for voting ${Vote[vote ?? Vote.FOR]}` : ''
              }
              value={voteReason}
              onChange={e => setVoteReason(e.target.value)}
              className={classes.voteReasonTextarea}
            />
          </FloatingLabel>
          <br />
          <Button
            onClick={async () => {
              if (vote === undefined || !proposalId || isLoading) {
                return;
              }
              setIsLoading(true);
              const isReasonEmpty = voteReason.trim() === '';
              if (isReasonEmpty) {
                castRefundableVote({ args: [BigInt(proposalId), vote] });
              } else {
                castRefundableVoteWithReason({ args: [BigInt(proposalId), vote, voteReason] });
              }
            }}
            className={vote === undefined ? classes.submitBtnDisabled : classes.submitBtn}
          >
            {isLoading ? <Spinner animation="border" /> : <Trans>Submit Vote</Trans>}
          </Button>

          <div className={classes.gasFreeVotingWrapper}>
            <span className={classes.gasFreeVotingCopy}>
              <Trans>Gas spent on voting will be refunded to you.</Trans>
            </span>
          </div>
        </div>
      )}
    </>
  );

  // On modal dismiss, reset non-success state
  const resetNonSuccessStateAndHideModal = () => {
    setIsLoading(false);
    setIsVoteFailed(false);
    setErrorMessage('');
    setFailureCopy('');
    onHide();
  };

  return (
    <>
      <SolidColorBackgroundModal
        show={show}
        onDismiss={resetNonSuccessStateAndHideModal}
        content={voteModalContent}
      />
    </>
  );
};
export default VoteModal;
