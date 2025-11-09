'use client';

import { useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { isTruthy, map } from 'remeda';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';

import AddNounsToForkModal from '@/components/add-nouns-to-fork-modal';
import ForkingPeriodTimer from '@/components/forking-period-timer';
import NotFoundPage from '@/components/not-found-page';
import Section from '@/components/section';
import useForkTreasuryBalance from '@/hooks/use-fork-treasury-balance';
import { useScrollToLocation } from '@/hooks/use-scroll-to-location';
import { cn } from '@/lib/utils';
import { buildEtherscanAddressLink } from '@/utils/etherscan';
import { Address } from '@/utils/types';
import { useUserEscrowedNounIds, useUserOwnedNounIds } from '@/wrappers/noun-token';
import {
  useAdjustedTotalSupply,
  useEscrowEvents,
  useForkDetails,
  useForks,
  useForkThreshold,
  useForkThresholdBPS,
  useNumTokensInForkEscrow,
} from '@/wrappers/nouns-dao';

import DeployForkButton from './deploy-fork-button';
import ForkEventComponent from './fork-event';
import WithdrawNounsButton from './withdraw-nouns-button';

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
      <div className={cn('flex h-full items-center justify-center opacity-50')}>
        <img src="/loading-noggles.svg" alt="loading" className="mx-auto mb-2 block max-w-[75px]" />
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
        <div className="grid grid-cols-12 gap-3">
          {isNewForkPage ? (
            <div
              className={cn(
                'flex content-end max-lg:flex-col max-lg:items-start max-lg:gap-[10px]',
                'flex-col items-center justify-center text-center md-lg:min-h-[50vh]',
              )}
            >
              <div className="lg:col-span-12">
                <header>
                  <div className="flex w-full flex-row items-center justify-start gap-[10px] text-center">
                    <Link
                      className="text-brand-text-muted-700 inline-block size-8 appearance-none rounded-full border border-black/10 bg-white p-0 font-bold leading-[1.85] no-underline transition-[border] duration-150 ease-in-out hover:border-black/25"
                      href="/fork"
                    >
                      ←
                    </Link>
                    <span className="border-brand-border-light text-brand-gray-dark-text rounded-md border px-[10px] py-[6px] text-[14px]">
                      {forkStatusLabel}
                    </span>
                    <div className="size-8 opacity-0" />
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
                  className={cn(
                    'font-pt h-fit rounded-[8px] px-[16px] py-[10px] font-bold leading-none transition-all duration-150 ease-in-out',
                    'bg-black text-white no-underline hover:opacity-75 disabled:opacity-50',
                  )}
                  disabled={userOwnedNounIds?.data?.length === 0}
                >
                  {addNounsButtonLabel}
                </button>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                'flex content-end justify-between max-lg:flex-col max-lg:items-start max-lg:gap-[10px]',
                (escrowEvents.data == null || isNewForkPage) &&
                  'flex-col items-center justify-center text-center md-lg:min-h-[50vh]',
                isForked && 'w-full flex-col items-center',
              )}
            >
              <div className="lg:col-span-6">
                <div className="flex w-full flex-row items-center justify-start gap-[10px] text-center">
                  <Link
                    className="text-brand-text-muted-700 inline-block size-8 appearance-none rounded-full border border-black/10 bg-white p-0 font-bold leading-[1.85] no-underline transition-[border] duration-150 ease-in-out hover:border-black/25"
                    href="/fork"
                  >
                    ←
                  </Link>
                  <span className="border-brand-border-light text-brand-gray-dark-text rounded-md border px-[10px] py-[6px] text-[14px]">
                    {forkStatusLabel}
                  </span>
                  <div className="size-8 opacity-0" />
                </div>
                <h1>
                  <Trans>Nouns DAO Fork{isForked ? ` #${id}` : ''}</Trans>
                </h1>
                {!isForked && !isForkPeriodActive && (
                  <p className="text-brand-gray-dark-text mt-[10px] text-[14px] opacity-60">
                    <Trans>
                      More than {forkThreshold == null ? '...' : forkThreshold} Nouns{' '}
                      {`(${forkThresholdBPS != null ? forkThresholdBPS / 100 : '...'}% of the DAO)`}{' '}
                      are required to pass the threshold
                    </Trans>
                  </p>
                )}
              </div>
              {!isForked && (
                <div
                  className={cn(
                    'flex flex-row items-end justify-end gap-5',
                    escrowEvents.data == null && 'mt-4 flex flex-col items-center justify-center',
                  )}
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
                    className={cn(
                      'font-pt h-fit rounded-[8px] px-[16px] py-[10px] font-bold leading-none transition-all duration-150 ease-in-out',
                      'bg-black text-white no-underline hover:opacity-75 disabled:opacity-50',
                    )}
                    disabled={userOwnedNounIds?.data?.length === 0}
                  >
                    {addNounsButtonLabel}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Section>
      {(isForked || isForkPeriodActive) && (
        <Section fullWidth={false}>
          <div className="col-span-12">
            <div className="rounded-12 border-brand-border-light mb-5 border p-5">
              {forkDetails.data.forkingPeriodEndTimestamp &&
                +forkDetails.data.forkingPeriodEndTimestamp > now.getTime() / 1000 && (
                  <div className={cn('mb-4 border-b border-black/10 pb-4 text-center')}>
                    <ForkingPeriodTimer
                      endTime={+forkDetails.data.forkingPeriodEndTimestamp}
                      isPeriodEnded={isTruthy(
                        forkDetails?.data?.executed != null &&
                          forkDetails?.data?.executed &&
                          +forkDetails.data.forkingPeriodEndTimestamp < now.getTime() / 1000,
                      )}
                    />
                  </div>
                )}
              <div className={cn('gap-[10px] text-center')}>
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
          </div>
        </Section>
      )}

      {!isNewForkPage && escrowEvents.data != null && (
        <div
          className={cn(
            'border-brand-border-light mt-12 border-t pt-8',
            isForkPeriodActive && 'mt-0 border-t-0',
            isForked && 'mt-0 border-t-0',
          )}
        >
          <div className="container mx-auto px-4">
            <div className={cn('grid grid-cols-12 gap-3')}>
              <div
                className={cn(
                  'lg:col-span-3',
                  'max-lg:border-brand-border-light sticky top-[20px] h-fit max-lg:relative max-lg:top-0 max-lg:mb-[30px] max-lg:border-b max-lg:pb-[30px]',
                )}
              >
                <div className="rounded-12 border-brand-border-light mb-5 w-full border p-5 text-center leading-none">
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
                    <span className="mt-2 border-t border-black/10 pt-2">
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
                <div className="flex flex-row flex-wrap justify-between gap-[10px] max-lg:hidden">
                    {forkDetails.data.addedNouns.map(nounId => (
                      <a href={`/noun/${nounId}`} target="_blank" rel="noreferrer" key={nounId}>
                        <img
                          src={`https://noun.pics/${nounId}`}
                          alt="noun"
                          className="aspect-square w-full max-w-[50px] rounded-[6px]"
                        />
                      </a>
                    ))}
                    {/* add phantom elements to align boxes */}
                    {phantomListItems.map(i => (
                      <div
                        className={cn(
                          'aspect-square w-full max-w-[50px] rounded-[6px]',
                          '[width:calc(calc(100%_/_4)_-_8px)]',
                        )}
                        key={i}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className={cn('lg:col-span-9')}>
                {!isForked &&
                  userEscrowedNounIds.data != null &&
                  userEscrowedNounIds.data.length > 0 && (
                    <div className={cn('rounded-12 border-brand-border-light mb-5 border p-5')}>
                      <p>
                        Your Noun{userEscrowedNounIds.data.length > 1 && 's'} in escrow:{' '}
                        <strong>
                          {userEscrowedNounIds.data.map(nounId => `Noun ${nounId}`).join(', ')}
                        </strong>
                      </p>
                    </div>
                  )}
                {map(escrowEvents.data, event => {
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
                    <ForkEventComponent
                      key={event.id}
                      event={event}
                      isOnlyEvent={escrowEvents.data.length <= 1}
                    />
                  );
                })}
              </div>
            </div>
          </div>
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
