import React, { useEffect, useState } from 'react';

import { t } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { FormControl } from 'react-bootstrap';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

import { Spinner } from '@/components/spinner';
import { useSendFeedback, VoteSignalDetail } from '@/wrappers/nouns-data';

import VoteSignalGroup from './vote-signal-group';

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

  const { _ } = useLingui();
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
    } else if (status === 'Fail' || status === 'Exception') {
      toast.error(errorMessage || _(t`Please try again.`));
      setIsTransactionPending(false);
      setIsTransactionWaiting(false);
      setDataFetchPollInterval(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendCandidateFeedbackState, sendProposalFeedbackState, _]);

  const userFeedbackAdded = (
    <Trans>
      You provided{' '}
      <span
        className={cn(
          userVoteSupport?.supportDetailed === 1 && 'text-[var(--brand-color-green)]',
          userVoteSupport?.supportDetailed === 0 && 'text-[var(--brand-color-red)]',
          userVoteSupport?.supportDetailed === 2 && 'text-[var(--brand-gray-light-text)]',
        )}
      >
        {userVoteSupport && supportText[userVoteSupport.supportDetailed].toLowerCase()}
      </span>{' '}
      feedback{' '}
      {typeof userVoteSupport?.createdTimestamp === 'number' &&
        dayjs(userVoteSupport.createdTimestamp * 1000).fromNow()}
    </Trans>
  );
  const title =
    isCandidate === true ? (
      <Trans>Pre-proposal feedback</Trans>
    ) : (
      <Trans>Pre-voting feedback</Trans>
    );

  return (
    <>
      {proposalId && (
        <div className={cn(isCandidate === true && 'relative top-0')}>
          <div className={cn('my-4', isCandidate === true && 'mt-8')}>
            <h2 className={cn('m-0 mb-2 text-base font-bold', isCandidate === true && 'text-xl')}>
              {title}
            </h2>
            {isCandidate !== true && (
              <p className="m-0 p-0 text-base font-[PT_Root_UI] text-[var(--brand-gray-light-text)]">
                <Trans>
                  Nouns voters can cast voting signals to give proposers of pending proposals an
                  idea of how they intend to vote and helpful guidance on proposal changes to change
                  their vote.
                </Trans>
              </p>
            )}
          </div>
          <div
            className={cn(
              'flex flex-col items-center justify-between overflow-hidden rounded-xl border border-[#e6e6e6]',
              isCandidate !== true && 'lg:sticky lg:top-5',
            )}
          >
            {!feedbackList ? (
              <div className="mx-auto flex h-full w-full items-center justify-center p-5 text-center">
                <Spinner />
              </div>
            ) : (
              <>
                <div className="w-full px-4 py-1.5">
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
                {isFeedbackClosed !== true && userVotes !== undefined && userVotes > 0 && (
                  <div
                    className={cn(
                      'flex w-full flex-col items-center justify-center gap-2.5 border-t border-[#e6e6e6] bg-[#f4f4f8] p-5',
                      userVoteSupport && 'block',
                    )}
                  >
                    {!hasUserVoted ? (
                      <>
                        {isTransactionWaiting || isTransactionPending ? (
                          <>
                            <p className="m-0 p-0 text-base font-bold leading-tight">
                              <Trans>Adding your feedback</Trans>
                            </p>
                            <img
                              src="/loading-noggles.svg"
                              alt="loading"
                              className="mx-auto max-w-[60px] p-2.5"
                            />
                          </>
                        ) : (
                          <>
                            <p className="m-0 p-0 text-base font-bold leading-tight">
                              <Trans>Add your feedback</Trans>
                            </p>
                            <div className="flex flex-row gap-2.5 md:w-full md:flex-col">
                              <button
                                className={cn(
                                  'duration-125 cursor-pointer rounded-[10px] border-0 border-2 border-transparent bg-[var(--brand-color-green)] px-4 py-2.5 text-sm font-bold leading-none text-white outline-2 outline-transparent transition-all ease-in-out md:w-full',
                                  support === undefined && 'opacity-100',
                                  support !== undefined && support === 1
                                    ? 'border-2 border-white outline-2 outline-black'
                                    : 'opacity-40',
                                  support === undefined && 'opacity-100',
                                  'hover:border-2 hover:border-white hover:opacity-80 hover:outline-2 hover:outline-[rgba(0,0,0,0.05)]',
                                )}
                                disabled={isTransactionPending || isTransactionWaiting}
                                onClick={() =>
                                  support === 1 ? setSupport(undefined) : setSupport(1)
                                }
                              >
                                <Trans>For</Trans>
                              </button>
                              <button
                                className={cn(
                                  'duration-125 cursor-pointer rounded-[10px] border-0 border-2 border-transparent bg-[var(--brand-color-red)] px-4 py-2.5 text-sm font-bold leading-none text-white outline-2 outline-transparent transition-all ease-in-out md:w-full',
                                  support === undefined && 'opacity-100',
                                  support !== undefined && support === 0
                                    ? 'border-2 border-white outline-2 outline-black'
                                    : 'opacity-40',
                                  support === undefined && 'opacity-100',
                                  'hover:border-2 hover:border-white hover:opacity-80 hover:outline-2 hover:outline-[rgba(0,0,0,0.05)]',
                                )}
                                disabled={isTransactionPending || isTransactionWaiting}
                                onClick={() =>
                                  support === 0 ? setSupport(undefined) : setSupport(0)
                                }
                              >
                                <Trans>Against</Trans>
                              </button>
                              <button
                                className={cn(
                                  'duration-125 cursor-pointer rounded-[10px] border-0 border-2 border-transparent bg-[var(--brand-gray-light-text)] px-4 py-2.5 text-sm font-bold leading-none text-white outline-2 outline-transparent transition-all ease-in-out md:w-full',
                                  support === undefined && 'opacity-100',
                                  support !== undefined && support === 2
                                    ? 'border-2 border-white outline-2 outline-black'
                                    : 'opacity-40',
                                  support === undefined && 'opacity-100',
                                  'hover:border-2 hover:border-white hover:opacity-80 hover:outline-2 hover:outline-[rgba(0,0,0,0.05)]',
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
                                className="mb-0 w-full rounded-lg border border-[#aaa] p-2.5 text-sm"
                                placeholder="Optional reason"
                                value={reasonText}
                                disabled={isTransactionPending || isTransactionWaiting}
                                onChange={event => setReasonText(event.target.value)}
                                as="textarea"
                              />
                              <button
                                className={cn(
                                  'duration-125 cursor-pointer rounded-[10px] border-0 border-2 border-transparent bg-black px-4 py-2.5 text-sm font-bold leading-none text-white outline-2 outline-transparent transition-all ease-in-out md:w-full',
                                  'disabled:cursor-not-allowed disabled:opacity-20',
                                  'disabled:hover:border-2 disabled:hover:border-transparent disabled:hover:opacity-20 disabled:hover:outline-2 disabled:hover:outline-transparent',
                                )}
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
                      <div className="text-left">
                        <p>{userFeedbackAdded}</p>
                        {userVoteSupport?.reason && (
                          <div className="">
                            <p className="text-left text-sm font-normal italic text-[var(--brand-gray-light-text)]">
                              &ldquo;{userVoteSupport.reason}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          {isCandidate === true && (
            <p className="m-0 mt-2 p-0 text-base text-sm font-[PT_Root_UI] leading-tight text-[var(--brand-gray-light-text)]">
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
