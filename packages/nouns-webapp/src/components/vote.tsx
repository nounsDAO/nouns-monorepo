'use client';

import type { Address } from '@/utils/types';

import { Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { useQuery } from '@apollo/client';
import { SearchIcon } from '@heroicons/react/solid';
import { i18n } from '@lingui/core';
import { t } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import dayjs from 'dayjs';
import en from 'dayjs/locale/en';
import advanced from 'dayjs/plugin/advancedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { isNonNullish } from 'remeda';
import { toast } from 'sonner';
import { zeroAddress } from 'viem';
import { useAccount, useBlockNumber } from 'wagmi';

import DynamicQuorumInfoModal from '@/components/dynamic-quorum-info-modal';
import ProposalContent from '@/components/proposal-content';
import ProposalHeader from '@/components/proposal-header';
import Section from '@/components/section';
import ShortAddress from '@/components/short-address';
import { Spinner as LoadingSpinner } from '@/components/spinner';
import StreamWithdrawModal from '@/components/stream-withdraw-modal';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import VoteCard, { VoteCardVariant } from '@/components/vote-card';
import VoteModal from '@/components/vote-modal';
import VoteSignals from '@/components/vote-signals';
import { useReadNounsGovernorQuorumVotes } from '@/contracts';
import { useAppSelector } from '@/hooks';
import { useActiveLocale } from '@/hooks/use-activate-locale';
import { SUPPORTED_LOCALE_TO_DAYSJS_LOCALE, SupportedLocale } from '@/i18n/locales';
import { cn } from '@/lib/utils';
import { AVERAGE_BLOCK_TIME_IN_SECS } from '@/utils/constants';
import { getNounVotes } from '@/utils/get-nouns-votes';
import { isProposalUpdatable } from '@/utils/proposals';
import { parseStreamCreationCallData } from '@/utils/streaming-payment-utils/streaming-payment-utils';
import { useUserVotes, useUserVotesAsOfBlock } from '@/wrappers/noun-token';
import {
  PartialProposal,
  ProposalState,
  ProposalVersion,
  useCancelProposal,
  useExecuteProposal,
  useHasVotedOnProposal,
  useIsDaoGteV3,
  useIsForkActive,
  useProposal,
  useProposalVersions,
  useQueueProposal,
} from '@/wrappers/nouns-dao';
import { useProposalFeedback } from '@/wrappers/nouns-data';
import {
  delegateNounsAtBlockQuery,
  Delegates,
  ProposalVotes,
  proposalVotesQuery,
  propUsingDynamicQuorum,
} from '@/wrappers/subgraph';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

const getUpdatableCountdownCopy = (
  proposal: PartialProposal,
  currentBlock: bigint,
  locale: SupportedLocale,
) => {
  const timestamp = Date.now();
  const endDate =
    proposal !== undefined && currentBlock !== undefined
      ? dayjs(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * Number(proposal.updatePeriodEndBlock - BigInt(currentBlock)),
          'seconds',
        )
      : undefined;

  return (
    <>
      {dayjs(endDate)
        .locale(SUPPORTED_LOCALE_TO_DAYSJS_LOCALE[locale] ?? en)
        .fromNow(true)}
    </>
  );
};

const VotePage = () => {
  const { id } = useParams<{ id: string }>();
  const [showVoteModal, setShowVoteModal] = useState<boolean>(false);
  const [showDynamicQuorumInfoModal, setShowDynamicQuorumInfoModal] = useState<boolean>(false);
  const [isQueuePending, setQueuePending] = useState<boolean>(false);
  const [isExecutePending, setExecutePending] = useState<boolean>(false);
  const [isCancelPending, setCancelPending] = useState<boolean>(false);
  const [showStreamWithdrawModal, setShowStreamWithdrawModal] = useState<boolean>(false);
  const [dataFetchPollInterval, setDataFetchPollInterval] = useState<number>(0);
  const [streamWithdrawInfo, setStreamWithdrawInfo] = useState<{
    streamAddress: Address;
    startTime: number;
    endTime: number;
    streamAmount: number;
    tokenAddress: Address;
  } | null>(null);
  // if objection period is active, then we are in objection period, unless the current block is greater than the end block
  const [isObjectionPeriod, setIsObjectionPeriod] = useState<boolean>(false);
  const [forkPeriodMessage, setForkPeriodMessage] = useState<ReactNode>(<></>);
  const [isExecutable, setIsExecutable] = useState<boolean>(true);
  const proposal = useProposal(Number(id));
  const proposalVersions = useProposalVersions(Number(id));
  const activeLocale = useActiveLocale();
  const { _ } = useLingui();
  const { address: account } = useAccount();
  const { query, variables } = propUsingDynamicQuorum(id ?? '0');
  const { data: dqInfo, loading: loadingDQInfo, error: dqError } = useQuery(query, { variables });
  const { queueProposal, queueProposalState } = useQueueProposal();
  const { executeProposal, executeProposalState } = useExecuteProposal();
  const { cancelProposal, cancelProposalState } = useCancelProposal();
  const isDaoGteV3 = useIsDaoGteV3();
  const { data: proposalFeedback, refetch: proposalFeedbackRefetch } = useProposalFeedback(
    Number(id).toString(),
    dataFetchPollInterval,
  );
  const hasVoted = useHasVotedOnProposal(BigInt(proposal?.id ?? 0n));
  const forkActiveState = useIsForkActive();
  const [isForkActive, setIsForkActive] = useState<boolean>(false);
  // Get and format date from data
  const timestamp = Date.now();
  const { data: currentBlock } = useBlockNumber();
  const startDate =
    proposal !== undefined && currentBlock !== undefined
      ? dayjs(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * Number(proposal.startBlock - BigInt(currentBlock)),
          'seconds',
        )
      : undefined;

  const endBlock =
    currentBlock !== undefined &&
    proposal?.endBlock !== undefined &&
    isObjectionPeriod &&
    currentBlock > proposal?.endBlock
      ? proposal?.objectionPeriodEndBlock
      : proposal?.endBlock;
  const endDate =
    proposal !== undefined && currentBlock !== undefined && endBlock !== undefined
      ? dayjs(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * Number(endBlock - BigInt(currentBlock)),
          'seconds',
        )
      : undefined;
  const now = dayjs();

  // Get total votes and format percentages for UI
  const totalVotes = proposal
    ? proposal.forCount + proposal.againstCount + proposal.abstainCount
    : undefined;
  const forPercentage =
    proposal !== undefined && totalVotes !== undefined && totalVotes > 0
      ? (proposal.forCount * 100) / totalVotes
      : 0;
  const againstPercentage =
    proposal !== undefined && totalVotes !== undefined && totalVotes > 0
      ? (proposal.againstCount * 100) / totalVotes
      : 0;
  const abstainPercentage =
    proposal !== undefined && totalVotes !== undefined && totalVotes > 0
      ? (proposal.abstainCount * 100) / totalVotes
      : 0;

  // Use user votes as of the current or proposal snapshot block
  const currentOrSnapshotBlock = useMemo(
    () =>
      Math.min(
        Number(proposal?.voteSnapshotBlock) ?? 0,
        currentBlock !== undefined ? Number(currentBlock - 1n) : 0,
      ) || undefined,
    [currentBlock, proposal?.voteSnapshotBlock],
  );
  const userVotes = useUserVotesAsOfBlock(currentOrSnapshotBlock);

  // Get user votes as of current block to use in vote signals
  const userVotesNow = useUserVotes() ?? 0;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Type instantiation is excessively deep and possibly infinite.
  const { data: currentQuorum } = useReadNounsGovernorQuorumVotes({
    args: [proposal !== undefined && proposal.id !== undefined ? BigInt(proposal.id) : 0n],
    query: {
      enabled:
        dqInfo !== undefined && dqInfo.proposal !== undefined
          ? dqInfo.proposal.quorumCoefficient === '0'
          : true,
    },
  });

  const getVersionTimestamp = (proposalVersions: ProposalVersion[]) => {
    const versionDetails = proposalVersions[proposalVersions.length - 1];
    return versionDetails?.createdAt;
  };
  const hasSucceeded = proposal?.status === ProposalState.SUCCEEDED;
  const isInNonFinalState =
    proposal?.status !== undefined &&
    [
      ProposalState.UPDATABLE,
      ProposalState.PENDING,
      ProposalState.ACTIVE,
      ProposalState.SUCCEEDED,
      ProposalState.QUEUED,
      ProposalState.OBJECTION_PERIOD,
    ].includes(proposal.status);
  const signers = proposal && proposal?.signers?.map(signer => signer.id.toLowerCase());
  const isProposalSigner = !!(
    account &&
    proposal &&
    signers &&
    signers.includes(account?.toLowerCase())
  );
  const hasManyVersions = proposalVersions !== undefined && proposalVersions.length > 1;
  const isProposer = () => proposal?.proposer?.toLowerCase() === account?.toLowerCase();
  const isUpdateable = () => {
    if (!isDaoGteV3) return false;
    return !!(
      proposal !== undefined &&
      currentBlock !== undefined &&
      isProposalUpdatable(proposal.status, proposal.updatePeriodEndBlock, currentBlock)
    );
  };

  const isCancellable = () => {
    return isInNonFinalState && (isProposalSigner || isProposer());
  };

  const isAwaitingStateChange = () => {
    if (hasSucceeded) {
      return true;
    }
    if (proposal?.status === ProposalState.QUEUED) {
      return new Date() >= (proposal?.eta ?? Number.MAX_SAFE_INTEGER);
    }
    return false;
  };

  const isAwaitingDestructiveStateChange = () => {
    return isCancellable();
  };

  const isActionable = () => {
    if (isUpdateable() && !(isProposer() || isProposalSigner)) {
      return false;
    } else if (isAwaitingStateChange()) {
      return true;
    } else if (isAwaitingDestructiveStateChange()) {
      return true;
    } else return isUpdateable();
  };

  const startOrEndTimeCopy = () => {
    if (startDate?.isBefore(now) === true && endDate?.isAfter(now) === true) {
      return <Trans>Ends</Trans>;
    }
    if (endDate?.isBefore(now) === true) {
      return <Trans>Ended</Trans>;
    }
    return <Trans>Starts</Trans>;
  };

  const startOrEndTimeTime = () => {
    if (startDate?.isBefore(now) !== true) {
      return startDate;
    }
    return endDate;
  };
  const objectionEnd = () => {
    return proposal !== undefined &&
      currentBlock !== undefined &&
      proposal.objectionPeriodEndBlock !== undefined
      ? dayjs(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * Number(proposal.objectionPeriodEndBlock - currentBlock),
          'seconds',
        )
      : undefined;
  };

  const objectionEndTime = i18n.date(new Date(objectionEnd()?.toISOString() || 0), {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
  const objectionEndDate = i18n.date(new Date(objectionEnd()?.toISOString() || 0), {
    dateStyle: 'long',
  });
  const objectionNoteCopy = (
    <>
      Voters will have until {objectionEndTime} on {objectionEndDate} to vote against this proposal.
    </>
  );
  const moveStateButtonAction = hasSucceeded ? <Trans>Queue</Trans> : <Trans>Execute</Trans>;
  const moveStateAction = (() => {
    if (hasSucceeded) {
      return () => {
        if (proposal?.id) {
          return queueProposal({ args: [BigInt(proposal.id)] });
        }
      };
    }
    return () => {
      if (proposal?.id) {
        if (proposal?.onTimelockV1) {
          return true;
        } else {
          return executeProposal({ args: [BigInt(proposal.id)] });
        }
      }
    };
  })();

  const destructiveStateButtonAction = isCancellable() ? 'Cancel' : '';
  const destructiveStateAction = (() => {
    if (isCancellable()) {
      return () => {
        if (proposal?.id) {
          return cancelProposal({ args: [BigInt(proposal.id)] });
        }
      };
    }
  })();

  const handleRefetchData = async () => {
    await proposalFeedbackRefetch();
  };

  const onTransactionStateChange = useCallback(
    (
      {
        errorMessage,
        status,
      }: {
        status: string;
        errorMessage?: string;
      },
      successMessage?: string,
      setPending?: (isPending: boolean) => void,
      getErrorMessage?: (error?: string) => string | undefined,
      onFinalState?: () => void,
    ) => {
      switch (status) {
        case 'None':
          setPending?.(false);
          break;
        case 'Mining':
          setPending?.(true);
          break;
        case 'Success':
          toast.success(successMessage || _(t`Transaction Successful!`));
          setPending?.(false);
          onFinalState?.();
          break;
        case 'Fail':
          toast.error(errorMessage || _(t`Please try again.`));
          setPending?.(false);
          onFinalState?.();
          break;
        case 'Exception':
          toast.error(getErrorMessage?.(errorMessage) || _(t`Please try again.`));
          setPending?.(false);
          onFinalState?.();
          break;
      }
    },
    [_],
  );

  useEffect(
    () => onTransactionStateChange(queueProposalState, _(t`Proposal Queued!`), setQueuePending),
    [queueProposalState, onTransactionStateChange, _],
  );

  useEffect(
    () =>
      onTransactionStateChange(executeProposalState, _(t`Proposal Executed!`), setExecutePending),
    [executeProposalState, onTransactionStateChange, _],
  );

  useEffect(
    () => onTransactionStateChange(cancelProposalState, _(t`Proposal Canceled!`), setCancelPending),
    [cancelProposalState, onTransactionStateChange, _],
  );

  useEffect(() => {
    if (forkActiveState.data) {
      setIsForkActive(forkActiveState.data);
    }
  }, [forkActiveState.data, setIsForkActive]);

  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { query: votesQuery, variables: votesVariables } = proposalVotesQuery(proposal?.id ?? '0');
  const {
    loading,
    error,
    data: voters,
  } = useQuery<ProposalVotes>(votesQuery, {
    skip: !proposal,
    variables: votesVariables,
  });

  const voterIds = voters?.votes?.map(v => v.voter.id);
  const { query: voteSnapshotQuery, variables: voteSnapshotVariables } = delegateNounsAtBlockQuery(
    voterIds ?? [],
    BigInt(proposal?.voteSnapshotBlock ?? 0),
  );
  const { data: delegateSnapshot } = useQuery<Delegates>(voteSnapshotQuery, {
    skip: (voters?.votes?.length ?? 0) === 0,
    variables: voteSnapshotVariables,
  });

  const { delegates } = delegateSnapshot || {};
  const delegateToNounIds = delegates?.reduce<Record<string, string[]>>((acc, curr) => {
    acc[curr.id] = curr?.nounsRepresented?.map(nr => nr.id) ?? [];
    return acc;
  }, {});

  const data = voters?.votes?.map(v => ({
    delegate: v.voter.id as Address,
    supportDetailed: v.supportDetailed,
    nounsRepresented: delegateToNounIds?.[v.voter.id] ?? [],
  }));

  const [showToast, setShowToast] = useState(true);
  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
  }, [showToast]);

  const isWalletConnected = activeAccount !== undefined;
  const isActiveForVoting =
    proposal?.status === ProposalState.ACTIVE ||
    proposal?.status === ProposalState.OBJECTION_PERIOD;

  useEffect(() => {
    if (
      isDaoGteV3 &&
      proposal !== undefined &&
      currentBlock !== undefined &&
      proposal?.objectionPeriodEndBlock !== undefined &&
      proposal.objectionPeriodEndBlock > 0 &&
      proposal?.endBlock !== undefined &&
      currentBlock > proposal.endBlock &&
      currentBlock <= proposal.objectionPeriodEndBlock
    ) {
      setIsObjectionPeriod(true);
    } else {
      setIsObjectionPeriod(false);
    }
  }, [currentBlock, proposal?.status, proposal, isDaoGteV3]);

  useEffect(() => {
    if (proposal?.status === ProposalState.QUEUED && isForkActive) {
      setForkPeriodMessage(
        <p>
          <Trans>Proposals cannot be executed during a forking period</Trans>
        </p>,
      );
      setIsExecutable(false);
    } else if (proposal?.status === ProposalState.QUEUED && !isForkActive) {
      setIsExecutable(true);
    }
  }, [proposal?.status, isForkActive, setForkPeriodMessage, setIsExecutable]);

  if (!proposal || loading || !data || loadingDQInfo || dqInfo === undefined) {
    return (
      <div className="mx-auto max-w-[30px] text-[--brand-gray-light-text]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || dqError) {
    return <Trans>Failed to fetch</Trans>;
  }
  const againstNouns = getNounVotes(data, 0);
  const isV2Prop = dqInfo.proposal.quorumCoefficient > 0;

  return (
    <Section fullWidth={false} className="text-[--brand-dark-red]">
      {showDynamicQuorumInfoModal && (
        <DynamicQuorumInfoModal
          proposal={proposal}
          againstVotesAbsolute={againstNouns.length}
          onDismiss={() => setShowDynamicQuorumInfoModal(false)}
          currentQuorum={Number(currentQuorum)}
        />
      )}
      <StreamWithdrawModal
        show={showStreamWithdrawModal}
        onDismiss={() => setShowStreamWithdrawModal(false)}
        streamAddress={streamWithdrawInfo?.streamAddress ?? zeroAddress}
        startTime={streamWithdrawInfo?.startTime}
        endTime={streamWithdrawInfo?.endTime}
        streamAmount={streamWithdrawInfo?.streamAmount}
        tokenAddress={streamWithdrawInfo?.tokenAddress ?? zeroAddress}
      />
      <VoteModal
        show={showVoteModal}
        onHide={() => setShowVoteModal(false)}
        proposalId={proposal?.id}
        availableVotes={userVotes ?? 0}
        isObjectionPeriod={isObjectionPeriod}
      />
      <div className={cn('mx-auto', 'w-full', isUpdateable() ? 'lg:w-full' : 'lg:w-5/6')}>
        {proposal !== undefined && (
          <ProposalHeader
            proposal={proposal}
            proposalVersions={proposalVersions}
            isActiveForVoting={isActiveForVoting}
            isWalletConnected={isWalletConnected}
            submitButtonClickHandler={() => setShowVoteModal(true)}
            versionNumber={
              hasManyVersions && proposalVersions !== undefined
                ? BigInt(proposalVersions.length)
                : undefined
            }
            isObjectionPeriod={isObjectionPeriod}
          />
        )}
      </div>
      <div
        className={cn(
          'mt-4 bg-white',
          'mx-auto',
          'w-full',
          isUpdateable() ? 'lg:w-full' : 'lg:w-5/6',
        )}
      >
        {proposal.status === ProposalState.EXECUTED &&
          proposal.details
            .filter(txn => txn?.functionSig?.includes('createStream') === true)
            .map(txn => {
              const parsedCallData = parseStreamCreationCallData(txn.callData);
              if (parsedCallData.recipient.toLowerCase() !== account?.toLowerCase()) {
                return <Fragment key={parsedCallData.streamAddress} />;
              }
              return (
                <div key={parsedCallData.streamAddress} className={cn('break-words', 'border-t-0')}>
                  <span className={'text-brand-gray-light-text mb-2 font-medium'}>
                    <Trans>Only visible to you</Trans>
                  </span>
                  <div className="grid gap-4">
                    <Button
                      onClick={() => {
                        setStreamWithdrawInfo({
                          streamAddress: parsedCallData.streamAddress as Address,
                          startTime: parsedCallData.startTime,
                          endTime: parsedCallData.endTime,
                          streamAmount: parsedCallData.streamAmount,
                          tokenAddress: parsedCallData.tokenAddress as Address,
                        });
                        setShowStreamWithdrawModal(true);
                      }}
                      className={
                        'font-pt cursor-pointer bg-black px-4 py-[10px] font-bold text-white transition-all duration-150 ease-in-out hover:opacity-50'
                      }
                    >
                      <Trans>
                        Withdraw from Stream{' '}
                        <ShortAddress
                          address={(parsedCallData.streamAddress as `0x${string}`) ?? '0x'}
                        />
                      </Trans>
                    </Button>
                  </div>
                </div>
              );
            })}
        <div className={cn('break-words', 'border-t-0')}>
          <div className="grid gap-4">
            {userVotes !== undefined && userVotes > 0 && !hasVoted && isObjectionPeriod ? (
              <div
                className={
                  'rounded-12 border-brand-border-light border px-[15px] py-[5px] lg-max:p-[10px] lg-max:text-center'
                }
              >
                <div className={'flex items-center justify-between lg-max:flex-col'}>
                  <div className={'m-0 block p-0 text-[13px] font-bold opacity-70'}>
                    <p>
                      <strong className="block">
                        <Trans>Objection only period</Trans>
                      </strong>
                      <Trans>
                        Voting is now limited to against votes. This objection-only period protects
                        the DAO from last-minute vote swings.
                      </Trans>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowVoteModal(true)}
                    className={
                      'font-pt bg-brand-color-red h-fit cursor-pointer rounded-lg border-0 px-4 py-[10px] font-bold leading-none text-white transition-all duration-150 ease-in-out hover:opacity-70'
                    }
                  >
                    <Trans>Vote against</Trans>
                  </button>
                </div>
              </div>
            ) : null}

            {isActionable() && (
              <div className="rounded-12 border-brand-border-light border px-[15px] py-[5px] lg-max:p-[10px] lg-max:text-center">
                <div className="flex items-center justify-between lg-max:flex-col">
                  <p>
                    <span className="m-0 block p-0 text-[13px] font-bold opacity-70">
                      <Trans>Proposal functions</Trans>
                    </span>
                    {isProposer() && isUpdateable() && (
                      <>
                        <Trans>This proposal can be edited for </Trans>{' '}
                        {getUpdatableCountdownCopy(proposal, currentBlock ?? 0n, activeLocale)}{' '}
                      </>
                    )}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <>
                      {isAwaitingStateChange() && (
                        <div className={cn('m-1 flex flex-col gap-1')}>
                          <Button
                            onClick={moveStateAction}
                            disabled={isQueuePending || isExecutePending || !isExecutable}
                            className={
                              'font-pt cursor-pointer bg-black px-4 py-[10px] font-bold text-white transition-all duration-150 ease-in-out hover:opacity-50'
                            }
                          >
                            {isQueuePending || isExecutePending ? (
                              <LoadingSpinner className="size-4" />
                            ) : (
                              <Trans>{moveStateButtonAction} Proposal ⌐◧-◧</Trans>
                            )}
                          </Button>
                          {forkPeriodMessage}
                        </div>
                      )}

                      {isAwaitingDestructiveStateChange() && (
                        <Button
                          onClick={destructiveStateAction}
                          disabled={isCancelPending}
                          className={
                            'font-pt text-brand-gray-dark-text hover:bg-brand-color-red h-fit cursor-pointer rounded-lg border-0 px-4 py-[10px] font-bold leading-none transition-all duration-150 ease-in-out hover:text-white'
                          }
                        >
                          {isCancelPending ? (
                            <LoadingSpinner className="size-4" />
                          ) : (
                            <Trans>{destructiveStateButtonAction} Proposal </Trans>
                          )}
                        </Button>
                      )}
                    </>
                    {isProposer() && isUpdateable() && (
                      <Link
                        href={`/vote/${id}/edit`}
                        className={
                          'font-pt h-fit rounded-lg border-0 bg-black px-4 py-[10px] font-bold leading-none text-white no-underline transition-all duration-150 ease-in-out hover:opacity-75'
                        }
                      >
                        <Trans>Edit</Trans>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {!isUpdateable() && (
          <>
            <div className="flex flex-row gap-4">
              <VoteCard
                proposal={proposal}
                percentage={forPercentage}
                variant={VoteCardVariant.FOR}
                delegateGroupedVoteData={data}
              />
              <VoteCard
                proposal={proposal}
                percentage={againstPercentage}
                variant={VoteCardVariant.AGAINST}
                delegateGroupedVoteData={data}
              />
              <VoteCard
                proposal={proposal}
                percentage={abstainPercentage}
                variant={VoteCardVariant.ABSTAIN}
                delegateGroupedVoteData={data}
              />
            </div>
          </>
        )}

        {/* TODO abstract this into a component  */}
        <div className="-mx-2 flex flex-wrap">
          <div className="w-full px-2 xl:w-1/3">
            <div className={'mt-4 rounded-[12px] p-2'}>
              <div className="p-2">
                <div className={'flex justify-between'}>
                  <div className={'mt-2 w-max'}>
                    <h1>
                      <Trans>Threshold</Trans>
                    </h1>
                  </div>

                  {isV2Prop ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            onClick={() => setShowDynamicQuorumInfoModal(isV2Prop)}
                            className={cn('text-right', 'cursor-pointer')}
                          >
                            <span>
                              <Trans>Current Threshold</Trans>
                            </span>
                            <h3>
                              <Trans>{i18n.number(Number(currentQuorum ?? 0))} votes</Trans>
                              <SearchIcon
                                className={cn('mb-1 ml-1 size-[18px] opacity-50', 'inline-block')}
                              />
                            </h3>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          className={
                            'bg-brand-gray-dark-text rounded-lg font-medium text-white opacity-75 transition duration-150 ease-in-out'
                          }
                        >
                          <Trans>View Threshold Info</Trans>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <div className={'text-right'}>
                      <span>
                        <Trans>Threshold</Trans>
                      </span>
                      <h3>
                        <Trans>{proposal.quorumVotes} votes</Trans>
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full px-2 xl:w-1/3">
            <div className={'mt-4 rounded-[12px] p-2'}>
              <div className="p-2">
                <div className={'flex justify-between'}>
                  <div className={'mt-2 w-max'}>
                    <h1>{startOrEndTimeCopy()}</h1>
                  </div>
                  <div className={'min-w-fit text-right'}>
                    <span>
                      {startOrEndTimeTime() &&
                        i18n.date(new Date(startOrEndTimeTime()?.toISOString() || 0), {
                          hour: 'numeric',
                          minute: '2-digit',
                          timeZoneName: 'short',
                        })}
                    </span>
                    <h3>
                      {startOrEndTimeTime() &&
                        i18n.date(new Date(startOrEndTimeTime()?.toISOString() || 0), {
                          dateStyle: 'long',
                        })}
                    </h3>
                  </div>
                </div>
                {isNonNullish(currentBlock) &&
                  proposal?.objectionPeriodEndBlock !== undefined &&
                  proposal.objectionPeriodEndBlock > 0n && (
                    <div
                      className={'text-brand-gray-light-text mt-4 border-t border-black/10 pt-4'}
                    >
                      <p>
                        <strong>
                          <Trans>Objection period triggered</Trans>
                        </strong>
                      </p>
                      {currentBlock !== undefined &&
                        proposal?.endBlock !== undefined &&
                        currentBlock < proposal.endBlock && <p>{objectionNoteCopy}</p>}
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div className="w-full px-2 xl:w-1/3">
            <div className={'mt-4 rounded-[12px] p-2'}>
              <div className="p-2">
                <div className={'flex justify-between'}>
                  <div className={'mt-2 w-max'}>
                    <h1>
                      <Trans>Snapshot</Trans>
                    </h1>
                  </div>
                  <div className={'text-right'}>
                    <span>
                      <Trans>Taken at block</Trans>
                    </span>
                    <h3>{String(proposal?.voteSnapshotBlock)}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isUpdateable() ? (
        <div className={'mt-8'}>
          <div className="flex flex-wrap">
            <div className="w-full xl:w-2/3">
              <ProposalContent
                description={proposal.description}
                title={proposal.title}
                details={proposal.details}
                hasSidebar={true}
                proposeOnV1={proposal.onTimelockV1}
              />
            </div>
            <div className={cn('w-full xl:w-1/3', 'md-lg:h-full')}>
              {proposalVersions !== undefined && (
                <VoteSignals
                  feedback={proposalFeedback}
                  proposalId={proposal.id}
                  versionTimestamp={getVersionTimestamp(proposalVersions)}
                  userVotes={userVotesNow}
                  setDataFetchPollInterval={setDataFetchPollInterval}
                  handleRefetch={handleRefetchData}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex">
          <div className="mx-auto w-full xl:w-5/6">
            <ProposalContent
              description={proposal.description}
              title={proposal.title}
              details={proposal.details}
              proposeOnV1={proposal.onTimelockV1}
            />
          </div>
        </div>
      )}
    </Section>
  );
};

export default VotePage;
