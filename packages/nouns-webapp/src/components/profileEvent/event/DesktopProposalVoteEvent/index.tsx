import { useHistory } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import classes from './DesktopProposalVoteEvent.module.css';
import ProposalVoteInfoPillsContainer from '../../eventData/ProposalVoteInfoPillsContainer';
import { ProposalVoteEvent } from '../../../../wrappers/nounActivity';
import React from 'react';
import { getProposalVoteIcon } from '../../../../utils/nounActivity/getProposalVoteIcon';
import ProposalVoteHeadline from '../../eventData/ProposalVoteHeadline';
import DesktopNounActivityRow from '../../activityRow/DesktopNounActivityRow';

interface DesktopProposalVoteEventProps {
  event: ProposalVoteEvent;
}

const DesktopProposalVoteEvent: React.FC<DesktopProposalVoteEventProps> = props => {
  const { event } = props;
  const history = useHistory();
  const proposalOnClickHandler = () =>
    history.push(event.proposal.id ? `/vote/${event.proposal.id}` : '/vote');

  return (
    <DesktopNounActivityRow
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

export default DesktopProposalVoteEvent;
