import { StandaloneNounImage } from '@/components/standalone-noun';

type CandidateSponsorImageProps = {
  nounId: bigint;
};

const CandidateSponsorImage = ({ nounId }: CandidateSponsorImageProps) => (
  <div className="size-8 [&_img]:block [&_img]:w-full [&_img]:rounded-full">
    <StandaloneNounImage nounId={nounId} />
  </div>
);

export default CandidateSponsorImage;
