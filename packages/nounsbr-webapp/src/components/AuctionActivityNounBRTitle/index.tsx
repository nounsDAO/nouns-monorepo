import { BigNumber } from 'ethers';
import classes from './AuctionActivityNounBRTitle.module.css';
import { Trans } from '@lingui/macro';

const AuctionActivityNounBRTitle: React.FC<{ nounbrId: BigNumber; isCool?: boolean }> = props => {
  const { nounbrId, isCool } = props;
  return (
    <div className={classes.wrapper}>
      <h1 style={{ color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)' }}>
        <Trans>NounBR {nounbrId.toString()}</Trans>
      </h1>
    </div>
  );
};
export default AuctionActivityNounBRTitle;
