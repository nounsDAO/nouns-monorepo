import classes from './CandidateSponsors.module.css';

import { StandaloneNounImage } from '@/components/StandaloneNoun';

type CandidateSponsorImageProps = {
  nounId: bigint;
};

const CandidateSponsorImage = ({ nounId }: CandidateSponsorImageProps) => (
  <div className={classes.sponsorAvatar}>
    <StandaloneNounImage nounId={nounId} />
  </div>
);

export default CandidateSponsorImage;
