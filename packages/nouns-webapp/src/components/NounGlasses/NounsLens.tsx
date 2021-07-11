import Lens from './Lens';
import Noun from '../Shared/Noun';
import { useNounToken } from '../../wrappers/nounToken';
import { BigNumber } from '@ethersproject/bignumber';

const NounsLens: React.FC<{ nounId: BigNumber }> = props => {
  const noun = useNounToken(props.nounId);
  return (
    <Lens zIndex={4}>
      <Noun imgPath={noun ? noun.image : ''} />
    </Lens>
  );
};

export default NounsLens;
