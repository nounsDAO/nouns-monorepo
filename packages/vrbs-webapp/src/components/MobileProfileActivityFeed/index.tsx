import React from 'react';
import { Collapse } from 'react-bootstrap';
import {
  DelegationEvent,
  VrbEventType,
  VrbProfileEvent,
  WinEvent,
  ProposalVoteEvent,
  TransferEvent,
} from '../../wrappers/vrbsActivity';
import MobileDelegationEvent from '../ProfileEvent/event/MobileDelegationEvent';
import MobileWinEvent from '../ProfileEvent/event/MobileWinEvent';
import MobileProposalVoteEvent from '../ProfileEvent/event/MobileProposalVoteEvent';
import MobileTransferEvent from '../ProfileEvent/event/MobileTransferEvent';

interface MobileProfileActivityFeedProps {
  events: VrbProfileEvent[];
  aboveFoldEventCount: number;
  isExpanded: boolean;
}

const getComponentFromEvent = (event: VrbProfileEvent, key: number) => {
  if (event.eventType === VrbEventType.PROPOSAL_VOTE) {
    return <MobileProposalVoteEvent event={event.payload as ProposalVoteEvent} key={key} />;
  }

  if (event.eventType === VrbEventType.DELEGATION) {
    return <MobileDelegationEvent event={event.payload as DelegationEvent} key={key} />;
  }

  if (event.eventType === VrbEventType.TRANSFER) {
    return <MobileTransferEvent event={event.payload as TransferEvent} key={key} />;
  }

  if (event.eventType === VrbEventType.AUCTION_WIN) {
    return <MobileWinEvent event={event.payload as WinEvent} key={key} />;
  }
};

const MobileProfileActivityFeed: React.FC<MobileProfileActivityFeedProps> = props => {
  const { events, aboveFoldEventCount, isExpanded } = props;

  return (
    <>
      {events
        .slice(0)
        .slice(0, aboveFoldEventCount)
        .map((event: VrbProfileEvent, i: number) => {
          return getComponentFromEvent(event, i);
        })}
      <Collapse in={isExpanded}>
        <>
          {events
            .slice(0)
            .slice(aboveFoldEventCount, events.length)
            .map((event: VrbProfileEvent, i: number) => {
              return getComponentFromEvent(event, i);
            })}
        </>
      </Collapse>
    </>
  );
};

export default MobileProfileActivityFeed;
