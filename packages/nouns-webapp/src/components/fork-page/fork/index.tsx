'use client';

import { useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { Col, Container, Row } from 'react-bootstrap';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';

import AddNounsToForkModal from '@/components/add-nouns-to-fork-modal';
import ForkingPeriodTimer from '@/components/forking-period-timer';
import useForkTreasuryBalance from '@/hooks/useForkTreasuryBalance';
import { useScrollToLocation } from '@/hooks/useScrollToLocation';
import Section from '@/layout/Section';
import { buildEtherscanAddressLink } from '@/utils/etherscan';
import { Address } from '@/utils/types';
import {
  useAdjustedTotalSupply,
  useEscrowEvents,
  useForkDetails,
  useForks,
  useForkThreshold,
  useForkThresholdBPS,
  useNumTokensInForkEscrow,
} from '@/wrappers/nounsDao';
import { useUserEscrowedNounIds, useUserOwnedNounIds } from '@/wrappers/nounToken';
import { Link, useParams } from 'react-router';

import NotFoundPage from '../not-found';

import DeployForkButton from './DeployForkButton';
import classes from './Fork.module.css';
import ForkEvent from './ForkEvent';
import WithdrawNounsButton from './WithdrawNounsButton';

const now = new Date();

const ForkPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isThresholdMet, setIsThresholdMet] = useState(false);
  const [isForked, setIsForked] = useState(false);
  const [isPageDataLoaded, setIsPageDataLoaded] = useState(false);
  const [isForkPeriodActive, setIsForkPeriodActive] = useState(false);
  const [isNewForkPage, setIsNewForkPage] = useState(false);
  const [thresholdPercentage, setThresholdPercentage] = useState(0);
  const [currentEscrowPercentage, setCurrentEscrowPercentage] = useState(0);
  const [dataFetchPollInterval, setDataFetchPollInterval] = useState(0);
  const [forkStatusLabel, setForkStatusLabel] = useState('Escrow');
  const [addNounsButtonLabel, setAddNounsButtonLabel] = useState('Add Nouns to escrow');

  // Hooks
  const adjustedTotalSupply = useAdjustedTotalSupply();
  const forkThreshold = useForkThreshold();
  const forkThresholdBPS = useForkThresholdBPS();
  const numTokensInForkEscrow = useNumTokensInForkEscrow();
  const userEscrowedNounIds = useUserEscrowedNounIds(dataFetchPollInterval, Number(id).toString());
  const userOwnedNounIds = useUserOwnedNounIds(dataFetchPollInterval);
  const escrowEvents = useEscrowEvents(dataFetchPollInterval, Number(id).toString());
  const forkDetails = useForkDetails(dataFetchPollInterval, id || '');
  const forks = useForks(dataFetchPollInterval);
  const { address: account } = useAccount();
  const phantomListItems = new Array(4 - (forkDetails.data.addedNouns.length! % 4)).fill(0);
  const forkTreasuryBalance = useForkTreasuryBalance(forkDetails.data.forkTreasury as Address);
  useScrollToLocation();

  // Data fetching
  const refetchForkData = () => {
    userOwnedNounIds.refetch();
    userEscrowedNounIds.refetch();
    escrowEvents.refetch();
    forkDetails.refetch();
    forks.refetch();
  };

  // Calculate percentage to threshold
  const updateEscrowPercentage = () => {
    if (
      forkThreshold !== undefined &&
      adjustedTotalSupply !== undefined &&
      numTokensInForkEscrow !== undefined
    ) {
      const baseValue = forkThreshold + 1;
      const numerator =
        isForkPeriodActive || isForked
          ? forkDetails.data.tokensForkingCount
          : numTokensInForkEscrow;
      const currentPercentage = (numerator / baseValue) * 100;
      setCurrentEscrowPercentage(+currentPercentage.toFixed(2));
    }
  };

  // Update threshold status
  const updateThresholdStatus = () => {
    const isThresholdReached =
      numTokensInForkEscrow !== undefined &&
      forkThreshold !== undefined &&
      numTokensInForkEscrow > forkThreshold;
    setIsThresholdMet(isThresholdReached);

    if (
      forkThresholdBPS !== undefined &&
      adjustedTotalSupply !== undefined &&
      numTokensInForkEscrow !== undefined
    ) {
      const percentage = forkThresholdBPS / 100;
      setThresholdPercentage(+percentage.toFixed());
    }
  };

  // Update fork status labels
  const updateForkStatus = () => {
    const timestamp = forkDetails?.data?.forkingPeriodEndTimestamp;
    const currentTime = now.getTime() / 1000;

    if (timestamp && +timestamp > currentTime) {
      // 'forking'
      setForkStatusLabel('Forking');
      setAddNounsButtonLabel('Join fork');
      setIsForkPeriodActive(true);
    } else if (timestamp && +timestamp < currentTime) {
      // 'forked'
      setIsForked(true);
      setForkStatusLabel('Forked');
    } else if (!timestamp && forkDetails?.data?.tokensInEscrowCount) {
      // 'escrow'
      setForkStatusLabel('Escrow');
      setAddNounsButtonLabel('Add Nouns to escrow');
    } else {
      // 'pre-escrow'
      setForkStatusLabel('Pre-escrow');
      setAddNounsButtonLabel('Add Nouns to Start Escrow Period');
    }
  };

  // Refresh data on modal state changes
  useEffect(() => {
    refetchForkData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, isWithdrawModalOpen, isDeployModalOpen, isForkPeriodActive]);

  // Update fork status, threshold status, and percentages
  useEffect(() => {
    updateForkStatus();
    updateThresholdStatus();
    updateEscrowPercentage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    forkDetails,
    forkThreshold,
    numTokensInForkEscrow,
    adjustedTotalSupply,
    forkThresholdBPS,
    isModalOpen,
    isForkPeriodActive,
    forks.data,
    id,
  ]);

  useEffect(() => {
    // set page layout based on data
    if (forks.data != null && forkDetails.data != null) {
      // match id to upcoming fork id
      if (
        forks?.data.length === 0 ||
        (forks?.data.length > 0 && +Number(id) === +forks.data[forks.data.length - 1].id + 1)
      ) {
        setIsNewForkPage(true);
      } else {
        setIsNewForkPage(false);
      }
      setIsPageDataLoaded(true);
    }
  }, [forks.data, forkDetails.data, id]);

  if (!isPageDataLoaded) {
    return (
      <div className={clsx(classes.spinner, classes.pageLoadingSpinner)}>
        <img src="/loading-noggles.svg" alt="loading" className={classes.transactionModalSpinner} />
      </div>
    );
  }

  if (
    Number(forks?.data?.length) > 0 &&
    Number(id) > Number(forks?.data?.[Number(forks?.data?.length) - 1].id) + 1
  ) {
    // fork doesn't exist
    return <NotFoundPage />;
  }

  return (
    <>
      <Section fullWidth={false} className="h-100">
        <Row>
          {isNewForkPage ? (
            <div className={clsx(classes.pageHeader, classes.emptyState)}>
              <Col lg={12}>
                <header>
                  <div className={classes.status}>
                    <Link className={classes.backButton} to="/fork">
                      ←
                    </Link>
                    <span className={clsx(classes.forkStatus)}>{forkStatusLabel}</span>
                    <div className={classes.spacer} />
                  </div>
                  <h1>
                    <Trans>Fork Nouns DAO</Trans>
                  </h1>
                  <p className="mb-4">
                    <Trans>
                      Any token holder can signal to fork (exit) in response to a governance
                      proposal. If a{' '}
                      {thresholdPercentage && thresholdPercentage > 0
                        ? `${thresholdPercentage}% `
                        : ' '}
                      quorum of tokens signal to exit, the fork will succeed.
                    </Trans>
                  </p>
                </header>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className={clsx(classes.button, classes.primaryButton)}
                  disabled={userOwnedNounIds?.data?.length === 0}
                >
                  {addNounsButtonLabel}
                </button>
              </Col>
            </div>
          ) : (
            <div
              className={clsx(
                classes.pageHeader,
                (escrowEvents.data == null || isNewForkPage) && classes.emptyState,
                isForked && classes.isForked,
              )}
            >
              <Col lg={6}>
                <div className={classes.status}>
                  <Link className={classes.backButton} to="/fork">
                    ←
                  </Link>
                  <span className={clsx(classes.forkStatus)}>{forkStatusLabel}</span>
                  <div className={classes.spacer} />
                </div>
                <h1>
                  <Trans>Nouns DAO Fork{isForked ? ` #${id}` : ''}</Trans>
                </h1>
                {!isForked && !isForkPeriodActive && (
                  <p className={classes.note}>
                    <Trans>
                      More than {forkThreshold == null ? '...' : forkThreshold} Nouns{' '}
                      {`(${forkThresholdBPS != null ? forkThresholdBPS / 100 : '...'}% of the DAO)`}{' '}
                      are required to pass the threshold
                    </Trans>
                  </p>
                )}
              </Col>
              {!isForked && (
                <Col
                  lg={6}
                  className={clsx(classes.buttons, escrowEvents.data == null && classes.emptyState)}
                >
                  {!isForkPeriodActive &&
                    userEscrowedNounIds != null &&
                    userEscrowedNounIds.data != null &&
                    userEscrowedNounIds.data.length > 0 && (
                      <WithdrawNounsButton
                        tokenIds={userEscrowedNounIds.data}
                        isWithdrawModalOpen={isWithdrawModalOpen}
                        setIsWithdrawModalOpen={setIsWithdrawModalOpen}
                        setDataFetchPollInterval={setDataFetchPollInterval}
                      />
                    )}
                  <button
                    type="button"
                    onClick={() => {
                      if (isForkPeriodActive) {
                        setIsConfirmModalOpen(true);
                      } else {
                        setIsModalOpen(true);
                      }
                    }}
                    className={clsx(classes.button, classes.primaryButton)}
                    disabled={userOwnedNounIds?.data?.length === 0}
                  >
                    {addNounsButtonLabel}
                  </button>
                </Col>
              )}
            </div>
          )}
        </Row>
      </Section>
      {(isForked || isForkPeriodActive) && (
        <Section fullWidth={false}>
          <Col>
            <div className={classes.callout}>
              {forkDetails.data.forkingPeriodEndTimestamp &&
                +forkDetails.data.forkingPeriodEndTimestamp > now.getTime() / 1000 && (
                  <div className={clsx(classes.countdown)}>
                    <ForkingPeriodTimer
                      endTime={+forkDetails.data.forkingPeriodEndTimestamp}
                      isPeriodEnded={Boolean(
                        forkDetails?.data?.executed != null &&
                          forkDetails?.data?.executed &&
                          +forkDetails.data.forkingPeriodEndTimestamp < now.getTime() / 1000,
                      )}
                    />
                  </div>
                )}
              <div className={clsx(classes.isForked)}>
                {forkDetails.data.executedAt != null && forkDetails.data.executedAt > 0n ? (
                  <p>
                    <strong>
                      This fork was executed on{' '}
                      {dayjs.unix(Number(forkDetails.data.executedAt)).format('MMM D, YYYY')}
                    </strong>
                  </p>
                ) : null}
                <p>
                  Fork contracts:{' '}
                  {forkDetails.data.forkTreasury && (
                    <>
                      <a
                        href={buildEtherscanAddressLink(forkDetails.data.forkTreasury)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Treasury
                      </a>
                      ,{' '}
                    </>
                  )}
                  {forkDetails.data.forkToken && (
                    <>
                      <a
                        href={buildEtherscanAddressLink(forkDetails.data.forkToken)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Token
                      </a>
                    </>
                  )}
                </p>
                <p>Fork treasury balance: Ξ{Number(formatEther(forkTreasuryBalance)).toFixed(2)}</p>
              </div>
            </div>
          </Col>
        </Section>
      )}

      {!isNewForkPage && escrowEvents.data != null && (
        <div
          className={clsx(
            classes.forkTimelineWrapper,
            isForkPeriodActive && classes.isForkingPeriod,
            isForked && classes.isForked,
          )}
        >
          <Container>
            <Row className={classes.forkTimeline}>
              <Col lg={3} className={classes.sidebar}>
                <div className={classes.summary}>
                  <span>{isForkPeriodActive || isForked ? 'in fork' : 'in escrow'}</span>
                  <strong>
                    {isForkPeriodActive || isForked ? (
                      <>
                        {forkDetails.data?.tokensForkingCount != undefined
                          ? forkDetails.data?.tokensForkingCount
                          : '...'}
                      </>
                    ) : (
                      <>{numTokensInForkEscrow !== undefined ? numTokensInForkEscrow : '...'}</>
                    )}{' '}
                    Noun
                    {(() => {
                      if (isForkPeriodActive || isForked) {
                        return forkDetails.data?.tokensForkingCount === 1 ? '' : 's';
                      } else {
                        return numTokensInForkEscrow === 1 ? '' : 's';
                      }
                    })()}
                  </strong>
                  {isForkPeriodActive || isForked ? null : (
                    <span className={classes.thresholdCount}>
                      {currentEscrowPercentage >= 100
                        ? `threshold met`
                        : `${currentEscrowPercentage}% of threshold`}
                    </span>
                  )}
                </div>

                <DeployForkButton
                  setDataFetchPollInterval={setDataFetchPollInterval}
                  refetchData={refetchForkData}
                  isDeployModalOpen={isDeployModalOpen}
                  setIsDeployModalOpen={setIsDeployModalOpen}
                  isForkPeriodActive={isForkPeriodActive}
                  isThresholdMet={isThresholdMet}
                  isUserConnected={!!account}
                />

                {(isForkPeriodActive || isForked) && (
                  <div className={classes.nounsInFork}>
                    {forkDetails.data.addedNouns.map(nounId => (
                      <a href={`/noun/${nounId}`} target="_blank" rel="noreferrer" key={nounId}>
                        <img
                          src={`https://noun.pics/${nounId}`}
                          alt="noun"
                          className={classes.nounImage}
                        />
                      </a>
                    ))}
                    {/* add phantom elements to align boxes */}
                    {phantomListItems.map(i => (
                      <div className={clsx(classes.nounImage, classes.phantom)} key={i} />
                    ))}
                  </div>
                )}
              </Col>
              <Col lg={9} className={classes.events}>
                {!isForked &&
                  userEscrowedNounIds.data != null &&
                  userEscrowedNounIds.data.length > 0 && (
                    <div className={clsx(classes.userNouns, classes.callout)}>
                      <p>
                        Your Noun{userEscrowedNounIds.data.length > 1 && 's'} in escrow:{' '}
                        <strong>
                          {userEscrowedNounIds.data.map(nounId => `Noun ${nounId}`).join(', ')}
                        </strong>
                      </p>
                    </div>
                  )}
                {escrowEvents.data != null &&
                  escrowEvents.data.map(event => {
                    if (event?.eventType === 'ForkingEnded') {
                      if (
                        event.createdAt != null &&
                        forkDetails.data.forkingPeriodEndTimestamp != null &&
                        now.getTime() / 1000 < +forkDetails.data.forkingPeriodEndTimestamp
                      ) {
                        return null;
                      }
                    }
                    return (
                      <ForkEvent
                        key={event.id}
                        event={event}
                        isOnlyEvent={escrowEvents.data.length <= 1}
                      />
                    );
                  })}
              </Col>
            </Row>
          </Container>
        </div>
      )}
      {account && (
        <>
          <AddNounsToForkModal
            setIsModalOpen={setIsModalOpen}
            isModalOpen={isModalOpen}
            isConfirmModalOpen={isConfirmModalOpen}
            isForkingPeriod={isForkPeriodActive}
            title={'Add Nouns to escrow'}
            description={
              "Nouners can withdraw their tokens from escrow as long as the forking period hasn't started. Nouns in escrow are not eligible to vote or submit proposals."
            }
            selectLabel={'Select Nouns to escrow'}
            selectDescription={
              'Add as many or as few of your Nouns as you’d like.  Additional Nouns can be added during the escrow period.'
            }
            account={account}
            ownedNouns={userOwnedNounIds.data}
            userEscrowedNouns={userEscrowedNounIds.data}
            refetchData={refetchForkData}
            setDataFetchPollInterval={setDataFetchPollInterval}
            setIsConfirmModalOpen={setIsConfirmModalOpen}
          />
        </>
      )}
    </>
  );
};
export default ForkPage;
