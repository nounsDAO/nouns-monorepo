import Lens from './Lens';
import Noun from '../Shared/Noun';

const NounsLens: React.FC<{ imgSrc: string }> = props => {
  return (
    <Lens zIndex={4}>
      <Noun imgPath={props.imgSrc} />
    </Lens>
  );
};

export default NounsLens;
