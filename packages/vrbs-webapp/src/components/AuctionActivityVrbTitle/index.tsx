import { BigNumber } from 'ethers';
import classes from './AuctionActivityVrbTitle.module.css';
import { Trans } from '@lingui/macro';

const AuctionActivityVrbTitle: React.FC<{ vrbId: BigNumber; isCool?: boolean }> = props => {
  const { vrbId, isCool } = props;
  return (
    <div className={classes.wrapper}>
      <h1 style={{ color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)' }}>
        <Trans>vrb {vrbId.toString()}</Trans>
      </h1>
    </div>
  );
};
export default AuctionActivityVrbTitle;
