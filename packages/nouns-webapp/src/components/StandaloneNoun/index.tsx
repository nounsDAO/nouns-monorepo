import { BigNumber } from 'ethers';
import { useNounToken } from '../../wrappers/nounToken';
import Noun from '../Noun';
import classes from './StandaloneNoun.module.css';

interface StandaloneNounProps {
  nounId: BigNumber;
  boxShadow?: boolean;
}

const StandaloneNoun: React.FC<StandaloneNounProps> = (props: StandaloneNounProps) => {
  const { nounId, boxShadow } = props;
  const noun = useNounToken(nounId);

  return (
    <div className={noun && boxShadow ? classes.boxShadow : ''}>
      <Noun imgPath={noun ? noun.image : ''} alt={noun ? noun.description : ''} />
    </div>
  );
};

export default StandaloneNoun;
