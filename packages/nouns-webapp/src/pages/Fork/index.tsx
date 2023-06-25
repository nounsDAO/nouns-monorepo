import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import classes from './Fork.module.css';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import Section from '../../layout/Section';
import { Col, Container, Row } from 'react-bootstrap';
import AddNounsToForkModal from '../../components/AddNounsToForkModal';
import ForkingPeriodTimer from '../../components/ForkingPeriodTimer';
import { useEscrowEvents, useEscrowToFork, useForkThreshold, useIsForkPeriodActive, useNumTokensInForkEscrow, useWithdrawFromForkEscrow } from '../../wrappers/nounsDao';
import { TransactionStatus, useEthers } from '@usedapp/core';
import { useSetApprovalForAll, useTotalSupply, useUserEscrowedNounIds, useUserOwnedNounIds } from '../../wrappers/nounToken';
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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');
  const { escrowToFork, escrowToForkState } = useEscrowToFork();
  const { setApproval, setApprovalState } = useSetApprovalForAll();
  const isForkPeriodActive = useIsForkPeriodActive();
  const totalSupply = useTotalSupply();
  const forkThreshold = useForkThreshold();
  const numTokensInForkEscrow = useNumTokensInForkEscrow();
  // const getUserEscrowedNounIds = useUserEscrowedNounIds();
  const userEscrowedNounIds = useUserEscrowedNounIds(dataFetchPollInterval);
  // const getUserOwnedNouns = useUserOwnedNounIds();
  // const { userOwnedNounIdsLoading, userOwnedNouns, userOwnedNounIdsError, refetchUserOwnedNounIds } = useUserOwnedNounIds();
  const userOwnedNounIds = useUserOwnedNounIds(dataFetchPollInterval);
  const escrowEvents = useEscrowEvents();
  const [isEscrowPeriodActive, setIsEscrowPeriodActive] = useState(false); // true if not forking and 1 or more nouns in escrow
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const { withdrawFromForkEscrow, withdrawFromForkEscrowState } = useWithdrawFromForkEscrow();

  // const [userOwnedNouns, setUserOwnedNouns] = useState<number[] | undefined>(ownedNouns);
  // const [userEscrowedNounIds, setUserEscrowedNounIds] = useState<number[] | undefined>(escrowedNouns);
  // console.log('getUserOwnedNouns', getUserOwnedNouns, 'userOwnedNouns', userOwnedNouns, 'userEscrowedNounIds', userEscrowedNounIds);



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

  // useEffect(() => {
  //   console.log('userOwnedNounIdsLoading', userOwnedNounIdsLoading);
  //   console.log('ownedNouns', ownedNouns);
  //   console.log('userOwnedNounIdsError', userOwnedNounIdsError);
  //   setUserOwnedNouns(ownedNouns);
  //   setUserEscrowedNounIds(escrowedNouns);
  // }, [userOwnedNounIdsLoading, userEscrowedNounIdsLoading]);

  // useEffect(() => {
  //   console.log('userOwnedNounIdsLoading', userOwnedNounIdsLoading);
  //   console.log('ownedNouns', ownedNouns);
  //   console.log('userOwnedNouns', userOwnedNouns);
  //   setUserOwnedNouns(ownedNouns);
  //   // setUserEscrowedNounIds(escrowedNouns);
  // }, [userOwnedNounIdsRefetch]);

  useEffect(() => {
    if (isForkPeriodActive) {
      setCurrentState('forking');
    }
    if (!isForkPeriodActive && numTokensInForkEscrow !== undefined && numTokensInForkEscrow >= 1) {
      setIsEscrowPeriodActive(true);
      setCurrentState('escrow');
    }
  }, [forkThreshold]);

  useEffect(() => {
    if ((numTokensInForkEscrow && forkThreshold !== undefined) && numTokensInForkEscrow >= forkThreshold) {
      setIsThresholdMet(true);
      setCurrentState('escrow threshold met');
    }
  }, [forkThreshold, numTokensInForkEscrow]);

  const { account } = useEthers();

  useEffect(() => {
    if (forkThreshold !== undefined && totalSupply && numTokensInForkEscrow) {
      console.log('forkThreshold', forkThreshold, 'totalSupply', totalSupply, 'numTokensInForkEscrow', numTokensInForkEscrow);
      const percentage = (forkThreshold / totalSupply) * 100;
      setThresholdPercentage(+percentage.toFixed(2));
      const currentPercentage = (numTokensInForkEscrow / forkThreshold) * 100;
      setCurrentEscrowPercentage(+currentPercentage.toFixed(2));
    }
  }, [forkThreshold, totalSupply, numTokensInForkEscrow]);



  const handleWithdrawFromForkEscrowState = useCallback((state: TransactionStatus) => {
    switch (state.status) {
      case 'None':
        setIsLoading(false);
        break;
      case 'Mining':
        setIsLoading(true);
        break;
      case 'Success':
        setIsLoading(false);
        break;
      case 'Fail':
        // setErrorMessage(state?.errorMessage || <Trans>Please try again.</Trans>);
        setIsLoading(false);
        break;
      case 'Exception':
        // setErrorMessage(
        //   // getVoteErrorMessage(state?.errorMessage) || <Trans>Please try again.</Trans>,
        // );
        setIsLoading(false);
        break;
    }
  }, []);


  // const handleSetApprovalStateChange = useCallback((state: TransactionStatus) => {
  //   switch (state.status) {
  //     case 'None':
  //       setIsLoading(false);
  //       break;
  //     case 'Mining':
  //       setIsLoading(true);
  //       break;
  //     case 'Success':
  //       setIsLoading(false);
  //       break;
  //     case 'Fail':
  //       setErrorMessage(state?.errorMessage || <Trans>Please try again.</Trans>);
  //       setIsLoading(false);
  //       break;
  //     case 'Exception':
  //       // setErrorMessage(
  //       //   // getVoteErrorMessage(state?.errorMessage) || <Trans>Please try again.</Trans>,
  //       // );
  //       setIsLoading(false);
  //       break;
  //   }
  // }, []);

  // const handleEscrowToForkStateChange = useCallback((state: TransactionStatus) => {
  //   switch (state.status) {
  //     case 'None':
  //       setIsLoading(false);
  //       break;
  //     case 'Mining':
  //       setIsLoading(true);
  //       break;
  //     case 'Success':
  //       setIsLoading(false);
  //       // setIsVoteSuccessful(true);
  //       break;
  //     case 'Fail':
  //       // setFailureCopy(<Trans>Transaction Failed</Trans>);
  //       setErrorMessage(state?.errorMessage || <Trans>Please try again.</Trans>);
  //       setIsLoading(false);
  //       // setIsVoteFailed(true);
  //       break;
  //     case 'Exception':
  //       // setFailureCopy(<Trans>Error</Trans>);
  //       // setErrorMessage(
  //       //   // getVoteErrorMessage(state?.errorMessage) || <Trans>Please try again.</Trans>,
  //       // );
  //       setIsLoading(false);
  //       // setIsVoteFailed(true);
  //       break;
  //   }
  // }, []);

  // useEffect(() => {
  //   handleEscrowToForkStateChange(escrowToForkState);
  // }, [escrowToForkState, handleEscrowToForkStateChange]);

  // useEffect(() => {
  //   handleSetApprovalStateChange(setApprovalState);
  // }, [setApprovalState, handleSetApprovalStateChange]);

  useEffect(() => {
    handleWithdrawFromForkEscrowState(withdrawFromForkEscrowState);
  }, [withdrawFromForkEscrowState, handleWithdrawFromForkEscrowState]);

  // useEffect(() => {
  //   handleForkThresholdStateChange(forkThresholdState);
  // }, [forkThresholdState, handleForkThresholdStateChange]);


  return (
    <>
      {userOwnedNounIds.data && userOwnedNounIds.data.map((nounId) => (
        nounId
      ))}
      {/* temp state changer */}
      {/* <div className={classes.tempStateChanger}>
        <button
          className={clsx(currentState === 'escrow' && classes.active)}
          onClick={() => setCurrentState('escrow')}>escrow</button>
        <button
          className={clsx(currentState === 'nouns added' && classes.active)}
          onClick={() => setCurrentState('nouns added')}>user's nouns added</button>
        <button
          className={clsx(currentState === 'escrow threshold met' && classes.active)}
          onClick={() => setCurrentState('escrow threshold met')}>escrow threshold met</button>
        <button
          className={clsx(currentState === 'forking' && classes.active)}
          onClick={() => setCurrentState('forking')}>forking</button>
      </div> */}
      <Section fullWidth={false} className='al'>
        <div className={clsx(
          classes.pageHeader,
          !escrowEvents.data && classes.emptyState
        )}>
          <Col lg={6}>
            <span className={clsx(classes.forkStatus)}>
              {currentState === 'escrow' && 'Escrow'}
              {currentState === 'nouns added' && 'Escrow'}
              {currentState === 'escrow threshold met' && 'Escrow'}
              {currentState === 'forking' && 'Forking'}
              {currentState === 'pre-escrow' && 'Pre-escrow'}

              {" "}Period
            </span>
            <h1><Trans>Nouns DAO Fork</Trans></h1>
            {currentState === 'forking' ? (
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
            !isEscrowPeriodActive && !isForkPeriodActive && classes.emptyState
          )}>
            {!isForkPeriodActive && userEscrowedNounIds && userEscrowedNounIds.data?.length > 0 && (
              <WithdrawNounsButton tokenIds={userEscrowedNounIds.data} isWithdrawModalOpen={setIsWithdrawModalOpen} isForkPeriodActive={isForkPeriodActive} setDataFetchPollInterval={setDataFetchPollInterval} />
            )}
            {userOwnedNounIds.data && userOwnedNounIds.data.length > 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className={clsx(classes.button, classes.primaryButton)}>
                {currentState === 'pre-escrow' && 'Add Nouns to Start Escrow Period'}
                {(currentState === 'escrow' || currentState === 'escrow threshold met' || currentState === 'nouns added') && 'Add Nouns to escrow'}
                {currentState === 'forking' && 'Join fork'}
              </button>
            )}
            {/* <button className={clsx(classes.button, classes.primaryButton)}
              onClick={async () => {
                setApproval(config.addresses.nounsDAOProxy, true);
              
              }}
            >Add Nouns to Escrow [contract] </button> */}
          </Col>
        </div>
      </Section>
      {currentState === 'forking' && (
        <Section fullWidth={false} className='al'>
          <div className={clsx(classes.countdown, classes.callout)}>
            <ForkingPeriodTimer endTime={dummyForkingDates.endTime} isPeriodEnded={false} />
            <p>
              time left to return Nouns and join this fork.
            </p>
          </div>
        </Section>
      )}
      {/* {(isEscrowPeriodActive || isForkPeriodActive) && ( */}
      {escrowEvents.data && (
        <div className={clsx(classes.forkTimelineWrapper, currentState === 'forking' && classes.isForkingPeriod)}>
          <Container>
            <Row className={classes.forkTimeline}>
              <Col lg={3} className={classes.sidebar}>
                <div className={classes.summary}>
                  <span>
                    {(currentState === 'escrow' || currentState === 'nouns added' || currentState === 'escrow threshold met') && 'in escrow'}
                    {currentState === 'forking' && 'joined this fork'}
                  </span>
                  {numTokensInForkEscrow && (
                    <strong>
                      {numTokensInForkEscrow !== undefined ? numTokensInForkEscrow : '...'}
                      {" "}Noun{numTokensInForkEscrow > 1 && 's'}
                    </strong>
                  )}
                  <span>
                    {currentEscrowPercentage > 0 && `${currentEscrowPercentage}%`}
                  </span>
                </div>
                {isThresholdMet && (
                  <DeployForkButton />
                )}
                {currentState === 'forking' && (
                  <div className={classes.nounsInFork}>
                    {nounsInFork.map((nounId) => (
                      <a href={`/noun/${nounId}`}><img src={`https://noun.pics/${nounId}`} alt="noun" className={classes.nounImage} /></a>
                    ))}
                  </div>
                )}
              </Col>
              <Col lg={9} className={classes.events}>
                {/* {currentState === 'nouns added' && ( */}
                {userEscrowedNounIds.data && userEscrowedNounIds.data.length > 0 && (
                  <div className={clsx(classes.userNouns, classes.callout)}>
                    <p>
                      Your Noun{userEscrowedNounIds.data.length > 1 && 's'} in escrow: <strong>{userEscrowedNounIds.data.map((nounId) => `Noun ${nounId}`).join(', ')}</strong>
                    </p>
                  </div>
                )}
                {escrowEvents.data && escrowEvents.data.map((event, i) => <ForkEvent event={event} />)}
                {/* {currentState === 'forking' && (
                <>
                  <div className={classes.forkTimelineItem}>
                    <header>
                      <span className={classes.timestamp}>1 hour ago</span>
                      <h3 className={classes.eventTitle}>Noun321.eth added 1 Noun</h3>
                      <div className={classes.nounsList}>
                        <a href={`/noun/${Math.floor(Math.random() * 737)}`}><img src={`https://noun.pics/${Math.floor(Math.random() * 737)}`} alt="noun" className={classes.nounImage} /></a>
                      </div>
                    </header>
                  </div>
                  <div className={classes.forkTimelineItem}>
                    <header>
                      <span className={classes.timestamp}>3 hours ago</span>
                      <h3 className={classes.eventTitle}>NounXYZ.eth added 2 Nouns</h3>
                      <p className={classes.message}>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Nulla vitae elit libero, a pharetra augue.</p>
                      <div className={classes.nounsList}>
                        <a href={`/noun/${Math.floor(Math.random() * 737)}`}><img src={`https://noun.pics/${Math.floor(Math.random() * 737)}`} alt="noun" className={classes.nounImage} /></a>
                        <a href={`/noun/${Math.floor(Math.random() * 737)}`}><img src={`https://noun.pics/${Math.floor(Math.random() * 737)}`} alt="noun" className={classes.nounImage} /></a>
                      </div>
                      <div className={classes.proposals}>
                        <p className={classes.sectionLabel}>
                          <Trans>Offending proposals</Trans>
                        </p>
                        <ul>
                          <li><a href="/vote/282"><strong>282</strong> Dynamic Quorum Updates</a></li>
                          <li><a href="/vote/123"><strong>123</strong> Prop 56 FUN Frames Re-evaluation</a></li>
                          <li><a href="/vote/282"><strong>99</strong> Sailing PR campaign, Korea Blockchain Week 2022 [6,7 August]</a></li>
                        </ul>
                      </div>
                    </header>
                  </div>
                  <div className={clsx(classes.forkTimelineItem, classes.forkDeployed)}>
                    <header>
                      <span className={classes.timestamp}>1 day ago</span>
                      <h3 className={classes.eventTitle}>Fork deployed</h3>
                    </header>
                  </div>
                </>)} */}
                {/* <div className={classes.forkTimelineItem}>
                <header>
                  <span className={classes.timestamp}>2 days ago</span>
                  <h3 className={classes.eventTitle}>Noun123.eth added 6 Nouns</h3>
                  <p className={classes.message}>Etiam porta sem malesuada magna mollis euismod. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
                  <div className={classes.nounsList}>
                    <a href={`/noun/${Math.floor(Math.random() * 737)}`}><img src={`https://noun.pics/${Math.floor(Math.random() * 737)}`} alt="noun" className={classes.nounImage} /></a>
                    <a href={`/noun/${Math.floor(Math.random() * 737)}`}><img src={`https://noun.pics/${Math.floor(Math.random() * 737)}`} alt="noun" className={classes.nounImage} /></a>
                    <a href={`/noun/${Math.floor(Math.random() * 737)}`}><img src={`https://noun.pics/${Math.floor(Math.random() * 737)}`} alt="noun" className={classes.nounImage} /></a>
                    <a href={`/noun/${Math.floor(Math.random() * 737)}`}><img src={`https://noun.pics/${Math.floor(Math.random() * 737)}`} alt="noun" className={classes.nounImage} /></a>
                    <a href={`/noun/${Math.floor(Math.random() * 737)}`}><img src={`https://noun.pics/${Math.floor(Math.random() * 737)}`} alt="noun" className={classes.nounImage} /></a>
                    <a href={`/noun/${Math.floor(Math.random() * 737)}`}><img src={`https://noun.pics/${Math.floor(Math.random() * 737)}`} alt="noun" className={classes.nounImage} /></a>
                  </div>
                  <div className={classes.proposals}>
                    <p className={classes.sectionLabel}>
                      <Trans>Offending proposals</Trans>
                    </p>
                    <ul>
                      <li><a href="/vote/282"><strong>282</strong> Dynamic Quorum Updates</a></li>
                      <li><a href="/vote/123"><strong>123</strong> Prop 56 FUN Frames Re-evaluation</a></li>
                      <li><a href="/vote/282"><strong>99</strong> Sailing PR campaign, Korea Blockchain Week 2022 [6,7 August]</a></li>
                    </ul>
                  </div>
                </header>
              </div> */}
                {/* <div className={clsx(classes.forkTimelineItem, classes.eventRemove)}>
                <header>
                  <span className={classes.timestamp}>4 days ago</span>
                  <h3 className={classes.eventTitle}>NounABC.eth withdrew 3 Nouns from escrow</h3>
                  <div className={classes.nounsList}>
                    <a href={`/noun/123`}><img src={`https://noun.pics/123`} alt="noun" className={classes.nounImage} /></a>
                    <a href={`/noun/124`}><img src={`https://noun.pics/124`} alt="noun" className={classes.nounImage} /></a>
                    <a href={`/noun/125`}><img src={`https://noun.pics/125`} alt="noun" className={classes.nounImage} /></a>
                  </div>
                </header>
              </div>
              <div className={classes.forkTimelineItem}>
                <header>
                  <span className={classes.timestamp}>5 days ago</span>
                  <h3 className={classes.eventTitle}>Noun123.eth added 6 Nouns</h3>
                  <p className={classes.message}>Etiam porta sem malesuada magna mollis euismod. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
                  <div className={classes.nounsList}>
                    <a href={`/noun/${Math.floor(Math.random() * 737)}`}><img src={`https://noun.pics/${Math.floor(Math.random() * 737)}`} alt="noun" className={classes.nounImage} /></a>
                    <a href={`/noun/${Math.floor(Math.random() * 737)}`}><img src={`https://noun.pics/${Math.floor(Math.random() * 737)}`} alt="noun" className={classes.nounImage} /></a>
                    <a href={`/noun/${Math.floor(Math.random() * 737)}`}><img src={`https://noun.pics/${Math.floor(Math.random() * 737)}`} alt="noun" className={classes.nounImage} /></a>
                    <a href={`/noun/${Math.floor(Math.random() * 737)}`}><img src={`https://noun.pics/${Math.floor(Math.random() * 737)}`} alt="noun" className={classes.nounImage} /></a>
                    <a href={`/noun/${Math.floor(Math.random() * 737)}`}><img src={`https://noun.pics/${Math.floor(Math.random() * 737)}`} alt="noun" className={classes.nounImage} /></a>
                    <a href={`/noun/${Math.floor(Math.random() * 737)}`}><img src={`https://noun.pics/${Math.floor(Math.random() * 737)}`} alt="noun" className={classes.nounImage} /></a>
                  </div>
                  <div className={classes.proposals}>
                    <p className={classes.sectionLabel}>
                      <Trans>Offending proposals</Trans>
                    </p>
                    <ul>
                      <li><a href="/vote/282"><strong>282</strong> Dynamic Quorum Updates</a></li>
                      <li><a href="/vote/123"><strong>123</strong> Prop 56 FUN Frames Re-evaluation</a></li>
                      <li><a href="/vote/282"><strong>99</strong> Sailing PR campaign, Korea Blockchain Week 2022 [6,7 August]</a></li>
                    </ul>
                  </div>
                </header>
              </div>
              <div className={classes.forkTimelineItem}>
                <header>
                  <span className={classes.timestamp}>6 days ago</span>
                  <h3 className={classes.eventTitle}>NounABC.eth added 3 Nouns</h3>
                  <p className={classes.message}>Etiam porta sem malesuada magna mollis euismod. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
                  <div className={classes.nounsList}>
                    <a href={`/noun/123`}><img src={`https://noun.pics/123`} alt="noun" className={classes.nounImage} /></a>
                    <a href={`/noun/124`}><img src={`https://noun.pics/124`} alt="noun" className={classes.nounImage} /></a>
                    <a href={`/noun/125`}><img src={`https://noun.pics/125`} alt="noun" className={classes.nounImage} /></a>
                  </div>
                  <div className={classes.proposals}>
                    <p className={classes.sectionLabel}>
                      <Trans>Offending proposals</Trans>
                    </p>
                    <ul>
                      <li><a href="/vote/282"><strong>282</strong> Dynamic Quorum Updates</a></li>
                      <li><a href="/vote/123"><strong>123</strong> Prop 56 FUN Frames Re-evaluation</a></li>
                      <li><a href="/vote/282"><strong>99</strong> Sailing PR campaign, Korea Blockchain Week 2022 [6,7 August]</a></li>
                    </ul>
                  </div>
                </header>
              </div> */}
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
