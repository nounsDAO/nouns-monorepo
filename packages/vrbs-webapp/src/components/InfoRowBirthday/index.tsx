import { BigNumber } from '@ethersproject/bignumber';
import React from 'react';
import { isFounderVrb } from '../../utils/founderVrb';

import classes from './InfoRowBirthday.module.css';
import _BirthdayIcon from '../../assets/icons/Birthday.svg';

import { Image } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import { AuctionState } from '../../state/slices/auction';
import { Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';

interface InfoRowBirthdayProps {
  vrbId: number;
}

export const getVrbBirthday = (vrbId: number, pastAuctions: AuctionState[]) => {
  return BigNumber.from(
    pastAuctions.find((auction: AuctionState, i: number) => {
      const maybeVrbId = auction.activeAuction?.vrbId;
      return maybeVrbId ? BigNumber.from(maybeVrbId).eq(BigNumber.from(vrbId)) : false;
    })?.activeAuction?.startTime || 0,
  );
};

const InfoRowBirthday: React.FC<InfoRowBirthdayProps> = props => {
  const { vrbId } = props;

  // If the vrb is a vrbder vrb, use the next vrb to get the mint date.
  // We do this because we use the auction start time to get the mint date and
  // vrbder vrbs do not have an auction start time.
  const vrbIdForQuery = isFounderVrb(BigNumber.from(vrbId)) ? vrbId + 1 : vrbId;

  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);
  if (!pastAuctions || !pastAuctions.length) {
    return <></>;
  }

  const startTime = getVrbBirthday(vrbIdForQuery, pastAuctions);
  if (!startTime) {
    return <Trans>Error fetching Vrb birthday</Trans>;
  }

  const birthday = new Date(Number(startTime._hex) * 1000);

  return (
    <div className={classes.birthdayInfoContainer}>
      <span>
        <Image src={_BirthdayIcon} className={classes.birthdayIcon} />
      </span>
      <Trans>Born</Trans>
      <span className={classes.vrbInfoRowBirthday}>
        {i18n.date(birthday, { month: 'long', year: 'numeric', day: '2-digit' })}
      </span>
    </div>
  );
};

export default InfoRowBirthday;
