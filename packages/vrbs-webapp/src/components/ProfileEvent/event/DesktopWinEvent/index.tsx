import React from 'react';
import { buildEtherscanAddressLink, buildEtherscanTxLink } from '../../../../utils/etherscan';
import { WinEvent } from '../../../../wrappers/vrbsActivity';
import classes from './DesktopWinEvent.module.css';
import DesktopActivityRow from '../../activityRow/DesktopActivityRow';
import { CakeIcon } from '@heroicons/react/solid';
import ReactTooltip from 'react-tooltip';
import ShortAddress from '../../../ShortAddress';
import TransactionHashPill from '../../eventData/infoPills/TransactionHashPill';
import { Trans } from '@lingui/macro';

interface DesktopWinEventProps {
  event: WinEvent;
}

const DesktopWinEvent: React.FC<DesktopWinEventProps> = props => {
  const { event } = props;

  const isVrbderVrb = parseInt(event.vrbId as string) % 10 === 0;
  return (
    <DesktopActivityRow
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
              return <Trans>View on Etherscan</Trans>;
            }}
          />
          {isVrbderVrb ? (
            <Trans>
              <span className={classes.bold}> Vrb {event.vrbId} </span> sent to{' '}
              <span
                data-tip={`View on Etherscan`}
                onClick={() => window.open(buildEtherscanAddressLink(event.winner), '_blank')}
                data-for="view-on-etherscan-tooltip"
                className={classes.address}
              >
                {' '}
                <ShortAddress address={event.winner} />
              </span>{' '}
            </Trans>
          ) : (
            <Trans>
              <span className={classes.bold}> Vrb {event.vrbId} </span> won by{' '}
              <span
                data-tip={`View on Etherscan`}
                onClick={() => window.open(buildEtherscanAddressLink(event.winner), '_blank')}
                data-for="view-on-etherscan-tooltip"
                className={classes.address}
              >
                {' '}
                <ShortAddress address={event.winner} />
              </span>{' '}
            </Trans>
          )}
        </>
      }
      secondaryContent={
        <>
          <ReactTooltip
            id={'view-on-etherscan-txn-tooltip'}
            effect={'solid'}
            className={classes.delegateHover}
            getContent={dataTip => {
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

export default DesktopWinEvent;
