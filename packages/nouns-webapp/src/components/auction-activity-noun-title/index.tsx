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
        className="mb-2.5 font-['Londrina_Solid'] text-[68px] md:text-[56px] lg:text-[68px]"
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
