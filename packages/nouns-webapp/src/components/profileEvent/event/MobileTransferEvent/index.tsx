import React from 'react';
import { buildEtherscanTxLink } from '../../../../utils/etherscan';
import { TransferEvent } from '../../../../wrappers/nounActivity';
import classes from './MobileTransferEvent.module.css';
import MobileNounActivityRow from '../../activityRow/MobileNounActivityRow';
import { SwitchHorizontalIcon } from '@heroicons/react/solid';
import ShortAddress from '../../../ShortAddress';
import TransactionHashPill from '../../eventData/infoPills/TransactionHashPill';
import { Trans } from '@lingui/macro';

interface MobileTransferEventProps {
  event: TransferEvent;
}

const MobileTransferEvent: React.FC<MobileTransferEventProps> = props => {
  const { event } = props;

  return (
    <MobileNounActivityRow
      onClick={() => window.open(buildEtherscanTxLink(event.transactionHash), '_blank')}
      icon={
        <div className={classes.switchIconWrapper}>
          <SwitchHorizontalIcon className={classes.switchIcon} />
        </div>
      }
      primaryContent={
        <>
          <Trans>
            Holder changed from
            <span className={classes.bold}>
              {' '}
              <ShortAddress address={event.from} />
            </span>{' '}
            to{' '}
            <span className={classes.bold}>
              <ShortAddress address={event.to} />
            </span>
          </Trans>
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

export default MobileTransferEvent;
