import { BigNumber } from 'ethers';
import classes from './AuctionActivityPunkTitle.module.css';
import { Trans } from '@lingui/macro';

const AuctionActivityPunkTitle: React.FC<{ tokenId: BigNumber; isCool?: boolean }> = props => {
  const { tokenId, isCool } = props;
  return (
    <div className={classes.wrapper}>
      <h1 style={{ color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)' }}>
        <Trans>Punk {tokenId.toString()}</Trans>
      </h1>
    </div>
  );
};
export default AuctionActivityPunkTitle;
