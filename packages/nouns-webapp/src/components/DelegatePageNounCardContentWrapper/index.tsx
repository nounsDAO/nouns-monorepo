import { ReactNode } from 'react';
import classes from './DelegatePageNounCardContentWrapper.module.css';

interface DelegatePageNounCardContentWrapperProps {
  primaryText: ReactNode;
  secondaryText: ReactNode;
}

const DelegatePageNounCardContentWrapper: React.FC<
  DelegatePageNounCardContentWrapperProps
> = props => {
  const { primaryText, secondaryText } = props;

  return (
    <div className={classes.wrapper}>
      <div className={classes.primaryText}>{primaryText}</div>
      <div className={classes.secondaryText}>{secondaryText}</div>
    </div>
  );
};

export default DelegatePageNounCardContentWrapper;
