import { useQuery } from '@apollo/client';
import React from 'react';
import { Proposal, useAllProposals } from '../../wrappers/nounsDao';
import { nounVotingHistoryQuery } from '../../wrappers/subgraph';
import classes from './ProfileActivityFeed.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';

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

const selectIconForNounVoteActivityRow = (nounVoted: boolean, nounSupported: boolean) => {
  if (!nounVoted) {
    return <FontAwesomeIcon icon={faTimes} color={'gray'} />;
  } else if (nounSupported) {
    return <FontAwesomeIcon icon={faThumbsUp} color={'gray'} />;
  } else {
    return <FontAwesomeIcon icon={faThumbsDown} color={'gray'} />;
  }
};

const selectVotingInfoText = (nounVoted: boolean, nounSupported: boolean) => {
  if (!nounVoted) {
    return 'was absent for';
  } else if (nounSupported) {
    return (
      <>
        voted <strong className={classes.voteYes}>yes</strong> on
      </>
    );
  } else {
    return (
      <>
        voted <strong className={classes.voteNo}>no</strong> on
      </>
    );
  }
};

const nounVoteActivityRow = (
  proposal: Proposal,
  index: number,
  nounVoted: boolean,
  nounSupported: boolean,
  nounId: number,
) => {
  if (!proposal || !proposal.id) {
    return <></>;
  }

  const proposalURL = '/vote/' + proposal.id.toString();
  const icon = selectIconForNounVoteActivityRow(nounVoted, nounSupported);
  const votingInfoText = selectVotingInfoText(nounVoted, nounSupported);

  return (
    <li key={index} className={classes.recentActivityRow}>
      <Link to={proposalURL} className={classes.recentActivityLink}>
        <div className={classes.recentActivityItem}>
          <div className={classes.activityRowItemText}>
            {icon} &ensp; <strong>Noun {nounId}</strong> {votingInfoText} proposition{' '}
            <strong>{proposal.title}</strong>
          </div>
        </div>
      </Link>
    </li>
  );
};

const ProfileActivityFeed: React.FC<ProfileActivityFeedProps> = props => {
  const { nounId } = props;
  const NUM_ACTIVITY_ITEMS_TO_SHOW = 10;

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

  return (
    <div>
      <Row>
        <h3 className={classes.heading}>Recent Activity</h3>
      </Row>

      <Row>
        <ul className={classes.recentActivityCollection}>
          {proposals?.length ? (
            proposals
              .slice(0)
              .reverse()
              .slice(0, NUM_ACTIVITY_ITEMS_TO_SHOW)
              .map((p: Proposal, i: number) => {
                return nounVoteActivityRow(
                  p,
                  i,
                  proposalsVotedOn.includes(p.id),
                  supportedProposals.includes(p.id),
                  nounId,
                );
              })
          ) : (
            <div>no data</div>
          )}
        </ul>
      </Row>
    </div>
  );
};

export default ProfileActivityFeed;
