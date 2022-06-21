import React, { useState } from 'react';
import { Col, Collapse, Table } from 'react-bootstrap';
import Section from '../../layout/Section';
import classes from './ProfileActivityFeed.module.css';

import { useQuery } from '@apollo/client';
import { Proposal, ProposalState, useAllProposals } from '../../wrappers/nounsDao';
import { createTimestampAllProposals, nounVotingHistoryQuery } from '../../wrappers/subgraph';
import NounProfileVoteRow from '../NounProfileVoteRow';
import { LoadingNoun } from '../Noun';
import { useNounCanVoteTimestamp } from '../../wrappers/nounsAuction';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Trans } from '@lingui/macro';

interface ProfileActivityFeedProps {
  nounId: number;
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
  const { nounId } = props;

  const MAX_EVENTS_SHOW_ABOVE_FOLD = 5;

  const [truncateProposals, setTruncateProposals] = useState(true);

  const { loading, error, data } = useQuery(nounVotingHistoryQuery(nounId));
  const {
    loading: proposalTimestampLoading,
    error: proposalTimestampError,
    data: proposalCreatedTimestamps,
  } = useQuery(createTimestampAllProposals());

  const nounCanVoteTimestamp = useNounCanVoteTimestamp(nounId);

  const { data: proposals } = useAllProposals();

  if (loading || !proposals || !proposals.length || proposalTimestampLoading) {
    return <></>;
  } else if (error || proposalTimestampError) {
    return (
      <div>
        <Trans>Failed to fetch Noun activity history</Trans>
      </div>
    );
  }

  const nounVotes: { [key: string]: NounVoteHistory } = data.noun.votes
    .slice(0)
    .reduce((acc: any, h: NounVoteHistory, i: number) => {
      acc[h.proposal.id] = h;
      return acc;
    }, {});

  const filteredProposals = proposals.filter((p: Proposal, id: number) => {
    const proposalCreationTimestamp = parseInt(
      proposalCreatedTimestamps.proposals[id].createdTimestamp,
    );

    // Filter props from before the Noun was born
    if (nounCanVoteTimestamp.gt(proposalCreationTimestamp)) {
      return false;
    }
    // Filter props which were cancelled and got 0 votes of any kind
    if (
      p.status === ProposalState.CANCELLED &&
      p.forCount + p.abstainCount + p.againstCount === 0
    ) {
      return false;
    }
    return true;
  });

  return (
    <Section fullWidth={false}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>
            <Trans>Activity</Trans>
          </h1>
        </div>
        {filteredProposals && filteredProposals.length ? (
          <>
            <Table responsive hover className={classes.aboveTheFoldEventsTable}>
              <tbody className={classes.nounInfoPadding}>
                {filteredProposals?.length ? (
                  filteredProposals
                    .slice(0)
                    .reverse()
                    .slice(0, MAX_EVENTS_SHOW_ABOVE_FOLD)
                    .map((p: Proposal, i: number) => {
                      const vote = p.id ? nounVotes[p.id] : undefined;
                      return <NounProfileVoteRow proposal={p} vote={vote} key={i} />;
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
                    {filteredProposals?.length ? (
                      filteredProposals
                        .slice(0)
                        .reverse()
                        .slice(MAX_EVENTS_SHOW_ABOVE_FOLD, filteredProposals.length)
                        .map((p: Proposal, i: number) => {
                          const vote = p.id ? nounVotes[p.id] : undefined;
                          return <NounProfileVoteRow proposal={p} vote={vote} key={i} />;
                        })
                    ) : (
                      <LoadingNoun />
                    )}
                  </tbody>
                </Table>
              </div>
            </Collapse>

            {filteredProposals.length <= MAX_EVENTS_SHOW_ABOVE_FOLD ? (
              <></>
            ) : (
              <>
                {truncateProposals ? (
                  <div
                    className={classes.expandCollapseCopy}
                    onClick={() => setTruncateProposals(false)}
                  >
                    <Trans>Show all {filteredProposals.length} events </Trans>{' '}
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                ) : (
                  <div
                    className={classes.expandCollapseCopy}
                    onClick={() => setTruncateProposals(true)}
                  >
                    <Trans>Show fewer</Trans> <FontAwesomeIcon icon={faChevronUp} />
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className={classes.nullStateCopy}>
            <Trans>This Noun has no activity, since it was just created. Check back soon!</Trans>
          </div>
        )}
      </Col>
    </Section>
  );
};

export default ProfileActivityFeed;
