import { Row, Col, Alert, Button, Card, Spinner } from 'react-bootstrap';
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
import { RouteComponentProps } from 'react-router-dom';
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
import { useAppDispatch, useAppSelector } from '../../hooks';
import { nounVotesForProposalQuery } from '../../wrappers/subgraph';
import { useQuery } from '@apollo/client';
import VoteProgresBar, { ProgressBarVariant } from '../../components/VoteProgressBar';
import proposalStatusClasses from '../../components/ProposalStatus/ProposalStatus.module.css';
import NounImageVoteTable from '../../components/NounImageVoteTable';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

const AVERAGE_BLOCK_TIME_IN_SECS = 13;

// Helper function to transform response from graph into flat list of nounIds that voted
// supportDetailed for the given prop
const getNounVotes = (data: any, supportDetailed: number) => {
  return data.proposals[0].votes
    .filter((vote: any) => vote.supportDetailed === supportDetailed)
    .map((vote: any) => vote.nouns)
    .flat(1)
    .map((noun: any) => noun.id);
};

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

  const backButtonClickHandler = () => {
    // eslint-disable-next-line no-restricted-globals
    location.href = '/vote';
  };

  const activeAccount = useAppSelector(state => state.account.activeAccount);

  const { loading, error, data } = useQuery(
    nounVotesForProposalQuery(proposal && proposal.id ? proposal?.id : '0'),
  );
  if (!proposal || loading || !data || data.proposals.length === 0) {
    return (
      <div className={classes.spinner}>
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <>Failed to fetch</>;
  }

  const forNouns = getNounVotes(data, 1);
  const againstNouns = getNounVotes(data, 0);
  const abstainNouns = getNounVotes(data, 2);

  const startOrEndTimeCopy = () => {
    if (startDate?.isBefore(now) && endDate?.isAfter(now)) {
      return 'Ends';
    } else if (endDate?.isBefore(now)) {
      return 'Ended';
    } else {
      return 'Starts';
    }
  };

  const startOrEndTimeTime = () => {
    if (!startDate?.isBefore(now)) {
      return startDate;
    } else {
      return endDate;
    }
  };

  const isWalletConnected = !(activeAccount === undefined);
  const isActiveForVoting = startDate?.isBefore(now) && endDate?.isAfter(now);

  return (
    <Section fullWidth={false} className={classes.votePage}>
      <VoteModal
        show={showVoteModal}
        onHide={() => setShowVoteModal(false)}
        onVote={() => castVote(proposal?.id, vote)}
        isLoading={isVotePending}
        proposalId={proposal?.id}
        availableVotes={availableVotes}
        vote={vote}
      />
      <Col lg={{ span: 10, offset: 1 }} className={classes.proposal}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex justify-content-start align-items-start">
            <button className={classes.leftArrowCool} onClick={backButtonClickHandler}>
              ←
            </button>
            <div className={classes.headerRow}>
              <span>Proposal {proposal.id}</span>
              <h1>
                {proposal.title}{' '}
                <span className={classes.proposalStatus}>
                  <ProposalStatus
                    status={proposal?.status}
                    className={proposalStatusClasses.votePageProposalStatus}
                  />
                </span>
              </h1>
            </div>
          </div>
          <div className="d-flex justify-content-end align-items-end">
            {isActiveForVoting && (
              <>
                {isWalletConnected ? (
                  <></>
                ) : (
                  <div className={classes.connectWalletText}>Connect a wallet to vote.</div>
                )}
                <Button
                  className={isWalletConnected ? classes.submitBtn : classes.submitBtnDisabled}
                  onClick={backButtonClickHandler}
                >
                  Submit vote
                </Button>
              </>
            )}
          </div>
        </div>
        {proposal && proposalActive && (
          <>
            {showBlockRestriction && !hasVoted && (
              <Alert variant="secondary" className={classes.blockRestrictionAlert}>
                Only NOUN votes that were self delegated or delegated to another address before
                block {proposal.createdBlock} are eligible for voting.
              </Alert>
            )}
            {hasVoted && (
              <Alert variant="success" className={classes.voterIneligibleAlert}>
                Thank you for your vote!
              </Alert>
            )}
          </>
        )}
        {showVotingButtons ? (
          <Row>
            <Col lg={4} className="d-grid gap-2">
              <Button
                className={classes.votingButton}
                onClick={() => {
                  setVote(Vote.FOR);
                  setShowVoteModal(true);
                }}
              >
                Vote For
              </Button>
            </Col>
            <Col lg={4} className="d-grid gap-2">
              <Button
                className={classes.votingButton}
                onClick={() => {
                  setVote(Vote.AGAINST);
                  setShowVoteModal(true);
                }}
              >
                Vote Against
              </Button>
            </Col>
            <Col lg={4} className="d-grid gap-2">
              <Button
                className={classes.votingButton}
                onClick={() => {
                  setVote(Vote.ABSTAIN);
                  setShowVoteModal(true);
                }}
              >
                Abstain
              </Button>
            </Col>
          </Row>
        ) : (
          ''
        )}
        {isAwaitingStateChange() && (
          <Row className={classes.section}>
            <Col className="d-grid">
              <Button
                onClick={moveStateAction}
                disabled={isQueuePending || isExecutePending}
                variant="dark"
              >
                {isQueuePending || isExecutePending ? (
                  <Spinner animation="border" />
                ) : (
                  `${moveStateButtonAction} Proposal`
                )}
              </Button>
            </Col>
          </Row>
        )}
        <Row>
          <Col lg={4}>
            <Card className={classes.voteCountCard}>
              <Card.Body className="p-2">
                <Card.Text className="py-2 m-0">
                  <span className={`${classes.voteCardHeaderText} ${classes.for}`}>For</span>
                  <span className={classes.voteCardVoteCount}>{proposal?.forCount}</span>
                </Card.Text>
                <VoteProgresBar variant={ProgressBarVariant.FOR} percentage={forPercentage} />
                <Row className={classes.nounProfilePics}>
                  <NounImageVoteTable nounIds={forNouns} />
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className={classes.voteCountCard}>
              <Card.Body className="p-2">
                <Card.Text className="py-2 m-0">
                  <span className={`${classes.voteCardHeaderText} ${classes.against}`}>
                    Against
                  </span>
                  <span className={classes.voteCardVoteCount}>{proposal?.againstCount}</span>
                </Card.Text>
                <VoteProgresBar
                  variant={ProgressBarVariant.AGINST}
                  percentage={againstPercentage}
                />
                <Row className={classes.nounProfilePics}>
                  <NounImageVoteTable nounIds={againstNouns} />
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className={classes.voteCountCard}>
              <Card.Body className="p-2">
                <Card.Text className="py-2 m-0">
                  <span className={`${classes.voteCardHeaderText} ${classes.abstain}`}>
                    Abstain
                  </span>
                  <span className={classes.voteCardVoteCount}>{proposal?.abstainCount}</span>
                </Card.Text>
                <VoteProgresBar
                  variant={ProgressBarVariant.ABSTAIN}
                  percentage={abstainPercentage}
                />
                <Row className={classes.nounProfilePics}>
                  <NounImageVoteTable nounIds={abstainNouns} />
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={4}>
            <Card className={classes.voteInfoCard}>
              <Card.Body className="p-2">
                <Row className={classes.voteMetadataRow}>
                  <Col className={classes.voteMetadataRowTitle}>
                    <h1>Threshold</h1>
                  </Col>
                  <Col>
                    <span>Differential</span>
                    <h3>{proposal.forCount - proposal.againstCount} votes</h3>
                  </Col>
                  <Col>
                    <span>Quorum</span>
                    <h3>{proposal.quorumVotes} votes</h3>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className={classes.voteInfoCard}>
              <Card.Body className="p-2">
                <Row className={classes.voteMetadataRow}>
                  <Col className={classes.voteMetadataRowTitle}>
                    <h1>{startOrEndTimeCopy()}</h1>
                  </Col>
                  <Col className={classes.voteMetadataTime}>
                    <span>{startOrEndTimeTime() && startOrEndTimeTime()?.format('h:mm A z')}</span>
                    <h3>{startOrEndTimeTime() && startOrEndTimeTime()?.format('MMMM D, YYYY')}</h3>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className={classes.voteInfoCard}>
              <Card.Body className="p-2">
                <Row className={classes.voteMetadataRow}>
                  <Col className={classes.voteMetadataRowTitle}>
                    <h1>Snapshot</h1>
                  </Col>
                  <Col>
                    <span>Taken at block</span>
                    <h3>{proposal.createdBlock}</h3>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col className={classes.section}>
            {proposal?.description && (
              <ReactMarkdown
                className={classes.markdown}
                children={proposal.description}
                remarkPlugins={[remarkBreaks]}
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col className={classes.section}>
            <h5>Proposed Transactions</h5>
            <ol>
              {proposal?.details?.map((d, i) => {
                return (
                  <li key={i} className="m-0">
                    {linkIfAddress(d.target)}.{d.functionSig}
                    {d.value}(
                    <br />
                    {d.callData.split(',').map((content, i) => {
                      return (
                        <Fragment key={i}>
                          <span key={i}>
                            &emsp;
                            {linkIfAddress(content)}
                            {d.callData.split(',').length - 1 === i ? '' : ','}
                          </span>
                          <br />
                        </Fragment>
                      );
                    })}
                    )
                  </li>
                );
              })}
            </ol>
          </Col>
        </Row>
        <Row>
          <Col className={classes.section}>
            <h5>Proposer</h5>
            {proposal?.proposer && proposal?.transactionHash && (
              <>
                {linkIfAddress(proposal.proposer)} at {transactionLink(proposal.transactionHash)}
              </>
            )}
          </Col>
        </Row>
      </Col>
    </Section>
  );
};

export default VotePage;
