import React from 'react';

import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';

import { NavBarButtonStyle } from '../NavBarButton';

import classes from './NavBarTreasury.module.css';

interface NavBarTreasuryProps {
  treasuryBalance: string;
  treasuryStyle: NavBarButtonStyle;
}

const NavBarTreasury: React.FC<NavBarTreasuryProps> = ({ treasuryBalance, treasuryStyle }) => {
  let treasuryStyleClass;
  switch (treasuryStyle) {
    case NavBarButtonStyle.WARM_INFO:
      treasuryStyleClass = classes.warmInfo;
      break;
    case NavBarButtonStyle.COOL_INFO:
      treasuryStyleClass = classes.coolInfo;
      break;
    case NavBarButtonStyle.WHITE_INFO:
    default:
      treasuryStyleClass = classes.whiteInfo;
      break;
  }

  return (
    <div className={`${classes.wrapper} ${treasuryStyleClass}`}>
      <div className={classes.button}>
        <div
          className="d-flex justify-content-around flex-row"
          style={{
            paddingTop: '1px',
          }}
        >
          <div
            className={clsx(
              classes.treasuryHeader,
              treasuryStyle === NavBarButtonStyle.WHITE_INFO ? classes.whiteTreasuryHeader : '',
            )}
          >
            <Trans>Treasury</Trans>
          </div>
          <div className={classes.treasuryBalance}>Ξ {i18n.number(Number(treasuryBalance))}</div>
        </div>
      </div>
    </div>
  );
};

export default NavBarTreasury;
