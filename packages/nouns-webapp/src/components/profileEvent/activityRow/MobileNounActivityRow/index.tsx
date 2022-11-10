import { ReactNode } from 'react';
import classes from './MobileNounBRActivityRow.module.css';

interface MobileNounBRActivityRowProps {
  onClick: () => void;
  icon: ReactNode;
  primaryContent: ReactNode;
  secondaryContent?: ReactNode;
}

const MobileNounBRActivityRow: React.FC<MobileNounBRActivityRowProps> = props => {
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

export default MobileNounBRActivityRow;
