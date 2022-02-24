import { Button, Modal, Spinner } from 'react-bootstrap';
import classes from './VoteModal.module.css';
import { useCastVote, Vote } from '../../wrappers/nounsDao';
import React, { useCallback, useEffect, useState } from 'react';
import { TransactionStatus } from '@usedapp/core';
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

  return (
    <Modal show={show} onHide={onHide} dialogClassName={classes.voteModal} centered>
      <Modal.Header closeButton className={classes.header}>
        <Modal.Title className={classes.propTitle}>Vote on Prop {proposalId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isVoteSucessful && (
          <div className={classes.transactionStatus}>
            <h1
              style={{
                fontFamily: 'Londrina Solid',
                fontSize: '56px',
                marginTop: '1.15rem',
              }}
            >
              Success!
            </h1>

            <div style={{ marginTop: '1rem' }}>Thank you for voting.</div>
          </div>
        )}
        {isVoteFailed && (
          <div className={classes.transactionStatus}>
            <h1
              style={{
                fontFamily: 'Londrina Solid',
                fontSize: '56px',
                marginTop: '0.25rem',
                width: '100%',
              }}
            >
              Well this is awkward
            </h1>
            <div style={{ marginTop: '1rem', fontWeight: 'normal' }}>
              {failureCopy}:{' '}
              <span style={{ fontWeight: 'bold', color: 'var(--brand-color-red)' }}>
                {errorMessage}
              </span>
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
      </Modal.Body>
    </Modal>
  );
};
export default VoteModal;
