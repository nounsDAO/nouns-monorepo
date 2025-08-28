import React from 'react';

import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';

import { NavBarButtonStyle } from '@/components/nav-bar-button';
import { cn } from '@/lib/utils';

interface NavBarTreasuryProps {
  treasuryBalance: string;
  treasuryStyle: NavBarButtonStyle;
}

const NavBarTreasury: React.FC<NavBarTreasuryProps> = ({ treasuryBalance, treasuryStyle }) => {
  const balanceColor =
    treasuryStyle === NavBarButtonStyle.WARM_INFO
      ? 'text-brand-warm-dark-text'
      : treasuryStyle === NavBarButtonStyle.COOL_INFO
        ? 'text-brand-cool-dark-text'
        : '';

  return (
    <div
      className={cn(
        'rounded-10 font-pt xs:ml-0 xs:px-2.5 -ml-2 h-10 border border-black/10 px-2.5 py-0 pl-1.5 pr-1.5 text-base font-bold shadow-none transition-all duration-150 ease-in-out',
        treasuryStyle === NavBarButtonStyle.WARM_INFO &&
          'rounded-10 text-brand-warm-light-text border-brand-warm-border hover:bg-brand-warm-accent border hover:text-black',
        treasuryStyle === NavBarButtonStyle.COOL_INFO &&
          'rounded-10 text-brand-cool-dark-text border-brand-cool-border hover:bg-brand-cool-accent border hover:text-black',
        treasuryStyle !== NavBarButtonStyle.WARM_INFO &&
          treasuryStyle !== NavBarButtonStyle.COOL_INFO &&
          'bg-white',
      )}
    >
      <div
        className={cn(
          'flex h-full w-full flex-row items-center justify-center hover:cursor-pointer',
        )}
      >
        <div
          className="d-flex justify-content-around flex-row"
          style={{
            paddingTop: '1px',
          }}
        >
          <div className="mr-0.4 ml-1 mt-px block text-base opacity-50">
            <Trans>Treasury</Trans>
          </div>
          <div className={cn('ml-0.4 mr-1 text-base tracking-wide', balanceColor)}>
            Ξ {i18n.number(Number(treasuryBalance))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBarTreasury;
