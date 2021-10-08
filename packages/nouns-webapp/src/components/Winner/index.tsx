import { Button } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import classes from './Winner.module.css';
import ShortAddress from '../ShortAddress';
import { Link } from 'react-router-dom';

const Winner: React.FC<{ winner: string }> = props => {
  const { winner } = props;
  const activeAccount = useAppSelector(state => state.account.activeAccount);

  return (
    <div className={classes.section}>
      <h4>Winner</h4>
      <h2>
        {activeAccount !== undefined &&
        activeAccount.toLocaleLowerCase() === winner.toLocaleLowerCase() ? (
          <div className={classes.youSection}>
            <div>You!</div>
            <Link to="/verify" className={classes.verifyLink}>
              <Button className={classes.verifyButton}>Get Verified</Button>
            </Link>
          </div>
        ) : (
          <ShortAddress address={winner} avatar={true} />
        )}
      </h2>
    </div>
  );
};

export default Winner;
