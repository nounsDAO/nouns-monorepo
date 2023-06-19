import React from 'react';
import { buildEtherscanTxLink } from '../../../../utils/etherscan';
import { WinEvent } from '../../../../wrappers/vrbsActivity';
import classes from './MobileWinEvent.module.css';
import MobileActivityRow from '../../activityRow/MobileActivityRow';
import { CakeIcon } from '@heroicons/react/solid';
import ShortAddress from '../../../ShortAddress';
import TransactionHashPill from '../../eventData/infoPills/TransactionHashPill';
import { Trans } from '@lingui/macro';

interface MobileWinEventProps {
  event: WinEvent;
}

const MobileWinEvent: React.FC<MobileWinEventProps> = props => {
  const { event } = props;

  const isVrbderVrb = parseInt(event.vrbId as string) % 10 === 0;
  return (
    <MobileActivityRow
      onClick={() => window.open(buildEtherscanTxLink(event.transactionHash), '_blank')}
      icon={
        <div className={classes.iconWrapper}>
          <CakeIcon className={classes.switchIcon} />
        </div>
      }
      primaryContent={
        <>
          {isVrbderVrb ? (
            <Trans>
              <span className={classes.bold}> Vrb {event.vrbId} </span> sent to{' '}
              <span className={classes.bold}>
                {' '}
                <ShortAddress address={event.winner} />
              </span>{' '}
            </Trans>
          ) : (
            <Trans>
              <span className={classes.bold}> Vrb {event.vrbId} </span> won by{' '}
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

export default MobileWinEvent;
