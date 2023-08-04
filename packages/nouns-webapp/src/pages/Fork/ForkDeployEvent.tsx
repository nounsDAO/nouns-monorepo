import React from 'react';
import classes from './Fork.module.css';
import { EscrowDeposit, EscrowWithdrawal, Fork, useProposalTitles } from '../../wrappers/nounsDao';
import { Trans } from '@lingui/macro';
import { Link } from 'react-router-dom';
import ShortAddress from '../../components/ShortAddress';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import dayjs from 'dayjs';

type Props = {
  forkDetails: Fork;
  // event: ForkCycleEvent;
};

const ForkCycleEvent = ({ forkDetails }: Props) => {
  const actionLabel = 'Fork deployed';
  const nounCount = forkDetails?.tokensInEscrowCount;
  const nounLabel = nounCount > 1 ? 'Nouns' : 'Noun';
  const timestamp = dayjs(
    forkDetails?.forkingPeriodEndTimestamp && +forkDetails?.forkingPeriodEndTimestamp * 1000,
  ).fromNow();
  // need data for deployer address and tx hash
  const ownerLink = (
    <a
      // href={buildEtherscanAddressLink(event.owner.id || '')}
      target="_blank"
      rel="noreferrer"
      className={classes.proposerLinkJp}
    >
      {/* <ShortAddress address={event.owner.id || ''} avatar={false} /> */}
    </a>
  );

  return (
    <div className={classes.forkTimelineItem} id="#deploy-fork">
      <a href="#deploy-fork" className={classes.eventPoint} />
      <header>
        <span className={classes.timestamp}>
          <a href="#deploy-fork">{timestamp}</a>
        </span>
        <h3 className={classes.eventTitle}>
          {ownerLink} {actionLabel} by "TKTK" with {nounCount} {nounLabel}
        </h3>
      </header>
    </div>
  );
};

export default ForkCycleEvent;
