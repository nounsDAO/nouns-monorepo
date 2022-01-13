import classes from './NavBarTreasury.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Container, Row } from 'react-bootstrap';
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
        <div>
          <Container className={classes.treasuryInfoWrapper}>
            <Row className={classes.treasuryHeader}>Treasury</Row>
            <Row className={classes.treasuryBalance}>
              Ξ {Number(treasuryBalance).toLocaleString('en-US')}
            </Row>
          </Container>
        </div>
        <div className={classes.icon}>
          <FontAwesomeIcon icon={faQuestionCircle} />
        </div>
      </div>
    </div>
  );
};

export default NavBarTreasury;
