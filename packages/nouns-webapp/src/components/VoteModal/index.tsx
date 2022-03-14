import { Button, Spinner } from 'react-bootstrap';
import Modal from '../Modal';
import classes from './VoteModal.module.css';
import { useCastVote, Vote } from '../../wrappers/nounsDao';
import React, { useEffect, useState } from 'react';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import clsx from 'clsx';

interface VoteModalProps {
  show: boolean;
  onHide: () => void;
  proposalId: string | undefined;
  availableVotes: number;
}

const POST_SUCESSFUL_VOTE_MODAL_CLOSE_TIME_MS = 3000;

const VoteModal = ({ show, onHide, proposalId, availableVotes }: VoteModalProps) => {
  const { castVote, castVoteState } = useCastVote();
  const [vote, setVote] = useState<Vote>();
  const [isLoading, setIsLoading] = useState(false);
  const [isVoteSucessful, setIsVoteSuccessful] = useState(false);
  const [isVoteFailed, setIsVoteFailed] = useState(false);
  const [failureCopy, setFailureCopy] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const getVoteErrorMessage = (error: string | undefined) => {
    if (error?.match(/voter already voted/)) {
      return 'User Already Voted';
    }
    return error;
  };

  // Cast vote transaction state hook
  useEffect(() => {
    switch (castVoteState.status) {
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
        setFailureCopy('Transaction Failed');
        setErrorMessage(castVoteState?.errorMessage || 'Please try again.');
        setIsLoading(false);
        setIsVoteFailed(true);
        break;
      case 'Exception':
        setFailureCopy('Error');
        setErrorMessage(getVoteErrorMessage(castVoteState?.errorMessage) || 'Please try again.');
        setIsLoading(false);
        setIsVoteFailed(true);
        break;
    }
  }, [castVoteState]);

  // Auto close the modal after a transaction completes succesfully
  // Leave failed transaction up until user closes manually to allow for debugging
  useEffect(() => {
    if (isVoteSucessful) {
      setTimeout(onHide, POST_SUCESSFUL_VOTE_MODAL_CLOSE_TIME_MS);
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
      {isVoteSucessful && (
        <div className={classes.transactionStatus}>
          <p>You've successfully voted on on prop {proposalId}</p>

          <div className={classes.voteSuccessBody}>Thank you for voting.</div>
        </div>
      )}
      {isVoteFailed && (
        <div className={classes.transactionStatus}>
          <p className={classes.voteFailureTitle}>There was an error voting for your account.</p>
          <div className={classes.voteFailureBody}>
            {failureCopy}: <span className={classes.voteFailureErrorMessage}>{errorMessage}</span>
          </div>
        </div>
      )}
      {!isVoteFailed && !isVoteSucessful && (
        <div className={clsx(classes.votingButtonsWrapper, isLoading ? classes.disabled : '')}>
          <div onClick={() => setVote(Vote.FOR)}>
            <NavBarButton
              buttonText={`Cast ${availableVotes} ${
                availableVotes > 1 ? 'votes' : 'vote'
              } for Prop ${proposalId} `}
              buttonIcon={<></>}
              buttonStyle={
                vote === Vote.FOR
                  ? NavBarButtonStyle.WHITE_ACTIVE_VOTE_SUBMIT
                  : NavBarButtonStyle.WHITE_INFO
              }
            />
          </div>
          <br />
          <div onClick={() => setVote(Vote.AGAINST)}>
            <NavBarButton
              buttonText={`Cast ${availableVotes} ${
                availableVotes > 1 ? 'votes' : 'vote'
              } against Prop ${proposalId} `}
              buttonIcon={<></>}
              buttonStyle={
                vote === Vote.AGAINST
                  ? NavBarButtonStyle.WHITE_ACTIVE_VOTE_SUBMIT
                  : NavBarButtonStyle.WHITE_INFO
              }
            />
          </div>
          <br />
          <div onClick={() => setVote(Vote.ABSTAIN)}>
            <NavBarButton
              buttonText={`Abstain from voting on Prop ${proposalId} `}
              buttonIcon={<></>}
              buttonStyle={
                vote === Vote.ABSTAIN
                  ? NavBarButtonStyle.WHITE_ACTIVE_VOTE_SUBMIT
                  : NavBarButtonStyle.WHITE_INFO
              }
            />
          </div>
          <br />
          <Button
            onClick={
              vote === undefined
                ? () => {}
                : () => {
                    setIsLoading(true);
                    castVote(proposalId, vote);
                  }
            }
            className={vote === undefined ? classes.submitBtnDisabled : classes.submitBtn}
          >
            {isLoading ? <Spinner animation="border" /> : 'Submit Vote'}
          </Button>
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
      {show && (
        <Modal
          onDismiss={resetNonSuccessStateAndHideModal}
          title={`Vote on Prop ${proposalId}`}
          content={voteModalContent}
        />
      )}
    </>
  );
};
export default VoteModal;
