import {
  PartialProposal,
  ProposalState,
  useIsDaoGteV3,
  useProposalThreshold,
} from '../../wrappers/nounsDao';
import { Alert, Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import ProposalStatus from '../ProposalStatus';
import classes from './Proposals.module.css';
import { useHistory, useLocation } from 'react-router-dom';
import { useBlockNumber, useEthers } from '@usedapp/core';
import { isMobileScreen } from '../../utils/isMobile';
import clsx from 'clsx';
import { useNounTokenBalance, useUserVotes } from '../../wrappers/nounToken';
import { Trans } from '@lingui/macro';
import { ClockIcon } from '@heroicons/react/solid';
import proposalStatusClasses from '../ProposalStatus/ProposalStatus.module.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useActiveLocale } from '../../hooks/useActivateLocale';
import { SUPPORTED_LOCALE_TO_DAYSJS_LOCALE, SupportedLocale } from '../../i18n/locales';
import { useEffect, useState } from 'react';
import DelegationModal from '../DelegationModal';
import { i18n } from '@lingui/core';
import en from 'dayjs/locale/en';
import { AVERAGE_BLOCK_TIME_IN_SECS } from '../../utils/constants';
import Section from '../../layout/Section';
import CandidateCard from '../CandidateCard';
import { Link } from 'react-router-dom';
import { useCandidateProposals } from '../../wrappers/nounsData';
import { isProposalUpdatable } from '../../utils/proposals';
import config from '../../config';

dayjs.extend(relativeTime);

const getCountdownCopy = (
  proposal: PartialProposal,
  currentBlock: number,
  locale: SupportedLocale,
) => {
  const timestamp = Date.now();
  const startDate =
    proposal && timestamp && currentBlock
      ? dayjs(timestamp).add(
        AVERAGE_BLOCK_TIME_IN_SECS * (proposal.startBlock - currentBlock),
        'seconds',
      )
      : undefined;

  const endDate =
    proposal && timestamp && currentBlock
      ? dayjs(timestamp).add(
        AVERAGE_BLOCK_TIME_IN_SECS * (proposal.endBlock - currentBlock),
        'seconds',
      )
      : undefined;

  const expiresDate = proposal && dayjs(proposal.eta).add(14, 'days');

  const now = dayjs();

  if (startDate?.isBefore(now) && endDate?.isAfter(now)) {
    return (
      <Trans>
        Ends {endDate.locale(SUPPORTED_LOCALE_TO_DAYSJS_LOCALE[locale] || en).fromNow()}
      </Trans>
    );
  }
  if (endDate?.isBefore(now)) {
    return (
      <Trans>
        Expires {expiresDate.locale(SUPPORTED_LOCALE_TO_DAYSJS_LOCALE[locale] || en).fromNow()}
      </Trans>
    );
  }
  return (
    <Trans>
      Starts{' '}
      {dayjs(startDate)
        .locale(SUPPORTED_LOCALE_TO_DAYSJS_LOCALE[locale] || en)
        .fromNow()}
    </Trans>
  );
};

const Proposals = ({
  proposals,
  nounsRequired,
}: {
  proposals: PartialProposal[];
  nounsRequired?: number;
}) => {
  const [showDelegateModal, setShowDelegateModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const currentBlock = useBlockNumber();
  const { account } = useEthers();
  const history = useHistory();
  const { data: candidates } = useCandidateProposals(blockNumber || currentBlock);
  const connectedAccountNounVotes = useUserVotes() || 0;
  const isMobile = isMobileScreen();
  const activeLocale = useActiveLocale();
  const threshold = (useProposalThreshold() ?? 0) + 1;
  const hasEnoughVotesToPropose = account !== undefined && connectedAccountNounVotes >= threshold;
  const hasNounBalance = (useNounTokenBalance(account ?? '') ?? 0) > 0;
  const isDaoGteV3 = useIsDaoGteV3();
  const tabs = ['Proposals', config.featureToggles.candidates && isDaoGteV3 && 'Candidates'];
  const { hash } = useLocation();

  useEffect(() => {
    // prevent blockNumber from triggering a re-render when it's already set
    if (blockNumber === 0) {
      setBlockNumber(currentBlock || blockNumber);
    }
  }, [currentBlock, blockNumber]);

  useEffect(() => {
    if (hash === '#candidates') {
      setActiveTab(1);
    }
  }, [hash]);
  useEffect(() => {
    if (activeTab === 1) {
      history.push('/vote#candidates');
    } else {
      history.push('/vote');
    }
  }, [activeTab, history]);

  const nullStateCopy = () => {
    if (account !== null) {
      if (connectedAccountNounVotes > 0) {
        return <Trans>Making a proposal requires {threshold} votes</Trans>;
      }
      return <Trans>You have no Votes.</Trans>;
    }
    return <Trans>Connect wallet to make a proposal.</Trans>;
  };

  return (
    <div className={classes.proposals}>
      {showDelegateModal && <DelegationModal onDismiss={() => setShowDelegateModal(false)} />}
      <div className={classes.sectionWrapper}>
        <Section fullWidth={false} className={classes.section}>
          <Col
            lg={10}
            className={clsx(
              classes.headerWrapper,
              !hasEnoughVotesToPropose ? classes.forceFlexRow : '',
            )}
          >
            <div className={classes.tabs}>
              {tabs.map((tab, index) => (
                <button
                  className={clsx(classes.tab, index === activeTab ? classes.activeTab : '')}
                  onClick={() => setActiveTab(index)}
                  key={index}
                >
                  {tab}
                </button>
              ))}
            </div>
            {!isMobile && hasEnoughVotesToPropose ? (
              <div className={classes.nounInWalletBtnWrapper}>
                <div className={classes.submitProposalButtonWrapper}>
                  <Button
                    className={classes.generateBtn}
                    onClick={() => history.push('create-proposal')}
                  >
                    <Trans>Submit Proposal</Trans>
                  </Button>
                </div>

                {hasNounBalance && (
                  <div className={classes.delegateBtnWrapper}>
                    <Button
                      className={classes.changeDelegateBtn}
                      onClick={() => setShowDelegateModal(true)}
                    >
                      <Trans>Delegate</Trans>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className={clsx('d-flex', classes.nullStateSubmitProposalBtnWrapper)}>
                {!isMobile && <div className={classes.nullStateCopy}>{nullStateCopy()}</div>}
                {!isMobile && (
                  <div className={classes.nullBtnWrapper}>
                    <Button className={classes.generateBtnDisabled}>
                      <Trans>Submit Proposal</Trans>
                    </Button>
                  </div>
                )}
                {!isMobile && hasNounBalance && (
                  <div className={classes.delegateBtnWrapper}>
                    <Button
                      className={classes.changeDelegateBtn}
                      onClick={() => setShowDelegateModal(true)}
                    >
                      <Trans>Delegate</Trans>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Col>
        </Section>
      </div>

      {isMobile && hasNounBalance && (
        <Container>
          <div className="w-100">
            <Row>
              <Col>
                <div className={classes.nullStateCopy}>{nullStateCopy()}</div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className={classes.nounInWalletBtnWrapper}>
                  <div className={classes.submitProposalButtonWrapper}>
                    <Button
                      className={classes.generateBtn}
                      onClick={() => history.push('create-proposal')}
                    >
                      <Trans>Submit Proposal</Trans>
                    </Button>
                  </div>
                  {hasNounBalance && (
                    <div className={classes.delegateBtnWrapper}>
                      <Button
                        className={classes.changeDelegateBtn}
                        onClick={() => setShowDelegateModal(true)}
                      >
                        <Trans>Delegate</Trans>
                      </Button>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      )}
      <Section fullWidth={false} className={classes.section}>
        {activeTab === 0 && (
          <Col lg={10} className={classes.proposalsList}>
            {proposals?.length ? (
              proposals
                .slice(0)
                .reverse()
                .map((p, i) => {
                  const isPropInStateToHaveCountDown =
                    p.status === ProposalState.UPDATABLE ||
                    p.status === ProposalState.PENDING ||
                    p.status === ProposalState.ACTIVE ||
                    p.status === ProposalState.QUEUED;

                  const countdownPill = (
                    <div className={classes.proposalStatusWrapper}>
                      <div
                        className={clsx(
                          proposalStatusClasses.proposalStatus,
                          classes.countdownPill,
                        )}
                      >
                        <div className={classes.countdownPillContentWrapper}>
                          <span className={classes.countdownPillClock}>
                            <ClockIcon height={16} width={16} />
                          </span>{' '}
                          <span className={classes.countdownPillText}>
                            {getCountdownCopy(p, blockNumber || 0, activeLocale)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );

                  return (
                    <a
                      className={clsx(classes.proposalLink, classes.proposalLinkWithCountdown)}
                      href={`/vote/${p.id}`}
                      key={i}
                    >
                      <div className={classes.proposalInfoWrapper}>
                        <span className={classes.proposalTitle}>
                          <span className={classes.proposalId}>
                            {i18n.number(parseInt(p.id || '0'))}
                          </span>{' '}
                          <span>{p.title}</span>
                        </span>

                        {isPropInStateToHaveCountDown && (
                          <div className={classes.desktopCountdownWrapper}>{countdownPill}</div>
                        )}
                        <div
                          className={clsx(classes.proposalStatusWrapper, classes.votePillWrapper)}
                        >
                          <ProposalStatus status={p.status}></ProposalStatus>
                        </div>
                      </div>

                      {isPropInStateToHaveCountDown && (
                        <div className={classes.mobileCountdownWrapper}>{countdownPill}</div>
                      )}
                    </a>
                  );
                })
            ) : (
              <Alert variant="secondary" className={classes.alert}>
                <Alert.Heading>
                  <Trans>No proposals found</Trans>
                </Alert.Heading>
                <p>
                  <Trans>Proposals submitted by community members will appear here.</Trans>
                </p>
              </Alert>
            )}
          </Col>
        )}
        {activeTab === 1 && (
          <Col lg={10} className={classes.proposalsList}>
            <Row>
              <Col lg={9}>
                {nounsRequired && candidates?.length ? (
                  candidates
                    .slice(0)
                    .reverse()
                    .map((c, i) => {
                      if (+c.version.content.proposalIdToUpdate > 0) {
                        const prop = proposals.find(
                          p => p.id === c.version.content.proposalIdToUpdate,
                        );
                        let isOriginalPropUpdatable =
                          prop &&
                            blockNumber &&
                            isProposalUpdatable(prop?.status, prop?.updatePeriodEndBlock, blockNumber)
                            ? true
                            : false;
                        if (!isOriginalPropUpdatable) return null;
                      }
                      return (
                        <div key={i}>
                          <CandidateCard
                            latestProposal={proposals[proposals.length - 1]}
                            candidate={c}
                            key={c.id}
                            nounsRequired={threshold}
                            currentBlock={blockNumber ? blockNumber - 1 : 0}
                          />
                        </div>
                      );
                    })
                ) : (
                  <>
                    {!candidates && (
                      <Alert variant="secondary" className={classes.dataStatus}>
                        <Spinner animation="border" className={classes.spinner} />
                        Loading candidates...
                      </Alert>
                    )}
                    {candidates?.length === 0 && (
                      <Alert variant="secondary" className={classes.alert}>
                        <Alert.Heading>
                          <Trans>No candidates found</Trans>
                        </Alert.Heading>
                        <p>
                          <Trans>Candidates submitted by community members will appear here.</Trans>
                        </p>
                      </Alert>
                    )}
                  </>
                )}
              </Col>
              <Col lg={3} className={classes.candidatesSidebar}>
                <h4>
                  <strong>
                    <Trans>About Proposal Candidates</Trans>
                  </strong>
                </h4>
                <p>
                  <Trans>
                    Proposal candidates can be created by anyone. If a candidate receives enough
                    signatures by Nouns voters, it can be promoted to a proposal.
                  </Trans>
                </p>
                <Link to="/create-candidate" className={clsx(classes.button)}>
                  Create a candidate
                </Link>
              </Col>
            </Row>
          </Col>
        )}
      </Section>
    </div>
  );
};
export default Proposals;
