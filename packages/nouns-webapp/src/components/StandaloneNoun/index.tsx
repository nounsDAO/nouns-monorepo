import { BigNumber } from 'ethers';
import { INounSeed, useNounSeed, useNounToken } from '../../wrappers/nounToken';
import Noun from '../Noun';

interface StandaloneNounProps {
  nounId: BigNumber;
}

interface StandaloneNounWithSeedProps {
  nounId: BigNumber;
  onLoadSeed?: (seed: INounSeed) => void;
}

const StandaloneNoun: React.FC<StandaloneNounProps> = (props: StandaloneNounProps) => {
  const { nounId } = props;
  const noun = useNounToken(nounId);

  return <Noun imgPath={noun ? noun.image : ''} alt={noun ? noun.description : 'Noun'} />;
};

export const StandaloneNounWithSeed: React.FC<StandaloneNounWithSeedProps> = (
  props: StandaloneNounWithSeedProps,
) => {
  const { nounId, onLoadSeed } = props;

  const noun = useNounToken(nounId);
  const seed = useNounSeed(nounId);

  if (noun && seed && onLoadSeed) {
    onLoadSeed(seed);
    return <Noun imgPath={noun ? noun.image : ''} alt={noun ? noun.description : 'Noun'} />;
  } else {
    return <Noun imgPath="" alt="Noun" />;
  }
};

export default StandaloneNoun;
