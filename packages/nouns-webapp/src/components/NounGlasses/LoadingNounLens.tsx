import Lens from './Lens';
import Noun from '../Shared/Noun';

const LoadingNounLens = () => {
  return (
    <Lens zIndex={4}>
      <Noun imgPath="" alt="" />
    </Lens>
  );
};

export default LoadingNounLens;
