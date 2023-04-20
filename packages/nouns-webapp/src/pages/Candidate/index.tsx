import { Row, Col, Button, Card, Spinner } from 'react-bootstrap';
import Section from '../../layout/Section';
import {
  ProposalState,
  useCancelProposal,
  useCurrentQuorum,
  useExecuteProposal,
  useProposal,
  useQueueProposal,
} from '../../wrappers/nounsDao';
import { useUserVotesAsOfBlock } from '../../wrappers/nounToken';
import classes from './Candidate.module.css';
import { RouteComponentProps } from 'react-router-dom';
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
import { CandidateSignature } from '../../utils/types';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

const CandidatePage = ({
  match: {
    params: { id },
  },
}: RouteComponentProps<{ id: string }>) => {
  const proposal = useProposal(id);
  const { account } = useEthers();

  const signatures: CandidateSignature[] = [
    {
      signer: '0x0055cd5f017027d10adf4f13332181e6d8d886bb',
      expirationTimestamp: BigNumber.from(1683822753),
      proposer: '0xCB43078C32423F5348Cab5885911C3B5faE217F9',
      slug: 'test-candidate',
      reason: '',
    },
    {
      signer: '0xcc2688350d29623e2a0844cc8885f9050f0f6ed5',
      expirationTimestamp: BigNumber.from(1684341153),
      proposer: '0xCB43078C32423F5348Cab5885911C3B5faE217F9',
      slug: 'test-candidate',
      reason:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ullamcorper nulla non metus auctor fringilla.',
    },
  ];
  const [signedVotes, setSignedVotes] = React.useState<number>(0);
  const blockNumber = useBlockNumber();
  const signers = signatures.map(signature => signature.signer);
  const { data: delegateSnapshot } = useQuery<Delegates>(
    delegateNounsAtBlockQuery(signers, blockNumber ?? 0),
  );
  const [showVoteModal, setShowVoteModal] = useState<boolean>(false);
  const [showDynamicQuorumInfoModal, setShowDynamicQuorumInfoModal] = useState<boolean>(false);
  // Toggle between Noun centric view and delegate view
  const [isDelegateView, setIsDelegateView] = useState(false);

  const [isQueuePending, setQueuePending] = useState<boolean>(false);
  const [isExecutePending, setExecutePending] = useState<boolean>(false);
  const [isCancelPending, setCancelPending] = useState<boolean>(false);
  const [showStreamWithdrawModal, setShowStreamWithdrawModal] = useState<boolean>(false);
  const [streamWithdrawInfo, setStreamWithdrawInfo] = useState<{
    streamAddress: string;
    startTime: number;
    endTime: number;
    streamAmount: number;
    tokenAddress: string;
  } | null>(null);

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);
  const {
    data: dqInfo,
    loading: loadingDQInfo,
    error: dqError,
  } = useQuery(propUsingDynamicQuorum(id ?? '0'));

  const { queueProposal, queueProposalState } = useQueueProposal();
  const { executeProposal, executeProposalState } = useExecuteProposal();
  const { cancelProposal, cancelProposalState } = useCancelProposal();

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

  // Only count available votes as of the proposal created block
  const availableVotes = useUserVotesAsOfBlock(proposal?.createdBlock ?? undefined);

  const currentQuorum = useCurrentQuorum(
    config.addresses.nounsDAOProxy,
    proposal && proposal.id ? parseInt(proposal.id) : 0,
    dqInfo && dqInfo.proposal ? dqInfo.proposal.quorumCoefficient === '0' : true,
  );

  const hasSucceeded = proposal?.status === ProposalState.SUCCEEDED;
  const isInNonFinalState = [
    ProposalState.PENDING,
    ProposalState.ACTIVE,
    ProposalState.SUCCEEDED,
    ProposalState.QUEUED,
  ].includes(proposal?.status!);
  const isCancellable =
    isInNonFinalState && proposal?.proposer?.toLowerCase() === account?.toLowerCase();

  const isAwaitingStateChange = () => {
    if (hasSucceeded) {
      return true;
    }
    if (proposal?.status === ProposalState.QUEUED) {
      return new Date() >= (proposal?.eta ?? Number.MAX_SAFE_INTEGER);
    }
    return false;
  };

  const isAwaitingDestructiveStateChange = () => {
    if (isCancellable) {
      return true;
    }
    return false;
  };

  const startOrEndTimeCopy = () => {
    if (startDate?.isBefore(now) && endDate?.isAfter(now)) {
      return <Trans>Ends</Trans>;
    }
    if (endDate?.isBefore(now)) {
      return <Trans>Ended</Trans>;
    }
    return <Trans>Starts</Trans>;
  };

  const startOrEndTimeTime = () => {
    if (!startDate?.isBefore(now)) {
      return startDate;
    }
    return endDate;
  };

  const moveStateButtonAction = hasSucceeded ? <Trans>Queue</Trans> : <Trans>Execute</Trans>;
  const moveStateAction = (() => {
    if (hasSucceeded) {
      return () => {
        if (proposal?.id) {
          return queueProposal(proposal.id);
        }
      };
    }
    return () => {
      if (proposal?.id) {
        return executeProposal(proposal.id);
      }
    };
  })();

  const destructiveStateButtonAction = isCancellable ? <Trans>Cancel</Trans> : '';
  const destructiveStateAction = (() => {
    if (isCancellable) {
      return () => {
        if (proposal?.id) {
          return cancelProposal(proposal.id);
        }
      };
    }
  })();

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

  useEffect(
    () =>
      onTransactionStateChange(
        queueProposalState,
        <Trans>Proposal Queued!</Trans>,
        setQueuePending,
      ),
    [queueProposalState, onTransactionStateChange, setModal],
  );

  useEffect(
    () =>
      onTransactionStateChange(
        executeProposalState,
        <Trans>Proposal Executed!</Trans>,
        setExecutePending,
      ),
    [executeProposalState, onTransactionStateChange, setModal],
  );

  useEffect(
    () => onTransactionStateChange(cancelProposalState, 'Proposal Canceled!', setCancelPending),
    [cancelProposalState, onTransactionStateChange, setModal],
  );

  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const {
    loading,
    error,
    data: voters,
  } = useQuery<ProposalVotes>(proposalVotesQuery(proposal?.id ?? '0'), {
    skip: !proposal,
  });

  // const voterIds = voters?.votes?.map(v => v.voter.id);
  // const { data: delegateSnapshot } = useQuery<Delegates>(
  //   delegateNounsAtBlockQuery(voterIds ?? [], proposal?.createdBlock ?? 0),
  //   {
  //     skip: !voters?.votes?.length,
  //   },
  // );

  // const { delegates } = delegateSnapshot || {};
  // const delegateToNounIds = delegates?.reduce<Record<string, string[]>>((acc, curr) => {
  //   acc[curr.id] = curr?.nounsRepresented?.map(nr => nr.id) ?? [];
  //   return acc;
  // }, {});

  // const data = voters?.votes?.map(v => ({
  //   delegate: v.voter.id,
  //   supportDetailed: v.supportDetailed,
  //   nounsRepresented: delegateToNounIds?.[v.voter.id] ?? [],
  // }));

  const [showToast, setShowToast] = useState(true);
  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
  }, [showToast]);

  // if (!proposal || loading || !data || loadingDQInfo || !dqInfo) {
  //   return (
  //     <div className={classes.spinner}>
  //       <Spinner animation="border" />
  //     </div>
  //   );
  // }

  if (error || dqError) {
    return <Trans>Failed to fetch</Trans>;
  }

  const isWalletConnected = !(activeAccount === undefined);
  const isActiveForVoting = startDate?.isBefore(now) && endDate?.isAfter(now);

  // const forNouns = getNounVotes(data, 1);
  // const againstNouns = getNounVotes(data, 0);
  // const abstainNouns = getNounVotes(data, 2);
  // const isV2Prop = dqInfo.proposal.quorumCoefficient > 0;

  return (
    <Section fullWidth={false} className={classes.votePage}>
      <Col lg={12} className={classes.wrapper}>
        {proposal && (
          <ProposalHeader
            proposal={proposal}
            isCandidate={true}
            isActiveForVoting={isActiveForVoting}
            isWalletConnected={isWalletConnected}
            submitButtonClickHandler={() => setShowVoteModal(true)}
          />
        )}
      </Col>
      <Row>
        <Col lg={8} className={clsx(classes.proposal, classes.wrapper)}>
          <ProposalContent proposal={proposal} />
        </Col>
        <Col lg={4}>
          <CandidateSponsors
            slug={'test-candidate-slug'}
            signatures={signatures}
            delegateSnapshot={delegateSnapshot}
          />
        </Col>
      </Row>
    </Section>
  );
};

export default CandidatePage;
