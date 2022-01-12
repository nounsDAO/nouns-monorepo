import classes from './NavBarTreasury.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Container, Row } from 'react-bootstrap';

interface NavBarTreasuryProps {
    treasuryBalance:  string;
    isWarmStyle: boolean;
}

const NavBarTreasury: React.FC<NavBarTreasuryProps> = props => {

    const { treasuryBalance, isWarmStyle } = props;

    return (
        <div className={`${classes.wrapper} ${isWarmStyle ? classes.warmInfo : classes.coolInfo}`} >
        <div className={classes.button}>
            <div>
                <Container className={classes.treasuryInfoWrapper}>
                    <Row className={classes.treasuryHeader}>
                        Treasury
                    </Row>
                    <Row className={classes.treasuryBalance}>
                        Ξ {Number(treasuryBalance).toLocaleString("en-US")}
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