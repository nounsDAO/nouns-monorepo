'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import dayjs from 'dayjs';
import advanced from 'dayjs/plugin/advancedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { first, isNullish, isNonNullish } from 'remeda';
import { toast } from 'sonner';
import { useAccount, useBlockNumber } from 'wagmi';

import CandidateHeader from '@/components/candidate-header';
import CandidateSponsors from '@/components/candidate-sponsors/index';
import ProposalCandidateContent from '@/components/proposal-candidate-content';
import Section from '@/components/section';
import VoteSignals from '@/components/vote-signals';
import { useAppSelector } from '@/hooks';
import { cn } from '@/lib/utils';
import { checkHasActiveOrPendingProposalOrCandidate } from '@/utils/proposals';
import { useUserVotes } from '@/wrappers/noun-token';
import {
  ProposalState,
  useProposal,
  useProposalCount,
  useProposalThreshold,
} from '@/wrappers/nouns-dao';
import {
  useCancelCandidate,
  useCandidateFeedback,
  useCandidateProposal,
} from '@/wrappers/nouns-data';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

const CandidatePage = () => {
  const { id } = useParams<{ id: string }>();
  const [isCancelPending, setCancelPending] = useState<boolean>(false);
  const [dataFetchPollInterval, setDataFetchPollInterval] = useState<number>(0);
  const { cancelCandidate, cancelCandidateState } = useCancelCandidate();
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const isWalletConnected = activeAccount !== undefined;
  const { data: currentBlock } = useBlockNumber();
  const { data: candidateData, refetch: candidateRefetch } = useCandidateProposal(
    id ?? '',
    dataFetchPollInterval,
    false,
    currentBlock,
  );
  const [candidate, setCandidate] = useState<typeof candidateData>(undefined);
  const { address: account } = useAccount();
  const threshold = useProposalThreshold();
  const userVotes = useUserVotes();
  const latestProposalId = useProposalCount();
  const latestProposal = useProposal(latestProposalId ?? 0);
  const feedback = useCandidateFeedback(Number(id).toString(), dataFetchPollInterval);
  const originalProposal = useProposal(candidate?.proposalIdToUpdate ?? 0);
  const isParentProposalUpdatable = originalProposal?.status === ProposalState.UPDATABLE;
  const isProposal = candidate?.isProposal === true;
  const isUpdateToProposal = Number(candidate?.proposalIdToUpdate ?? 0) > 0;

  const isProposer = useMemo(() => {
    if (isNonNullish(candidate) && isNonNullish(account)) {
      return candidate.proposer.toLowerCase() === account.toLowerCase();
    }
    return false;
  }, [candidate, account]);

  const isSignerWithActiveOrPendingProposal = useMemo(() => {
    if (isNonNullish(latestProposal) && isNonNullish(account)) {
      return checkHasActiveOrPendingProposalOrCandidate(
        latestProposal.status,
        latestProposal.proposer,
        account,
      );
    }
    return false;
  }, [latestProposal, account]);

  useEffect(() => {
    (async () => {
      if (isNullish(candidate)) {
        await candidateRefetch();
        if (isNonNullish(candidateData)) {
          setCandidate(candidateData);
        }
      }
    })();
  }, [candidate, candidateData, candidateRefetch]);

  const handleRefetchData = () => {
    feedback.refetch();
  };

  const { _ } = useLingui();

  const onTransactionStateChange = useCallback(
    (
      { errorMessage, status }: { errorMessage?: string; status: string },
      successMessage?: string,
      setPending?: (isPending: boolean) => void,
      getErrorMessage?: (error?: string) => string | undefined,
      onFinalState?: () => void,
    ) => {
      switch (status) {
        case 'None':
          setPending?.(false);
          break;
        case 'Mining':
          setPending?.(true);
          break;
        case 'Success':
          toast.success(successMessage || _(`Transaction Successful!`));
          setPending?.(false);
          onFinalState?.();
          break;
        case 'Fail':
          toast.error(errorMessage || _(`Please try again.`));
          setPending?.(false);
          onFinalState?.();
          break;
        case 'Exception':
          toast.error(getErrorMessage?.(errorMessage) || _(`Please try again.`));
          setPending?.(false);
          onFinalState?.();
          break;
      }
    },
    [_],
  );

  // handle cancel candidate
  useEffect(
    () =>
      onTransactionStateChange(
        cancelCandidateState,
        _(`Proposal Candidate Canceled!`),
        setCancelPending,
      ),
    [cancelCandidateState, onTransactionStateChange, _],
  );

  const destructiveStateAction = (() => {
    return () => {
      if (candidate?.id) {
        return cancelCandidate({ args: [candidate.slug] });
      }
    };
  })();

  const primaryProposalId = first(candidate?.matchingProposalIds ?? []);

  return (
    <Section fullWidth={false} className="font-pt">
      {/* notice for proposal updates */}
      {isNonNullish(candidate?.proposalIdToUpdate) &&
        Number(candidate?.proposalIdToUpdate ?? 0) > 0 &&
        !isProposer && (
          <Alert variant="warning">
            <Trans>
              <strong>Note: </strong>
              This candidate is an update to{' '}
              <Link href={`/vote/${candidate?.proposalIdToUpdate}`}>
                Proposal {candidate?.proposalIdToUpdate}
              </Link>
              .
            </Trans>
          </Alert>
        )}
      {isProposal === true && (
        <Alert variant="success">
          <Trans>
            <strong>Note: </strong>
            This proposal candidate has been proposed onchain.
          </Trans>{' '}
          {primaryProposalId != null && primaryProposalId !== 0 && (
            <Link href={`/vote/${primaryProposalId}`}>View the proposal here</Link>
          )}
        </Alert>
      )}
      <div className={cn('col-span-12 lg:col-span-12', 'mx-auto')}>
        {isNullish(candidate) && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '100vh' }}
          >
            <Spinner animation="border" />
          </div>
        )}
        {isNonNullish(candidate) && (
          <CandidateHeader
            title={candidate.version.content.title}
            id={candidate.id}
            proposer={candidate.proposer}
            versionsCount={candidate.versionsCount}
            createdTransactionHash={candidate.createdTransactionHash}
            lastUpdatedTimestamp={Number(candidate.lastUpdatedTimestamp)}
            isCandidate={true}
            isWalletConnected={isWalletConnected}
            isUpdateToProposal={isUpdateToProposal}
            submitButtonClickHandler={() => {}}
          />
        )}
      </div>
      {isProposer && isProposal === false && (
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 lg:col-span-12">
            <div className="rounded-12 border-brand-border-light mb-8 flex items-center justify-between gap-4 border p-[15px] lg-max:flex-col lg-max:text-center">
              <p>
                <span className="m-0 block p-0 text-[13px] font-bold opacity-70">
                  <Trans>Proposer functions</Trans>
                </span>
                <Trans>
                  Editing a proposal candidate will clear any previous sponsors and require each
                  sponsor to re-sign
                </Trans>
              </p>
              <div className="flex w-[30%] flex-row justify-end gap-4 lg-max:w-full lg-max:justify-center">
                <Button
                  onClick={destructiveStateAction}
                  disabled={isCancelPending}
                  variant="danger"
                  className={cn(
                    'font-pt bg-brand-color-red h-[50px] rounded-lg text-[24px] font-bold transition-all duration-150 ease-in-out',
                    'hover:cursor-pointer hover:opacity-50',
                  )}
                >
                  {isCancelPending ? (
                    <Spinner animation="border" />
                  ) : (
                    <Trans>Cancel candidate</Trans>
                  )}
                </Button>
                <Link
                  href={`/candidates/${id}/edit`}
                  className={cn(
                    'font-pt text-brand-gray-dark-text h-fit rounded-lg border-0 px-4 py-[10px] font-bold leading-none transition-all duration-150 ease-in-out',
                    'bg-black text-white no-underline hover:opacity-75',
                  )}
                >
                  <Trans>Edit</Trans>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {isNonNullish(candidate) && (
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 lg:col-span-12">
            <a
              className="font-londrina rounded-12 border-brand-border-light mb-0 mt-2 flex w-full flex-col border bg-white p-2 text-center font-bold no-underline md-lg:hidden"
              href="#feedback"
            >
              Jump to Sponsored Votes and Feedback
            </a>
          </div>
          <div className={cn('col-span-12 lg:col-span-8', 'mx-auto mt-[1em] bg-white')}>
            <ProposalCandidateContent proposal={candidate} />
          </div>
          <div id="feedback" className={cn('col-span-12 lg:col-span-4', 'mt-4 md-lg:mt-6')}>
            {currentBlock != null &&
              threshold != null &&
              userVotes != null &&
              candidate.isProposal !== true && (
                <CandidateSponsors
                  candidate={candidate}
                  slug={candidate.slug ?? ''}
                  id={candidate.id}
                  isProposer={isProposer}
                  handleRefetchCandidateData={() => {
                    candidateRefetch();
                  }}
                  setDataFetchPollInterval={(interval: number | null) =>
                    interval !== null
                      ? setDataFetchPollInterval(interval)
                      : setDataFetchPollInterval(0)
                  }
                  currentBlock={currentBlock - 1n}
                  requiredVotes={threshold + 1}
                  userVotes={userVotes}
                  isSignerWithActiveOrPendingProposal={isSignerWithActiveOrPendingProposal}
                  latestProposal={latestProposal}
                  isUpdateToProposal={isUpdateToProposal}
                  originalProposal={originalProposal}
                  blockNumber={currentBlock}
                />
              )}
            <VoteSignals
              proposalId={candidate.id}
              proposer={candidate.proposer}
              versionTimestamp={BigInt(candidate?.lastUpdatedTimestamp)}
              feedback={feedback.data}
              userVotes={userVotes}
              isCandidate={true}
              candidateSlug={candidate.slug}
              setDataFetchPollInterval={setDataFetchPollInterval}
              handleRefetch={handleRefetchData}
              isFeedbackClosed={isUpdateToProposal && !isParentProposalUpdatable}
            />
          </div>
        </div>
      )}
    </Section>
  );
};

export default CandidatePage;
