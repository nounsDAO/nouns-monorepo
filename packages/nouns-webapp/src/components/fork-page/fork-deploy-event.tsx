import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { Fork } from '@/wrappers/nouns-dao';


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
      className="text-[#14161b] no-underline hover:underline"
    >
      {/* <ShortAddress address={event.owner.id || ''} avatar={false} /> */}
    </a>
  );

  return (
    <div className="group relative m-0 pb-[50px] pl-[40px]" id="#deploy-fork">
      <span
        aria-hidden
        className="absolute left-[6px] top-[3px] bottom-0 w-[3px] bg-[#b3b3b3]"
      />
      <a href="#deploy-fork" className="absolute -left-[7px] -top-[2px] block h-[30px] w-[30px]">
        <span className="absolute inset-0 rounded-full border-[3px] border-[#B3B3B3] bg-white" />
        <span className="absolute inset-0 rounded-full border-[3px] border-[#14161b] bg-white opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-50" />
      </a>
      <header>
        <span className="font-londrina text-[#14161b]">
          <a href="#deploy-fork" className="no-underline transition-all duration-200 ease-in-out">
            {timestamp}
          </a>
        </span>
        <h3 className="m-0 text-[20px] font-bold leading-[1.1]">
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
