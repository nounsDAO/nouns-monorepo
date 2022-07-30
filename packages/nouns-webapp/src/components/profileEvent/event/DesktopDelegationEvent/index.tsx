import React from 'react';
import { buildEtherscanTxLink } from '../../../../utils/etherscan';
import { DelegationEvent } from '../../../../wrappers/nounActivity';
import classes from './DesktopDelegationEvent.module.css';
import DesktopNounActivityRow from '../../activityRow/DesktopNounActivityRow';
import { ExternalLinkIcon, ScaleIcon } from '@heroicons/react/solid';
import ReactTooltip from 'react-tooltip';
import ShortAddress from '../../../ShortAddress';

interface DesktopDelegationEventProps {
  event: DelegationEvent;
}

const DesktopDelegationEvent: React.FC<DesktopDelegationEventProps> = props => {
  const { event } = props;

  return (
    <DesktopNounActivityRow
      onClick={() => window.open(buildEtherscanTxLink(event.transactionHash), '_blank')}
      icon={
        <div className={classes.scaleIconWrapper}>
          <ScaleIcon className={classes.scaleIcon} />
        </div>
      }
      primaryContent={
        <>
          Delegate changed from
          <span className={classes.bold}>
            {' '}
            <ShortAddress address={event.previousDelegate} />
          </span>{' '}
          to{' '}
          <span className={classes.bold}>
            <ShortAddress address={event.newDelegate} />
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
            data-tip={`View on Etherscan`}
            data-for="view-on-etherscan-tooltip"
            className={classes.transactionHashWrapper}
          >
            <ExternalLinkIcon className={classes.externalLinkIcon} />
            {event.transactionHash.substring(0, 15) + '...'}
          </div>
        </>
      }
    />
  );
};

export default DesktopDelegationEvent;
