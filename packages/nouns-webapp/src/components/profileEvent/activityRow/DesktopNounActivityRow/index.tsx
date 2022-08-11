import { ReactNode } from 'react-markdown/lib/react-markdown';
import classes from './DesktopNounActivityRow.module.css';
import responsiveUiUtilsClasses from '../../../../utils/ResponsiveUIUtils.module.css';
import { useActiveLocale } from '../../../../hooks/useActivateLocale';

interface DesktopNounActivityRowProps {
  icon: ReactNode;
  primaryContent: ReactNode;
  secondaryContent?: ReactNode;
}

const DesktopNounActivityRow: React.FC<DesktopNounActivityRowProps> = props => {
  const { icon, primaryContent, secondaryContent } = props;

  const activeLocale = useActiveLocale();

  return (
    <tr className={classes.wrapper}>
      <td className={classes.icon}>{icon}</td>
      <td className={classes.activityTableCell}>
        <div className={classes.infoContainer}>{primaryContent}</div>
      </td>
      <td className={activeLocale === 'ja-JP' ? responsiveUiUtilsClasses.desktopOnly : ''}>
        <div className={classes.secondaryContentWrapper}>
          <div className={classes.secondaryContentContainer}>{secondaryContent}</div>
        </div>
      </td>
    </tr>
  );
};

export default DesktopNounActivityRow;
