import { Button, Row, Container, Col } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import classes from './Winner.module.css';
import ShortAddress from '../ShortAddress';
import { Link } from 'react-router-dom';

interface WinnerProps {
  winner: string;
  isNounders?: boolean;
}

const Winner: React.FC<WinnerProps> = props => {
  const { winner, isNounders } = props;
  const activeAccount = useAppSelector(state => state.account.activeAccount);

  const nonNounderNounContent =
    activeAccount !== undefined &&
    activeAccount.toLocaleLowerCase() === winner.toLocaleLowerCase() ? (
      <Row className={classes.youSection}>
        <Row>You!</Row>
        <Link to="/verify" className={classes.verifyLink}>
          <Button className={classes.verifyButton}>Get Verified</Button>
        </Link>
      </Row>
    ) : (
      <ShortAddress size={40} address={winner} avatar={true} />
    );

  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const nounderNounContent = <h2>nounders.eth</h2>;

  return (
    <Container className={classes.wrapper}>
      <Row className={classes.section}>
        <Col xs={1} lg={12} className={classes.leftCol}>
          <h4
            style={{
              fontFamily: 'PT Root UI Bold',
              color: isCool ? 'var(--brand-cool-light-text)' : 'var(--brand-warm-light-text)',
            }}
          >
            Winner
          </h4>
        </Col>
        <Col xs="auto" lg={12}>
          <h2
            style={{
              color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)',
            }}
          >
            {isNounders ? nounderNounContent : nonNounderNounContent}
          </h2>
        </Col>
      </Row>
    </Container>
  );
};

export default Winner;
