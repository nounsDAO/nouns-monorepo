import React from 'react';
import { buildEtherscanTxLink } from '../../../../utils/etherscan';
import { NounWinEvent } from '../../../../wrappers/nounActivity';
import classes from './MobileNounWinEvent.module.css';
import MobileNounActivityRow from '../../activityRow/MobileNounActivityRow';
import { CakeIcon } from '@heroicons/react/solid';
import ShortAddress from '../../../ShortAddress';
import TransactionHashPill from '../../eventData/infoPills/TransactionHashPill';

interface MobileNounWinEventProps {
  event: NounWinEvent;
}

const MobileNounWinEvent: React.FC<MobileNounWinEventProps> = props => {
  const { event } = props;

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
          <span className={classes.bold}> Noun {event.nounId} </span> won by
          <span className={classes.address}>
            {' '}
            <ShortAddress address={event.winner} />
          </span>{' '}
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
