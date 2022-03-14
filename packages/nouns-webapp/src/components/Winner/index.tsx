import { Button, Row, Col } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import classes from './Winner.module.css';
import ShortAddress from '../ShortAddress';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { isMobileScreen } from '../../utils/isMobile';
import { black, primary } from '../../utils/nounBgColors';

interface WinnerProps {
  winner: string;
  isNounders?: boolean;
  isEthereum?: boolean;
}

const Winner: React.FC<WinnerProps> = props => {
  const { winner, isNounders, isEthereum = false } = props;
  const activeAccount = useAppSelector(state => state.account.activeAccount);

  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const isMobile = isMobileScreen();

  const isWinnerYou =
    activeAccount !== undefined && activeAccount.toLocaleLowerCase() === winner.toLocaleLowerCase();

  const nonNounderNounContent = isWinnerYou ? (
    <Row className={classes.youSection}>
      <Col lg={4} className={classes.youCopy}>
        <h2
          className={classes.winnerContent}
          style={{
            color: isEthereum ? primary : black,
          }}
        >
          You
        </h2>
      </Col>
      {!isMobile && (
        <Col>
          <Link to="/verify" className={classes.verifyLink}>
            <Button className={classes.verifyButton}>Get Verified</Button>
          </Link>
        </Col>
      )}
    </Row>
  ) : (
    <ShortAddress size={40} address={winner} avatar={true} />
  );

  const nounderNounContent = <h2>nounders.eth</h2>;

  return (
    <>
      <Row className={clsx(classes.wrapper, classes.section)}>
        <Col lg={12} className={classes.leftCol}>
          <h4
            style={{
              color: isEthereum ? primary : black,
            }}
          >
            Winner
          </h4>
        </Col>
        <Col lg={12}>
          <h2
            className={classes.winnerContent}
            style={{
              color: isEthereum ? primary : black,
            }}
          >
            {isNounders ? nounderNounContent : nonNounderNounContent}
          </h2>
        </Col>
      </Row>
      {isWinnerYou && isMobile && (
        <Row>
          <Link to="/verify" className={classes.verifyLink}>
            <Button className={classes.verifyButton}>Get Verified</Button>
          </Link>
        </Row>
      )}
    </>
  );
};

export default Winner;
