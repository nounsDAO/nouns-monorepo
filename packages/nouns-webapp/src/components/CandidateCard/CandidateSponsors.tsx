import { useState } from 'react';
import classes from './CandidateSponsors.module.css';
import { CandidateSignature } from '../../wrappers/nounsData';
import CandidateSponsorImage from './CandidateSponsorImage';
import { useQuery } from '@apollo/client';
import { Delegates, delegateNounsAtBlockQuery } from '../../wrappers/subgraph';
import clsx from 'clsx';

type Props = {
  signers: CandidateSignature[];
  nounsRequired: number;
  currentBlock?: number;
  isThresholdMetByProposer?: boolean;
};

function CandidateSponsors({
  signers,
  nounsRequired,
  currentBlock,
  isThresholdMetByProposer
}: Props) {
  const maxVisibleSpots = 5;
  const [signerCountOverflow, setSignerCountOverflow] = useState(0);
  const activeSigners = signers?.filter(s => s.signer.activeOrPendingProposal === false && s.signer.id) ?? [];
  const signerIds = activeSigners?.map(s => s.signer.id) ?? [];
  const { data: delegateSnapshot } = useQuery<Delegates>(
    delegateNounsAtBlockQuery(signerIds ?? [], currentBlock ?? 0),
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
    isThresholdMetByProposer && nounIds.length === 0 ? 1 : nounsRequired - nounIds.length;
  const placeholderArray = Array(placeholderCount >= 1 ? placeholderCount : 0).fill(0);

  return (
    <div
      className={clsx(
        classes.sponsorsWrap,
        signerCountOverflow > 0 && classes.sponsorsWrapOverflow,
      )}
    >
      {nounIds.length > 0 && (
        <div className={classes.sponsors}>
          {nounIds.map((nounId, i) => {
            if (i >= maxVisibleSpots) return null;
            return <CandidateSponsorImage nounId={+nounId} key={i * +nounId} />;
          })}
        </div>
      )}
      {placeholderArray.map((_, i) => (
        <div className={classes.emptySponsorSpot} key={i} />
      ))}
    </div>
  );
}

export default CandidateSponsors;
