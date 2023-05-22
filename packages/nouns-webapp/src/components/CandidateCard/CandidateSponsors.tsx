import React, { useState } from 'react';
import classes from './CandidateSponsors.module.css';
import { CandidateSignature } from '../../wrappers/nounsDao';
import CandidateSponsorImage from './CandidateSponsorImage';
import { useQuery } from '@apollo/client';
import { useBlockNumber } from '@usedapp/core';
import { Delegates, delegateNounsAtBlockQuery } from '../../wrappers/subgraph';
import { Link } from 'react-router-dom';

type Props = {
  signers: CandidateSignature[];
  nounsRequired: number;
};

function CandidateSponsors({ signers, nounsRequired }: Props) {
  const [signerSpots, setSignerSpots] = useState<CandidateSignature[]>();
  const [emptySignerSpots, setEmptySignerSpots] = useState<number[]>();
  const [signerCountOverflow, setSignerCountOverflow] = useState(0);

  const currentBlock = useBlockNumber();
  const signerIds = signers?.map(s => s.signer.id) ?? [];

  const { data: delegateSnapshot } = useQuery<Delegates>(
    delegateNounsAtBlockQuery(signerIds ?? [], currentBlock ?? 0),
  );
  const { delegates } = delegateSnapshot || {};
  const delegateToNounIds = delegates?.reduce<Record<string, string[]>>((acc, curr) => {
    acc[curr.id] = curr?.nounsRepresented?.map(nr => nr.id) ?? [];
    return acc;
  }, {});
  console.log('delegateToNounIds', delegateToNounIds);
  const nounIds = Object.values(delegateToNounIds ?? {}).flat();
  console.log('nounIds', nounIds);

  React.useEffect(() => {
    if (signers && signers.length < nounsRequired) {
      setSignerSpots(signers);
    } else if (signers && signers.length > nounsRequired) {
      setSignerCountOverflow(signers.length - nounsRequired);
      setSignerSpots(signers.slice(0, nounsRequired));
    } else {
      setSignerSpots(signers);
    }
  }, [signers]);

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
      {Array(nounsRequired - signers.length)
        .fill(0)
        .map((_, index) => (
          <div className={classes.emptySponsorSpot} />
        ))}
    </div>
  );
}

export default CandidateSponsors;
