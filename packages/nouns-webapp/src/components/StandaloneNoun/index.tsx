import { BigNumber, BigNumberish } from 'ethers';
import { useNounToken } from '../../wrappers/nounToken';
import Noun from '../Noun';
import classes from './StandaloneNoun.module.css';

interface StandaloneNounProps {
  nounId: BigNumberish;
}

const StandaloneNoun: React.FC<StandaloneNounProps> = (props: StandaloneNounProps) => {
  const { nounId } = props;
  const noun = useNounToken(BigNumber.from(nounId));

  return (
    <div className={classes.standaloneNoun}>
      <Noun imgPath={noun ? noun.image : ''} alt={noun ? noun.description : ''} />
    </div>
  );
};

export default StandaloneNoun;
