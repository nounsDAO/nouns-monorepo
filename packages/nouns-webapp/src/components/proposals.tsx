'use client';

import { useEffect, useState } from 'react';

import { ClockIcon } from '@heroicons/react/solid';
import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';
import dayjs from 'dayjs';
import en from 'dayjs/locale/en';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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
  const [hash, setHash] = useState<string>('');
  useEffect(() => {
    const updateHash = () => setHash(window.location.hash || '');
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

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
      router.push('/vote#candidates');
    } else {
      router.push('/vote');
    }
  }, [activeTab, router]);

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
    <div className="flex flex-col">
      {showDelegateModal && <DelegationModal onDismiss={() => setShowDelegateModal(false)} />}
      <div className="mb-4 flex items-center justify-between border-b border-black/10">
        <Section fullWidth={false} className="mx-auto w-full">
          <div
            className={cn(
              'mx-auto w-full lg:w-10/12',
              'flex flex-row justify-between',
              'lg-max:flex-col lg-max:justify-start lg-max:items-start',
              !hasEnoughVotesToPropose ? 'lg-max:flex-row' : '',
            )}
          >
            <div className="m-0 flex flex-row items-end justify-between gap-[10px]">
              {tabs.map((tab, index) => (
                <button
                  type="button"
                  className={cn(
                    'font-londrina rounded-[12px] rounded-b-none border border-transparent bg-white px-[14px] pb-[6px] pt-[10px] text-[32px] leading-none text-black',
                    index === activeTab &&
                      'relative top-[2px] border border-black/10 border-b-white px-[14px] py-[10px]',
                  )}
                  onClick={() => setActiveTab(index)}
                  key={index}
                >
                  {tab}
                </button>
              ))}
            </div>
            {!isMobile && hasEnoughVotesToPropose ? (
              <div
                className={cn(
                  // layout/display
                  'flex lg-max:flex lg-max:items-center lg-max:justify-center',
                  // spacing
                  'pt-[0.8rem] lg-max:w-full',
                )}
              >
                <div className="text-right">
                  <Button
                    className={
                      'rounded-12 border-brand-color-green bg-brand-color-green hover:bg-brand-color-green hover:shadow-brand-focus-green focus:bg-brand-color-green focus:shadow-brand-focus-green active:bg-brand-color-green mb-2 h-12 max-w-40 border font-bold'
                    }
                    onClick={() => router.push('/create-proposal')}
                  >
                    <Trans>Submit Proposal</Trans>
                  </Button>
                </div>

                {hasNounBalance && (
                  <div className="pl-2">
                    <Button
                      className={
                        'rounded-12 text-brand-text-muted-700 hover:bg-brand-surface-muted focus:bg-brand-surface-muted active:bg-brand-surface-muted mb-2 h-12 max-w-40 border border-black/10 bg-white font-bold hover:text-black focus:text-black'
                      }
                      onClick={() => setShowDelegateModal(true)}
                    >
                      <Trans>Delegate</Trans>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className={cn('d-flex', 'text-right')}>
                {!isMobile && (
                  <div
                    className={cn(
                      // typography
                      'font-pt text-[16px] font-medium leading-[22.4px] text-brand-gray-light-text',
                      // spacing
                      'mr-4 mt-[0.9rem] lg-max:mr-0 lg-max:mt-0',
                      // responsive alignment
                      'lg-max:text-center',
                    )}
                  >
                    {nullStateCopy()}
                  </div>
                )}
                {!isMobile && (
                  <div className={'min-w-40'}>
                    <Button
                      className={
                        'rounded-12 border-brand-border-ui bg-brand-surface text-brand-text-muted-600 hover:border-brand-surface hover:bg-brand-surface hover:text-brand-text-muted-600 focus:border-brand-surface focus:bg-brand-surface focus:text-brand-text-muted-600 active:bg-brand-surface mb-2 h-12 max-w-40 cursor-not-allowed border font-bold focus:shadow-none focus:outline-none'
                      }
                    >
                      <Trans>Submit Proposal</Trans>
                    </Button>
                  </div>
                )}
                {!isMobile && hasNounBalance && (
                  <div className={'pl-2'}>
                    <Button
                      className={
                        'rounded-12 text-brand-text-muted-700 hover:bg-brand-surface-muted focus:bg-brand-surface-muted active:bg-brand-surface-muted mb-2 h-12 max-w-40 border border-black/10 bg-white font-bold hover:text-black focus:text-black'
                      }
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
                  <div
                    className={cn(
                      'font-pt text-[16px] font-medium leading-[22.4px] text-brand-gray-light-text',
                      'mr-4 mt-[0.9rem] lg-max:mr-0 lg-max:mt-0 lg-max:text-center',
                    )}
                  >
                  {nullStateCopy()}
                </div>
              </div>
            </div>
            <div className="w-full">
              <div>
                <div className={'flex pt-[0.8rem]'}>
                  <div className={'text-right'}>
                    <Button
                      className={
                        'rounded-12 border-brand-color-green bg-brand-color-green hover:bg-brand-color-green hover:shadow-brand-focus-green focus:bg-brand-color-green focus:shadow-brand-focus-green active:bg-brand-color-green mb-2 h-12 max-w-40 border font-bold'
                      }
                      onClick={() => router.push('create-proposal')}
                    >
                      <Trans>Submit Proposal</Trans>
                    </Button>
                  </div>
                  {hasNounBalance && (
                    <div className={'pl-2'}>
                      <Button
                        className={
                          'rounded-12 text-brand-text-muted-700 hover:bg-brand-surface-muted focus:bg-brand-surface-muted active:bg-brand-surface-muted mb-2 h-12 max-w-40 border border-black/10 bg-white font-bold hover:text-black focus:text-black'
                        }
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
      <Section fullWidth={false} className={'mx-auto w-full'}>
        {activeTab === 0 && (
          <div className={cn('mx-auto w-full lg:w-10/12')}>
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
                    <div className={'ml-2 min-w-max'}>
                      <div
                        className={cn(
                          'font-pt rounded-lg border-2 border-transparent px-2.5 py-1.5 text-sm font-bold text-white',
                          'bg-brand-gray-light-text-translucent -ml-2 w-fit',
                        )}
                      >
                        <div className={'flex flex-row'}>
                          <span className={'my-auto flex flex-col'}>
                            <ClockIcon height={16} width={16} />
                          </span>{' '}
                          <span className={'ml-1'}>
                            {getCountdownCopy(p, blockNumber ?? 0n, activeLocale)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );

                  return (
                    <a
                      className={cn(
                        'font-pt border-brand-border-ui bg-brand-surface mb-4 mt-[0.4rem] flex flex-col rounded-2xl border p-4 text-[22px] font-bold no-underline hover:cursor-pointer hover:bg-white',
                      )}
                      href={`/vote/${p.id}`}
                      key={i}
                    >
                      <div className={'flex w-full flex-row items-center justify-between'}>
                        <span className={cn('w-4/5 lg-max:max-w-[65%] lg-max:break-words')}>
                          <span className={'text-brand-text-muted-600 mr-2'}>
                            {i18n.number(Number(p.id || '0'))}
                          </span>{' '}
                          <span>{p.title}</span>
                        </span>

                        {isPropInStateToHaveCountDown && (
                          <div className={cn('flex', 'lg-max:hidden')}>{countdownPill}</div>
                        )}
                        <div className={cn('ml-2 min-w-max max-w-20')}>
                          <ProposalStatus status={p.status}></ProposalStatus>
                        </div>
                      </div>

                      {isPropInStateToHaveCountDown && (
                        <div className={cn('lg-max:mt-4 lg-max:flex lg-max:w-full hidden')}>
                          {countdownPill}
                        </div>
                      )}
                    </a>
                  );
                })
            ) : (
              <Alert variant="secondary" className={'w-full'}>
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
          <div className={cn('mx-auto w-full lg:w-10/12')}>
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
                      <Alert
                        variant="secondary"
                        className={
                          'font-pt text-brand-gray-light-text my-4 flex flex-col items-center justify-center text-center text-[16px] font-medium leading-[22.4px]'
                        }
                      >
                        <Spinner animation="border" />
                        Loading candidates...
                      </Alert>
                    )}
                    {candidates?.length === 0 && (
                      <Alert variant="secondary" className={'w-full'}>
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
              <div className={cn('font-pt w-full lg:w-3/12')}>
                <h4 className="mb-2 text-[1.2rem] font-bold">
                  <strong>
                    <Trans>About Proposal Candidates</Trans>
                  </strong>
                </h4>
                <p className="text-brand-gray-light-text m-0 p-0">
                  <Trans>
                    Proposal candidates can be created by anyone. If a candidate receives enough
                    signatures by Nouns voters, it can be promoted to a proposal.
                  </Trans>
                </p>
                <Link
                  href="/create-candidate"
                  className={cn(
                    'rounded-12 hover:text-brand-border-ui mt-4 block border border-black/10 bg-black p-4 text-center font-bold leading-none text-white no-underline hover:border-black/10 hover:bg-black hover:shadow-none',
                  )}
                >
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
