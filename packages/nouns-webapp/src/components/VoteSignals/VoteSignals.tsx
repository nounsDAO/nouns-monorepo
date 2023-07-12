import React, { useState, useCallback, useEffect } from 'react';
import classes from './VoteSignals.module.css';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import VoteSignalGroup from './VoteSignalGroup';
import {
  VoteSignalDetail,
  useSendFeedback,
} from '../../wrappers/nounsData';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import { useAppDispatch } from '../../hooks';
import { useEthers } from '@usedapp/core';
import dayjs from 'dayjs';
import { Spinner } from 'react-bootstrap';

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
  const { sendFeedback, sendFeedbackState } = useSendFeedback(props.isCandidate === true ? 'candidate' : 'proposal');
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

  return (
    <>
      {props.proposalId && (
        <div className={classes.voteSignals}>
          <div className={classes.header}>
            <h2>
              <Trans>Pre-voting feedback</Trans>
            </h2>
            {/* <p>
              <Trans>
                Nouns voters can cast voting signals to give proposers of pending proposals an idea of
                how they intend to vote and helpful guidance on proposal changes to change their vote.
              </Trans>
            </p> */}
          </div>
          <div className={classes.wrapper}>
            {!props.feedback ? (
              <div className={classes.spinner}>
                <Spinner animation="border" />
              </div>
            ) : (
              <>
                <div className={classes.voteSignalGroupsList}>
                  <VoteSignalGroup voteSignals={forFeedback} support={1} />
                  <VoteSignalGroup voteSignals={againstFeedback} support={0} />
                  <VoteSignalGroup voteSignals={abstainFeedback} support={2} />
                </div>
                {props.userVotes !== undefined && props.userVotes > 0 && (
                  <div className={clsx(classes.feedbackForm, userVoteSupport && classes.voted)}>
                    {!hasUserVoted ? (
                      <>
                        <p>Add your feedback</p>

                        {(isTransactionWaiting || isTransactionPending) ? (
                          <img src="/loading-noggles.svg" alt="loading" className={classes.loadingNoggles} />
                        ) : (
                          <>
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
                                onClick={() => setSupport(1)}
                              >
                                For
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
                                onClick={() => setSupport(0)}
                              >
                                Against
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
                                onClick={() => setSupport(2)}
                              >
                                Abstain
                              </button>
                            </div>
                            <>
                              <input
                                type="text"
                                className={classes.reasonInput}
                                placeholder="Optional reason"
                                value={reasonText}
                                disabled={isTransactionPending || isTransactionWaiting}
                                onChange={event => setReasonText(event.target.value)}
                              />
                              <button
                                className={clsx(classes.button, classes.submit)}
                                disabled={support === undefined || isTransactionPending || isTransactionWaiting}
                                onClick={() => {
                                  setIsTransactionWaiting(true);
                                  props.proposalId &&
                                    support !== undefined &&
                                    handleFeedbackSubmit(+props.proposalId, support, reasonText, props.candidateSlug, props.proposer)
                                }
                                }
                              >
                                Submit
                              </button>


                            </>
                          </>
                        )}
                      </>
                    ) : (
                      <div className={classes.voted}>
                        <p>
                          <Trans>You provided{' '}
                            <span
                              className={clsx(
                                userVoteSupport?.supportDetailed === 1 && classes.forText,
                                userVoteSupport?.supportDetailed === 0 && classes.againstText,
                                userVoteSupport?.supportDetailed === 2 && classes.abstainText,
                              )}
                            >
                              {userVoteSupport &&
                                supportText[userVoteSupport.supportDetailed].toLowerCase()}
                            </span>{' '}
                            feedback{' '}
                            {userVoteSupport?.createdTimestamp &&
                              dayjs(userVoteSupport?.createdTimestamp * 1000).fromNow()}
                          </Trans>
                        </p>
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
        </div>
      )}
    </>
  );
}

export default VoteSignals;
