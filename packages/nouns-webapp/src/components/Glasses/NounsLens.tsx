import Lens from './Lens';
import Noun from '../Shared/Noun';
import nounImg from '../../assets/noun.png';

const NounsLens = () => {
  return (
    <Lens zIndex={4}>
      <Noun imgPath={nounImg} />
    </Lens>
  );
};

export default NounsLens;
