import { BigNumber } from 'ethers';
import classes from './AuctionActivityNounTitle.module.css';
import { Trans } from '@lingui/macro';

const AuctionActivityNounTitle: React.FC<{ nounId: BigNumber; isCool?: boolean }> = props => {
  const { nounId, isCool } = props;
  return (
    <div className={classes.wrapper}>
      <h1 style={{ color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)' }}>
        <Trans>Noun {nounId.toString()}</Trans>
      </h1>
    </div>
  );
};
export default AuctionActivityNounTitle;
