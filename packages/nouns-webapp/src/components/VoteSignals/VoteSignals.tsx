import React, { useState, useCallback, useEffect } from 'react';
import classes from './VoteSignals.module.css';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import VoteSignalGroup from './VoteSignalGroup';
import { VoteSignalDetail, useSendFeedback } from '../../wrappers/nounsData';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import { useAppDispatch } from '../../hooks';
import { useEthers } from '@usedapp/core';
import dayjs from 'dayjs';
import { FormControl, Spinner } from 'react-bootstrap';

type Props = {
  proposalId?: string;
  proposer?: string;
  versionTimestamp: number;
  feedback?: VoteSignalDetail[];
  userVotes?: number;
  isCandidate?: boolean;
  candidateSlug?: string;
  setDataFetchPollInterval: (interval: number) => void;
  handleRefetch: Function;
  isFeedbackClosed?: boolean;
};

function VoteSignals(props: Props) {
  const [reasonText, setReasonText] = React.useState('');
  const [support, setSupport] = React.useState<number | undefined>();
  const [isTransactionWaiting, setIsTransactionWaiting] = useState(false);
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [forFeedback, setForFeedback] = useState<any[]>([]);
  const [againstFeedback, setAgainstFeedback] = useState<any[]>([]);
  const [abstainFeedback, setAbstainFeedback] = useState<any[]>([]);
  const [hasUserVoted, setHasUserVoted] = useState(false);
  const [userVoteSupport, setUserVoteSupport] = useState<VoteSignalDetail>();
  const [expandedGroup, setExpandedGroup] = useState<number | undefined>(undefined);
  const { sendFeedback, sendFeedbackState } = useSendFeedback(
    props.isCandidate === true ? 'candidate' : 'proposal',
  );
  const { account } = useEthers();
  const supportText = ['Against', 'For', 'Abstain'];

  useEffect(() => {
    let forIt: VoteSignalDetail[] = [];
    let againstIt: VoteSignalDetail[] = [];
    let abstainIt: VoteSignalDetail[] = [];

    if (props.feedback) {
      // filter feedback to this version
      let versionFeedback = props.feedback;
      if (props.versionTimestamp) {
        versionFeedback = props.feedback.filter(
          (feedback: VoteSignalDetail) => feedback.createdTimestamp >= +props.versionTimestamp,
        );
      }
      // sort feedback
      versionFeedback.map((feedback: VoteSignalDetail) => {
        if (feedback.supportDetailed === 1) {
          forIt.push(feedback);
        }
        if (feedback.supportDetailed === 0) {
          againstIt.push(feedback);
        }
        if (feedback.supportDetailed === 2) {
          abstainIt.push(feedback);
        }
        return feedback;
      });
      setForFeedback(forIt);
      setAgainstFeedback(againstIt);
      setAbstainFeedback(abstainIt);

      // check if user has voted for this proposal or version
      versionFeedback.map((feedback: any) => {
        if (account && account.toUpperCase() === feedback.voter.id.toUpperCase()) {
          setHasUserVoted(true);
          setUserVoteSupport(feedback);
        }
        return feedback;
      });
    }
  }, [props.feedback, props.versionTimestamp, account]);

  async function handleFeedbackSubmit(
    proposalId: number,
    supportNum: number,
    reason: string | null,
    candidateSlug?: string,
    proposer?: string,
  ) {
    if (supportNum > 2) {
      return;
    }
    if (props.isCandidate === true && candidateSlug && proposer) {
      await sendFeedback(proposer, candidateSlug, supportNum, reason);
    } else {
      await sendFeedback(proposalId, supportNum, reason);
    }
  }

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);
  useEffect(() => {
    switch (sendFeedbackState.status) {
      case 'None':
        setIsTransactionPending(false);
        break;
      case 'PendingSignature':
        setIsTransactionWaiting(true);
        break;
      case 'Mining':
        setIsTransactionWaiting(false);
        setIsTransactionPending(true);
        props.setDataFetchPollInterval(50);
        break;
      case 'Success':
        // don't show modal. just update feedback
        props.handleRefetch();
        setIsTransactionPending(false);
        setHasUserVoted(true);
        setExpandedGroup(support);
        break;
      case 'Fail':
        setModal({
          title: <Trans>Transaction Failed</Trans>,
          message: sendFeedbackState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setIsTransactionPending(false);
        setIsTransactionWaiting(false);
        props.setDataFetchPollInterval(0);
        break;
      case 'Exception':
        setModal({
          title: <Trans>Error</Trans>,
          message: sendFeedbackState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setIsTransactionPending(false);
        setIsTransactionWaiting(false);
        props.setDataFetchPollInterval(0);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendFeedbackState, setModal]);

  const userFeedbackAdded = (
    <Trans>
      You provided{' '}
      <span
        className={clsx(
          userVoteSupport?.supportDetailed === 1 && classes.forText,
          userVoteSupport?.supportDetailed === 0 && classes.againstText,
          userVoteSupport?.supportDetailed === 2 && classes.abstainText,
        )}
      >
        {userVoteSupport && supportText[userVoteSupport.supportDetailed].toLowerCase()}
      </span>{' '}
      feedback{' '}
      {userVoteSupport?.createdTimestamp &&
        dayjs(userVoteSupport?.createdTimestamp * 1000).fromNow()}
    </Trans>
  );
  const title = (
    <Trans>{props.isCandidate ? 'Pre-proposal feedback' : 'Pre-voting feedback'}</Trans>
  );

  return (
    <>
      {props.proposalId && (
        <div className={clsx(classes.voteSignals, props.isCandidate && classes.isCandidate)}>
          <div className={classes.header}>
            <h2>{title}</h2>
            {!props.isCandidate && (
              <p>
                <Trans>
                  Nouns voters can cast voting signals to give proposers of pending proposals an
                  idea of how they intend to vote and helpful guidance on proposal changes to change
                  their vote.
                </Trans>
              </p>
            )}
          </div>
          <div className={classes.wrapper}>
            {!props.feedback ? (
              <div className={classes.spinner}>
                <Spinner animation="border" />
              </div>
            ) : (
              <>
                <div className={classes.voteSignalGroupsList}>
                  <VoteSignalGroup
                    voteSignals={forFeedback}
                    support={1}
                    isExpanded={expandedGroup === 1}
                  />
                  <VoteSignalGroup
                    voteSignals={againstFeedback}
                    support={0}
                    isExpanded={expandedGroup === 0}
                  />
                  <VoteSignalGroup
                    voteSignals={abstainFeedback}
                    support={2}
                    isExpanded={expandedGroup === 2}
                  />
                </div>
                {!props.isFeedbackClosed && props.userVotes !== undefined && props.userVotes > 0 && (
                  <div className={clsx(classes.feedbackForm, userVoteSupport && classes.voted)}>
                    {!hasUserVoted ? (
                      <>
                        {isTransactionWaiting || isTransactionPending ? (
                          <>
                            <p>
                              <Trans>Adding your feedback</Trans>
                            </p>
                            <img
                              src="/loading-noggles.svg"
                              alt="loading"
                              className={classes.loadingNoggles}
                            />
                          </>
                        ) : (
                          <>
                            <p>
                              <Trans>Add your feedback</Trans>
                            </p>
                            <div className={classes.buttons}>
                              <button
                                className={clsx(
                                  classes.button,
                                  classes.for,
                                  support === undefined && classes.noSupportSelected,
                                  support && support === 1
                                    ? classes.selectedSupport
                                    : classes.unselectedSupport,
                                )}
                                disabled={isTransactionPending || isTransactionWaiting}
                                onClick={() =>
                                  support === 1 ? setSupport(undefined) : setSupport(1)
                                }
                              >
                                <Trans>For</Trans>
                              </button>
                              <button
                                className={clsx(
                                  classes.button,
                                  classes.against,
                                  support === undefined && classes.noSupportSelected,
                                  support !== undefined && support === 0
                                    ? classes.selectedSupport
                                    : classes.unselectedSupport,
                                )}
                                disabled={isTransactionPending || isTransactionWaiting}
                                onClick={() =>
                                  support === 0 ? setSupport(undefined) : setSupport(0)
                                }
                              >
                                <Trans>Against</Trans>
                              </button>
                              <button
                                className={clsx(
                                  classes.button,
                                  classes.abstain,
                                  support === undefined && classes.noSupportSelected,
                                  support && support === 2
                                    ? classes.selectedSupport
                                    : classes.unselectedSupport,
                                )}
                                disabled={isTransactionPending || isTransactionWaiting}
                                onClick={() => {
                                  support === 2 ? setSupport(undefined) : setSupport(2);
                                }}
                              >
                                <Trans>Abstain</Trans>
                              </button>
                            </div>
                            <>
                              <FormControl
                                className={classes.reasonInput}
                                placeholder="Optional reason"
                                value={reasonText}
                                disabled={isTransactionPending || isTransactionWaiting}
                                onChange={event => setReasonText(event.target.value)}
                                as="textarea"
                              />
                              <button
                                className={clsx(classes.button, classes.submit)}
                                disabled={
                                  support === undefined ||
                                  isTransactionPending ||
                                  isTransactionWaiting
                                }
                                onClick={() => {
                                  setIsTransactionWaiting(true);
                                  props.proposalId &&
                                    support !== undefined &&
                                    handleFeedbackSubmit(
                                      +props.proposalId,
                                      support,
                                      reasonText,
                                      props.candidateSlug,
                                      props.proposer,
                                    );
                                }}
                              >
                                <Trans>Submit</Trans>
                              </button>
                            </>
                          </>
                        )}
                      </>
                    ) : (
                      <div className={classes.voted}>
                        <p>{userFeedbackAdded}</p>
                        {userVoteSupport?.reason && (
                          <div className={classes.userVotedReason}>
                            <p>&ldquo;{userVoteSupport.reason}&rdquo;</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          {props.isCandidate && (
            <p className={classes.descriptionBelow}>
              <Trans>
                Nouns voters can cast voting signals to give proposers of pending proposals an idea
                of how they intend to vote and helpful guidance on proposal changes to change their
                vote.
              </Trans>
            </p>
          )}
        </div>
      )}
    </>
  );
}

export default VoteSignals;
