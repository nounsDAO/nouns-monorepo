import { StandaloneNounImage } from '@/components/StandaloneNoun';

import classes from './CandidateSponsors.module.css';

type CandidateSponsorImageProps = {
  nounId: bigint;
};

const CandidateSponsorImage = ({ nounId }: CandidateSponsorImageProps) => (
  <div className={classes.sponsorAvatar}>
    <StandaloneNounImage nounId={nounId} />
  </div>
);

export default CandidateSponsorImage;
