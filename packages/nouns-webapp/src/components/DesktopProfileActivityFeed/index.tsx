import React from 'react';
import { Collapse, Table } from 'react-bootstrap';
import {
  DelegationEvent,
  NounEventType,
  NounProfileEvent,
  NounWinEvent,
  ProposalVoteEvent,
  TransferEvent,
} from '../../wrappers/nounActivity';
import BrandSpinner from '../BrandSpinner';
import DesktopDelegationEvent from '../profileEvent/event/DesktopDelegationEvent';
import DesktopNounWinEvent from '../profileEvent/event/DesktopNounWinEvent';
import DesktopProposalVoteEvent from '../profileEvent/event/DesktopProposalVoteEvent';
import DesktopTransferEvent from '../profileEvent/event/DesktopTransferEvent';
import classes from './DesktopProfileActivityFeed.module.css';

interface DesktopProfileActivityFeedProps {
  events: NounProfileEvent[];
  aboveFoldEventCount: number;
  isExpanded: boolean;
}

const getComponentFromEvent = (event: NounProfileEvent, key: number) => {
  if (event.eventType === NounEventType.PROPOSAL_VOTE) {
    return <DesktopProposalVoteEvent event={event.payload as ProposalVoteEvent} key={key} />;
  }

  if (event.eventType === NounEventType.DELEGATION) {
    return <DesktopDelegationEvent event={event.payload as DelegationEvent} key={key} />;
  }

  if (event.eventType === NounEventType.TRANSFER) {
    return <DesktopTransferEvent event={event.payload as TransferEvent} key={key} />;
  }

  if (event.eventType === NounEventType.AUCTION_WIN) {
    return <DesktopNounWinEvent event={event.payload as NounWinEvent} key={key} />;
  }
};

const DesktopProfileActivityFeed: React.FC<DesktopProfileActivityFeedProps> = props => {
  const { events, aboveFoldEventCount, isExpanded } = props;

  return (
    <>
      <Table responsive hover className={classes.aboveTheFoldEventsTable}>
        <tbody className={classes.nounInfoPadding}>
          {events?.length ? (
            events.slice(0, aboveFoldEventCount).map((event: NounProfileEvent, i: number) => {
              return getComponentFromEvent(event, i);
            })
          ) : (
            <BrandSpinner />
          )}
        </tbody>
      </Table>
      <Collapse in={isExpanded}>
        <Table responsive hover>
          <tbody className={classes.nounInfoPadding}>
            {events?.length ? (
              events
                .slice(aboveFoldEventCount, events.length)
                .map((event: NounProfileEvent, i: number) => {
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
