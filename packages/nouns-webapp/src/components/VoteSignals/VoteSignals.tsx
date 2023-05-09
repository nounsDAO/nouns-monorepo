import React, { useState, useCallback, useEffect } from 'react';
import classes from './VoteSignals.module.css';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import VoteSignalGroup from './VoteSignalGroup';
import {
  VoteSignalDetail,
  useAddSignature,
  useProposalFeedback,
  useSendFeedback,
} from '../../wrappers/nounsData';
import { Proposal, ProposalVersion, useCancelSignature } from '../../wrappers/nounsDao';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import { useAppDispatch } from '../../hooks';
import { useEthers } from '@usedapp/core';
import dayjs from 'dayjs';

type Props = {
  availableVotes?: number;
  proposal: Proposal;
  proposalVersions?: ProposalVersion[];
};

const tempVoteSignalsFor = [
  {
    address: '0x1234',
    voteCount: 3,
    support: 1,
    reason: "I'm voting for this proposal because I like it.",
  },
  {
    address: '0xXYZZ',
    voteCount: 1,
    support: 1,
    reason:
      'Maecenas faucibus mollis interdum. Donec id elit non mi porta gravida at eget metus. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.',
  },
  {
    address: '0xBCA',
    voteCount: 1,
    support: 1,
    reason: '',
  },
];
const tempVoteSignalsAgainst = [
  {
    address: '0x1234',
    voteCount: 6,
    support: 0,
    reason: "I'm voting against this proposal because I don't like it.",
  },
  {
    address: '0xABC',
    voteCount: 1,
    support: 0,
    reason: '',
  },
];

const tempVoteSignalsAbstain: any[] = [];

// const VoteSignals = (props: Props) => {
function VoteSignals(props: Props) {
  const supportText = ['Against', 'For', 'Abstain'];
  const [reasonText, setReasonText] = React.useState('');
  const [support, setSupport] = React.useState<number | undefined>();
  const { sendFeedback, sendFeedbackState } = useSendFeedback();
  const { account } = useEthers();
  const proposalId = props.proposal.id ? +props.proposal.id : 0;
  const { loading, error, data } = useProposalFeedback(props.proposal.id ? props.proposal.id : '0');
  const [isTransactionPending, setIsTransactionPending] = useState(false);

  const [forFeedback, setForFeedback] = useState<any[]>([]);
  const [againstFeedback, setAgainstFeedback] = useState<any[]>([]);
  const [abstainFeedback, setAbstainFeedback] = useState<any[]>([]);
  const [hasUserVoted, setHasUserVoted] = useState(false);
  const [userVoteSupport, setUserVoteSupport] = useState<VoteSignalDetail>();
  useEffect(() => {
    if (data) {
      // get latest version number
      // const versionNumber = props.proposalVersions[props.proposalVersions.length - 1].versionNumber;
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
          setForFeedback(prevState => [...prevState, feedback]);
        }
        if (feedback.supportDetailed === 0) {
          setAgainstFeedback(prevState => [...prevState, feedback]);
        }
        if (feedback.supportDetailed === 2) {
          setAbstainFeedback(prevState => [...prevState, feedback]);
        }
      });

      // check if user has voted for this proposal or version
      versionFeedback.map((feedback: any) => {
        if (account && account.toUpperCase() === feedback.voter.id.toUpperCase()) {
          setHasUserVoted(true);
          setUserVoteSupport(feedback);
        }
      });
    }
  }, [data]);

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
          message: <Trans>Proposal Created!</Trans>,
          show: true,
        });
        setIsTransactionPending(false);
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
              Nouns voters can cast voting signals to give proposers of pending proposals an idea of
              how they intend to vote and helpful guidance on proposal changes to change their vote.
            </p>
          </div>
          <div className={classes.wrapper}>
            <div className={classes.voteSignalGroupsList}>
              <VoteSignalGroup voteSignals={forFeedback} support={1} />
              <VoteSignalGroup voteSignals={againstFeedback} support={0} />
              <VoteSignalGroup voteSignals={abstainFeedback} support={2} />
            </div>
            {props.availableVotes && props.availableVotes > 0 && (
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
                    <input
                      type="text"
                      className={classes.reasonInput}
                      placeholder="Optional reason"
                      value={reasonText}
                      onChange={event => setReasonText(event.target.value)}
                    />

                    <button
                      className={clsx(classes.button, classes.submit)}
                      disabled={isTransactionPending}
                      onClick={() =>
                        props.proposal.id &&
                        support !== undefined &&
                        handleFeedbackSubmit(+props.proposal.id, support, reasonText)
                      }
                    >
                      Submit
                    </button>
                  </>
                ) : (
                  <div className={classes.voted}>
                    <p>
                      You provided{' '}
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
          </div>
        </div>
      )}
    </>
  );
}

export default VoteSignals;
