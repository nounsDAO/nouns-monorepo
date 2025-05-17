import React from 'react';

import { CakeIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/react/macro';

import ShortAddress from '@/components/ShortAddress';
import { buildEtherscanTxLink } from '@/utils/etherscan';
import { NounWinEvent } from '@/wrappers/nounActivity';

import MobileNounActivityRow from '../../activityRow/MobileNounActivityRow';
import TransactionHashPill from '../../eventData/infoPills/TransactionHashPill';

import classes from './MobileNounWinEvent.module.css';

interface MobileNounWinEventProps {
  event: NounWinEvent;
}

const MobileNounWinEvent: React.FC<MobileNounWinEventProps> = props => {
  const { event } = props;

  const isNounderNoun = Number(event.nounId as string) % 10 === 0;
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
