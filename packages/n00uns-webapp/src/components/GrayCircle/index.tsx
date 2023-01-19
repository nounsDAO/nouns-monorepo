import { getGrayBackgroundSVG } from '../../utils/grayBackgroundSVG';
import n00unClasses from '../N00un/N00un.module.css';
import N00un from '../N00un';
import classes from './GrayCircle.module.css';

interface GrayCircleProps {
  isDelegateView?: boolean;
}

export const GrayCircle: React.FC<GrayCircleProps> = props => {
  const { isDelegateView } = props;
  return (
    <div className={isDelegateView ? classes.wrapper : ''}>
      <N00un
        imgPath={getGrayBackgroundSVG()}
        alt={''}
        wrapperClassName={
          isDelegateView
            ? n00unClasses.delegateViewCircularN00unWrapper
            : n00unClasses.circularN00unWrapper
        }
        className={isDelegateView ? n00unClasses.delegateViewCircular : n00unClasses.circular}
      />
    </div>
  );
};
