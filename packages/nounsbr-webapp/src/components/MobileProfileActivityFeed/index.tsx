import React from 'react';
import { Collapse } from 'react-bootstrap';
import {
  DelegationEvent,
  NounBREventType,
  NounBRProfileEvent,
  NounBRWinEvent,
  ProposalVoteEvent,
  TransferEvent,
} from '../../wrappers/nounbrActivity';
import MobileDelegationEvent from '../profileEvent/event/MobileDelegationEvent';
import MobileNounBRWinEvent from '../profileEvent/event/MobileNounBRWinEvent';
import MobileProposalVoteEvent from '../profileEvent/event/MobileProposalVoteEvent';
import MobileTransferEvent from '../profileEvent/event/MobileTransferEvent';

interface MobileProfileActivityFeedProps {
  events: NounBRProfileEvent[];
  aboveFoldEventCount: number;
  isExpanded: boolean;
}

const getComponentFromEvent = (event: NounBRProfileEvent, key: number) => {
  if (event.eventType === NounBREventType.PROPOSAL_VOTE) {
    return <MobileProposalVoteEvent event={event.payload as ProposalVoteEvent} key={key} />;
  }

  if (event.eventType === NounBREventType.DELEGATION) {
    return <MobileDelegationEvent event={event.payload as DelegationEvent} key={key} />;
  }

  if (event.eventType === NounBREventType.TRANSFER) {
    return <MobileTransferEvent event={event.payload as TransferEvent} key={key} />;
  }

  if (event.eventType === NounBREventType.AUCTION_WIN) {
    return <MobileNounBRWinEvent event={event.payload as NounBRWinEvent} key={key} />;
  }
};

const MobileProfileActivityFeed: React.FC<MobileProfileActivityFeedProps> = props => {
  const { events, aboveFoldEventCount, isExpanded } = props;

  return (
    <>
      {events
        .slice(0)
        .slice(0, aboveFoldEventCount)
        .map((event: NounBRProfileEvent, i: number) => {
          return getComponentFromEvent(event, i);
        })}
      <Collapse in={isExpanded}>
        <>
          {events
            .slice(0)
            .slice(aboveFoldEventCount, events.length)
            .map((event: NounBRProfileEvent, i: number) => {
              return getComponentFromEvent(event, i);
            })}
        </>
      </Collapse>
    </>
  );
};

export default MobileProfileActivityFeed;
