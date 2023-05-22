import { BigNumber } from 'ethers';
import { StandaloneNounImage } from '../StandaloneNoun';

type Props = {
  nounId: number;
};

export default function CandidateSponsorImage({ nounId }: Props) {
  return <StandaloneNounImage nounId={BigNumber.from(nounId)} />;
}
