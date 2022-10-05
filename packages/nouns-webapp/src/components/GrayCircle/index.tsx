import { getGrayBackgroundSVG } from '../../utils/grayBackgroundSVG';
import punkClasses from '../Punk/Token.module.css';
import Punk from '../Punk';
import classes from './GrayCircle.module.css';

interface GrayCircleProps {
  isDelegateView?: boolean;
}

export const GrayCircle: React.FC<GrayCircleProps> = props => {
  const { isDelegateView } = props;
  return (
    <div className={isDelegateView ? classes.wrapper : ''}>
      <Punk
        imgPath={getGrayBackgroundSVG()}
        alt={''}
        wrapperClassName={
          isDelegateView
            ? punkClasses.delegateViewCircularTokenWrapper
            : punkClasses.circularTokenWrapper
        }
        className={isDelegateView ? punkClasses.delegateViewCircular : punkClasses.circular}
      />
    </div>
  );
};
