import { useCallback, useEffect, useState } from 'react';

import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import dayjs from 'dayjs';
import advanced from 'dayjs/plugin/advancedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Alert, Button, Col, Row, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router';
import { first, isNonNullish } from 'remeda';
import { toast } from 'sonner';
import { useAccount, useBlockNumber } from 'wagmi';

import CandidateSponsors from '@/components/CandidateSponsors';
import ProposalCandidateContent from '@/components/ProposalContent/ProposalCandidateContent';
import CandidateHeader from '@/components/ProposalHeader/CandidateHeader';
import VoteSignals from '@/components/VoteSignals/VoteSignals';
import { useAppSelector } from '@/hooks';
import Section from '@/layout/Section';
import { checkHasActiveOrPendingProposalOrCandidate } from '@/utils/proposals';
import { formatTxErrorMessage } from '@/utils/txErrorMessages';
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

import classes from './Candidate.module.css';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

const CandidatePage = () => {
  const { id } = useParams<{ id: string }>();
  const [isProposer, setIsProposer] = useState<boolean>(false);
  const [isCancelPending, setCancelPending] = useState<boolean>(false);
  const [dataFetchPollInterval, setDataFetchPollInterval] = useState<number>(0);
  const [isSignerWithActiveOrPendingProposal, setIsSignerWithActiveOrPendingProposal] = useState<
    boolean | undefined
  >(undefined);
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
  const [isProposal, setIsProposal] = useState<boolean>(false);
  const [isUpdateToProposal, setIsUpdateToProposal] = useState<boolean>(false);
  const originalProposal = useProposal(candidate?.proposalIdToUpdate ?? 0);
  const isParentProposalUpdatable = originalProposal?.status === ProposalState.UPDATABLE;

  useEffect(() => {
    (async () => {
      if (!candidate) {
        await candidateRefetch();
        if (candidateData) {
          setCandidate(candidateData);
        }
      }
    })();
  }, [candidate, candidateData, candidateRefetch]);

  const handleRefetchData = () => {
    feedback.refetch();
  };

  useEffect(() => {
    if (candidate && account) {
      setIsProposer(candidate.proposer.toLowerCase() === account.toLowerCase());
    }
    if (candidate?.isProposal) {
      setIsProposal(true);
    }
    if (candidate?.proposalIdToUpdate && +candidate?.proposalIdToUpdate > 0) {
      setIsUpdateToProposal(true);
    }
  }, [candidate, account]);

  useEffect(() => {
    if (latestProposal && account) {
      const status = checkHasActiveOrPendingProposalOrCandidate(
        latestProposal.status,
        latestProposal.proposer,
        account,
      );
      setIsSignerWithActiveOrPendingProposal(status);
    }
  }, [latestProposal, account]);

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
          toast.error(formatTxErrorMessage(errorMessage || _(`Please try again.`)));
          setPending?.(false);
          onFinalState?.();
          break;
        case 'Exception':
          toast.error(
            getErrorMessage?.(errorMessage) || formatTxErrorMessage(errorMessage || _(`Please try again.`)),
          );
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
        candidate?.proposalIdToUpdate > 0 &&
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
      {isProposal && (
        <Alert variant="success">
          <Trans>
            <strong>Note: </strong>
            This proposal candidate has been proposed onchain.
          </Trans>{' '}
          {primaryProposalId && (
            <Link to={`/vote/${primaryProposalId}`}>View the proposal here</Link>
          )}
        </Alert>
      )}
      <Col lg={12} className={classes.wrapper}>
        {!candidate && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '100vh' }}
          >
            <Spinner animation="border" />
          </div>
        )}
        {candidate && (
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
      {isProposer && !isProposal && (
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

      {candidate && (
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
            {!!currentBlock && !!threshold && !!userVotes && !candidate.isProposal && (
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
