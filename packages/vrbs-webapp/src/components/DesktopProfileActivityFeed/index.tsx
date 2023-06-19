import React from 'react';
import { Collapse, Table } from 'react-bootstrap';
import {
  DelegationEvent,
  VrbEventType,
  VrbProfileEvent,
  WinEvent,
  ProposalVoteEvent,
  TransferEvent,
} from '../../wrappers/vrbsActivity';
import BrandSpinner from '../BrandSpinner';
import DesktopDelegationEvent from '../ProfileEvent/event/DesktopDelegationEvent';
import DesktopWinEvent from '../ProfileEvent/event/DesktopWinEvent';
import DesktopProposalVoteEvent from '../ProfileEvent/event/DesktopProposalVoteEvent';
import DesktopTransferEvent from '../ProfileEvent/event/DesktopTransferEvent';
import classes from './DesktopProfileActivityFeed.module.css';

interface DesktopProfileActivityFeedProps {
  events: VrbProfileEvent[];
  aboveFoldEventCount: number;
  isExpanded: boolean;
}

const getComponentFromEvent = (event: VrbProfileEvent, key: number) => {
  if (event.eventType === VrbEventType.PROPOSAL_VOTE) {
    return <DesktopProposalVoteEvent event={event.payload as ProposalVoteEvent} key={key} />;
  }

  if (event.eventType === VrbEventType.DELEGATION) {
    return <DesktopDelegationEvent event={event.payload as DelegationEvent} key={key} />;
  }

  if (event.eventType === VrbEventType.TRANSFER) {
    return <DesktopTransferEvent event={event.payload as TransferEvent} key={key} />;
  }

  if (event.eventType === VrbEventType.AUCTION_WIN) {
    return <DesktopWinEvent event={event.payload as WinEvent} key={key} />;
  }
};

const DesktopProfileActivityFeed: React.FC<DesktopProfileActivityFeedProps> = props => {
  const { events, aboveFoldEventCount, isExpanded } = props;

  return (
    <>
      <Table responsive hover className={classes.aboveTheFoldEventsTable}>
        <tbody className={classes.vrbInfoPadding}>
          {events?.length ? (
            events.slice(0, aboveFoldEventCount).map((event: VrbProfileEvent, i: number) => {
              return getComponentFromEvent(event, i);
            })
          ) : (
            <BrandSpinner />
          )}
        </tbody>
      </Table>
      <Collapse in={isExpanded}>
        <Table responsive hover>
          <tbody className={classes.vrbInfoPadding}>
            {events?.length ? (
              events
                .slice(aboveFoldEventCount, events.length)
                .map((event: VrbProfileEvent, i: number) => {
                  return getComponentFromEvent(event, i);
                })
            ) : (
              <BrandSpinner />
            )}
          </tbody>
        </Table>
      </Collapse>
    </>
  );
};

export default DesktopProfileActivityFeed;
