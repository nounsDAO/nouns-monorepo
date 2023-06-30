import React, { useState, useCallback, useEffect } from 'react';
import classes from './VoteSignals.module.css';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import VoteSignalGroup from './VoteSignalGroup';
import {
  VoteSignalDetail,
  useProposalFeedback,
  useSendFeedback,
} from '../../wrappers/nounsData';
import { Proposal, ProposalVersion } from '../../wrappers/nounsDao';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import { useAppDispatch } from '../../hooks';
import { useEthers } from '@usedapp/core';
import dayjs from 'dayjs';
import { Spinner } from 'react-bootstrap';

type Props = {
  availableVotes?: number;
  proposal: Proposal;
  proposalVersions?: ProposalVersion[];
};

function VoteSignals(props: Props) {
  const [reasonText, setReasonText] = React.useState('');
  const [support, setSupport] = React.useState<number | undefined>();
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [forFeedback, setForFeedback] = useState<any[]>([]);
  const [againstFeedback, setAgainstFeedback] = useState<any[]>([]);
  const [abstainFeedback, setAbstainFeedback] = useState<any[]>([]);
  const [hasUserVoted, setHasUserVoted] = useState(false);
  const [userVoteSupport, setUserVoteSupport] = useState<VoteSignalDetail>();
  const { sendFeedback, sendFeedbackState } = useSendFeedback();
  const { account } = useEthers();
  const { data } = useProposalFeedback(props.proposal.id ? props.proposal.id : '0');
  const supportText = ['Against', 'For', 'Abstain'];

  useEffect(() => {
    let forIt: VoteSignalDetail[] = [];
    let againstIt: VoteSignalDetail[] = [];
    let abstainIt: VoteSignalDetail[] = [];

    if (data) {
      // get latest version number
      const versionDetails =
        props.proposalVersions && props.proposalVersions[props.proposalVersions.length - 1];
      const versionCreatedTimestamp = versionDetails?.createdAt;
      // filter feedback to this version
      let versionFeedback = data.proposalFeedbacks;
      if (versionCreatedTimestamp) {
        versionFeedback =
          versionCreatedTimestamp &&
          data.proposalFeedbacks.filter(
            (feedback: VoteSignalDetail) => feedback.createdTimestamp >= +versionCreatedTimestamp,
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
  }, [data, props.proposalVersions, account]);

  async function handleFeedbackSubmit(
    proposalId: number,
    supportNum: number,
    reason: string | null,
  ) {
    if (supportNum > 2) {
      return;
    }
    await sendFeedback(proposalId, supportNum, reason);
  }

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);
  useEffect(() => {
    switch (sendFeedbackState.status) {
      case 'None':
        setIsTransactionPending(false);
        break;
      case 'Mining':
        setIsTransactionPending(true);
        break;
      case 'Success':
        setModal({
          title: <Trans>Success</Trans>,
          message: <Trans>Your feedback has been added!</Trans>,
          show: true,
        });
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
        break;
      case 'Exception':
        setModal({
          title: <Trans>Error</Trans>,
          message: sendFeedbackState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setIsTransactionPending(false);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendFeedbackState, setModal]);

  return (
    <>
      {props.proposal.id && (
        <div className={classes.voteSignals}>
          <div className={classes.header}>
            <h2>
              <Trans>Pre-voting feedback</Trans>
            </h2>
            <p>
              <Trans>
                Nouns voters can cast voting signals to give proposers of pending proposals an idea of
                how they intend to vote and helpful guidance on proposal changes to change their vote.
              </Trans>
            </p>
          </div>
          <div className={classes.wrapper}>
            {!data ? (
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
                {props.availableVotes !== undefined && props.availableVotes > 0 && (
                  <div className={clsx(classes.feedbackForm, userVoteSupport && classes.voted)}>
                    {!hasUserVoted ? (
                      <>
                        <p>Add your feedback</p>
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
                            onClick={() => setSupport(2)}
                          >
                            Abstain
                          </button>
                        </div>
                        {/* {(isTransactionPending || hasUserVoted) && ( */}
                        <>
                          <input
                            type="text"
                            className={classes.reasonInput}
                            placeholder="Optional reason"
                            value={reasonText}
                            disabled={isTransactionPending}
                            onChange={event => setReasonText(event.target.value)}
                          />

                          <button
                            className={clsx(classes.button, classes.submit)}
                            disabled={support === undefined || isTransactionPending}
                            onClick={() =>
                              props.proposal.id &&
                              support !== undefined &&
                              handleFeedbackSubmit(+props.proposal.id, support, reasonText)
                            }
                          >
                            Submit
                          </button>
                        </>
                        {/* )} */}
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
