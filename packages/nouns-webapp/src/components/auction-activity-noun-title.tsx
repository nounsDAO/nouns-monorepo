import React from 'react';

import { Trans } from '@lingui/react/macro';

interface AuctionActivityNounTitleProps {
  nounId: bigint;
  isCool?: boolean;
}

const AuctionActivityNounTitle: React.FC<AuctionActivityNounTitleProps> = props => {
  const { nounId, isCool } = props;
  return (
    <div className="inline-block">
      <h1
        className="font-londrina md:text-56 mb-2.5 text-7xl lg:text-7xl"
        style={{
          color: isCool === true ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)',
        }}
      >
        <Trans>Noun {nounId.toString()}</Trans>
      </h1>
    </div>
  );
};
export default AuctionActivityNounTitle;
