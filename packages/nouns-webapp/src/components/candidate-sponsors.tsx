import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import { useDelegateNounsAtBlockQuery } from '@/wrappers/noun-token';
import { CandidateSignature } from '@/wrappers/nouns-data';

import CandidateSponsorImage from './candidate-sponsor-image';
import { isTruthy } from 'remeda';

type CandidateSponsorsProps = {
  signers: CandidateSignature[];
  nounsRequired: number;
  currentBlock?: bigint;
  isThresholdMetByProposer?: boolean;
};

const CandidateSponsors = ({
  signers,
  nounsRequired,
  currentBlock,
  isThresholdMetByProposer,
}: CandidateSponsorsProps) => {
  const maxVisibleSpots = 5;
  const [signerCountOverflow, setSignerCountOverflow] = useState(0);
  const activeSigners =
    signers?.filter(s => s.signer.activeOrPendingProposal === false && isTruthy(s.signer.id)) ?? [];
  const signerIds = activeSigners?.map(s => s.signer.id) ?? [];

  const { data: delegateSnapshot } = useDelegateNounsAtBlockQuery(
    signerIds ?? [],
    currentBlock ?? 0n,
  );
  const { delegates } = delegateSnapshot || {};
  const delegateToNounIds = delegates?.reduce<Record<string, string[]>>((acc, curr) => {
    acc[curr.id] = curr?.nounsRepresented?.map(nr => nr.id) ?? [];
    return acc;
  }, {});
  const nounIds = Object.values(delegateToNounIds ?? {}).flat();
  if (signers.length > maxVisibleSpots) {
    setSignerCountOverflow(signers.length - maxVisibleSpots);
  }
  const placeholderCount =
    isThresholdMetByProposer === true && nounIds.length === 0 ? 1 : nounsRequired - nounIds.length;
  const placeholderKeys = useMemo(
    () =>
      Array.from(
        { length: placeholderCount >= 1 ? placeholderCount : 0 },
        (_, idx) => `placeholder-${nounIds.length + idx}`,
      ),
    [placeholderCount, nounIds.length],
  );

  return (
    <div
      className={cn(
        'flex flex-row gap-2',
        signerCountOverflow > 0 && 'lg:max-w-[200px] lg:overflow-visible',
      )}
    >
      {nounIds.length > 0 && (
        <div className="flex flex-row flex-wrap place-content-center items-center gap-[5px] lg:justify-start">
          {nounIds.map((nounId, i) => {
            if (i >= maxVisibleSpots) return null;
            return <CandidateSponsorImage nounId={BigInt(nounId)} key={nounId} />;
          })}
        </div>
      )}
      {placeholderKeys.map(k => (
        <div
          className="size-8 rounded-full border border-dashed border-[#a7a7aa] bg-[#e8e8ec]"
          key={k}
        />
      ))}
    </div>
  );
};

export default CandidateSponsors;
