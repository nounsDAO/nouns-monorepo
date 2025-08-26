import { ReactNode, useCallback, useEffect, useState } from 'react';

import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';
import { Button, FloatingLabel, FormControl, Spinner } from 'react-bootstrap';

import NavBarButton, { NavBarButtonStyle } from '@/components/nav-bar-button';
import SolidColorBackgroundModal from '@/components/solid-color-background-modal';
import { cn } from '@/lib/utils';
import { useCastRefundableVote, useCastRefundableVoteWithReason, Vote } from '@/wrappers/nouns-dao';

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
      <div className="font-londrina text-center text-4xl">
        <Trans>Vote on Prop {i18n.number(Number(proposalId || '0'))}</Trans>
      </div>
      <div className="mb-4 text-center text-lg font-medium">
        {availableVotes === 1 ? (
          <Trans>
            Voting with <span className="font-bold">{i18n.number(availableVotes)}</span> Noun
          </Trans>
        ) : (
          <Trans>
            Voting with <span className="font-bold">{i18n.number(availableVotes)}</span> Nouns
          </Trans>
        )}
      </div>
      {isVoteSucessful && (
        <div className="font-pt mb-8 text-center text-lg font-bold">
          <p>
            <Trans>
              You&apos;ve successfully voted on on prop {i18n.number(Number(proposalId || '0'))}
            </Trans>
          </p>

          <div className="mt-4">
            <Trans>Thank you for voting.</Trans>
          </div>
        </div>
      )}
      {isVoteFailed && (
        <div className="font-pt mb-8 text-center text-lg font-bold">
          <p className="w-full font-normal">
            <Trans>There was an error voting for your account.</Trans>
          </p>
          <div className="mt-4 font-bold">
            {failureCopy}: <span className="text-brand-color-red font-bold">{errorMessage}</span>
          </div>
        </div>
      )}
      {!isVoteFailed && !isVoteSucessful && (
        <div
          className={cn('transition-all duration-150 ease-in-out', isLoading ? 'opacity-50' : '')}
        >
          {isObjectionPeriod === false && (
            <>
              <div onClick={() => setVote(Vote.FOR)}>
                <NavBarButton
                  buttonText={<Trans>For</Trans>}
                  buttonIcon={<></>}
                  buttonStyle={NavBarButtonStyle.FOR_VOTE_SUBMIT}
                  className={cn(
                    vote === undefined && '!scale-95',
                    vote !== Vote.FOR && 'scale-90 opacity-50',
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
                vote === undefined && '!scale-95',
                vote !== Vote.AGAINST && 'scale-90 opacity-50',
              )}
            />
          </div>
          {isObjectionPeriod === false && (
            <>
              <br />
              <div onClick={() => setVote(Vote.ABSTAIN)}>
                <NavBarButton
                  buttonText={<Trans>Abstain</Trans>}
                  buttonIcon={<></>}
                  buttonStyle={NavBarButtonStyle.ABSTAIN_VOTE_SUBMIT}
                  className={cn(
                    vote === undefined && '!scale-95',
                    vote !== Vote.ABSTAIN && 'scale-90 opacity-50',
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
              className="!h-26 rounded-10 border border-black/10 !pt-8 text-base font-bold focus:!border-black/25 focus:shadow-none"
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
            className={
              vote === undefined
                ? '!bg-brand-gray-light-text border-brand-gray-light-text h-10 w-full min-w-32 rounded-xl border font-bold opacity-50 !shadow-none hover:cursor-not-allowed hover:!text-white focus:!text-white'
                : '!border-brand-color-green !bg-brand-color-green hover:!bg-brand-color-green focus:!bg-brand-color-green focus:!border-brand-color-green focus:ring-brand-color-green-translucent active:!bg-brand-color-green h-10 w-full min-w-32 rounded-xl !border font-bold !text-white focus:ring-4'
            }
          >
            {isLoading ? <Spinner animation="border" /> : <Trans>Submit Vote</Trans>}
          </Button>

          <div className="mt-2 flex w-full justify-center">
            <span className="font-pt text-brand-gray-light-text w-fit text-center text-sm opacity-75">
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
