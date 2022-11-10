import React from 'react';
import { Collapse, Table } from 'react-bootstrap';
import {
  DelegationEvent,
  NounBREventType,
  NounBRProfileEvent,
  NounBRWinEvent,
  ProposalVoteEvent,
  TransferEvent,
} from '../../wrappers/nounbrActivity';
import BrandSpinner from '../BrandSpinner';
import DesktopDelegationEvent from '../profileEvent/event/DesktopDelegationEvent';
import DesktopNounBRWinEvent from '../profileEvent/event/DesktopNounBRWinEvent';
import DesktopProposalVoteEvent from '../profileEvent/event/DesktopProposalVoteEvent';
import DesktopTransferEvent from '../profileEvent/event/DesktopTransferEvent';
import classes from './DesktopProfileActivityFeed.module.css';

interface DesktopProfileActivityFeedProps {
  events: NounBRProfileEvent[];
  aboveFoldEventCount: number;
  isExpanded: boolean;
}

const getComponentFromEvent = (event: NounBRProfileEvent, key: number) => {
  if (event.eventType === NounBREventType.PROPOSAL_VOTE) {
    return <DesktopProposalVoteEvent event={event.payload as ProposalVoteEvent} key={key} />;
  }

  if (event.eventType === NounBREventType.DELEGATION) {
    return <DesktopDelegationEvent event={event.payload as DelegationEvent} key={key} />;
  }

  if (event.eventType === NounBREventType.TRANSFER) {
    return <DesktopTransferEvent event={event.payload as TransferEvent} key={key} />;
  }

  if (event.eventType === NounBREventType.AUCTION_WIN) {
    return <DesktopNounBRWinEvent event={event.payload as NounBRWinEvent} key={key} />;
  }
};

const DesktopProfileActivityFeed: React.FC<DesktopProfileActivityFeedProps> = props => {
  const { events, aboveFoldEventCount, isExpanded } = props;

  return (
    <>
      <Table responsive hover className={classes.aboveTheFoldEventsTable}>
        <tbody className={classes.nounbrInfoPadding}>
          {events?.length ? (
            events.slice(0, aboveFoldEventCount).map((event: NounBRProfileEvent, i: number) => {
              return getComponentFromEvent(event, i);
            })
          ) : (
            <BrandSpinner />
          )}
        </tbody>
      </Table>
      <Collapse in={isExpanded}>
        <Table responsive hover>
          <tbody className={classes.nounbrInfoPadding}>
            {events?.length ? (
              events
                .slice(aboveFoldEventCount, events.length)
                .map((event: NounBRProfileEvent, i: number) => {
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
