import React, { useCallback, useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { FormControl, Spinner } from 'react-bootstrap';

import { useAppDispatch } from '@/hooks';
import { AlertModal, setAlertModal } from '@/state/slices/application';
import { useSendFeedback, VoteSignalDetail } from '@/wrappers/nounsData';

import VoteSignalGroup from './VoteSignalGroup';
import classes from './VoteSignals.module.css';
import { useAccount } from 'wagmi';

type VoteSignalsProps = {
  proposalId?: string;
  proposer?: string;
  versionTimestamp: bigint;
  feedback?: VoteSignalDetail[];
  userVotes?: number;
  isCandidate?: boolean;
  candidateSlug?: string;
  setDataFetchPollInterval: (interval: number) => void;
  handleRefetch: () => void;
  isFeedbackClosed?: boolean;
};

function VoteSignals({
  candidateSlug,
  feedback: feedbackList,
  handleRefetch,
  isCandidate,
  isFeedbackClosed,
  proposalId,
  proposer,
  setDataFetchPollInterval,
  userVotes,
  versionTimestamp,
}: Readonly<VoteSignalsProps>) {
  const [reasonText, setReasonText] = React.useState('');
  const [support, setSupport] = React.useState<number | undefined>();
  const [isTransactionWaiting, setIsTransactionWaiting] = useState(false);
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [forFeedback, setForFeedback] = useState<VoteSignalDetail[]>([]);
  const [againstFeedback, setAgainstFeedback] = useState<VoteSignalDetail[]>([]);
  const [abstainFeedback, setAbstainFeedback] = useState<VoteSignalDetail[]>([]);
  const [hasUserVoted, setHasUserVoted] = useState(false);
  const [userVoteSupport, setUserVoteSupport] = useState<VoteSignalDetail>();
  const [expandedGroup, setExpandedGroup] = useState<number | undefined>(undefined);

  const {
    sendProposalFeedback,
    sendProposalFeedbackState,
    sendCandidateFeedback,
    sendCandidateFeedbackState,
  } = useSendFeedback();

  const { address: account } = useAccount();
  const supportText = ['Against', 'For', 'Abstain'];

  useEffect(() => {
    const forIt: VoteSignalDetail[] = [];
    const againstIt: VoteSignalDetail[] = [];
    const abstainIt: VoteSignalDetail[] = [];

    if (feedbackList) {
      // filter feedback to this version
      if (versionTimestamp) {
        feedbackList = feedbackList.filter(
          (feedback: VoteSignalDetail) => feedback.createdTimestamp >= versionTimestamp,
        );
      }
      // sort feedback
      feedbackList.forEach((feedback: VoteSignalDetail) => {
        if (feedback.supportDetailed === 1) {
          forIt.push(feedback);
        }
        if (feedback.supportDetailed === 0) {
          againstIt.push(feedback);
        }
        if (feedback.supportDetailed === 2) {
          abstainIt.push(feedback);
        }
      });
      setForFeedback(forIt);
      setAgainstFeedback(againstIt);
      setAbstainFeedback(abstainIt);

      // check if user has voted for this proposal or version
      feedbackList.forEach((feedback: VoteSignalDetail) => {
        if (account && account.toUpperCase() === feedback.voter.id.toUpperCase()) {
          setHasUserVoted(true);
          setUserVoteSupport(feedback);
        }
      });
    }
  }, [feedbackList, versionTimestamp, account]);

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
    if (isCandidate === true && candidateSlug && proposer) {
      await sendCandidateFeedback({
        args: [proposer as `0x${string}`, candidateSlug, supportNum, reason || ''],
      });
    } else {
      await sendProposalFeedback({ args: [BigInt(proposalId), supportNum, reason || ''] });
    }
  }

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);
  useEffect(() => {
    const status =
      isCandidate === true ? sendCandidateFeedbackState?.status : sendProposalFeedbackState?.status;
    const errorMessage =
      isCandidate === true
        ? sendCandidateFeedbackState?.errorMessage
        : sendProposalFeedbackState?.errorMessage;

    if (status === 'None') {
      setIsTransactionPending(false);
    } else if (status === 'PendingSignature') {
      setIsTransactionWaiting(true);
    } else if (status === 'Mining') {
      setIsTransactionWaiting(false);
      setIsTransactionPending(true);
      setDataFetchPollInterval(50);
    } else if (status === 'Success') {
      // don't show modal. update feedback
      handleRefetch();
      setIsTransactionPending(false);
      setHasUserVoted(true);
      setExpandedGroup(support);
    } else if (status === 'Fail') {
      setModal({
        title: <Trans>Transaction Failed</Trans>,
        message: errorMessage || <Trans>Please try again.</Trans>,
        show: true,
      });
      setIsTransactionPending(false);
      setIsTransactionWaiting(false);
      setDataFetchPollInterval(0);
    } else if (status === 'Exception') {
      setModal({
        title: <Trans>Error</Trans>,
        message: errorMessage || <Trans>Please try again.</Trans>,
        show: true,
      });
      setIsTransactionPending(false);
      setIsTransactionWaiting(false);
      setDataFetchPollInterval(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendCandidateFeedbackState, sendProposalFeedbackState, setModal]);

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
  const title = isCandidate ? (
    <Trans>Pre-proposal feedback</Trans>
  ) : (
    <Trans>Pre-voting feedback</Trans>
  );

  return (
    <>
      {proposalId && (
        <div className={clsx(classes.voteSignals, isCandidate && classes.isCandidate)}>
          <div className={classes.header}>
            <h2>{title}</h2>
            {!isCandidate && (
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
            {!feedbackList ? (
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
                {!isFeedbackClosed && userVotes !== undefined && userVotes > 0 && (
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
                                  if (support === 2) {
                                    setSupport(undefined);
                                  } else {
                                    setSupport(2);
                                  }
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
                                  if (proposalId && support !== undefined) {
                                    handleFeedbackSubmit(
                                      +proposalId,
                                      support,
                                      reasonText,
                                      candidateSlug,
                                      proposer,
                                    );
                                  }
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
          {isCandidate && (
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
