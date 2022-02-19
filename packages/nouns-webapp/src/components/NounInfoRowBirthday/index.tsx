import { BigNumber } from '@ethersproject/bignumber';
import React from 'react';
import { isNounderNoun } from '../../utils/nounderNoun';

import classes from './NounInfoRowBirthday.module.css';
import _BirthdayIcon from '../../assets/icons/Birthday.svg';

import { Image } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import { AuctionState } from '../../state/slices/auction';

interface NounInfoRowBirthdayProps {
  nounId: number;
}

const NounInfoRowBirthday: React.FC<NounInfoRowBirthdayProps> = props => {
  const { nounId } = props;

  // If the noun is a nounder noun, use the next noun to get the mint date.
  // We do this because we use the auction start time to get the mint date and
  // nounder nouns do not have an auction start time.
  const nounIdForQuery = isNounderNoun(BigNumber.from(nounId)) ? nounId + 1 : nounId;

  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);
  if (!pastAuctions || !pastAuctions.length) {
    return <></>;
  }

  const startTime = BigNumber.from(
    pastAuctions.find((auction: AuctionState, i: number) => {
      const maybeNounId = auction.activeAuction?.nounId;
      return maybeNounId ? BigNumber.from(maybeNounId).eq(BigNumber.from(nounIdForQuery)) : false;
    })?.activeAuction?.startTime,
  );

  if (!startTime) {
    return <>Error fetching noun birthday</>;
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const birthday = new Date(Number(startTime._hex) * 1000);

  return (
    <div className={classes.birthdayInfoContainer}>
      <span>
        <Image src={_BirthdayIcon} className={classes.birthdayIcon} />
      </span>
      Born
      <span className={classes.nounInfoRowBirthday}>
        {monthNames[birthday.getUTCMonth()]} {birthday.getUTCDate()}, {birthday.getUTCFullYear()}
      </span>
    </div>
  );
};

export default NounInfoRowBirthday;
