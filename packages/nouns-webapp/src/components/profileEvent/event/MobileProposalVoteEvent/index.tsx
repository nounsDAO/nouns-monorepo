import React from 'react';

import { Image } from 'react-bootstrap';
import { useNavigate } from 'react-router';

import { getProposalVoteIcon } from '../../../../utils/nounActivity/getProposalVoteIcon';
import { ProposalVoteEvent } from '../../../../wrappers/nounActivity';
import MobileNounActivityRow from '../../activityRow/MobileNounActivityRow';
import ProposalVoteHeadline from '../../eventData/ProposalVoteHeadline';
import ProposalVoteInfoPillsContainer from '../../eventData/ProposalVoteInfoPillsContainer';

import classes from './MobileProposalVoteEvent.module.css';

interface MobileProposalVoteEventProps {
  event: ProposalVoteEvent;
}

const MobileProposalVoteEvent: React.FC<MobileProposalVoteEventProps> = props => {
  const { event } = props;
  const navigate = useNavigate();
  const proposalOnClickHandler = () =>
    navigate(event.proposal.id ? `/vote/${event.proposal.id}` : '/vote');

  return (
    <MobileNounActivityRow
      onClick={proposalOnClickHandler}
      icon={
        <Image
          src={getProposalVoteIcon(event.proposal, event.vote.supportDetailed)}
          className={classes.voteIcon}
        />
      }
      primaryContent={
        <>
          <ProposalVoteHeadline
            proposal={event.proposal}
            voter={event.vote.voter}
            supportDetailed={event.vote.supportDetailed}
          />{' '}
          <span className={classes.proposalTitle}>{event.proposal.title}</span>
        </>
      }
      secondaryContent={<ProposalVoteInfoPillsContainer proposal={event.proposal} />}
    />
  );
};

export default MobileProposalVoteEvent;
