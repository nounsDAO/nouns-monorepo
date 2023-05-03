import React, { useState } from 'react';
import classes from './CandidateSponsors.module.css';
import { PartialCandidateSignature } from '../../wrappers/nounsDao';

type Props = {
  signers: PartialCandidateSignature[];
};

function CandidateSponsors({ signers }: Props) {
  // todo: get from contract
  const minSignerCount = 5;
  const [signerSpots, setSignerSpots] = useState<PartialCandidateSignature[]>();
  const [emptySignerSpots, setEmptySignerSpots] = useState<number[]>();
  const [signerCountOverflow, setSignerCountOverflow] = useState(0);
  React.useEffect(() => {
    if (signers && signers.length < minSignerCount) {
      setSignerSpots(signers);
    } else if (signers && signers.length > minSignerCount) {
      setSignerCountOverflow(signers.length - minSignerCount);
      setSignerSpots(signers.slice(0, minSignerCount));
    } else {
      setSignerSpots(signers);
    }
  }, [signers]);

  return (
    <div className={classes.sponsors}>
      {signerSpots &&
        signerSpots.length > 0 &&
        signerSpots.map(signer => {
          return (
            <a href={'[sponsor]'} className={classes.sponsorAvatar}>
              {/* get noun image of sponsor */}
              <img src="https://noun.pics/0" alt="Sponsor's noun image" />
            </a>
          );
        })}
      {/* empty sponsor spots */}

      {Array(minSignerCount - signers.length)
        .fill(0)
        .map((_, index) => (
          <div className={classes.emptySponsorSpot} />
        ))}
    </div>
  );
}

export default CandidateSponsors;
