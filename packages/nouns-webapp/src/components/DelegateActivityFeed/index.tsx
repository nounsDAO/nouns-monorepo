import { Trans } from '@lingui/macro';
import React from 'react';
import { Col } from 'react-bootstrap';
import Section from '../../layout/Section';
import classes from './DelegateActivityFeed.module.css';
import responsiveUiUtilsClasses from '../../utils/ResponsiveUIUtils.module.css';
import DesktopProfileActivityFeed from '../DesktopProfileActivityFeed';
import MobileProfileActivityFeed from '../MobileProfileActivityFeed';
import { useDelegateProposalVoteEvents } from '../../wrappers/delegateActivity';

interface DelegateActivityFeedProps {
  votes: any[];
}

const DelegateActivityFeed: React.FC<DelegateActivityFeedProps> = props => {
  const { votes } = props;

  const data = useDelegateProposalVoteEvents(votes ?? []);

  return (
    <Section fullWidth={false}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>
            <Trans>Activity</Trans>
          </h1>
        </div>
        {votes && votes.length === 0 ? (
          <div className={classes.nullStateCopy}>
            <Trans>This Delegate has no activity. Check back soon!</Trans>
          </div>
        ) : (
          <>
            <div className={responsiveUiUtilsClasses.desktopOnly}>
              <DesktopProfileActivityFeed events={data} isExpanded={true} aboveFoldEventCount={1} />
            </div>
            <div className={responsiveUiUtilsClasses.mobileOnly}>
              <MobileProfileActivityFeed events={data} isExpanded={true} aboveFoldEventCount={1} />
            </div>
          </>
        )}
      </Col>
    </Section>
  );
};

export default DelegateActivityFeed;
