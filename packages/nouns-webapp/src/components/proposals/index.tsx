'use client';

import { useEffect, useState } from 'react';

import { ClockIcon } from '@heroicons/react/solid';
import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';
import dayjs from 'dayjs';
import en from 'dayjs/locale/en';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { filter, find, last } from 'remeda';
import { useAccount, useBlockNumber } from 'wagmi';

import CandidateCard from '@/components/candidate-card';
import DelegationModal from '@/components/delegation-modal';
import ProposalStatus from '@/components/proposal-status';
import Section from '@/components/section';
import config from '@/config';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useActiveLocale } from '@/hooks/use-activate-locale';
import { SUPPORTED_LOCALE_TO_DAYSJS_LOCALE, SupportedLocale } from '@/i18n/locales';
import { cn } from '@/lib/utils';
import { setCandidates } from '@/state/slices/candidates';
import { AVERAGE_BLOCK_TIME_IN_SECS } from '@/utils/constants';
import { isMobileScreen } from '@/utils/is-mobile';
import { isProposalUpdatable } from '@/utils/proposals';
import { useNounTokenBalance, useUserVotes } from '@/wrappers/noun-token';
import {
  PartialProposal,
  ProposalState,
  useIsDaoGteV3,
  useProposalThreshold,
} from '@/wrappers/nouns-dao';
import { ProposalCandidate, useCandidateProposals } from '@/wrappers/nouns-data';
import { Link, useLocation, useNavigate } from 'react-router';

import classes from './proposals.module.css';

dayjs.extend(relativeTime);

const getCountdownCopy = (
  proposal: PartialProposal | undefined,
  currentBlock: bigint,
  locale: SupportedLocale,
) => {
  const timestamp = Date.now();
  const startDate =
    proposal && timestamp && currentBlock
      ? dayjs(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * Number(proposal.startBlock - currentBlock),
          'seconds',
        )
      : undefined;

  const endDate =
    proposal && timestamp && currentBlock
      ? dayjs(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * Number(proposal.endBlock - currentBlock),
          'seconds',
        )
      : undefined;

  const expiresDate =
    proposal &&
    dayjs(proposal.eta).add(config.contractParameters.executor.GRACE_PERIOD_SECONDS, 'seconds');

  const now = dayjs();

  if (
    startDate !== undefined &&
    startDate?.isBefore(now) &&
    endDate !== undefined &&
    endDate?.isAfter(now)
  ) {
    return (
      <Trans>
        Ends {endDate.locale(SUPPORTED_LOCALE_TO_DAYSJS_LOCALE[locale] ?? en).fromNow()}
      </Trans>
    );
  }
  if (expiresDate !== undefined && endDate !== undefined && endDate?.isBefore(now)) {
    return (
      <Trans>
        Expires {expiresDate.locale(SUPPORTED_LOCALE_TO_DAYSJS_LOCALE[locale] ?? en).fromNow()}
      </Trans>
    );
  }
  return (
    <Trans>
      Starts{' '}
      {dayjs(startDate)
        .locale(SUPPORTED_LOCALE_TO_DAYSJS_LOCALE[locale] ?? en)
        .fromNow()}
    </Trans>
  );
};

interface ProposalsProps {
  proposals?: PartialProposal[];
  nounsRequired?: number;
}

const Proposals = ({ proposals, nounsRequired }: ProposalsProps) => {
  const [showDelegateModal, setShowDelegateModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { data: blockNumber } = useBlockNumber();
  const { address: account } = useAccount();
  const navigate = useNavigate();
  const { data: candidatesData, refetch: refetchCandidates } = useCandidateProposals(blockNumber);
  const dispatch = useAppDispatch();
  const candidates = useAppSelector(state => state.candidates.data);
  const connectedAccountNounVotes = useUserVotes() ?? 0;
  const isMobile = isMobileScreen();
  const activeLocale = useActiveLocale();
  const threshold = (useProposalThreshold() ?? 0) + 1;
  const hasEnoughVotesToPropose = account !== undefined && connectedAccountNounVotes >= threshold;
  const hasNounBalance = (useNounTokenBalance(account ?? '0x0') ?? 0) > 0;
  const isDaoGteV3 = useIsDaoGteV3();
  const tabs = ['Proposals', config.featureToggles.candidates && isDaoGteV3 && 'Candidates'];
  const { hash } = useLocation();

  useEffect(() => {
    (async () => {
      if (candidates) {
        return;
      }
      await refetchCandidates();
      const filteredCandidates = filter(
        candidatesData ?? [],
        (candidate): candidate is ProposalCandidate => candidate !== undefined,
      );
      if (filteredCandidates.length > 0) {
        dispatch(setCandidates(filteredCandidates));
      }
    })();
  }, [candidates, candidatesData, refetchCandidates, dispatch]);

  useEffect(() => {
    if (hash === '#candidates') {
      setActiveTab(1);
    }
  }, [hash]);

  useEffect(() => {
    if (activeTab === 1) {
      navigate('/vote#candidates');
    } else {
      navigate('/vote');
    }
  }, [activeTab, navigate]);

  const nullStateCopy = () => {
    if (!!account) {
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
          <div
            className={cn(
              'mx-auto w-full lg:w-10/12',
              classes.headerWrapper,
              'lg-max:flex-col lg-max:justify-start lg-max:items-start',
              !hasEnoughVotesToPropose ? 'lg-max:flex-row' : '',
            )}
          >
            <div className={classes.tabs}>
              {tabs.map((tab, index) => (
                <button
                  type="button"
                  className={cn(classes.tab, index === activeTab ? classes.activeTab : '')}
                  onClick={() => setActiveTab(index)}
                  key={index}
                >
                  {tab}
                </button>
              ))}
            </div>
            {!isMobile && hasEnoughVotesToPropose ? (
              <div className={`${classes.nounInWalletBtnWrapper} lg-max:w-full lg-max:flex lg-max:items-center lg-max:justify-center`}>
                <div className={classes.submitProposalButtonWrapper}>
                  <Button
                    className={classes.generateBtn}
                    onClick={() => navigate('/create-proposal')}
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
              <div className={cn('d-flex', classes.nullStateSubmitProposalBtnWrapper)}>
                {!isMobile && (
                  <div className={`${classes.nullStateCopy} lg-max:mt-0 lg-max:mr-0 lg-max:text-center`}>
                    {nullStateCopy()}
                  </div>
                )}
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
          </div>
        </Section>
      </div>

      {isMobile && hasNounBalance && (
        <div className="container mx-auto px-4">
          <div className="w-100">
            <div className="w-full">
              <div>
                <div className={`${classes.nullStateCopy} lg-max:mt-0 lg-max:mr-0 lg-max:text-center`}>
                  {nullStateCopy()}
                </div>
              </div>
            </div>
            <div className="w-full">
              <div>
                <div className={classes.nounInWalletBtnWrapper}>
                  <div className={classes.submitProposalButtonWrapper}>
                    <Button
                      className={classes.generateBtn}
                      onClick={() => navigate('create-proposal')}
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
              </div>
            </div>
          </div>
        </div>
      )}
      <Section fullWidth={false} className={classes.section}>
        {activeTab === 0 && (
          <div className={`mx-auto w-full lg:w-10/12 ${classes.proposalsList}`}>
            {proposals && proposals.length > 0 ? (
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
                        className={cn(
                          'font-pt rounded-lg border-2 border-transparent px-2.5 py-1.5 text-sm font-bold text-white',
                          classes.countdownPill,
                        )}
                      >
                        <div className={classes.countdownPillContentWrapper}>
                          <span className={classes.countdownPillClock}>
                            <ClockIcon height={16} width={16} />
                          </span>{' '}
                          <span className={classes.countdownPillText}>
                            {getCountdownCopy(p, blockNumber ?? 0n, activeLocale)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );

                  return (
                    <a
                      className={cn(classes.proposalLink, classes.proposalLinkWithCountdown)}
                      href={`/vote/${p.id}`}
                      key={i}
                    >
                      <div className={classes.proposalInfoWrapper}>
                        <span className={`${classes.proposalTitle} lg-max:max-w-[65%] lg-max:break-words`}>
                          <span className={classes.proposalId}>
                            {i18n.number(Number(p.id || '0'))}
                          </span>{' '}
                          <span>{p.title}</span>
                        </span>

                        {isPropInStateToHaveCountDown && (
                          <div className={cn(classes.desktopCountdownWrapper, 'lg-max:hidden')}>
                            {countdownPill}
                          </div>
                        )}
                        <div className={cn(classes.proposalStatusWrapper, classes.votePillWrapper)}>
                          <ProposalStatus status={p.status}></ProposalStatus>
                        </div>
                      </div>

                      {isPropInStateToHaveCountDown && (
                        <div className={cn(classes.mobileCountdownWrapper, 'hidden lg-max:mt-4 lg-max:flex lg-max:w-full')}>
                          {countdownPill}
                        </div>
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
          </div>
        )}
        {activeTab === 1 && (
          <div className={`mx-auto w-full lg:w-10/12 ${classes.proposalsList}`}>
            <div className="w-full lg:flex lg:gap-6">
              <div className="w-full lg:w-9/12">
                {nounsRequired !== undefined && candidates && candidates.length > 0 ? (
                  candidates
                    .slice(0)
                    .reverse()
                    .map((c, i) => {
                      if (c.proposalIdToUpdate !== undefined && +c.proposalIdToUpdate > 0) {
                        const prop = find(proposals ?? [], p => p.id == c.proposalIdToUpdate);
                        const isOriginalPropUpdatable = !!(
                          prop &&
                          blockNumber !== undefined &&
                          isProposalUpdatable(prop?.status, prop?.updatePeriodEndBlock, blockNumber)
                        );
                        if (!isOriginalPropUpdatable) return null;
                      }
                      return (
                        <div key={i}>
                          <CandidateCard
                            latestProposal={last<PartialProposal[]>(proposals ?? [])}
                            candidate={c as unknown as ProposalCandidate}
                            key={c?.id}
                            nounsRequired={threshold}
                            currentBlock={blockNumber !== undefined ? blockNumber - 1n : 0n}
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
              </div>
              <div className={`w-full lg:w-3/12 ${classes.candidatesSidebar}`}>
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
                <Link to="/create-candidate" className={cn(classes.button)}>
                  Create a candidate
                </Link>
              </div>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
};
export default Proposals;
