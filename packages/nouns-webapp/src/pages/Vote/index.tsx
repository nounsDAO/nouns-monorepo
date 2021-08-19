import { Row, Col, Alert, Button, Card, ProgressBar } from 'react-bootstrap';
import Section from '../../layout/Section';
import { ProposalState, useProposal, Vote } from '../../wrappers/nounsDao';
import { useUserVotesAsOfBlock } from '../../wrappers/nounToken';
import classes from './Vote.module.css';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useBlockMeta, useBlockNumber } from '@usedapp/core';
import leftArrow from '../../assets/noun_arrow_left_brand_green_shadow.png';
import ProposalStatus from '../../components/ProposalStatus';
import moment from 'moment-timezone';
import VoteModal from '../../components/VoteModal';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown'

const AVERAGE_BLOCK_TIME_IN_SECS = 13;

const VotePage = ({
  match: {
    params: { id },
  },
}: RouteComponentProps<{ id: string }>) => {
  const proposal = useProposal(id);

  const [vote, setVote] = useState<Vote>();

  const [showVoteModal, setShowVoteModal] = useState<boolean>(false);

  // Get and format date from data
  const { timestamp } = useBlockMeta();
  const currentBlock = useBlockNumber();
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

  // Only count available votes as of the proposal start block
  const availableVotes = useUserVotesAsOfBlock(proposal?.startBlock ?? undefined);

  // Only show voting if user has > 0 votes at proposal start block and proposal is active
  const showVotingButtons = availableVotes && proposal?.status === ProposalState.ACTIVE;

  return (
    <Section bgColor="white" fullWidth={true}>
      <VoteModal
        show={showVoteModal}
        onHide={() => setShowVoteModal(false)}
        proposalId={proposal?.id}
        vote={vote}
      />
      <Col lg={{ span: 8, offset: 2 }}>
        <Link to="/vote">
          <img className={classes.backArrow} src={leftArrow} alt="Back" /> All Proposals
        </Link>
        <h1>Proposal {proposal?.id}</h1>
        <ProposalStatus status={proposal?.status}></ProposalStatus>
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
          <Alert variant="secondary">
            Only NOUN votes that were self delegated or delegated to another address before block{' '}
            {proposal.startBlock} are eligible for voting.
          </Alert>
        )}
        {showVotingButtons ? (
          <Row>
            <Col>
              <Button
                className={classes.votingButton}
                onClick={() => {
                  setVote(Vote.FOR);
                  setShowVoteModal(true);
                }}
                block
              >
                Vote for
              </Button>
            </Col>
            <Col>
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
            <Col>
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
              <Card.Body>
                <Card.Text>
                  <span>For</span>
                  <span>{proposal?.forCount}</span>
                </Card.Text>
                <ProgressBar variant="success" now={forPercentage} />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className={classes.voteCountCard}>
              <Card.Body>
                <Card.Text>
                  <span>Against</span>
                  <span>{proposal?.againstCount}</span>
                </Card.Text>
                <ProgressBar variant="danger" now={againstPercentage} />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className={classes.voteCountCard}>
              <Card.Body>
                <Card.Text>
                  <span>Abstain</span>
                  <span>{proposal?.abstainCount}</span>
                </Card.Text>
                <ProgressBar variant="info" now={abstainPercentage} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col className={classes.description}>
            { proposal?.description && <ReactMarkdown children={proposal.description} /> }
          </Col>
        </Row>
      </Col>
    </Section>
  );
};

export default VotePage;
