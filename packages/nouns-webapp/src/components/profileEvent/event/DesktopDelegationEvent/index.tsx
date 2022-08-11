import React from 'react';
import { buildEtherscanAddressLink } from '../../../../utils/etherscan';
import { DelegationEvent } from '../../../../wrappers/nounActivity';
import classes from './DesktopDelegationEvent.module.css';
import DesktopNounActivityRow from '../../activityRow/DesktopNounActivityRow';
import { ScaleIcon } from '@heroicons/react/solid';
import ReactTooltip from 'react-tooltip';
import ShortAddress from '../../../ShortAddress';
import TransactionHashPill from '../../eventData/infoPills/TransactionHashPill';
import { Trans } from '@lingui/macro';

interface DesktopDelegationEventProps {
  event: DelegationEvent;
}

const DesktopDelegationEvent: React.FC<DesktopDelegationEventProps> = props => {
  const { event } = props;

  return (
    <DesktopNounActivityRow
      icon={
        <div className={classes.scaleIconWrapper}>
          <ScaleIcon className={classes.scaleIcon} />
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
          Delegate changed from
          <span
            data-tip={`View on Etherscan`}
            onClick={() => window.open(buildEtherscanAddressLink(event.previousDelegate), '_blank')}
            data-for="view-on-etherscan-tooltip"
            className={classes.address}
          >
            {' '}
            <ShortAddress address={event.previousDelegate} />
          </span>{' '}
          to{' '}
          <span
            data-tip={`View on Etherscan`}
            data-for="view-on-etherscan-tooltip"
            onClick={() => window.open(buildEtherscanAddressLink(event.newDelegate), '_blank')}
            className={classes.address}
          >
            <ShortAddress address={event.newDelegate} />
          </span>
        </>
      }
      secondaryContent={
        <>
          <ReactTooltip
            id={'view-on-etherscan-txn-delegate-tooltip'}
            effect={'solid'}
            className={classes.delegateHover}
            getContent={dataTip => {
              return <Trans>View on Etherscan</Trans>;
            }}
          />
          <div data-tip={`View on Etherscan`} data-for="view-on-etherscan-txn-delegate-tooltip">
            <TransactionHashPill transactionHash={event.transactionHash} />
          </div>
        </>
      }
    />
  );
};

export default DesktopDelegationEvent;
