import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import classes from './Fork.module.css';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import Section from '../../layout/Section';
import { Col, Container, Row } from 'react-bootstrap';
import AddNounsToForkModal from '../../components/AddNounsToForkModal';
import ForkingPeriodTimer from '../../components/ForkingPeriodTimer';
import { useEscrowEvents, useForkThreshold, useIsForkPeriodActive, useNumTokensInForkEscrow, useWithdrawFromForkEscrow } from '../../wrappers/nounsDao';
import { useEthers } from '@usedapp/core';
import { useTotalSupply, useUserEscrowedNounIds, useUserOwnedNounIds } from '../../wrappers/nounToken';
import ForkEvent from './ForkEvent';
import DeployForkButton from './DeployForkButton';
import WithdrawNounsButton from './WithdrawNounsButton';
import { useScrollToLocation } from '../../hooks/useScrollToLocation';

interface ForkPageProps { }
const now = new Date();
const dummyForkingDates = {
  startTime: now.getTime() / 1000,
  endTime: now.getTime() / 1000 + 86400
}
const nounsInFork = Array.from(Array(160), (_, x) => Math.floor(Math.random() * 737));


const ForkPage: React.FC<ForkPageProps> = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentState, setCurrentState] = useState('pre-escrow');
  const [isThresholdMet, setIsThresholdMet] = useState(false);
  const [thresholdPercentage, setThresholdPercentage] = useState(0);
  const [currentEscrowPercentage, setCurrentEscrowPercentage] = useState(0);
  const [dataFetchPollInterval, setDataFetchPollInterval] = useState(0);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [forkStatusLabel, setForkStatusLabel] = useState('Escrow');
  const [addNounsButtonLabel, setAddNounsButtonLabel] = useState('Add Nouns to escrow');
  const isForkPeriodActive = useIsForkPeriodActive();
  const totalSupply = useTotalSupply();
  const forkThreshold = useForkThreshold();
  const numTokensInForkEscrow = useNumTokensInForkEscrow();
  const userEscrowedNounIds = useUserEscrowedNounIds(dataFetchPollInterval);
  const userOwnedNounIds = useUserOwnedNounIds(dataFetchPollInterval);
  const escrowEvents = useEscrowEvents();
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
    if (isForkPeriodActive) {
      setForkStatusLabel('Forking');
      setAddNounsButtonLabel('Join fork');
    } else if (!isForkPeriodActive && !numTokensInForkEscrow) {
      setForkStatusLabel('Pre-escrow');
      setAddNounsButtonLabel('Add Nouns to Start Escrow Period');
    } else {
      setForkStatusLabel('Escrow');
      setAddNounsButtonLabel('Add Nouns to escrow');
    }
  }, [isForkPeriodActive, numTokensInForkEscrow]);

  useEffect(() => {
    if ((numTokensInForkEscrow && forkThreshold !== undefined) && numTokensInForkEscrow >= forkThreshold) {
      setIsThresholdMet(true);
      setCurrentState('escrow threshold met');
    }
  }, [forkThreshold, numTokensInForkEscrow]);

  useEffect(() => {
    if (forkThreshold !== undefined && totalSupply && numTokensInForkEscrow) {
      const percentage = (forkThreshold / totalSupply) * 100;
      const currentPercentage = (numTokensInForkEscrow / forkThreshold) * 100;
      setThresholdPercentage(+percentage.toFixed(2));
      setCurrentEscrowPercentage(+currentPercentage.toFixed(2));
    }
  }, [forkThreshold, totalSupply, numTokensInForkEscrow]);

  return (
    <>
      <Section fullWidth={false} className='al'>
        <div className={clsx(
          classes.pageHeader,
          !escrowEvents.data && classes.emptyState
        )}>
          <Col lg={6}>
            <span className={clsx(classes.forkStatus)}>
              {forkStatusLabel} Period
            </span>
            <h1><Trans>Nouns DAO Fork</Trans></h1>
            {isForkPeriodActive ? (
              <p>Fork contracts: <a
                href="https://etherscan.io/[link]"
                target='_blank'
                rel='noreferrer'
              >Governor</a>, <a
                href="https://etherscan.io/[link]"
                target='_blank'
                rel='noreferrer'
              >Token</a>, <a
                href="https://etherscan.io/[link]"
                target='_blank'
                rel='noreferrer'
              >Timelock</a></p>
            ) : (
              <p>{forkThreshold === undefined ? '...' : forkThreshold} Nouns {(`(${thresholdPercentage}%)`) || '...'} are required to meet the threshold</p>
            )}
          </Col>
          <Col lg={6} className={clsx(
            classes.buttons,
            !escrowEvents && classes.emptyState
          )}>
            {!isForkPeriodActive && userEscrowedNounIds && userEscrowedNounIds.data?.length > 0 && (
              <WithdrawNounsButton tokenIds={userEscrowedNounIds.data} isWithdrawModalOpen={setIsWithdrawModalOpen} setDataFetchPollInterval={setDataFetchPollInterval} />
            )}
            {userOwnedNounIds.data && userOwnedNounIds.data.length > 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className={clsx(classes.button, classes.primaryButton)}>
                {addNounsButtonLabel}
              </button>
            )}
          </Col>
        </div>
      </Section>
      {isForkPeriodActive && (
        <Section fullWidth={false} className='al'>
          <div className={clsx(classes.countdown, classes.callout)}>
            <ForkingPeriodTimer endTime={dummyForkingDates.endTime} isPeriodEnded={false} />
            <p>
              time left to return Nouns and join this fork.
            </p>
          </div>
        </Section>
      )}
      {escrowEvents.data && (
        <div className={clsx(classes.forkTimelineWrapper, currentState === 'forking' && classes.isForkingPeriod)}>
          <Container>
            <Row className={classes.forkTimeline}>
              <Col lg={3} className={classes.sidebar}>
                <div className={classes.summary}>
                  <span>
                    {isForkPeriodActive ? 'forking' : 'in escrow'}
                  </span>
                  <strong>
                    {numTokensInForkEscrow !== undefined ? numTokensInForkEscrow : '...'}
                    {" "}Noun{numTokensInForkEscrow === 1 ? '' : 's'}
                  </strong>
                  <span>
                    {currentEscrowPercentage !== undefined && `${currentEscrowPercentage}%`}
                  </span>
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
                {userEscrowedNounIds.data && userEscrowedNounIds.data.length > 0 && (
                  <div className={clsx(classes.userNouns, classes.callout)}>
                    <p>
                      Your Noun{userEscrowedNounIds.data.length > 1 && 's'} in escrow: <strong>{userEscrowedNounIds.data.map((nounId) => `Noun ${nounId}`).join(', ')}</strong>
                    </p>
                  </div>
                )}
                {escrowEvents.data && escrowEvents.data.map((event, i) => <ForkEvent event={event} />)}
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
      )}
    </>
  );
};
export default ForkPage;
