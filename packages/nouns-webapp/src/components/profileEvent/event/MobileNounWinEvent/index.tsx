import React from 'react';
import { buildEtherscanTxLink } from '../../../../utils/etherscan';
import { NounWinEvent } from '../../../../wrappers/nounActivity';
import classes from './MobileNounWinEvent.module.css';
import MobileNounActivityRow from '../../activityRow/MobileNounActivityRow';
import { CakeIcon } from '@heroicons/react/solid';
import ShortAddress from '../../../ShortAddress';
import TransactionHashPill from '../../eventData/infoPills/TransactionHashPill';
import { Trans } from '@lingui/macro';

interface MobileNounWinEventProps {
  event: NounWinEvent;
}

const MobileNounWinEvent: React.FC<MobileNounWinEventProps> = props => {
  const { event } = props;

  const isNounderNoun = parseInt(event.nounId as string) % 10 === 0;
  return (
    <MobileNounActivityRow
      onClick={() => window.open(buildEtherscanTxLink(event.transactionHash), '_blank')}
      icon={
        <div className={classes.iconWrapper}>
          <CakeIcon className={classes.switchIcon} />
        </div>
      }
      primaryContent={
        <>
          {isNounderNoun ? (
            <Trans>
              <span className={classes.bold}> Noun {event.nounId} </span> sent to{' '}
              <span className={classes.bold}>
                {' '}
                <ShortAddress address={event.winner} />
              </span>{' '}
            </Trans>
          ) : (
            <Trans>
              <span className={classes.bold}> Noun {event.nounId} </span> won by{' '}
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

export default MobileNounWinEvent;
