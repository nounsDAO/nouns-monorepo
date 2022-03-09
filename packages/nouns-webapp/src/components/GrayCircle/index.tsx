import { getGrayBackgroundSVG } from '../../utils/grayBackgroundSVG';
import nounClasses from '../Noun/Noun.module.css';
import Noun from '../Noun';

export const GrayCircle = () => {
  return (
    <Noun
      imgPath={getGrayBackgroundSVG()}
      alt={''}
      wrapperClassName={nounClasses.circularNounWrapper}
      className={nounClasses.circular}
    />
  );
};
