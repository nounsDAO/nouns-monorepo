import React, { useState } from 'react';
import classes from './CandidateSponsors.module.css';
import { CandidateSignature } from '../../wrappers/nounsData';
import CandidateSponsorImage from './CandidateSponsorImage';
import { useQuery } from '@apollo/client';
import { useBlockNumber } from '@usedapp/core';
import { Delegates, delegateNounsAtBlockQuery } from '../../wrappers/subgraph';
import { Link } from 'react-router-dom';

type Props = {
  signers: CandidateSignature[];
  nounsRequired: number;
  currentBlock?: number;
};

function CandidateSponsors({ signers, nounsRequired, currentBlock }: Props) {
  const [signerSpots, setSignerSpots] = useState<CandidateSignature[]>();
  const [signerCountOverflow, setSignerCountOverflow] = useState(0);
  const signerIds = signers?.map(s => s.signer.id) ?? [];

  const { data: delegateSnapshot } = useQuery<Delegates>(
    delegateNounsAtBlockQuery(signerIds ?? [], currentBlock ?? 0),
  );
  const { delegates } = delegateSnapshot || {};
  const delegateToNounIds = delegates?.reduce<Record<string, string[]>>((acc, curr) => {
    acc[curr.id] = curr?.nounsRepresented?.map(nr => nr.id) ?? [];
    return acc;
  }, {});
  const nounIds = Object.values(delegateToNounIds ?? {}).flat();

  React.useEffect(() => {
    if (signers && signers.length < nounsRequired) {
      setSignerSpots(signers);
    } else if (signers && signers.length > nounsRequired) {
      setSignerCountOverflow(signers.length - nounsRequired);
      setSignerSpots(signers.slice(0, nounsRequired));
    } else {
      setSignerSpots(signers);
    }
  }, [signers, nounsRequired]);

  console.log('todo: add signerCountOverflow element', signerCountOverflow);
  const placeholderCount = nounsRequired - signers.length;
  const placeholderArray = Array(placeholderCount >= 1 ? placeholderCount : 0).fill(0);
  return (
    <div className={classes.sponsors}>
      {signerSpots &&
        signerSpots.length > 0 &&
        delegateToNounIds &&
        nounIds.map(nounId => {
          return (
            <Link to={`/noun/${nounId}`} className={classes.sponsorAvatar}>
              <CandidateSponsorImage nounId={+nounId} />
            </Link>
          );
        })}
      {placeholderArray.map((_) => (
        <div className={classes.emptySponsorSpot} />
      ))}
    </div>
  );
}

export default CandidateSponsors;
