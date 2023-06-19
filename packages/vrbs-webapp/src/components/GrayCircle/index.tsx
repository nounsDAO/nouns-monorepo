import { getGrayBackgroundSVG } from '../../utils/grayBackgroundSVG';
import vrbClasses from '../Vrb/Vrb.module.css';
import Vrb from '../Vrb';
import classes from './GrayCircle.module.css';

interface GrayCircleProps {
  isDelegateView?: boolean;
}

export const GrayCircle: React.FC<GrayCircleProps> = props => {
  const { isDelegateView } = props;
  return (
    <div className={isDelegateView ? classes.wrapper : ''}>
      <Vrb
        imgPath={getGrayBackgroundSVG()}
        alt={''}
        wrapperClassName={
          isDelegateView
            ? vrbClasses.delegateViewCircularVrbWrapper
            : vrbClasses.circularVrbWrapper
        }
        className={isDelegateView ? vrbClasses.delegateViewCircular : vrbClasses.circular}
      />
    </div>
  );
};
