import { BigNumber } from 'ethers';
import { useNounToken } from '../../wrappers/nounToken';
import Noun from '../Noun';
import classes from './StandaloneNoun.module.css';

interface StandaloneNounProps {
  nounId: BigNumber;
}

const StandaloneNoun: React.FC<StandaloneNounProps> = (props: StandaloneNounProps) => {
  const { nounId } = props;
  const noun = useNounToken(nounId);

  return <Noun imgPath={noun ? noun.image : ''} alt={noun ? noun.description : 'Noun'} />;
};

export default StandaloneNoun;
