import { ReactNode } from 'react';
import classes from './MobileNounActivityRow.module.css';

interface MobileNounActivityRowProps {
  onClick: () => void;
  icon: ReactNode;
  primaryContent: ReactNode;
  secondaryContent?: ReactNode;
}

const MobileNounActivityRow: React.FC<MobileNounActivityRowProps> = props => {
  const { onClick, icon, primaryContent, secondaryContent } = props;

  return (
    <div className={classes.wrapper} onClick={onClick}>
      <div className={classes.icon}>{icon}</div>

      <div className={classes.content}>
        <div>{primaryContent}</div>
        <div>{secondaryContent}</div>
      </div>
    </div>
  );
};

export default MobileNounActivityRow;
