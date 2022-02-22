import { BigNumber } from 'ethers';
import classes from './AuctionActivityNounTitle.module.css';

const AuctionActivityNounTitle: React.FC<{ nounId: BigNumber; isCool?: boolean }> = props => {
  const { nounId, isCool } = props;
  const nounIdContent = `Noun ${nounId.toString()}`;
  return (
    <div className={classes.wrapper}>
      <h1 style={{ color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)' }}>
        {nounIdContent}
      </h1>
    </div>
  );
};
export default AuctionActivityNounTitle;
