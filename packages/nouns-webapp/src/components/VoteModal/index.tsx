import { Button, Modal, Spinner, Image } from 'react-bootstrap';
import classes from './VoteModal.module.css';
import { useCastVote, Vote } from '../../wrappers/nounsDao';
import React, { useCallback, useEffect, useState } from 'react';
import { TransactionStatus } from '@usedapp/core';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import _glasses from '../../assets/glasses.svg';
import clsx from 'clsx';

interface VoteModalProps {
  show: boolean;
  onHide: () => void;
  proposalId: string | undefined;
  availableVotes: number;
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

const VoteModal = ({ show, onHide, proposalId, availableVotes }: VoteModalProps) => {
  const { castVote, castVoteState } = useCastVote();
  const [vote, setVote] = useState<Vote>();
  const [transactionStateCopy, setTransactionStateCopy] = useState('');
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

  const onTransactionStateChange = useCallback(
    (
      tx: TransactionStatus,
      successMessage?: string,
      setPending?: (isPending: boolean) => void,
      getErrorMessage?: (error?: string) => string | undefined,
      onFinalState?: () => void,
    ) => {
      switch (tx.status) {
        case 'None':
          setPending?.(false);
          break;
        case 'Mining':
          setPending?.(true);
          break;
        case 'Success':
          setPending?.(false);
          onFinalState?.();
          break;
        case 'Fail':
          setFailureCopy('Transaction Failed');
          setErrorMessage(tx?.errorMessage || 'Please try again.');
          setPending?.(false);
          onFinalState?.();
          break;
        case 'Exception':
          setFailureCopy('Error');
          setErrorMessage(getErrorMessage?.(tx?.errorMessage) || 'Please try again.');
          setPending?.(false);
          onFinalState?.();
          break;
      }
    },
    [failureCopy, errorMessage],
  );

  useEffect(
    () =>
      onTransactionStateChange(
        castVoteState,
        'Vote Successful!',
        setIsLoading,
        getVoteErrorMessage,
        // TODO make this a set timeout to close out the modal after k seconds
        () => {
          console.log('hello');
        },
      ),
    [castVoteState, onTransactionStateChange],
  );

  // TODO just for testing
  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
        setIsVoteSuccessful(true);
        // setIsVoteFailed(true);
      }, 2000);
    }
    if (isVoteSucessful) {
      setTimeout(() => {
        onHide();
      }, 3000);
    }
  });

  return (
    <Modal show={show} onHide={onHide} dialogClassName={classes.voteModal} centered>
      <Modal.Header closeButton className={classes.header}>
        <Modal.Title className={classes.propTitle}>Vote on Prop {proposalId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isVoteSucessful && (
          <div className={classes.transactionStatus}>
            <div className="d-flex flex-row justify-content-center">
              <div style={{}}>
                <Image src={_glasses} width={200} />
              </div>
              <h1
                style={{
                  fontFamily: 'Londrina Solid',
                  fontSize: '56px',
                  marginLeft: '1rem',
                  marginTop: '0.25rem',
                }}
              >
                Success!
              </h1>
            </div>

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
