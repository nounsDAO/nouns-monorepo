import React, { useState } from 'react';
import classes from './Fork.module.css';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import Section from '../../layout/Section';
import { Col, Container, Row } from 'react-bootstrap';
import SolidColorBackgroundModal from '../../components/SolidColorBackgroundModal';
import AddNounsToForkModal from '../../components/AddNounsToForkModal';
import ForkingPeriodTimer from '../../components/ForkingPeriodTimer';

interface ForkPageProps { }

const dummyData = {
  states: ['escrow', 'nouns added', 'escrow threshold met', 'forking'],
  userNouns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
}

const now = new Date();
const dummyForkingDates = {
  startTime: now.getTime() / 1000,
  endTime: now.getTime() / 1000 + 86400
}

const ForkPage: React.FC<ForkPageProps> = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentState, setCurrentState] = useState('escrow');

  const confirmModalContent = (
    <div className={classes.confirmModalContent}>
      <h2 className={classes.modalTitle}>Confirm</h2>
      <p className={classes.modalDescription}>By joining this fork you are giving up your Nouns to be retrieved in the new fork. This cannot be undone.</p>
      <button className={clsx(classes.button, classes.primaryButton)}
      // onClick={() => setIsConfirmModalOpen(false)}
      >Join</button>
      <button className={clsx(classes.button, classes.secondaryButton)} onClick={() => setIsConfirmModalOpen(false)}>Cancel</button>
    </div>
  );

  return (
    <>
      {/* temp state changer */}
      <div className={classes.tempStateChanger}>
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
      </div>
      <Section fullWidth={false} className='al'>
        <div className={classes.pageHeader}>
          <Col lg={6}>
            <span className={clsx(classes.forkStatus)}>
              {currentState === 'escrow' && 'Escrow'}
              {currentState === 'nouns added' && 'Escrow'}
              {currentState === 'escrow threshold met' && 'Escrow'}
              {currentState === 'forking' && 'Forking'}
              {" "}Period
            </span>
            <h1><Trans>Nouns DAO Fork</Trans></h1>
            <p>160 Nouns (20%) are required to meet the threshold</p>
          </Col>
          <Col lg={6} className={classes.buttons}>
            {currentState === 'nouns added' && (
              <button className={clsx(classes.button, classes.secondaryButton, classes.withdrawButton)}
                onClick={() => setIsConfirmModalOpen(false)}
              >Withdraw Nouns</button>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className={clsx(classes.button, classes.primaryButton)}>
              {(currentState === 'escrow' || currentState === 'escrow threshold met' || currentState === 'nouns added') && 'Add Nouns to escrow'}
              {currentState === 'forking' && 'Join fork'}
            </button>
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
      <div className={clsx(classes.forkTimelineWrapper, currentState === 'forking' && classes.isForkingPeriod)}>
        <Container>
          <Row className={classes.forkTimeline}>
            <Col lg={3} className={classes.sidebar}>
              <div className={classes.summary}>
                <span>
                  {(currentState === 'escrow' || currentState === 'nouns added' || currentState === 'escrow threshold met') && 'in escrow'}
                  {currentState === 'forking' && 'joined this fork'}
                </span>
                <strong>
                  {(currentState === 'escrow' || currentState === 'nouns added') && '12'}
                  {(currentState === 'escrow threshold met' || currentState === 'forking') && '160'}
                  {" "}Nouns
                </strong>
                <span>{(currentState === 'escrow' || currentState === 'nouns added') && '1.5%'}
                  {(currentState === 'escrow threshold met' || currentState === 'forking') && '21%'}</span>
              </div>
              {currentState === 'escrow threshold met' && (
                <button className={clsx(classes.button, classes.primaryButton, classes.deployButton)}>
                  Deploy Nouns fork
                </button>
              )}
            </Col>
            <Col lg={9} className={classes.events}>
              {currentState === 'nouns added' && (
                <div className={clsx(classes.userNouns, classes.callout)}>
                  <p>
                    Your Nouns <strong>{dummyData.userNouns.map((nounId) => nounId).join(', ')}</strong> are in escrow.
                  </p>
                </div>
              )}
              <div className={classes.forkTimelineItem}>
                <header>
                  <span className={classes.timestamp}>2 days ago</span>
                  <h3 className={classes.eventTitle}>Noun123.eth added 6 Nouns to escrow</h3>
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
                      <li><a href="/vote/282"><strong>282</strong> Dynamic Quorum Updates</a></li>
                      <li><a href="/vote/282"><strong>282</strong> Dynamic Quorum Updates</a></li>
                    </ul>
                  </div>
                </header>
              </div>
              <div className={classes.forkTimelineItem}>
                <header>
                  <span className={classes.timestamp}>2 days ago</span>
                  <h3 className={classes.eventTitle}>NounABC.eth added 3 Nouns to escrow</h3>
                  <p className={classes.message}>Etiam porta sem malesuada magna mollis euismod. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
                  <div className={classes.nounsList}>
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
                      <li><a href="/vote/282"><strong>282</strong> Dynamic Quorum Updates</a></li>
                      <li><a href="/vote/282"><strong>282</strong> Dynamic Quorum Updates</a></li>
                    </ul>
                  </div>
                </header>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {currentState === 'forking' ? (
        <AddNounsToForkModal
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          isForkingPeriod={true}
          title={'Join the fork'}
          description={"By joining this fork you are giving up your Nouns to be retrieved in the new fork. This cannot be undone."}
          selectLabel={'Select Nouns to join the fork'}
          selectDescription={'Add as many or as few of your Nouns as you’d like.  Additional Nouns can be added during the forking period'}
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
        />
      )}


      <SolidColorBackgroundModal
        show={isConfirmModalOpen}
        onDismiss={() => setIsConfirmModalOpen(false)}
        content={confirmModalContent}
      />
    </>
  );
};
export default ForkPage;
