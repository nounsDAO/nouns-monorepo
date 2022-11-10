import { getGrayBackgroundSVG } from '../../utils/grayBackgroundSVG';
import nounbrClasses from '../NounBR/NounBR.module.css';
import NounBR from '../NounBR';
import classes from './GrayCircle.module.css';

interface GrayCircleProps {
  isDelegateView?: boolean;
}

export const GrayCircle: React.FC<GrayCircleProps> = props => {
  const { isDelegateView } = props;
  return (
    <div className={isDelegateView ? classes.wrapper : ''}>
      <NounBR
        imgPath={getGrayBackgroundSVG()}
        alt={''}
        wrapperClassName={
          isDelegateView
            ? nounbrClasses.delegateViewCircularNounBRWrapper
            : nounbrClasses.circularNounBRWrapper
        }
        className={isDelegateView ? nounbrClasses.delegateViewCircular : nounbrClasses.circular}
      />
    </div>
  );
};
