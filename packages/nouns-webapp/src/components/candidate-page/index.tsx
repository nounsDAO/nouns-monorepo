'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import dayjs from 'dayjs';
import advanced from 'dayjs/plugin/advancedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
// eslint-disable-next-line no-restricted-imports
import { Alert, Button, Col, Row, Spinner } from 'react-bootstrap';
import { first, isNullish, isNonNullish } from 'remeda';
import { toast } from 'sonner';
import { useAccount, useBlockNumber } from 'wagmi';

import CandidateSponsors from '@/components/candidate-sponsors';
import ProposalCandidateContent from '@/components/proposal-content/proposal-candidate-content';
import CandidateHeader from '@/components/proposal-header/candidate-header';
import Section from '@/components/section';
import VoteSignals from '@/components/vote-signals/vote-signals';
import { useAppSelector } from '@/hooks';
import { checkHasActiveOrPendingProposalOrCandidate } from '@/utils/proposals';
import {
  ProposalState,
  useProposal,
  useProposalCount,
  useProposalThreshold,
} from '@/wrappers/nounsDao';
import {
  useCancelCandidate,
  useCandidateFeedback,
  useCandidateProposal,
} from '@/wrappers/nounsData';
import { useUserVotes } from '@/wrappers/nounToken';
import { Link, useParams } from 'react-router';

import classes from './candidate.module.css';

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
    <Section fullWidth={false} className={classes.votePage}>
      {/* notice for proposal updates */}
      {isNonNullish(candidate?.proposalIdToUpdate) &&
        Number(candidate?.proposalIdToUpdate ?? 0) > 0 &&
        !isProposer && (
          <Alert variant="warning">
            <Trans>
              <strong>Note: </strong>
              This candidate is an update to{' '}
              <Link to={`/vote/${candidate?.proposalIdToUpdate}`}>
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
            <Link to={`/vote/${primaryProposalId}`}>View the proposal here</Link>
          )}
        </Alert>
      )}
      <Col lg={12} className={classes.wrapper}>
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
      </Col>
      {isProposer && isProposal === false && (
        <Row>
          <Col lg={12}>
            <div className={classes.editCandidate}>
              <p>
                <span className={classes.proposerOptionsHeader}>
                  <Trans>Proposer functions</Trans>
                </span>
                <Trans>
                  Editing a proposal candidate will clear any previous sponsors and require each
                  sponsor to re-sign
                </Trans>
              </p>
              <div className={classes.buttons}>
                <Button
                  onClick={destructiveStateAction}
                  disabled={isCancelPending}
                  variant="danger"
                  className={clsx(classes.destructiveTransitionStateButton, classes.button)}
                >
                  {isCancelPending ? (
                    <Spinner animation="border" />
                  ) : (
                    <Trans>Cancel candidate</Trans>
                  )}
                </Button>
                <Link
                  to={`/candidates/${id}/edit`}
                  className={clsx(classes.primaryButton, classes.button)}
                >
                  <Trans>Edit</Trans>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {isNonNullish(candidate) && (
        <Row>
          <Col lg={12}>
            <a className={classes.jump} href="#feedback">
              Jump to Sponsored Votes and Feedback
            </a>
          </Col>
          <Col lg={8} className={clsx(classes.proposal, classes.wrapper)}>
            <ProposalCandidateContent proposal={candidate} />
          </Col>
          <Col id="feedback" lg={4} className={classes.sidebar}>
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
          </Col>
        </Row>
      )}
    </Section>
  );
};

export default CandidatePage;
