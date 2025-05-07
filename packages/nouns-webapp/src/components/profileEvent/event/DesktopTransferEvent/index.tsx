import React from 'react';

import { SwitchHorizontalIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/react/macro';
import ReactTooltip from 'react-tooltip';

import { buildEtherscanAddressLink, buildEtherscanTxLink } from '../../../../utils/etherscan';
import { TransferEvent } from '../../../../wrappers/nounActivity';
import ShortAddress from '../../../ShortAddress';
import DesktopNounActivityRow from '../../activityRow/DesktopNounActivityRow';
import TransactionHashPill from '../../eventData/infoPills/TransactionHashPill';

import classes from './DesktopTransferEvent.module.css';

interface DesktopTransferEventProps {
  event: TransferEvent;
}

const DesktopTransferEvent: React.FC<DesktopTransferEventProps> = props => {
  const { event } = props;

  return (
    <DesktopNounActivityRow
      icon={
        <div className={classes.switchIconWrapper}>
          <SwitchHorizontalIcon className={classes.switchIcon} />
        </div>
      }
      primaryContent={
        <>
          <ReactTooltip
            id={'view-on-etherscan-tooltip-primary'}
            effect={'solid'}
            className={classes.delegateHover}
            getContent={() => {
              return <Trans>View on Etherscan</Trans>;
            }}
          />
          <Trans>
            Holder changed from{' '}
            <span
              data-tip={`View on Etherscan`}
              onClick={() => window.open(buildEtherscanAddressLink(event.from), '_blank')}
              data-for="view-on-etherscan-tooltip"
              className={classes.address}
            >
              {' '}
              <ShortAddress address={event.from} />
            </span>{' '}
            to{' '}
            <span
              data-for="view-on-etherscan-tooltip"
              onClick={() => window.open(buildEtherscanAddressLink(event.to), '_blank')}
              className={classes.address}
            >
              <ShortAddress address={event.to} />
            </span>
          </Trans>
        </>
      }
      secondaryContent={
        <>
          <ReactTooltip
            id={'view-on-etherscan-txn-tooltip'}
            effect={'solid'}
            className={classes.delegateHover}
            getContent={() => {
              return <Trans>View on Etherscan</Trans>;
            }}
          />
          <div
            onClick={() => window.open(buildEtherscanTxLink(event.transactionHash), '_blank')}
            data-tip={`View on Etherscan`}
            data-for="view-on-etherscan-txn-tooltip"
          >
            <TransactionHashPill transactionHash={event.transactionHash} />
          </div>
        </>
      }
    />
  );
};

export default DesktopTransferEvent;
