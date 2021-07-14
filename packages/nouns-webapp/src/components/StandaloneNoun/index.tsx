import { BigNumber, BigNumberish } from 'ethers';
import { useNounToken } from '../../wrappers/nounToken';
import classes from './StandaloneNoun.module.css';

interface StandaloneNounProps {
  nounId: BigNumberish;
}

const StandaloneNoun: React.FC<StandaloneNounProps> = (props: StandaloneNounProps) => {
  const { nounId } = props;
  const noun = useNounToken(BigNumber.from(nounId));

  return (
    <div className={classes.standaloneNoun}>
      <img src={noun?.image} />
    </div>
  );
};

export default StandaloneNoun;
