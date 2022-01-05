import { Row, Col, Alert, Button, Card, ProgressBar, Spinner, Container } from 'react-bootstrap';
import Section from '../../layout/Section';
import {
  ProposalState,
  useCastVote,
  useExecuteProposal,
  useHasVotedOnProposal,
  useProposal,
  useQueueProposal,
  Vote,
} from '../../wrappers/nounsDao';
import { useUserVotesAsOfBlock } from '../../wrappers/nounToken';
import classes from './Vote.module.css';
import { Link, RouteComponentProps } from 'react-router-dom';
import { TransactionStatus, useBlockNumber } from '@usedapp/core';
import { buildEtherscanAddressLink, buildEtherscanTxLink } from '../../utils/etherscan';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import ProposalStatus from '../../components/ProposalStatus';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';
import VoteModal from '../../components/VoteModal';
import { Fragment, useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { utils } from 'ethers';
import { useAppDispatch } from '../../hooks';
import StandaloneNoun from '../../components/StandaloneNoun';
import { BigNumber as EthersBN } from 'ethers';
import VotePageHeader from '../../components/VotePageHeader';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

const AVERAGE_BLOCK_TIME_IN_SECS = 13;

const VotePage = ({
  match: {
    params: { id },
  },
}: RouteComponentProps<{ id: string }>) => {
  const proposal = useProposal(id);

  const [vote, setVote] = useState<Vote>();

  const [showVoteModal, setShowVoteModal] = useState<boolean>(false);
  const [isVotePending, setVotePending] = useState<boolean>(false);

  const [isQueuePending, setQueuePending] = useState<boolean>(false);
  const [isExecutePending, setExecutePending] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  const { castVote, castVoteState } = useCastVote();
  const { queueProposal, queueProposalState } = useQueueProposal();
  const { executeProposal, executeProposalState } = useExecuteProposal();

  // Get and format date from data
  const timestamp = Date.now();
  const currentBlock = useBlockNumber();
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
  const now = dayjs();

  // Get total votes and format percentages for UI
  const totalVotes = proposal
    ? proposal.forCount + proposal.againstCount + proposal.abstainCount
    : undefined;
  const forPercentage = proposal && totalVotes ? (proposal.forCount * 100) / totalVotes : 0;
  const againstPercentage = proposal && totalVotes ? (proposal.againstCount * 100) / totalVotes : 0;
  const abstainPercentage = proposal && totalVotes ? (proposal.abstainCount * 100) / totalVotes : 0;

  const proposalActive = proposal?.status === ProposalState.ACTIVE;

  // Only count available votes as of the proposal created block
  const availableVotes = useUserVotesAsOfBlock(proposal?.createdBlock ?? undefined);

  const hasVoted = useHasVotedOnProposal(proposal?.id);

  const showBlockRestriction = proposalActive;

  // Only show voting if user has > 0 votes at proposal created block and proposal is active
  const showVotingButtons = availableVotes && !hasVoted && proposalActive;

  const linkIfAddress = (content: string) => {
    if (utils.isAddress(content)) {
      return (
        <a href={buildEtherscanAddressLink(content)} target="_blank" rel="noreferrer">
          {content}
        </a>
      );
    }
    return <span>{content}</span>;
  };

  const transactionLink = (content: string) => {
    return (
      <a href={buildEtherscanTxLink(content)} target="_blank" rel="noreferrer">
        {content.substring(0, 7)}
      </a>
    );
  };

  const getVoteErrorMessage = (error: string | undefined) => {
    if (error?.match(/voter already voted/)) {
      return 'User Already Voted';
    }
    return error;
  };

  const hasSucceeded = proposal?.status === ProposalState.SUCCEEDED;
  const isAwaitingStateChange = () => {
    if (hasSucceeded) {
      return true;
    }
    if (proposal?.status === ProposalState.QUEUED) {
      return new Date() >= (proposal?.eta ?? Number.MAX_SAFE_INTEGER);
    }
    return false;
  };

  const { forCount = 0, againstCount = 0, quorumVotes = 0 } = proposal || {};
  const quorumReached = forCount > againstCount && forCount >= quorumVotes;

  const moveStateButtonAction = hasSucceeded ? 'Queue' : 'Execute';
  const moveStateAction = (() => {
    if (hasSucceeded) {
      return () => queueProposal(proposal?.id);
    }
    return () => executeProposal(proposal?.id);
  })();

  const onTransactionStateChange = useCallback(
    (
      tx: TransactionStatus,
      successMessage?: string,
      setPending?: (isPending: boolean) => void,
      getErrorMessage?: (error?: string) => string | undefined,
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
            title: 'Success',
            message: successMessage || 'Transaction Successful!',
            show: true,
          });
          setPending?.(false);
          onFinalState?.();
          break;
        case 'Fail':
          setModal({
            title: 'Transaction Failed',
            message: tx?.errorMessage || 'Please try again.',
            show: true,
          });
          setPending?.(false);
          onFinalState?.();
          break;
        case 'Exception':
          setModal({
            title: 'Error',
            message: getErrorMessage?.(tx?.errorMessage) || 'Please try again.',
            show: true,
          });
          setPending?.(false);
          onFinalState?.();
          break;
      }
    },
    [setModal],
  );

  useEffect(
    () =>
      onTransactionStateChange(
        castVoteState,
        'Vote Successful!',
        setVotePending,
        getVoteErrorMessage,
        () => setShowVoteModal(false),
      ),
    [castVoteState, onTransactionStateChange, setModal],
  );

  useEffect(
    () => onTransactionStateChange(queueProposalState, 'Proposal Queued!', setQueuePending),
    [queueProposalState, onTransactionStateChange, setModal],
  );

  useEffect(
    () => onTransactionStateChange(executeProposalState, 'Proposal Executed!', setExecutePending),
    [executeProposalState, onTransactionStateChange, setModal],
  );

  return (
    <Container fluid="lg">
      <Col lg={12}  style={{margin: '2rem 0'}}>
        <VotePageHeader />
      </Col>
    </Container>
  );
};

export default VotePage;
