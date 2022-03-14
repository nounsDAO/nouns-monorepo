import { black, primary } from '../../utils/nounBgColors';
import classes from './AuctionDescription.module.css';

const AuctionDescription: React.FC<{ isEthereum?: boolean; description: string }> = props => {
  const { isEthereum = false, description } = props;

  return (
    <div
      className={classes.wrapper}
      style={{ backgroundColor: isEthereum ? 'rgba(30, 228, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}
    >
      <p style={{ color: isEthereum ? primary : black }}>{description}</p>
    </div>
  );
};

export default AuctionDescription;
