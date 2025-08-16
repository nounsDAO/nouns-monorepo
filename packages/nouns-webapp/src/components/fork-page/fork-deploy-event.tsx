import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { Fork } from '@/wrappers/nounsDao';

import classes from './fork.module.css';

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
          {ownerLink} {actionLabel} by &quot;TKTK&quot; with {nounCount} {nounLabel}
        </h3>
      </header>
    </div>
  );
};

export { ForkCycleEvent };

// Prevent Next.js from treating this as a real page during prerender
const ForkDeployEventPage = () => null;
export default ForkDeployEventPage;
