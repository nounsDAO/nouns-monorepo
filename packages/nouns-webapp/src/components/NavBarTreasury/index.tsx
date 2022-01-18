import classes from './NavBarTreasury.module.css';
import { NavBarButtonStyle } from '../NavBarButton';

interface NavBarTreasuryProps {
  treasuryBalance: string;
  treasuryStyle: NavBarButtonStyle;
}

const NavBarTreasury: React.FC<NavBarTreasuryProps> = props => {
  const { treasuryBalance, treasuryStyle } = props;

  let treasuryStyleClass;
  switch (treasuryStyle) {
    case NavBarButtonStyle.WARM_INFO:
      treasuryStyleClass = classes.warmInfo;
      break;
    case NavBarButtonStyle.COOL_INFO:
      treasuryStyleClass = classes.coolInfo;
      break;
    case NavBarButtonStyle.WHITE_INFO:
    default:
      treasuryStyleClass = classes.whiteInfo;
      break;
  }

  return (
    <div className={`${classes.wrapper} ${treasuryStyleClass}`}>
      <div className={classes.button}>
          <div className='d-flex flex-row justify-content-around'>
            <div className={classes.treasuryHeader}>
              Treasury
            </div>
            <div className={classes.treasuryBalance}>
              Ξ {Number(treasuryBalance).toLocaleString('en-US')}
            </div>

          </div>
      </div>
    </div>
  );
};

export default NavBarTreasury;
