import { Row, Col, Alert, Button, Card, ProgressBar } from 'react-bootstrap';
import Section from '../../layout/Section';
import { ProposalState, useProposal, Vote } from '../../wrappers/nounsDao';
import { useUserVotesAsOfBlock } from '../../wrappers/nounToken';
import classes from './Vote.module.css';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useBlockMeta, useBlockNumber } from '@usedapp/core';
import leftArrow from '../../assets/noun_arrow_left_brand_green_shadow.png';
import { buildEtherscanAddressLink, buildEtherscanTxLink, Network } from '../../utils/buildEtherscanLink';
import ProposalStatus from '../../components/ProposalStatus';
import moment from 'moment-timezone';
import VoteModal from '../../components/VoteModal';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown'
import { utils } from 'ethers';

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

  // Only count available votes as of the proposal start block
  const availableVotes = useUserVotesAsOfBlock(proposal?.startBlock ?? undefined);

  // Only show voting if user has > 0 votes at proposal start block and proposal is active
  const showVotingButtons = availableVotes && proposal?.status === ProposalState.ACTIVE;

  const linkIfAddress = (content: string, network = Network.mainnet) => {
    if (utils.isAddress(content)) {
      return (
        <a href={buildEtherscanAddressLink(content, network).toString()} target="_blank" rel="noreferrer">
          {content}
        </a>
      );
    }
    return <span>{content}</span>;
  };

  const transactionLink = (content: string, network = Network.mainnet) => {
    return (
      <a href={buildEtherscanTxLink(content, network).toString()} target="_blank" rel="noreferrer">
        {content.substring(0,7)}
      </a>
    )
  }

  return (
    <Section bgColor="white" fullWidth={false}>
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
        <div className={classes.proposalHeader}>
          <h3 className={classes.proposalId}>Proposal {proposal?.id}</h3>
          <ProposalStatus status={proposal?.status}></ProposalStatus>
        </div>
        <div>
          {startDate && startDate.isBefore(now) ? (
            null
          ) : proposal ? (
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
            { proposal?.description && <ReactMarkdown className={classes.markdown} children={proposal.description} /> }
          </Col>
        </Row>
        <Row>
          <Col className={classes.section}>
            <h5>Details</h5>
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
                    )
                  })}
                  )
                </p>
              )
            })}
          </Col>
        </Row>
        <Row>
          <Col className={classes.section}>
            <h5>Proposer</h5>
            {proposal?.proposer && proposal?.transactionHash && <>{linkIfAddress(proposal.proposer)} at {transactionLink(proposal.transactionHash)}</> }
          </Col>
        </Row>
      </Col>
    </Section>
  );
};

export default VotePage;
