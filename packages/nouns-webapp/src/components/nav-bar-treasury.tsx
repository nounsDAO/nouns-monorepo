import React from 'react';

import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';

import { NavBarButtonStyle } from '@/components/nav-bar-button';

interface NavBarTreasuryProps {
  treasuryBalance: string;
  treasuryStyle: NavBarButtonStyle;
}

const NavBarTreasury: React.FC<NavBarTreasuryProps> = ({ treasuryBalance, treasuryStyle }) => {
  const baseWrapper =
    'h-10 rounded-10 text-base font-pt font-bold px-2.5 py-0 transition-all duration-150 ease-in-out shadow-none border border-black/10 -ml-2 pl-1.5 pr-1.5 xs:ml-0 xs:px-2.5';
  const buttonClasses =
    'flex h-full w-full flex-row items-center justify-center hover:cursor-pointer';

  const styleWrapper =
    treasuryStyle === NavBarButtonStyle.WARM_INFO
      ? 'rounded-10 border text-brand-warm-light-text border-brand-warm-border hover:text-black hover:bg-brand-warm-accent'
      : treasuryStyle === NavBarButtonStyle.COOL_INFO
        ? 'rounded-10 border text-brand-cool-dark-text border-brand-cool-border hover:text-black hover:bg-brand-cool-accent'
        : 'bg-white';

  const balanceColor =
    treasuryStyle === NavBarButtonStyle.WARM_INFO
      ? 'text-brand-warm-dark-text'
      : treasuryStyle === NavBarButtonStyle.COOL_INFO
        ? 'text-brand-cool-dark-text'
        : '';

  return (
    <div className={`${baseWrapper} ${styleWrapper}`}>
      <div className={buttonClasses}>
        <div
          className="d-flex justify-content-around flex-row"
          style={{
            paddingTop: '1px',
          }}
        >
          <div className="mr-0.4 ml-1 mt-px block text-base opacity-50">
            <Trans>Treasury</Trans>
          </div>
          <div className={`ml-0.4 mr-1 text-base tracking-wide ${balanceColor}`}>
            Ξ {i18n.number(Number(treasuryBalance))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBarTreasury;
