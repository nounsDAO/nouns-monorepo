import React from 'react';

import { Trans } from '@lingui/react/macro';

import classes from './AuctionActivityNounTitle.module.css';

interface AuctionActivityNounTitleProps {
  nounId: bigint;
  isCool?: boolean;
}

const AuctionActivityNounTitle: React.FC<AuctionActivityNounTitleProps> = props => {
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
