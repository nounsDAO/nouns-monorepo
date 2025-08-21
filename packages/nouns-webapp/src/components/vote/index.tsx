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
import { Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
import { isNonNullish } from 'remeda';
import { toast } from 'sonner';
import { zeroAddress } from 'viem';
import { useAccount, useBlockNumber } from 'wagmi';

import DynamicQuorumInfoModal from '@/components/dynamic-quorum-info-modal';
import ProposalContent from '@/components/proposal-content';
import ProposalHeader from '@/components/proposal-header';
import Section from '@/components/section';
import ShortAddress from '@/components/short-address';
import StreamWithdrawModal from '@/components/stream-withdraw-modal';
import VoteCard, { VoteCardVariant } from '@/components/vote-card';
import VoteModal from '@/components/vote-modal';
import VoteSignals from '@/components/vote-signals/vote-signals';
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
import { Link, useParams } from 'react-router';

import classes from './vote.module.css';

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
      <div className={classes.spinner}>
        <Spinner animation="border" />
      </div>
    );
  }

  if (error || dqError) {
    return <Trans>Failed to fetch</Trans>;
  }
  const againstNouns = getNounVotes(data, 0);
  const isV2Prop = dqInfo.proposal.quorumCoefficient > 0;

  return (
    <Section fullWidth={false} className={classes.votePage}>
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
      <Col lg={isUpdateable() ? 12 : 10} className={classes.wrapper}>
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
      </Col>
      <Col lg={isUpdateable() ? 12 : 10} className={cn(classes.proposal, classes.wrapper)}>
        {proposal.status === ProposalState.EXECUTED &&
          proposal.details
            .filter(txn => txn?.functionSig?.includes('createStream') === true)
            .map(txn => {
              const parsedCallData = parseStreamCreationCallData(txn.callData);
              if (parsedCallData.recipient.toLowerCase() !== account?.toLowerCase()) {
                return <Fragment key={parsedCallData.streamAddress} />;
              }
              return (
                <Row
                  key={parsedCallData.streamAddress}
                  className={cn(classes.section, classes.transitionStateButtonSection)}
                >
                  <span className={classes.boldedLabel}>
                    <Trans>Only visible to you</Trans>
                  </span>
                  <Col className="d-grid gap-4">
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
                      variant="primary"
                      className={classes.transitionStateButton}
                    >
                      <Trans>
                        Withdraw from Stream{' '}
                        <ShortAddress
                          address={(parsedCallData.streamAddress as `0x${string}`) ?? '0x'}
                        />
                      </Trans>
                    </Button>
                  </Col>
                </Row>
              );
            })}
        <Row className={cn(classes.section, classes.transitionStateButtonSection)}>
          <Col className="d-grid gap-4">
            {userVotes !== undefined && userVotes > 0 && !hasVoted && isObjectionPeriod ? (
              <div className={classes.objectionWrapper}>
                <div className={classes.objection}>
                  <div className={classes.objectionHeader}>
                    <p>
                      <strong className="d-block">
                        <Trans>Objection only period</Trans>
                      </strong>
                      Voting is now limited to against votes. This objection-only period protects
                      the DAO from last-minute vote swings.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowVoteModal(true)}
                    className={cn(
                      classes.destructiveTransitionStateButton,
                      classes.button,
                      classes.voteAgainst,
                    )}
                  >
                    Vote against
                  </button>
                </div>
              </div>
            ) : null}

            {isActionable() && (
              <div className={classes.proposerOptionsWrapper}>
                <div className={classes.proposerOptions}>
                  <p>
                    <span className={classes.proposerOptionsHeader}>
                      <Trans>Proposal functions</Trans>
                    </span>
                    {isProposer() && isUpdateable() && (
                      <>
                        <Trans>This proposal can be edited for </Trans>{' '}
                        {getUpdatableCountdownCopy(proposal, currentBlock ?? 0n, activeLocale)}{' '}
                      </>
                    )}
                  </p>

                  <div className="d-flex gap-3">
                    <>
                      {isAwaitingStateChange() && (
                        <div className={cn(classes.awaitingStateChangeButton)}>
                          <Button
                            onClick={moveStateAction}
                            disabled={isQueuePending || isExecutePending || !isExecutable}
                            variant="dark"
                            className={cn(classes.transitionStateButton, classes.button)}
                          >
                            {isQueuePending || isExecutePending ? (
                              <Spinner animation="border" />
                            ) : (
                              <>{moveStateButtonAction} Proposal ⌐◧-◧</>
                            )}
                          </Button>
                          {forkPeriodMessage}
                        </div>
                      )}

                      {isAwaitingDestructiveStateChange() && (
                        <Button
                          onClick={destructiveStateAction}
                          disabled={isCancelPending}
                          className={cn(classes.destructiveTransitionStateButton, classes.button)}
                        >
                          {isCancelPending ? (
                            <Spinner animation="border" />
                          ) : (
                            <>{destructiveStateButtonAction} Proposal </>
                          )}
                        </Button>
                      )}
                    </>
                    {isProposer() && isUpdateable() && (
                      <Link
                        to={`/vote/${id}/edit`}
                        className={cn(classes.primaryButton, classes.button)}
                      >
                        Edit
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Col>
        </Row>
        {!isUpdateable() && (
          <>
            <Row>
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
            </Row>
          </>
        )}

        {/* TODO abstract this into a component  */}
        <Row>
          <Col xl={4} lg={12}>
            <Card className={classes.voteInfoCard}>
              <Card.Body className="p-2">
                <div className={classes.voteMetadataRow}>
                  <div className={classes.voteMetadataRowTitle}>
                    <h1>
                      <Trans>Threshold</Trans>
                    </h1>
                  </div>
                  {isV2Prop && (
                    <ReactTooltip
                      id={'view-dq-info'}
                      className={classes.delegateHover}
                      getContent={() => {
                        return <Trans>View Threshold Info</Trans>;
                      }}
                    />
                  )}
                  <div
                    data-for="view-dq-info"
                    data-tip="View Dynamic Quorum Info"
                    onClick={() => setShowDynamicQuorumInfoModal(isV2Prop)}
                    className={cn(classes.thresholdInfo, isV2Prop ? classes.cursorPointer : '')}
                  >
                    <span>
                      {isV2Prop ? <Trans>Current Threshold</Trans> : <Trans>Threshold</Trans>}
                    </span>
                    <h3>
                      <Trans>
                        {isV2Prop ? i18n.number(Number(currentQuorum ?? 0)) : proposal.quorumVotes}{' '}
                        votes
                      </Trans>
                      {isV2Prop && <SearchIcon className={cn(classes.dqIcon, 'inline-block')} />}
                    </h3>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={4} lg={12}>
            <Card className={classes.voteInfoCard}>
              <Card.Body className="p-2">
                <div className={classes.voteMetadataRow}>
                  <div className={classes.voteMetadataRowTitle}>
                    <h1>{startOrEndTimeCopy()}</h1>
                  </div>
                  <div className={classes.voteMetadataTime}>
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
                    <div className={classes.objectionPeriodActive}>
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
              </Card.Body>
            </Card>
          </Col>
          <Col xl={4} lg={12}>
            <Card className={classes.voteInfoCard}>
              <Card.Body className="p-2">
                <div className={classes.voteMetadataRow}>
                  <div className={classes.voteMetadataRowTitle}>
                    <h1>Snapshot</h1>
                  </div>
                  <div className={classes.snapshotBlock}>
                    <span>Taken at block</span>
                    <h3>{String(proposal?.voteSnapshotBlock)}</h3>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>

      {isUpdateable() ? (
        <div className={classes.v3ProposalWrapper}>
          <Row>
            <Col xl={8} lg={12}>
              <ProposalContent
                description={proposal.description}
                title={proposal.title}
                details={proposal.details}
                hasSidebar={true}
                proposeOnV1={proposal.onTimelockV1}
              />
            </Col>
            <Col xl={4} lg={12} className={classes.sidebar}>
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
            </Col>
          </Row>
        </div>
      ) : (
        <Row>
          <Col xl={10} lg={12} className="m-auto">
            <ProposalContent
              description={proposal.description}
              title={proposal.title}
              details={proposal.details}
              proposeOnV1={proposal.onTimelockV1}
            />
          </Col>
        </Row>
      )}
    </Section>
  );
};

export default VotePage;
