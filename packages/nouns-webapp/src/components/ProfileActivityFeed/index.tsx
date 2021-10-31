import React from 'react';
import { Col, Table } from 'react-bootstrap';
import Section from '../../layout/Section';
import classes from './ProfileActivityFeed.module.css';

import { useQuery } from '@apollo/client';
import { Proposal, useAllProposals } from '../../wrappers/nounsDao';
import { nounVotingHistoryQuery } from '../../wrappers/subgraph';
import NounProfileVoteRow from '../NounProfileVoteRow';
import { LoadingNoun } from '../Noun';

interface ProfileActivityFeedProps {
  nounId: number;
}

interface ProposalInfo {
  id: number;
}

interface NounVoteHistory {
  proposal: ProposalInfo;
  support: boolean;
}

const ProfileActivityFeed: React.FC<ProfileActivityFeedProps> = props => {
  const { nounId } = props;

  const { loading, error, data } = useQuery(nounVotingHistoryQuery(nounId));
  const { data: proposals } = useAllProposals();

  if (loading) {
    return <></>;
  } else if (error) {
    return <div>Failed to fetch noun activity history</div>;
  }

  const proposalsVotedOn = data.noun.votes
    .slice(0)
    .map((h: NounVoteHistory, i: number) => h.proposal.id);

  const supportedProposals = data.noun.votes
    .slice(0)
    .filter((h: NounVoteHistory, i: number) => h.support)
    .map((h: NounVoteHistory, i: number) => h.proposal.id);

  const latestProposalId = proposals?.length;

  return (
    <Section fullWidth={false}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>Activity</h1>
        </div>

        <Table responsive hover>
          <tbody className={classes.nounInfoPadding}>
            {proposals?.length ? (
              proposals
                .slice(0)
                .reverse()
                .map((p: Proposal, i: number) => {
                  return (
                    <NounProfileVoteRow
                      proposal={p}
                      nounVoted={proposalsVotedOn.includes(p.id)}
                      nounSupported={supportedProposals.includes(p.id)}
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
      </Col>
    </Section>
  );
};

export default ProfileActivityFeed;
