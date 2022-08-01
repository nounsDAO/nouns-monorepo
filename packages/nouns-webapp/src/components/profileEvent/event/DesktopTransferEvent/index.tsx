import React from 'react';
import { buildEtherscanAddressLink, buildEtherscanTxLink } from '../../../../utils/etherscan';
import { TransferEvent } from '../../../../wrappers/nounActivity';
import classes from './DesktopTransferEvent.module.css';
import DesktopNounActivityRow from '../../activityRow/DesktopNounActivityRow';
import { SwitchHorizontalIcon } from '@heroicons/react/solid';
import ReactTooltip from 'react-tooltip';
import ShortAddress from '../../../ShortAddress';
import TransactionHashPill from '../../eventData/infoPills/TransactionHashPill';

interface DesktopTransferEventProps {
  event: TransferEvent;
}

const DesktopTransferEvent: React.FC<DesktopTransferEventProps> = props => {
  const { event } = props;

  return (
    <DesktopNounActivityRow
      onClick={() => {}}
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
            getContent={dataTip => {
              return <div>{dataTip}</div>;
            }}
          />
          Holder changed from
          <span
            data-tip={`View on Etherscan`}
            onClick={() => window.open(buildEtherscanAddressLink(event.from), '_blank')}
            data-for="view-on-etherscan-tooltip"
            className={classes.bold}
          >
            {' '}
            <ShortAddress address={event.from} />
          </span>{' '}
          to{' '}
          <span
            data-tip={`View on Etherscan`}
            data-for="view-on-etherscan-tooltip"
            onClick={() => window.open(buildEtherscanAddressLink(event.to), '_blank')}
            className={classes.bold}
          >
            <ShortAddress address={event.to} />
          </span>
        </>
      }
      secondaryContent={
        <>
          <ReactTooltip
            id={'view-on-etherscan-tooltip'}
            effect={'solid'}
            className={classes.delegateHover}
            getContent={dataTip => {
              return <div>{dataTip}</div>;
            }}
          />
          <div
            onClick={() => window.open(buildEtherscanTxLink(event.transactionHash), '_blank')}
            data-tip={`View on Etherscan`}
            data-for="view-on-etherscan-tooltip"
          >
            <TransactionHashPill transactionHash={event.transactionHash} />
          </div>
        </>
      }
    />
  );
};

export default DesktopTransferEvent;
