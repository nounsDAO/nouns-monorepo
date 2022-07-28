import { ReactNode } from 'react-markdown/lib/react-markdown';
import classes from './NounActivityFeedRow.module.css';
import responsiveUiUtilsClasses from '../../utils/ResponsiveUIUtils.module.css';
import { useActiveLocale } from '../../hooks/useActivateLocale';

interface NounActivityFeedRowProps {
  onClick: () => void;
  icon: ReactNode;
  primaryContent: ReactNode;
  secondaryContent?: ReactNode;
}

const NounActivityFeedRow: React.FC<NounActivityFeedRowProps> = props => {
  const { onClick, icon, primaryContent, secondaryContent } = props;

  const activeLocale = useActiveLocale();

  return (
    <tr onClick={onClick} className={classes.wrapper}>
      <td className={classes.icon}>{icon}</td>
      <td className={classes.activityTableCell}>
        <div className={classes.infoContainer}>{primaryContent}</div>
      </td>
      <td className={activeLocale === 'ja-JP' ? responsiveUiUtilsClasses.desktopOnly : ''}  >
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
      }}>
          <div style={{
              textAlign: 'right',
              width: 'max-content'
          }}>
            {secondaryContent}
          </div>
          </div>
      </td>
    </tr>
  );
};

export default NounActivityFeedRow;
