import { Row, Col, Button, Card, Spinner } from 'react-bootstrap';
import Section from '../../layout/Section';
import {
  ProposalState,
  useCancelProposal,
  useCandidate,
  useCurrentQuorum,
  useExecuteProposal,
  useProposal,
  useQueueProposal,
} from '../../wrappers/nounsDao';
import { useUserVotesAsOfBlock } from '../../wrappers/nounToken';
import classes from './Candidate.module.css';
import { Link, RouteComponentProps } from 'react-router-dom';
import { TransactionStatus, useBlockNumber, useEthers } from '@usedapp/core';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';
import VoteModal from '../../components/VoteModal';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import clsx from 'clsx';
import ProposalHeader from '../../components/ProposalHeader';
import ProposalContent from '../../components/ProposalContent';
import VoteCard, { VoteCardVariant } from '../../components/VoteCard';
import { useQuery } from '@apollo/client';
import {
  proposalVotesQuery,
  delegateNounsAtBlockQuery,
  ProposalVotes,
  Delegates,
  propUsingDynamicQuorum,
} from '../../wrappers/subgraph';
import { getNounVotes } from '../../utils/getNounsVotes';
import { Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import { ReactNode } from 'react-markdown/lib/react-markdown';
import { AVERAGE_BLOCK_TIME_IN_SECS } from '../../utils/constants';
import { SearchIcon } from '@heroicons/react/solid';
import ReactTooltip from 'react-tooltip';
import DynamicQuorumInfoModal from '../../components/DynamicQuorumInfoModal';
import config from '../../config';
import ShortAddress from '../../components/ShortAddress';
import StreamWithdrawModal from '../../components/StreamWithdrawModal';
import { parseStreamCreationCallData } from '../../utils/streamingPaymentUtils/streamingPaymentUtils';
import CandidateSponsors from '../../components/CandidateSponsors';
import { BigNumber } from 'ethers';
import { CandidateSignature } from '../../wrappers/nounsDao';
import CandidateHeader from '../../components/ProposalHeader/CandidateHeader';
import { version } from 'process';
import ProposalCandidateContent from '../../components/ProposalContent/ProposalCandidateContent';
import { ProposalCandidate, useCancelCandidate, useCandidateProposal } from '../../wrappers/nounsData';

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
  const candidate: ProposalCandidate | undefined = useCandidateProposal(id);
  const { cancelCandidate, cancelCandidateState } = useCancelCandidate();
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const isWalletConnected = !(activeAccount === undefined);
  const { account } = useEthers();

  useEffect(() => {
    if (candidate && account) {
      setIsProposer(candidate.proposer.toLowerCase() === account.toLowerCase());
    }
  }, [candidate, account]);
  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  const onTransactionStateChange = useCallback(
    (
      tx: TransactionStatus,
      successMessage?: ReactNode,
      setPending?: (isPending: boolean) => void,
      getErrorMessage?: (error?: string) => ReactNode | undefined,
      onFinalState?: () => void,
    ) => {
      console.log('tx', tx);
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
    () => onTransactionStateChange(cancelCandidateState, 'Proposal Candidate Canceled!', setCancelPending),
    [cancelCandidateState, onTransactionStateChange, setModal],
  );

  const destructiveStateAction = (() => {
    return () => {
      if (candidate?.id) {
        return cancelCandidate(candidate.slug);
      }
    };
  })();


  return (
    <Section fullWidth={false} className={classes.votePage}>

      <Col lg={12} className={classes.wrapper}>
        {candidate && (
          <CandidateHeader
            // proposal={candidate}
            title={candidate.version.title}
            slug={candidate.slug}
            id={candidate.id}
            proposer={candidate.proposer}
            versionsCount={candidate.versionsCount}
            createdTransactionHash={candidate.createdTransactionHash}
            lastUpdatedTimestamp={candidate.lastUpdatedTimestamp}
            isCandidate={true}
            isWalletConnected={isWalletConnected}
            submitButtonClickHandler={() => { }}
          />
        )}
      </Col>
      <Row>
        <Col lg={12}>
          <div className={classes.editCandidate}>
            <p>
              <Trans>
                Editing a proposal candidate will clear any previous sponsors and require each sponsor to
                re-sign</Trans>
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
      {candidate && (
        <Row>
          <Col lg={8} className={clsx(classes.proposal, classes.wrapper)}>
            <ProposalCandidateContent proposal={candidate} />
          </Col>
          <Col lg={4}>
            <CandidateSponsors
              candidate={candidate}
              slug={candidate.slug ?? ''}
              id={candidate.id}
              // only show signatures that are not canceled
              signatures={candidate.version.versionSignatures.filter(sig => sig.canceled === false)}
              isProposer={isProposer}
            />
          </Col>
        </Row>
      )}
    </Section>
  );
};

export default CandidatePage;
