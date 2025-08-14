import { StandaloneNounImage } from '@/components/standalone-noun';

import classes from './candidate-sponsors.module.css';

type CandidateSponsorImageProps = {
  nounId: bigint;
};

const CandidateSponsorImage = ({ nounId }: CandidateSponsorImageProps) => (
  <div className={classes.sponsorAvatar}>
    <StandaloneNounImage nounId={nounId} />
  </div>
);

export default CandidateSponsorImage;
