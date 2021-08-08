import classes from '../CurrentBid/CurrentBid.module.css';
import ShortAddress from '../ShortAddress';
import { useAppSelector } from '../../hooks';

const Winner: React.FC<{ winner: string }> = props => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);

  const { winner } = props;

  return (
    <div className={classes.section}>
      <h4>Winner</h4>
      <h2>
        {!winner ? '0x0000' : winner === activeAccount?.toLowerCase() ? 'You' : <ShortAddress>{winner}</ShortAddress>}
      </h2>
    </div>
  );
};

export default Winner;
