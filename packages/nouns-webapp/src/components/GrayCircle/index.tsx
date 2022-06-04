import { getGrayBackgroundSVG } from '../../utils/grayBackgroundSVG';
import nounClasses from '../Noun/Noun.module.css';
import Noun from '../Noun';

interface GrayCircleProps {
  small?: boolean;
}

export const GrayCircle: React.FC<GrayCircleProps> = props => {
  const { small } = props;
  return (
    <Noun
      imgPath={getGrayBackgroundSVG()}
      alt={''}
      wrapperClassName={
        small ? nounClasses.smallerCircularNounWrapper : nounClasses.circularNounWrapper
      }
      className={small ? nounClasses.smallCircular : nounClasses.circular}
    />
  );
};
