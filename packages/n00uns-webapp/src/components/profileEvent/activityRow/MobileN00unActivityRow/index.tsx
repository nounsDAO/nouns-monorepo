import { ReactNode } from 'react';
import classes from './MobileN00unActivityRow.module.css';

interface MobileN00unActivityRowProps {
  onClick: () => void;
  icon: ReactNode;
  primaryContent: ReactNode;
  secondaryContent?: ReactNode;
}

const MobileN00unActivityRow: React.FC<MobileN00unActivityRowProps> = props => {
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

export default MobileN00unActivityRow;
