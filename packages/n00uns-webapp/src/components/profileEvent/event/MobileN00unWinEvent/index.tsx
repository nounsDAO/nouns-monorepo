import React from 'react';
import { buildEtherscanTxLink } from '../../../../utils/etherscan';
import { N00unWinEvent } from '../../../../wrappers/n00unActivity';
import classes from './MobileN00unWinEvent.module.css';
import MobileN00unActivityRow from '../../activityRow/MobileN00unActivityRow';
import { CakeIcon } from '@heroicons/react/solid';
import ShortAddress from '../../../ShortAddress';
import TransactionHashPill from '../../eventData/infoPills/TransactionHashPill';
import { Trans } from '@lingui/macro';

interface MobileN00unWinEventProps {
  event: N00unWinEvent;
}

const MobileN00unWinEvent: React.FC<MobileN00unWinEventProps> = props => {
  const { event } = props;

  const isN00underN00un = parseInt(event.n00unId as string) % 10 === 0;
  return (
    <MobileN00unActivityRow
      onClick={() => window.open(buildEtherscanTxLink(event.transactionHash), '_blank')}
      icon={
        <div className={classes.iconWrapper}>
          <CakeIcon className={classes.switchIcon} />
        </div>
      }
      primaryContent={
        <>
          {isN00underN00un ? (
            <Trans>
              <span className={classes.bold}> N00un {event.n00unId} </span> sent to{' '}
              <span className={classes.bold}>
                {' '}
                <ShortAddress address={event.winner} />
              </span>{' '}
            </Trans>
          ) : (
            <Trans>
              <span className={classes.bold}> N00un {event.n00unId} </span> won by{' '}
              <span className={classes.bold}>
                {' '}
                <ShortAddress address={event.winner} />
              </span>{' '}
            </Trans>
          )}
        </>
      }
      secondaryContent={
        <>
          <TransactionHashPill transactionHash={event.transactionHash} />
        </>
      }
    />
  );
};

export default MobileN00unWinEvent;
