import { useEffect, useState } from 'react';
import classes from './Fork.module.css';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import Section from '../../layout/Section';
import { Col, Container, Row } from 'react-bootstrap';
import AddNounsToForkModal from '../../components/AddNounsToForkModal';
import ForkingPeriodTimer from '../../components/ForkingPeriodTimer';
import {
  useEscrowEvents,
  useForkDetails,
  useForkThreshold,
  useForks,
  useNumTokensInForkEscrow,
  useAdjustedTotalSupply,
  useForkThresholdBPS,
} from '../../wrappers/nounsDao';
import { useEthers } from '@usedapp/core';
import { useUserEscrowedNounIds, useUserOwnedNounIds } from '../../wrappers/nounToken';
import ForkEvent from './ForkEvent';
import DeployForkButton from './DeployForkButton';
import WithdrawNounsButton from './WithdrawNounsButton';
import { useScrollToLocation } from '../../hooks/useScrollToLocation';
import { Link, RouteComponentProps } from 'react-router-dom';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import dayjs from 'dayjs';
import NotFoundPage from '../NotFound';
import useForkTreasuryBalance from '../../hooks/useForkTreasuryBalance';
import { utils } from 'ethers/lib/ethers';

const now = new Date();

const ForkPage = ({
  match: {
    params: { id },
  },
}: RouteComponentProps<{ id: string }>) => {
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
  const adjustedTotalSupply = useAdjustedTotalSupply();
  const forkThreshold = useForkThreshold();
  const forkThresholdBPS = useForkThresholdBPS();
  const numTokensInForkEscrow = useNumTokensInForkEscrow();
  const userEscrowedNounIds = useUserEscrowedNounIds(dataFetchPollInterval, id);
  const userOwnedNounIds = useUserOwnedNounIds(dataFetchPollInterval);
  const escrowEvents = useEscrowEvents(dataFetchPollInterval, id);
  const forkDetails = useForkDetails(dataFetchPollInterval, id || '');
  const forks = useForks(dataFetchPollInterval);
  const { account } = useEthers();
  const phantomListItems = new Array(4 - (forkDetails.data.addedNouns.length! % 4)).fill(0);
  const forkTreasuryBalance = useForkTreasuryBalance(forkDetails.data.forkTreasury || '');
  useScrollToLocation();
  const refetchForkData = () => {
    userOwnedNounIds.refetch();
    userEscrowedNounIds.refetch();
    escrowEvents.refetch();
    forkDetails.refetch();
    forks.refetch();
  };

  const handlePercentageToThreshold = () => {
    if (forkThreshold !== undefined && adjustedTotalSupply && numTokensInForkEscrow) {
      if (isForkPeriodActive || isForked) {
        const currentPercentage = (forkDetails.data.tokensForkingCount / (forkThreshold + 1)) * 100;
        setCurrentEscrowPercentage(+currentPercentage.toFixed(2));
      } else {
        const currentPercentage = (numTokensInForkEscrow / (forkThreshold + 1)) * 100;
        setCurrentEscrowPercentage(+currentPercentage.toFixed(2));
      }
    }
  };

  useEffect(() => {
    // trigger data updates on modal close
    refetchForkData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, isWithdrawModalOpen, isDeployModalOpen, isForkPeriodActive]);

  useEffect(() => {
    if (
      forkDetails?.data?.forkingPeriodEndTimestamp &&
      +forkDetails.data.forkingPeriodEndTimestamp > now.getTime() / 1000
    ) {
      // 'forking'
      setForkStatusLabel('Forking');
      setAddNounsButtonLabel('Join fork');
      setIsForkPeriodActive(true);
    } else if (
      forkDetails?.data?.forkingPeriodEndTimestamp &&
      +forkDetails.data.forkingPeriodEndTimestamp < now.getTime() / 1000
    ) {
      // 'forked' === executed and forking period ended
      setIsForked(true);
      setForkStatusLabel('Forked');
    } else if (
      !forkDetails?.data?.forkingPeriodEndTimestamp &&
      forkDetails?.data?.tokensInEscrowCount
    ) {
      // 'escrow'
      setForkStatusLabel('Escrow');
      setAddNounsButtonLabel('Add Nouns to escrow');
    } else {
      // 'pre-escrow'
      setForkStatusLabel('Pre-escrow');
      setAddNounsButtonLabel('Add Nouns to Start Escrow Period');
    }
    // threshold
    if (
      numTokensInForkEscrow &&
      forkThreshold !== undefined &&
      numTokensInForkEscrow > forkThreshold
    ) {
      setIsThresholdMet(true);
    } else {
      setIsThresholdMet(false);
    }
    if (forkThresholdBPS !== undefined && adjustedTotalSupply && numTokensInForkEscrow) {
      const percentage = forkThresholdBPS / 100;
      setThresholdPercentage(+percentage.toFixed());
      handlePercentageToThreshold();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isModalOpen,
    isForkPeriodActive,
    numTokensInForkEscrow,
    forkDetails,
    forkThreshold,
    adjustedTotalSupply,
    forks.data,
    id,
  ]);

  useEffect(() => {
    // set page layout based on data
    if (forks.data && forkDetails.data) {
      // match id to upcoming fork id
      if (
        forks?.data.length === 0 ||
        (forks?.data.length > 0 && +id === +forks.data[forks.data.length - 1].id + 1)
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

  if (forks.data.length > 0 && +id > +forks.data[forks.data.length - 1].id + 1) {
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
                (!escrowEvents.data || isNewForkPage) && classes.emptyState,
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
                      More than {forkThreshold === undefined ? '...' : forkThreshold} Nouns{' '}
                      {`(${forkThresholdBPS && forkThresholdBPS / 100}% of the DAO)`} are required
                      to pass the threshold
                    </Trans>
                  </p>
                )}
              </Col>
              {!isForked && (
                <Col
                  lg={6}
                  className={clsx(classes.buttons, !escrowEvents.data && classes.emptyState)}
                >
                  {!isForkPeriodActive &&
                    userEscrowedNounIds &&
                    userEscrowedNounIds.data?.length > 0 && (
                      <WithdrawNounsButton
                        tokenIds={userEscrowedNounIds.data}
                        isWithdrawModalOpen={isWithdrawModalOpen}
                        setIsWithdrawModalOpen={setIsWithdrawModalOpen}
                        setDataFetchPollInterval={setDataFetchPollInterval}
                      />
                    )}
                  <button
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
                      isPeriodEnded={
                        forkDetails?.data?.executed &&
                          +forkDetails.data.forkingPeriodEndTimestamp < now.getTime() / 1000
                          ? true
                          : false
                      }
                    />

                  </div>
                )}
              <div className={clsx(classes.isForked)}>
                {forkDetails.data.executedAt && (
                  <p>
                    <strong>
                      This fork was executed on{' '}
                      {dayjs
                        .unix(+forkDetails.data.executedAt)
                        .format('MMM D, YYYY')}
                    </strong>
                  </p>
                )}
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
                <p>
                  Fork treasury balance: Ξ
                  {Number(utils.formatEther(forkTreasuryBalance)).toFixed(2)}
                </p>
              </div>
            </div>
          </Col>
        </Section>
      )}

      {!isNewForkPage && escrowEvents.data && (
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
                        {forkDetails.data?.tokensForkingCount !== undefined
                          ? forkDetails.data?.tokensForkingCount
                          : '...'}
                      </>
                    ) : (
                      <>{numTokensInForkEscrow !== undefined ? numTokensInForkEscrow : '...'}</>
                    )}{' '}
                    Noun
                    {isForkPeriodActive || isForked
                      ? forkDetails.data?.tokensForkingCount === 1
                        ? ''
                        : 's'
                      : numTokensInForkEscrow === 1
                        ? ''
                        : 's'}
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
                  isUserConnected={account ? true : false}
                />

                {(isForkPeriodActive || isForked) && (
                  <div className={classes.nounsInFork}>
                    {forkDetails.data.addedNouns.map((nounId, i) => (
                      <a href={`/noun/${nounId}`} target="_blank" rel="noreferrer" key={i}>
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
                {!isForked && userEscrowedNounIds.data && userEscrowedNounIds.data.length > 0 && (
                  <div className={clsx(classes.userNouns, classes.callout)}>
                    <p>
                      Your Noun{userEscrowedNounIds.data.length > 1 && 's'} in escrow:{' '}
                      <strong>
                        {userEscrowedNounIds.data.map(nounId => `Noun ${nounId}`).join(', ')}
                      </strong>
                    </p>
                  </div>
                )}
                {escrowEvents.data &&
                  escrowEvents.data.map((event, i) => {
                    if (event?.eventType === 'ForkingEnded') {
                      if (
                        event.createdAt &&
                        forkDetails.data.forkingPeriodEndTimestamp &&
                        now.getTime() / 1000 < +forkDetails.data.forkingPeriodEndTimestamp
                      ) {
                        return null;
                      }
                    }
                    return (
                      <ForkEvent
                        event={event}
                        isOnlyEvent={escrowEvents.data.length > 1 ? false : true}
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
