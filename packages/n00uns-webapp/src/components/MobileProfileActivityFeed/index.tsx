import React from 'react';
import { Collapse } from 'react-bootstrap';
import {
  DelegationEvent,
  N00unEventType,
  N00unProfileEvent,
  N00unWinEvent,
  ProposalVoteEvent,
  TransferEvent,
} from '../../wrappers/n00unActivity';
import MobileDelegationEvent from '../profileEvent/event/MobileDelegationEvent';
import MobileN00unWinEvent from '../profileEvent/event/MobileN00unWinEvent';
import MobileProposalVoteEvent from '../profileEvent/event/MobileProposalVoteEvent';
import MobileTransferEvent from '../profileEvent/event/MobileTransferEvent';

interface MobileProfileActivityFeedProps {
  events: N00unProfileEvent[];
  aboveFoldEventCount: number;
  isExpanded: boolean;
}

const getComponentFromEvent = (event: N00unProfileEvent, key: number) => {
  if (event.eventType === N00unEventType.PROPOSAL_VOTE) {
    return <MobileProposalVoteEvent event={event.payload as ProposalVoteEvent} key={key} />;
  }

  if (event.eventType === N00unEventType.DELEGATION) {
    return <MobileDelegationEvent event={event.payload as DelegationEvent} key={key} />;
  }

  if (event.eventType === N00unEventType.TRANSFER) {
    return <MobileTransferEvent event={event.payload as TransferEvent} key={key} />;
  }

  if (event.eventType === N00unEventType.AUCTION_WIN) {
    return <MobileN00unWinEvent event={event.payload as N00unWinEvent} key={key} />;
  }
};

const MobileProfileActivityFeed: React.FC<MobileProfileActivityFeedProps> = props => {
  const { events, aboveFoldEventCount, isExpanded } = props;

  return (
    <>
      {events
        .slice(0)
        .slice(0, aboveFoldEventCount)
        .map((event: N00unProfileEvent, i: number) => {
          return getComponentFromEvent(event, i);
        })}
      <Collapse in={isExpanded}>
        <>
          {events
            .slice(0)
            .slice(aboveFoldEventCount, events.length)
            .map((event: N00unProfileEvent, i: number) => {
              return getComponentFromEvent(event, i);
            })}
        </>
      </Collapse>
    </>
  );
};

export default MobileProfileActivityFeed;
