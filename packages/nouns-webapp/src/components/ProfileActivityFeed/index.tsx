import React, { useState } from 'react';
import { Col, Table, Collapse, Fade } from 'react-bootstrap';
import Section from '../../layout/Section';
import classes from './ProfileActivityFeed.module.css';

import { useQuery } from '@apollo/client';
import { Proposal, useAllProposals } from '../../wrappers/nounsDao';
import { nounVotingHistoryQuery } from '../../wrappers/subgraph';
import NounProfileVoteRow from '../NounProfileVoteRow';
import { LoadingNoun } from '../Noun';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface ProfileActivityFeedProps {
  nounId: number;
  shouldTruncateProposals: boolean;
}

interface ProposalInfo {
  id: number;
}

export interface NounVoteHistory {
  proposal: ProposalInfo;
  support: boolean;
  supportDetailed: number;
}

const ProfileActivityFeed: React.FC<ProfileActivityFeedProps> = props => {
  const { nounId, shouldTruncateProposals } = props;

  const [truncateProposals, setTruncateProposals] = useState(true);

  const numProposalsToShowDefault = 5;

  const { loading, error, data } = useQuery(nounVotingHistoryQuery(nounId));
  const { data: proposals } = useAllProposals();

  if (loading) {
    return <></>;
  } else if (error) {
    return <div>Failed to fetch noun activity history</div>;
  }

  const nounVotes: { [key: string]: NounVoteHistory } = data.noun.votes
    .slice(0)
    .reduce((acc: any, h: NounVoteHistory, i: number) => {
      acc[h.proposal.id] = h;
      return acc;
    }, {});

  const latestProposalId = proposals?.length;

  return (
    <Section fullWidth={false}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>Activity</h1>
        </div>

        <Table responsive hover className={classes.aboveTheFoldEventsTable}>
          <tbody className={classes.nounInfoPadding}>
            {proposals?.length ? (
              proposals
                .slice(0)
                .reverse()
                .slice(0, shouldTruncateProposals ? numProposalsToShowDefault : proposals.length)
                .map((p: Proposal, i: number) => {
                  const vote = p.id ? nounVotes[p.id] : undefined;
                  return (
                    <NounProfileVoteRow
                      proposal={p}
                      vote={vote}
                      latestProposalId={latestProposalId}
                      nounId={nounId}
                      key={i}
                    />
                  );
                })
            ) : (
              <LoadingNoun />
            )}
          </tbody>
        </Table>
        <Collapse in={!truncateProposals}>
          <div>
            <Table responsive hover>
              <tbody className={classes.nounInfoPadding}>
                {proposals?.length ? (
                  proposals
                    .slice(0)
                    .reverse()
                    .slice(numProposalsToShowDefault + 1, proposals.length)
                    .map((p: Proposal, i: number) => {
                      const vote = p.id ? nounVotes[p.id] : undefined;
                      return (
                        <NounProfileVoteRow
                          proposal={p}
                          vote={vote}
                          latestProposalId={latestProposalId}
                          nounId={nounId}
                          key={i}
                        />
                      );
                    })
                ) : (
                  <LoadingNoun />
                )}
              </tbody>
            </Table>
          </div>
        </Collapse>

        {shouldTruncateProposals ? (
          truncateProposals ? (
            <div className={classes.expandCollapseCopy} onClick={() => setTruncateProposals(false)}>
              Show all events <FontAwesomeIcon icon={faChevronDown} />
            </div>
          ) : (
            <div className={classes.expandCollapseCopy} onClick={() => setTruncateProposals(true)}>
              Show fewer <FontAwesomeIcon icon={faChevronUp} />
            </div>
          )
        ) : (
          <></>
        )}
      </Col>
    </Section>
  );
};

export default ProfileActivityFeed;
