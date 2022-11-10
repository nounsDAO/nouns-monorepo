import { useHistory } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import classes from './DesktopProposalVoteEvent.module.css';
import ProposalVoteInfoPillsContainer from '../../eventData/ProposalVoteInfoPillsContainer';
import { ProposalVoteEvent } from '../../../../wrappers/nounbrActivity';
import React from 'react';
import { getProposalVoteIcon } from '../../../../utils/nounbrActivity/getProposalVoteIcon';
import ProposalVoteHeadline from '../../eventData/ProposalVoteHeadline';
import DesktopNounBRActivityRow from '../../activityRow/DesktopNounBRActivityRow';
import ReactTooltip from 'react-tooltip';
import { Trans } from '@lingui/macro';

interface DesktopProposalVoteEventProps {
  event: ProposalVoteEvent;
}

const DesktopProposalVoteEvent: React.FC<DesktopProposalVoteEventProps> = props => {
  const { event } = props;
  const history = useHistory();
  const proposalOnClickHandler = () =>
    history.push(event.proposal.id ? `/vote/${event.proposal.id}` : '/vote');

  return (
    <DesktopNounBRActivityRow
      icon={
        <Image
          src={getProposalVoteIcon(event.proposal, event.vote.supportDetailed)}
          className={classes.voteIcon}
        />
      }
      primaryContent={
        <>
          <ReactTooltip
            id={'view-prop-tooltip'}
            effect={'solid'}
            className={classes.delegateHover}
            getContent={dataTip => {
              return <Trans>View on Etherscan</Trans>;
            }}
          />
          <ProposalVoteHeadline
            proposal={event.proposal}
            voter={event.vote.voter}
            supportDetailed={event.vote.supportDetailed}
          />{' '}
          <span
            data-tip={`View Proposal`}
            data-for="view-prop-tooltip"
            onClick={proposalOnClickHandler}
            className={classes.proposalTitle}
          >
            {event.proposal.title}
          </span>
        </>
      }
      secondaryContent={<ProposalVoteInfoPillsContainer proposal={event.proposal} />}
    />
  );
};

export default DesktopProposalVoteEvent;
