import React from 'react';
import { Collapse, Table } from 'react-bootstrap';
import {
  DelegationEvent,
  N00unEventType,
  N00unProfileEvent,
  N00unWinEvent,
  ProposalVoteEvent,
  TransferEvent,
} from '../../wrappers/n00unActivity';
import BrandSpinner from '../BrandSpinner';
import DesktopDelegationEvent from '../profileEvent/event/DesktopDelegationEvent';
import DesktopN00unWinEvent from '../profileEvent/event/DesktopN00unWinEvent';
import DesktopProposalVoteEvent from '../profileEvent/event/DesktopProposalVoteEvent';
import DesktopTransferEvent from '../profileEvent/event/DesktopTransferEvent';
import classes from './DesktopProfileActivityFeed.module.css';

interface DesktopProfileActivityFeedProps {
  events: N00unProfileEvent[];
  aboveFoldEventCount: number;
  isExpanded: boolean;
}

const getComponentFromEvent = (event: N00unProfileEvent, key: number) => {
  if (event.eventType === N00unEventType.PROPOSAL_VOTE) {
    return <DesktopProposalVoteEvent event={event.payload as ProposalVoteEvent} key={key} />;
  }

  if (event.eventType === N00unEventType.DELEGATION) {
    return <DesktopDelegationEvent event={event.payload as DelegationEvent} key={key} />;
  }

  if (event.eventType === N00unEventType.TRANSFER) {
    return <DesktopTransferEvent event={event.payload as TransferEvent} key={key} />;
  }

  if (event.eventType === N00unEventType.AUCTION_WIN) {
    return <DesktopN00unWinEvent event={event.payload as N00unWinEvent} key={key} />;
  }
};

const DesktopProfileActivityFeed: React.FC<DesktopProfileActivityFeedProps> = props => {
  const { events, aboveFoldEventCount, isExpanded } = props;

  return (
    <>
      <Table responsive hover className={classes.aboveTheFoldEventsTable}>
        <tbody className={classes.n00unInfoPadding}>
          {events?.length ? (
            events.slice(0, aboveFoldEventCount).map((event: N00unProfileEvent, i: number) => {
              return getComponentFromEvent(event, i);
            })
          ) : (
            <BrandSpinner />
          )}
        </tbody>
      </Table>
      <Collapse in={isExpanded}>
        <Table responsive hover>
          <tbody className={classes.n00unInfoPadding}>
            {events?.length ? (
              events
                .slice(aboveFoldEventCount, events.length)
                .map((event: N00unProfileEvent, i: number) => {
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
