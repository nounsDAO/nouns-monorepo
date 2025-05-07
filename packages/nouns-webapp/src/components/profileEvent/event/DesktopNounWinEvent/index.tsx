import React from 'react';

import { CakeIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/react/macro';
import ReactTooltip from 'react-tooltip';

import { buildEtherscanAddressLink, buildEtherscanTxLink } from '../../../../utils/etherscan';
import { NounWinEvent } from '../../../../wrappers/nounActivity';
import ShortAddress from '../../../ShortAddress';
import DesktopNounActivityRow from '../../activityRow/DesktopNounActivityRow';
import TransactionHashPill from '../../eventData/infoPills/TransactionHashPill';

import classes from './DesktopNounWinEvent.module.css';

interface DesktopNounWinEventProps {
  event: NounWinEvent;
}

const DesktopNounWinEvent: React.FC<DesktopNounWinEventProps> = props => {
  const { event } = props;

  const isNounderNoun = parseInt(event.nounId as string) % 10 === 0;
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
            getContent={() => {
              return <Trans>View on Etherscan</Trans>;
            }}
          />
          {isNounderNoun ? (
            <Trans>
              <span className={classes.bold}> Noun {event.nounId} </span> sent to{' '}
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
              <span className={classes.bold}> Noun {event.nounId} </span> won by{' '}
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

export default DesktopNounWinEvent;
