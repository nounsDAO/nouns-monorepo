import React from 'react';
import { buildEtherscanTxLink } from '../../../../utils/etherscan';
import { NounBRWinEvent } from '../../../../wrappers/nounbrActivity';
import classes from './MobileNounBRWinEvent.module.css';
import MobileNounBRActivityRow from '../../activityRow/MobileNounBRActivityRow';
import { CakeIcon } from '@heroicons/react/solid';
import ShortAddress from '../../../ShortAddress';
import TransactionHashPill from '../../eventData/infoPills/TransactionHashPill';
import { Trans } from '@lingui/macro';

interface MobileNounBRWinEventProps {
  event: NounBRWinEvent;
}

const MobileNounBRWinEvent: React.FC<MobileNounBRWinEventProps> = props => {
  const { event } = props;

  const isNounderBRBRNounBR = parseInt(event.nounbrId as string) % 10 === 0;
  return (
    <MobileNounBRActivityRow
      onClick={() => window.open(buildEtherscanTxLink(event.transactionHash), '_blank')}
      icon={
        <div className={classes.iconWrapper}>
          <CakeIcon className={classes.switchIcon} />
        </div>
      }
      primaryContent={
        <>
          {isNounderBRBRNounBR ? (
            <Trans>
              <span className={classes.bold}> NounBR {event.nounbrId} </span> sent to{' '}
              <span className={classes.bold}>
                {' '}
                <ShortAddress address={event.winner} />
              </span>{' '}
            </Trans>
          ) : (
            <Trans>
              <span className={classes.bold}> NounBR {event.nounbrId} </span> won by{' '}
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

export default MobileNounBRWinEvent;
