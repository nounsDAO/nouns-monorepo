import { BigNumber } from 'ethers';
import classes from './AuctionActivityN00unTitle.module.css';
import { Trans } from '@lingui/macro';

const AuctionActivityN00unTitle: React.FC<{ n00unId: BigNumber; isCool?: boolean }> = props => {
  const { n00unId, isCool } = props;
  return (
    <div className={classes.wrapper}>
      <h1 style={{ color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)' }}>
        <Trans>N00un {n00unId.toString()}</Trans>
      </h1>
    </div>
  );
};
export default AuctionActivityN00unTitle;
