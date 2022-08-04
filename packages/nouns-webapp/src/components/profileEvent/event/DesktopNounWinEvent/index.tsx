import React from 'react';
import { buildEtherscanAddressLink, buildEtherscanTxLink } from '../../../../utils/etherscan';
import { NounWinEvent } from '../../../../wrappers/nounActivity';
import classes from './DesktopNounWinEvent.module.css';
import DesktopNounActivityRow from '../../activityRow/DesktopNounActivityRow';
import { CakeIcon } from '@heroicons/react/solid';
import ReactTooltip from 'react-tooltip';
import ShortAddress from '../../../ShortAddress';
import TransactionHashPill from '../../eventData/infoPills/TransactionHashPill';

interface DesktopNounWinEventProps {
  event: NounWinEvent;
}

const DesktopNounWinEvent: React.FC<DesktopNounWinEventProps> = props => {
  const { event } = props;

  return (
    <DesktopNounActivityRow
      icon={
        <div className={classes.switchIconWrapper}>
          <CakeIcon className={classes.switchIcon} />
        </div>
      }
      primaryContent={
        <>
          <ReactTooltip
            id={'view-on-etherscan-tooltip'}
            effect={'solid'}
            className={classes.delegateHover}
            getContent={dataTip => {
              return <div>{dataTip}</div>;
            }}
          />
          <span className={classes.bold}> Noun {event.nounId} </span> won by
          <span
            data-tip={`View on Etherscan`}
            onClick={() => window.open(buildEtherscanAddressLink(event.winner), '_blank')}
            data-for="view-on-etherscan-tooltip"
            className={classes.address}
          >
            {' '}
            <ShortAddress address={event.winner} />
          </span>{' '}
        </>
      }
      secondaryContent={
        <>
          <ReactTooltip
            id={'view-on-etherscan-txn-tooltip'}
            effect={'solid'}
            className={classes.delegateHover}
            getContent={dataTip => {
              return <div>{dataTip}</div>;
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

export default DesktopNounWinEvent;
