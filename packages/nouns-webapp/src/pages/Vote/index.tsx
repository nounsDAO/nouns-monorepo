import { Row, Col, Alert, Button, Card, ProgressBar } from 'react-bootstrap';
import Section from '../../layout/Section';
import { ProposalState, useCastVote, useProposal, Vote } from '../../wrappers/nounsDao';
import { useUserVotesAsOfBlock } from '../../wrappers/nounToken';
import classes from './Vote.module.css';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useBlockNumber } from '@usedapp/core';
import {
  buildEtherscanAddressLink,
  buildEtherscanTxLink,
  Network,
} from '../../utils/buildEtherscanLink';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import ProposalStatus from '../../components/ProposalStatus';
import moment from 'moment-timezone';
import VoteModal from '../../components/VoteModal';
import { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { utils } from 'ethers';
import { useAppDispatch } from '../../hooks';

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

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  const { castVote, castVoteState } = useCastVote();

  // Get and format date from data
  const timestamp = Date.now();
  const currentBlock = useBlockNumber();
  const startDate =
    proposal && timestamp && currentBlock
      ? moment(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * (proposal.startBlock - currentBlock),
          'seconds',
        )
      : undefined;

  const endDate =
    proposal && timestamp && currentBlock
      ? moment(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * (proposal.endBlock - currentBlock),
          'seconds',
        )
      : undefined;
  const timezone = moment.tz(moment.tz.guess()).zoneAbbr();
  const now = moment();

  // Get total votes and format percentages for UI
  const totalVotes = proposal
    ? proposal.forCount + proposal.againstCount + proposal.abstainCount
    : undefined;
  const forPercentage = proposal && totalVotes ? (proposal.forCount * 100) / totalVotes : 0;
  const againstPercentage = proposal && totalVotes ? (proposal.againstCount * 100) / totalVotes : 0;
  const abstainPercentage = proposal && totalVotes ? (proposal.abstainCount * 100) / totalVotes : 0;

  // Only count available votes as of the proposal created block
  const availableVotes = useUserVotesAsOfBlock(proposal?.createdBlock ?? undefined);

  // Only show voting if user has > 0 votes at proposal created block and proposal is active
  const showVotingButtons = availableVotes && proposal?.status === ProposalState.ACTIVE;

  const linkIfAddress = (content: string, network = Network.mainnet) => {
    if (utils.isAddress(content)) {
      return (
        <a
          href={buildEtherscanAddressLink(content, network).toString()}
          target="_blank"
          rel="noreferrer"
        >
          {content}
        </a>
      );
    }
    return <span>{content}</span>;
  };

  const transactionLink = (content: string, network = Network.mainnet) => {
    return (
      <a href={buildEtherscanTxLink(content, network).toString()} target="_blank" rel="noreferrer">
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

  useEffect(() => {
    switch (castVoteState.status) {
      case 'None':
        setVotePending(false);
        break;
      case 'Mining':
        setVotePending(true);
        break;
      case 'Success':
        setModal({
          title: 'Success',
          message: 'Vote Successful!',
          show: true,
        });
        setVotePending(false);
        setShowVoteModal(false);
        break;
      case 'Fail':
        setModal({
          title: 'Transaction Failed',
          message: castVoteState?.errorMessage || 'Please try again.',
          show: true,
        });
        setVotePending(false);
        setShowVoteModal(false);
        break;
      case 'Exception':
        setModal({
          title: 'Error',
          message: getVoteErrorMessage(castVoteState?.errorMessage) || 'Please try again.',
          show: true,
        });
        setVotePending(false);
        setShowVoteModal(false);
        break;
    }
  }, [castVoteState, setModal]);

  return (
    <Section bgColor="transparent" fullWidth={false} className={classes.votePage}>
      <VoteModal
        show={showVoteModal}
        onHide={() => setShowVoteModal(false)}
        onVote={() => castVote(proposal?.id, vote)}
        isLoading={isVotePending}
        proposalId={proposal?.id}
        availableVotes={availableVotes}
        vote={vote}
      />
      <Col lg={{ span: 8, offset: 2 }}>
        <Link to="/vote">← All Proposals</Link>
      </Col>
      <Col lg={{ span: 8, offset: 2 }} className={classes.proposal}>
        <div className="d-flex justify-content-between align-items-center">
          <h3 className={classes.proposalId}>Proposal {proposal?.id}</h3>
          <ProposalStatus status={proposal?.status}></ProposalStatus>
        </div>
        <div>
          {startDate && startDate.isBefore(now) ? null : proposal ? (
            <span>
              Voting starts approximately {startDate?.format('LLL')} {timezone}
            </span>
          ) : (
            ''
          )}
        </div>
        <div>
          {endDate && endDate.isBefore(now) ? (
            <span>
              Voting ended {endDate.format('LLL')} {timezone}
            </span>
          ) : proposal ? (
            <span>
              Voting ends approximately {endDate?.format('LLL')} {timezone}
            </span>
          ) : (
            ''
          )}
        </div>
        {proposal && proposal.status === ProposalState.ACTIVE && !showVotingButtons && (
          <Alert variant="secondary" className={classes.voterIneligibleAlert}>
            Only NOUN votes that were self delegated or delegated to another address before block{' '}
            {proposal.createdBlock} are eligible for voting.
          </Alert>
        )}
        {showVotingButtons ? (
          <Row>
            <Col lg={4}>
              <Button
                className={classes.votingButton}
                onClick={() => {
                  setVote(Vote.FOR);
                  setShowVoteModal(true);
                }}
                block
              >
                Vote For
              </Button>
            </Col>
            <Col lg={4}>
              <Button
                className={classes.votingButton}
                onClick={() => {
                  setVote(Vote.AGAINST);
                  setShowVoteModal(true);
                }}
                block
              >
                Vote Against
              </Button>
            </Col>
            <Col lg={4}>
              <Button
                className={classes.votingButton}
                onClick={() => {
                  setVote(Vote.ABSTAIN);
                  setShowVoteModal(true);
                }}
                block
              >
                Abstain
              </Button>
            </Col>
          </Row>
        ) : (
          ''
        )}
        <Row>
          <Col lg={4}>
            <Card className={classes.voteCountCard}>
              <Card.Body className="p-2">
                <Card.Text className="py-2 m-0">
                  <span>For</span>
                  <span>{proposal?.forCount}</span>
                </Card.Text>
                <ProgressBar variant="success" now={forPercentage} />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className={classes.voteCountCard}>
              <Card.Body className="p-2">
                <Card.Text className="py-2 m-0">
                  <span>Against</span>
                  <span>{proposal?.againstCount}</span>
                </Card.Text>
                <ProgressBar variant="danger" now={againstPercentage} />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className={classes.voteCountCard}>
              <Card.Body className="p-2">
                <Card.Text className="py-2 m-0">
                  <span>Abstain</span>
                  <span>{proposal?.abstainCount}</span>
                </Card.Text>
                <ProgressBar variant="info" now={abstainPercentage} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col className={classes.section}>
            <h5>Description</h5>
            {proposal?.description && (
              <ReactMarkdown className={classes.markdown} children={proposal.description} />
            )}
          </Col>
        </Row>
        <Row>
          <Col className={classes.section}>
            <h5>Proposed Transactions</h5>
            {proposal?.details?.map((d, i) => {
              return (
                <p key={i} className="m-0">
                  {i + 1}: {linkIfAddress(d.target)}.{d.functionSig}(
                  {d.callData.split(',').map((content, i) => {
                    return (
                      <span key={i}>
                        {linkIfAddress(content)}
                        {d.callData.split(',').length - 1 === i ? '' : ','}
                      </span>
                    );
                  })}
                  )
                </p>
              );
            })}
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
