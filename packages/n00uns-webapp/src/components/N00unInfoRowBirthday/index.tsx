import { BigNumber } from '@ethersproject/bignumber';
import React from 'react';
import { isN00underN00un } from '../../utils/n00underN00un';

import classes from './N00unInfoRowBirthday.module.css';
import _BirthdayIcon from '../../assets/icons/Birthday.svg';

import { Image } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import { AuctionState } from '../../state/slices/auction';
import { Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';

interface N00unInfoRowBirthdayProps {
  n00unId: number;
}

export const getN00unBirthday = (n00unId: number, pastAuctions: AuctionState[]) => {
  return BigNumber.from(
    pastAuctions.find((auction: AuctionState, i: number) => {
      const maybeN00unId = auction.activeAuction?.n00unId;
      return maybeN00unId ? BigNumber.from(maybeN00unId).eq(BigNumber.from(n00unId)) : false;
    })?.activeAuction?.startTime || 0,
  );
};

const N00unInfoRowBirthday: React.FC<N00unInfoRowBirthdayProps> = props => {
  const { n00unId } = props;

  // If the n00un is a n00under n00un, use the next n00un to get the mint date.
  // We do this because we use the auction start time to get the mint date and
  // n00under n00uns do not have an auction start time.
  const n00unIdForQuery = isN00underN00un(BigNumber.from(n00unId)) ? n00unId + 1 : n00unId;

  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);
  if (!pastAuctions || !pastAuctions.length) {
    return <></>;
  }

  const startTime = getN00unBirthday(n00unIdForQuery, pastAuctions);
  if (!startTime) {
    return <Trans>Error fetching N00un birthday</Trans>;
  }

  const birthday = new Date(Number(startTime._hex) * 1000);

  return (
    <div className={classes.birthdayInfoContainer}>
      <span>
        <Image src={_BirthdayIcon} className={classes.birthdayIcon} />
      </span>
      <Trans>Born</Trans>
      <span className={classes.n00unInfoRowBirthday}>
        {i18n.date(birthday, { month: 'long', year: 'numeric', day: '2-digit' })}
      </span>
    </div>
  );
};

export default N00unInfoRowBirthday;
