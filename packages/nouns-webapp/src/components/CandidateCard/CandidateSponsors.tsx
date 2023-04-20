import React, { useState } from 'react';
import classes from './CandidateSponsors.module.css';

type Props = {
  sponsors: `0x${string}`[];
};

function CandidateSponsors({ sponsors }: Props) {
  const minSponsorCount = 5;
  const [sponsorSpots, setSponsorSpots] = useState<`0x${string}`[] | ''[]>();
  const [emptySponsorSpots, setEmptySponsorSpots] = useState<number[]>();
  const [sponsorCountOverflow, setSponsorCountOverflow] = useState(0);
  React.useEffect(() => {
    if (sponsors.length < minSponsorCount) {
      setSponsorSpots(sponsors);
      const emptySpots: number[] = Array(minSponsorCount - sponsors.length).fill(0);
      setEmptySponsorSpots(emptySpots);
    } else if (sponsors.length > minSponsorCount) {
      setSponsorCountOverflow(sponsors.length - minSponsorCount);
      setSponsorSpots(sponsors.slice(0, minSponsorCount));
    } else {
      setSponsorSpots(sponsors);
    }
  }, [sponsors]);

  return (
    <div className={classes.sponsors}>
      {sponsorSpots?.length &&
        sponsorSpots.map(sponsor => {
          return (
            <a href={'[sponsor]'} className={classes.sponsorAvatar}>
              {/* get noun image of sponsor */}
              <img src="https://noun.pics/0" alt="Sponsor's noun image" />
            </a>
          );
        })}
      {/* empty sponsor spots */}

      {emptySponsorSpots &&
        emptySponsorSpots.length < minSponsorCount &&
        emptySponsorSpots.map((_, index) => <div className={classes.emptySponsorSpot} />)}
    </div>
  );
}

export default CandidateSponsors;
