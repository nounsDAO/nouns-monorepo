import React from 'react';
import { Collapse, Table } from 'react-bootstrap';
import {
  DelegationEvent,
  TokenEventType,
  TokenProfileEvent,
  TokenWinEvent,
  ProposalVoteEvent,
  TransferEvent,
} from '../../wrappers/nActivity';
import BrandSpinner from '../BrandSpinner';
import DesktopDelegationEvent from '../profileEvent/event/DesktopDelegationEvent';
import DesktopNounWinEvent from '../profileEvent/event/DesktopNounWinEvent';
import DesktopProposalVoteEvent from '../profileEvent/event/DesktopProposalVoteEvent';
import DesktopTransferEvent from '../profileEvent/event/DesktopTransferEvent';
import classes from './DesktopProfileActivityFeed.module.css';

interface DesktopProfileActivityFeedProps {
  events: TokenProfileEvent[];
  aboveFoldEventCount: number;
  isExpanded: boolean;
}

const getComponentFromEvent = (event: TokenProfileEvent, key: number) => {
  if (event.eventType === TokenEventType.PROPOSAL_VOTE) {
    return <DesktopProposalVoteEvent event={event.payload as ProposalVoteEvent} key={key} />;
  }

  if (event.eventType === TokenEventType.DELEGATION) {
    return <DesktopDelegationEvent event={event.payload as DelegationEvent} key={key} />;
  }

  if (event.eventType === TokenEventType.TRANSFER) {
    return <DesktopTransferEvent event={event.payload as TransferEvent} key={key} />;
  }

  if (event.eventType === TokenEventType.AUCTION_WIN) {
    return <DesktopNounWinEvent event={event.payload as TokenWinEvent} key={key} />;
  }
};

const DesktopProfileActivityFeed: React.FC<DesktopProfileActivityFeedProps> = props => {
  const { events, aboveFoldEventCount, isExpanded } = props;

  return (
    <>
      <Table responsive hover className={classes.aboveTheFoldEventsTable}>
        <tbody className={classes.nounInfoPadding}>
          {events?.length ? (
            events.slice(0, aboveFoldEventCount).map((event: TokenProfileEvent, i: number) => {
              return getComponentFromEvent(event, i);
            })
          ) : (
            <BrandSpinner />
          )}
        </tbody>
      </Table>
      <Collapse in={isExpanded}>
        <Table responsive hover>
          <tbody className={classes.tokenInfoPadding}>
            {events?.length ? (
              events
                .slice(aboveFoldEventCount, events.length)
                .map((event: TokenProfileEvent, i: number) => {
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
