import { Row, Col, Button, Spinner } from 'react-bootstrap';
import Section from '../../layout/Section';
import classes from './Candidate.module.css';
import { Link, RouteComponentProps } from 'react-router-dom';
import { TransactionStatus, useBlockNumber, useEthers } from '@usedapp/core';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import clsx from 'clsx';
import { Trans } from '@lingui/macro';
import { ReactNode } from 'react-markdown/lib/react-markdown';
import CandidateSponsors from '../../components/CandidateSponsors';
import CandidateHeader from '../../components/ProposalHeader/CandidateHeader';
import ProposalCandidateContent from '../../components/ProposalContent/ProposalCandidateContent';
import { useProposalThreshold } from '../../wrappers/nounsDao';
import { useCancelCandidate, useCandidateProposal } from '../../wrappers/nounsData';
import { useUserVotes } from '../../wrappers/nounToken';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

const CandidatePage = ({
  match: {
    params: { id },
  },
}: RouteComponentProps<{ id: string }>) => {
  const [isProposer, setIsProposer] = useState<boolean>(false);
  const [isCancelPending, setCancelPending] = useState<boolean>(false);
  const [dataFetchPollInterval, setDataFetchPollInterval] = useState<number>(0);
  const [currentBlock, setCurrentBlock] = useState<number>();
  const candidate = useCandidateProposal(id, dataFetchPollInterval);
  const { cancelCandidate, cancelCandidateState } = useCancelCandidate();
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const isWalletConnected = !(activeAccount === undefined);
  const blockNumber = useBlockNumber();
  const { account } = useEthers();
  const threshold = useProposalThreshold();
  const userVotes = useUserVotes();

  useEffect(() => {
    // prevent live-updating the block resulting in undefined block number
    if (blockNumber && !currentBlock) {
      setCurrentBlock(blockNumber);
    }
  }, [blockNumber, currentBlock]);


  useEffect(() => {
    if (candidate.data && account) {
      setIsProposer(candidate.data.proposer.toLowerCase() === account.toLowerCase());
    }
  }, [candidate, account]);
  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);
  const handleRefetchCandidateData = () => {
    candidate.refetch();
  };

  const onTransactionStateChange = useCallback(
    (
      tx: TransactionStatus,
      successMessage?: ReactNode,
      setPending?: (isPending: boolean) => void,
      getErrorMessage?: (error?: string) => ReactNode | undefined,
      onFinalState?: () => void,
    ) => {
      switch (tx.status) {
        case 'None':
          setPending?.(false);
          break;
        case 'Mining':
          setPending?.(true);
          break;
        case 'Success':
          setModal({
            title: <Trans>Success</Trans>,
            message: successMessage || <Trans>Transaction Successful!</Trans>,
            show: true,
          });
          setPending?.(false);
          onFinalState?.();
          break;
        case 'Fail':
          setModal({
            title: <Trans>Transaction Failed</Trans>,
            message: tx?.errorMessage || <Trans>Please try again.</Trans>,
            show: true,
          });
          setPending?.(false);
          onFinalState?.();
          break;
        case 'Exception':
          setModal({
            title: <Trans>Error</Trans>,
            message: getErrorMessage?.(tx?.errorMessage) || <Trans>Please try again.</Trans>,
            show: true,
          });
          setPending?.(false);
          onFinalState?.();
          break;
      }
    },
    [setModal],
  );

  // handle cancel candidate
  useEffect(
    () =>
      onTransactionStateChange(
        cancelCandidateState,
        'Proposal Candidate Canceled!',
        setCancelPending,
      ),
    [cancelCandidateState, onTransactionStateChange, setModal],
  );

  const destructiveStateAction = (() => {
    return () => {
      if (candidate?.data?.id) {
        return cancelCandidate(candidate.data.slug);
      }
    };
  })();

  return (
    <Section fullWidth={false} className={classes.votePage}>
      <Col lg={12} className={classes.wrapper}>
        {candidate.data && (
          <CandidateHeader
            title={candidate.data.version.title}
            id={candidate.data.id}
            proposer={candidate.data.proposer}
            versionsCount={candidate.data.versionsCount}
            createdTransactionHash={candidate.data.createdTransactionHash}
            lastUpdatedTimestamp={candidate.data.lastUpdatedTimestamp}
            isCandidate={true}
            isWalletConnected={isWalletConnected}
            submitButtonClickHandler={() => { }}
          />
        )}
      </Col>
      {isProposer && (
        <Row>
          <Col lg={12}>
            <div className={classes.editCandidate}>
              <p>
                <span className={classes.proposerOptionsHeader}><Trans>Proposer functions</Trans></span>
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
                  {isCancelPending ? <Spinner animation="border" /> : <Trans>Cancel candidate</Trans>}
                </Button>
                <Link
                  to={`/candidates/${id}/edit`}
                  className={clsx(classes.primaryButton, classes.button)}
                >
                  {isCancelPending ? <Spinner animation="border" /> : <Trans>Edit</Trans>}
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      )}
      {candidate.data && (
        <Row>
          <Col lg={8} className={clsx(classes.proposal, classes.wrapper)}>
            <ProposalCandidateContent proposal={candidate.data} />
          </Col>
          <Col lg={4}>
            {currentBlock && threshold !== undefined && userVotes !== undefined && (
              <CandidateSponsors
                candidate={candidate.data}
                slug={candidate.data.slug ?? ''}
                id={candidate.data.id}
                isProposer={isProposer}
                handleRefetchCandidateData={handleRefetchCandidateData}
                setDataFetchPollInterval={setDataFetchPollInterval}
                currentBlock={currentBlock - 1}
                requiredVotes={threshold + 1}
                userVotes={userVotes}
              />
            )}
          </Col>
        </Row>
      )}
    </Section>
  );
};

export default CandidatePage;
