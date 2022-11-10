import React from 'react';
import { buildEtherscanAddressLink, buildEtherscanTxLink } from '../../../../utils/etherscan';
import { NounBRWinEvent } from '../../../../wrappers/nounbrActivity';
import classes from './DesktopNounBRWinEvent.module.css';
import DesktopNounBRActivityRow from '../../activityRow/DesktopNounBRActivityRow';
import { CakeIcon } from '@heroicons/react/solid';
import ReactTooltip from 'react-tooltip';
import ShortAddress from '../../../ShortAddress';
import TransactionHashPill from '../../eventData/infoPills/TransactionHashPill';
import { Trans } from '@lingui/macro';

interface DesktopNounBRWinEventProps {
  event: NounBRWinEvent;
}

const DesktopNounBRWinEvent: React.FC<DesktopNounBRWinEventProps> = props => {
  const { event } = props;

  const isNounderBRBRNounBR = parseInt(event.nounbrId as string) % 10 === 0;
  return (
    <DesktopNounBRActivityRow
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
          {isNounderBRBRNounBR ? (
            <Trans>
              <span className={classes.bold}> NounBR {event.nounbrId} </span> sent to{' '}
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
              <span className={classes.bold}> NounBR {event.nounbrId} </span> won by{' '}
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

export default DesktopNounBRWinEvent;
