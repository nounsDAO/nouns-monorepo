import { useQuery } from '@apollo/client';
import { BigNumber } from '@ethersproject/bignumber';
import React from 'react';
import { isNounderNoun } from '../../utils/nounderNoun';
import { auctionQuery } from '../../wrappers/subgraph';

import classes from './NounInfoRowBirthday.module.css';
import _BirthdayIcon from '../../assets/icons/Birthday.svg';

import { Image } from 'react-bootstrap';

interface NounInfoRowBirthdayProps {
  nounId: number;
}

const NounInfoRowBirthday: React.FC<NounInfoRowBirthdayProps> = props => {
  const { nounId } = props;

  // If the noun is a nounder noun, use the next noun to get the mint date.
  // We do this because we use the auction start time to get the mint date and
  // nounder nouns do not have an auction start time.
  var nounIdForQuery = isNounderNoun(BigNumber.from(nounId)) ? nounId + 1 : nounId;

  const { loading, error, data } = useQuery(auctionQuery(nounIdForQuery));
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

  if (loading) {
    return <></>;
  } else if (error) {
    return <div>Failed to fetch noun auction info</div>;
  }

  const birthday = new Date(data.auction.startTime * 1000);

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
