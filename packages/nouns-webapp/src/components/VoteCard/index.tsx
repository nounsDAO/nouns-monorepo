import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { isMobileScreen } from '../../utils/isMobile';
import { Proposal } from '../../wrappers/nounsDao';
import NounImageVoteTable from '../NounImageVoteTable';
import VoteProgresBar from '../VoteProgressBar';
import classes from './VoteCard.module.css';

export enum VoteCardVariant {
  FOR,
  AGAINST,
  ABSTAIN,
}

interface VoteCardProps {
  proposal: Proposal;
  percentage: number;
  nounIds: Array<string>;
  variant: VoteCardVariant;
}

const VoteCard: React.FC<VoteCardProps> = props => {
  const { proposal, percentage, nounIds, variant } = props;
  const isMobile = isMobileScreen();

  let titleClass;
  let titleCopy;
  let voteCount;
  switch (variant) {
    case VoteCardVariant.FOR:
      titleClass = classes.for;
      titleCopy = 'For';
      voteCount = proposal.forCount;
      break;
    case VoteCardVariant.AGAINST:
      titleClass = classes.against;
      titleCopy = 'Against';
      voteCount = proposal.againstCount;
      break;
    default:
      titleClass = classes.abstain;
      titleCopy = 'Abstain';
      voteCount = proposal.abstainCount;
      break;
  }

  console.log(isMobile);
  return (
    <Col lg={4} className={classes.wrapper}>
      <Card className={classes.voteCountCard}>
        <Card.Body className="p-2">
          <Card.Text className="py-2 m-0">
            <span className={`${classes.voteCardHeaderText} ${titleClass}`}>{titleCopy}</span>
            {!isMobile && <span className={classes.voteCardVoteCount}>{voteCount}</span>}
          </Card.Text>
          {isMobile && (
            <Card.Text className="py-2 m-0">
              <span className={classes.voteCardVoteCount}>{voteCount}</span>
            </Card.Text>
          )}
          <VoteProgresBar variant={variant} percentage={percentage} />
          {!isMobile && (
            <Row className={classes.nounProfilePics}>
              <NounImageVoteTable nounIds={nounIds} propId={parseInt(proposal.id || '0')} />
            </Row>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default VoteCard;
