import React from 'react';

import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';
import { Image } from 'react-bootstrap';

import _BirthdayIcon from '@/assets/icons/Birthday.svg';
import { useAppSelector } from '@/hooks';
import { AuctionState } from '@/state/slices/auction';
import { isNounderNoun } from '@/utils/nounderNoun';

import classes from './NounInfoRowBirthday.module.css';

interface NounInfoRowBirthdayProps {
  nounId: bigint;
}

export const getNounBirthday = (nounId: bigint, pastAuctions: AuctionState[]) => {
  return BigInt(
    pastAuctions.find((auction: AuctionState) => {
      const maybeNounId = auction.activeAuction?.nounId;
      return maybeNounId ? BigInt(maybeNounId) === BigInt(nounId) : false;
    })?.activeAuction?.startTime || 0,
  );
};

const NounInfoRowBirthday: React.FC<NounInfoRowBirthdayProps> = ({ nounId }) => {

  // If the noun is a nounder noun, use the next noun to get the mint date.
  // We do this because we use the auction start time to get the mint date and
  // nounder nouns do not have an auction start time.
  const nounIdForQuery = isNounderNoun(nounId) ? nounId + 1n : nounId;

  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);
  if (!pastAuctions || !pastAuctions.length) {
    return <></>;
  }

  const startTime = getNounBirthday(nounIdForQuery, pastAuctions);
  if (!startTime) {
    return <Trans>Error fetching Noun birthday</Trans>;
  }

  const birthday = new Date(Number(startTime) * 1000);

  return (
    <div className={classes.birthdayInfoContainer}>
      <span>
        <Image src={_BirthdayIcon} className={classes.birthdayIcon} />
      </span>
      <Trans>Born</Trans>
      <span className={classes.nounInfoRowBirthday}>
        {i18n.date(birthday, { month: 'long', year: 'numeric', day: '2-digit' })}
      </span>
    </div>
  );
};

export default NounInfoRowBirthday;
