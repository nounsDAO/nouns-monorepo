import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import classes from './Fork.module.css';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import Section from '../../layout/Section';
import { Col, Container, Row } from 'react-bootstrap';
import AddNounsToForkModal from '../../components/AddNounsToForkModal';
import ForkingPeriodTimer from '../../components/ForkingPeriodTimer';
import { Fork, useEscrowEvents, useForkDetails, useForkThreshold, useIsForkPeriodActive, useNumTokensInForkEscrow, useWithdrawFromForkEscrow } from '../../wrappers/nounsDao';
import { useEthers } from '@usedapp/core';
import { useTotalSupply, useUserEscrowedNounIds, useUserOwnedNounIds } from '../../wrappers/nounToken';
import ForkEvent from './ForkEvent';
import DeployForkButton from './DeployForkButton';
import WithdrawNounsButton from './WithdrawNounsButton';
import { useScrollToLocation } from '../../hooks/useScrollToLocation';
import { RouteComponentProps } from 'react-router-dom';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import dayjs from 'dayjs';
import ForkDeployEvent from './ForkDeployEvent';


const now = new Date();
const dummyForkingDates = {
  startTime: now.getTime() / 1000,
  endTime: now.getTime() / 1000 + 86400
}
const nounsInFork = Array.from(Array(160), (_, x) => Math.floor(Math.random() * 737));


const ForkPage = ({
  match: {
    params: { id },
  },
}: RouteComponentProps<{ id: string }>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isThresholdMet, setIsThresholdMet] = useState(false);
  const [thresholdPercentage, setThresholdPercentage] = useState(0);
  const [currentEscrowPercentage, setCurrentEscrowPercentage] = useState(0);
  const [dataFetchPollInterval, setDataFetchPollInterval] = useState(0);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [forkStatusLabel, setForkStatusLabel] = useState('Escrow');
  const [addNounsButtonLabel, setAddNounsButtonLabel] = useState('Add Nouns to escrow');
  const [isForked, setIsForked] = useState(false);
  const [isNewForkPage, setIsNewForkPage] = useState(false);
  const isForkPeriodActive = useIsForkPeriodActive();
  const totalSupply = useTotalSupply();
  const forkThreshold = useForkThreshold();
  const numTokensInForkEscrow = useNumTokensInForkEscrow();
  const userEscrowedNounIds = useUserEscrowedNounIds(dataFetchPollInterval);
  const userOwnedNounIds = useUserOwnedNounIds(dataFetchPollInterval);
  const escrowEvents = useEscrowEvents(+id);
  const forkDetails = useForkDetails(id || '');
  const { account } = useEthers();

  useScrollToLocation();

  const refetchForkData = () => {
    userOwnedNounIds.refetch();
    userEscrowedNounIds.refetch();
    escrowEvents.refetch();
  }

  useEffect(() => {
    // trigger data updates on modal close
    refetchForkData();
    console.log(isForkPeriodActive, numTokensInForkEscrow, forkThreshold);
  }, [isModalOpen, isWithdrawModalOpen, isForkPeriodActive]);

  useEffect(() => {
    if (forkDetails.data) {
      if (forkDetails.data.forkingPeriodEndTimestamp && +forkDetails.data.forkingPeriodEndTimestamp > now.getTime() / 1000) {
        // 'forking'
        setForkStatusLabel('Forking');
        setAddNounsButtonLabel('Join fork');
      } else if (forkDetails.data.forkingPeriodEndTimestamp && +forkDetails.data.forkingPeriodEndTimestamp < now.getTime() / 1000) {
        // 'forked' === executed and forking period ended
        setIsForked(true);
        setForkStatusLabel('Forked');
      } else if (!forkDetails.data.forkingPeriodEndTimestamp && forkDetails.data.tokensInEscrowCount) {
        // 'escrow'
        setForkStatusLabel('Escrow');
        setAddNounsButtonLabel('Add Nouns to escrow');
      } else {
        // 'pre-escrow'
        setForkStatusLabel('Pre-escrow');
        setAddNounsButtonLabel('Add Nouns to Start Escrow Period');
      }
    }

    // threshold
    if ((numTokensInForkEscrow && forkThreshold !== undefined) && numTokensInForkEscrow >= forkThreshold) {
      setIsThresholdMet(true);
    }
    if (forkThreshold !== undefined && totalSupply && numTokensInForkEscrow) {
      const percentage = (forkThreshold / totalSupply) * 100;
      const currentPercentage = (numTokensInForkEscrow / forkThreshold) * 100;
      setThresholdPercentage(+percentage.toFixed(2));
      setCurrentEscrowPercentage(+currentPercentage.toFixed(2));
    }

    if (id === 'new') {
      setIsNewForkPage(true);
    }
  }, [isForkPeriodActive, numTokensInForkEscrow, forkDetails, forkThreshold, totalSupply]);

  // useEffect(() => {
  //   if ((numTokensInForkEscrow && forkThreshold !== undefined) && numTokensInForkEscrow >= forkThreshold) {
  //     setIsThresholdMet(true);
  //   }
  // }, [forkThreshold, numTokensInForkEscrow]);

  // useEffect(() => {
  //   if (forkThreshold !== undefined && totalSupply && numTokensInForkEscrow) {
  //     const percentage = (forkThreshold / totalSupply) * 100;
  //     const currentPercentage = (numTokensInForkEscrow / forkThreshold) * 100;
  //     setThresholdPercentage(+percentage.toFixed(2));
  //     setCurrentEscrowPercentage(+currentPercentage.toFixed(2));
  //   }
  // }, [forkThreshold, totalSupply, numTokensInForkEscrow]);

  return (
    <>
      <Section fullWidth={false} className='h-100'>
        {isNewForkPage ? (
          <div className={clsx(
            classes.pageHeader,
            classes.emptyState,
          )}>
            <Col lg={12}>
              <header>
                <span className={clsx(classes.forkStatus)}>
                  {forkStatusLabel}
                </span>
                <h1><Trans>Nouns DAO Fork</Trans></h1>
                <p className='mb-4'><Trans>short intro about what it means to fork TKTK</Trans></p>
              </header>
              {userOwnedNounIds.data && userOwnedNounIds.data.length > 0 && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={clsx(classes.button, classes.primaryButton)}
                  disabled={userOwnedNounIds.data.length === 0}
                >
                  {addNounsButtonLabel}
                </button>
              )}
              <p className={classes.note}><Trans>
                {forkThreshold === undefined ? '...' : forkThreshold} Nouns {(`(${thresholdPercentage}%)`) || '...'} are required to meet the fork threshold
              </Trans></p>
            </Col>

          </div>
        ) : (
          <div className={clsx(
            classes.pageHeader,
            (!escrowEvents.data || isNewForkPage) && classes.emptyState,
            isForked && classes.isForked
          )}>
            <Col lg={6}>
              <span className={clsx(classes.forkStatus)}>
                {forkStatusLabel}
              </span>
              <h1><Trans>Nouns DAO Fork{isForked && ` #${id}`}</Trans></h1>
              {!isForkPeriodActive || !isForked && (
                <p><Trans>
                  {forkThreshold === undefined ? '...' : forkThreshold} Nouns {(`(${thresholdPercentage}%)`) || '...'} are required to meet the threshold
                </Trans></p>
              )}

            </Col>
            {!isForked && (
              <Col lg={6} className={clsx(
                classes.buttons,
                !escrowEvents.data && classes.emptyState
              )}>
                {(!isForkPeriodActive && userEscrowedNounIds && userEscrowedNounIds.data?.length > 0) && (
                  <WithdrawNounsButton tokenIds={userEscrowedNounIds.data} isWithdrawModalOpen={setIsWithdrawModalOpen} setDataFetchPollInterval={setDataFetchPollInterval} />
                )}
                {userOwnedNounIds.data && userOwnedNounIds.data.length > 0 && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className={clsx(classes.button, classes.primaryButton)}
                    disabled={userOwnedNounIds.data.length === 0}
                  >
                    {addNounsButtonLabel}
                  </button>
                )}
              </Col>
            )}
          </div>
        )}


      </Section>
      {isForkPeriodActive && (
        <Section fullWidth={false}>
          <div className={clsx(classes.countdown, classes.callout)}>
            <ForkingPeriodTimer endTime={+forkDetails.data.forkingPeriodEndTimestamp} isPeriodEnded={false} />
            <p>
              time left to return Nouns and join this fork.
            </p>
          </div>
        </Section>
      )}
      {isForked && (
        <Section fullWidth={false}>
          <div className={clsx(classes.callout, classes.isForked)}>
            <p>
              <Trans><strong>This fork was executed on {dayjs.unix(+forkDetails.data.forkingPeriodEndTimestamp).format('DD/MM/YYYY')}</strong></Trans>
            </p>
            <p>Fork contracts:{" "}
              {/* awaiting data */}
              {/* <a
                  href={buildEtherscanAddressLink(forkDetails.data.TKTK)}
                  target='_blank'
                  rel='noreferrer'
                >
                  Governor
                </a>,{" "} */}
              <a
                href={buildEtherscanAddressLink(forkDetails.data.forkTreasury)}
                target='_blank'
                rel='noreferrer'
              >
                Treasury
              </a>,{" "}
              <a
                href={buildEtherscanAddressLink(forkDetails.data.forkToken)}
                target='_blank'
                rel='noreferrer'
              >
                Token
              </a>,{" "}
              {/* awaiting data */}
              {/* <a
                  href={buildEtherscanAddressLink(forkDetails.data.TKTK)}
                  target='_blank'
                  rel='noreferrer'
                >Timelock</a> */}
            </p>
          </div>
        </Section>
      )}
      {!isNewForkPage && escrowEvents.data && (
        <div className={clsx(classes.forkTimelineWrapper, isForkPeriodActive && classes.isForkingPeriod)}>
          <Container>
            <Row className={classes.forkTimeline}>
              <Col lg={3} className={classes.sidebar}>
                <div className={classes.summary}>
                  <span>
                    {isForkPeriodActive || isForked ? 'in fork' : 'in escrow'}
                  </span>
                  <strong>
                    {isForkPeriodActive || isForked ? <>
                      {forkDetails.data?.tokensForkingCount !== undefined ? forkDetails.data?.tokensInEscrowCount : '...'}
                    </> : <>
                      {numTokensInForkEscrow !== undefined ? numTokensInForkEscrow : '...'}
                    </>}

                    {" "}Noun{numTokensInForkEscrow === 1 ? '' : 's'}
                  </strong>
                  {!isForkPeriodActive || !isForked && (
                    <span>
                      {currentEscrowPercentage !== undefined && `${currentEscrowPercentage}%`}
                    </span>
                  )}
                </div>
                {!isForkPeriodActive && isThresholdMet && (
                  <DeployForkButton />
                )}
                {isForkPeriodActive && (
                  <div className={classes.nounsInFork}>
                    {nounsInFork.map((nounId) => (
                      <a href={`/noun/${nounId}`}><img src={`https://noun.pics/${nounId}`} alt="noun" className={classes.nounImage} /></a>
                    ))}
                  </div>
                )}
              </Col>
              <Col lg={9} className={classes.events}>
                {!isForked && userEscrowedNounIds.data && userEscrowedNounIds.data.length > 0 && (
                  <div className={clsx(classes.userNouns, classes.callout)}>
                    <p>
                      Your Noun{userEscrowedNounIds.data.length > 1 && 's'} in escrow: <strong>{userEscrowedNounIds.data.map((nounId) => `Noun ${nounId}`).join(', ')}</strong>
                    </p>
                  </div>
                )}
                {/* if forked, add fork event to top of list */}
                <ForkDeployEvent forkDetails={forkDetails.data} />
                {escrowEvents.data && escrowEvents.data.map((event, i) => <ForkEvent event={event} />)}
              </Col>
            </Row>
          </Container>
        </div >
      )}
      {
        account && (
          <>
            <AddNounsToForkModal
              setIsModalOpen={setIsModalOpen}
              isModalOpen={isModalOpen}
              isForkingPeriod={false}
              title={'Add Nouns to escrow'}
              description={"Nouners can withdraw their tokens from escrow as long as the forking period hasn't started. Nouns in escrow are not eligible to vote or submit proposals."}
              selectLabel={'Select Nouns to escrow'}
              selectDescription={'Add as many or as few of your Nouns as you’d like.  Additional Nouns can be added during the escrow period.'}
              account={account}
              ownedNouns={userOwnedNounIds.data}
              userEscrowedNouns={userEscrowedNounIds.data}
              refetchData={refetchForkData}
              setDataFetchPollInterval={setDataFetchPollInterval}
            />
            {/* {currentState === 'forking' ? (
            <AddNounsToForkModal
              setIsModalOpen={setIsModalOpen}
              isModalOpen={isModalOpen}
              isForkingPeriod={true}
              title={'Join the fork'}
              description={"By joining this fork you are giving up your Nouns to be retrieved in the new fork. This cannot be undone."}
              selectLabel={'Select Nouns to join the fork'}
              selectDescription={'Add as many or as few of your Nouns as you’d like.  Additional Nouns can be added during the forking period'}
              account={account}
            />
          ) : (
            <AddNounsToForkModal
              setIsModalOpen={setIsModalOpen}
              isModalOpen={isModalOpen}
              isForkingPeriod={false}
              title={'Add Nouns to escrow'}
              description={"Nouners can withdraw their tokens from escrow as long as the forking period hasn't started. Nouns in escrow are not eligible to vote or submit proposals."}
              selectLabel={'Select Nouns to escrow'}
              selectDescription={'Add as many or as few of your Nouns as you’d like.  Additional Nouns can be added during the escrow period.'}
              account={account}
            />
          )} */}
          </>
        )
      }
    </>
  );
};
export default ForkPage;
