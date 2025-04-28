import { BigNumber } from 'ethers';
import { StandaloneNounImage } from '../StandaloneNoun';
import classes from './CandidateSponsors.module.css';

type Props = {
  nounId: number;
};

export default function CandidateSponsorImage({ nounId }: Props) {
  return (
    <div className={classes.sponsorAvatar}>
      <StandaloneNounImage nounId={BigNumber.from(nounId)} />
    </div>
  );
}
