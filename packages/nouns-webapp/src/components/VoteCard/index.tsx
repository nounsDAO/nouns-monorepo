import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Proposal } from '../../wrappers/nounsDao';
import NounImageVoteTable from '../NounImageVoteTable';
import VoteProgressBar from '../VoteProgressBar';
import classes from './VoteCard.module.css';
import { Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import DelegateGroupedNounImageVoteTable from '../DelegateGroupedNounImageVoteTable';
import HorizontalStackedNouns from '../HorizontalStackedNouns';

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
  delegateView?: boolean;
  delegateGroupedVoteData:
    | { delegate: string; supportDetailed: 0 | 1 | 2; nounsRepresented: string[] }[]
    | undefined;
}

const VoteCard: React.FC<VoteCardProps> = props => {
  const { proposal, percentage, nounIds, variant, delegateView, delegateGroupedVoteData } = props;
  const isMobile = window.innerWidth < 1200;

  let titleClass;
  let titleCopy;
  let voteCount;
  let supportDetailedValue: 0 | 1 | 2;
  switch (variant) {
    case VoteCardVariant.FOR:
      titleClass = classes.for;
      titleCopy = <Trans>For</Trans>;
      voteCount = proposal.forCount;
      supportDetailedValue = 1;
      break;
    case VoteCardVariant.AGAINST:
      titleClass = classes.against;
      titleCopy = <Trans>Against</Trans>;
      voteCount = proposal.againstCount;
      supportDetailedValue = 0;
      break;
    default:
      titleClass = classes.abstain;
      titleCopy = <Trans>Abstain</Trans>;
      voteCount = proposal.abstainCount;
      supportDetailedValue = 2;
      break;
  }

  return (
    <Col lg={4} className={classes.wrapper}>
      <Card className={classes.voteCountCard}>
        <Card.Body className="p-2">
          <Card.Text className="py-2 m-0">
            <span className={`${classes.voteCardHeaderText} ${titleClass}`}>{titleCopy}</span>
            {!isMobile && (
              <span className={classes.voteCardVoteCount}>{i18n.number(voteCount)}</span>
            )}
          </Card.Text>
          {isMobile && (
            <Card.Text className="py-2 m-0">
              <span className={classes.voteCardVoteCount}>{i18n.number(voteCount)}</span>
            </Card.Text>
          )}
          <VoteProgressBar variant={variant} percentage={percentage} />
          {!isMobile && (
            <Row className={classes.nounProfilePics}>
              {delegateView ? (
                <DelegateGroupedNounImageVoteTable
                  filteredDelegateGroupedVoteData={
                    delegateGroupedVoteData
                      ? delegateGroupedVoteData.filter(
                          v => v.supportDetailed === supportDetailedValue,
                        )
                      : []
                  }
                  propId={parseInt(proposal.id || '0')}
                />
              ) : (
                <NounImageVoteTable nounIds={nounIds} propId={parseInt(proposal.id || '0')} />
              )}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default VoteCard;
