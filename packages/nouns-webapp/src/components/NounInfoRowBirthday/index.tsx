import { BigNumber } from '@ethersproject/bignumber';
import React from 'react';
import { isNounderBRBRNounBR } from '../../utils/nounderbrNounBR';

import classes from './NounBRInfoRowBirthday.module.css';
import _BirthdayIcon from '../../assets/icons/Birthday.svg';

import { Image } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import { AuctionState } from '../../state/slices/auction';
import { Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';

interface NounBRInfoRowBirthdayProps {
  nounbrId: number;
}

export const getNounBRBirthday = (nounbrId: number, pastAuctions: AuctionState[]) => {
  return BigNumber.from(
    pastAuctions.find((auction: AuctionState, i: number) => {
      const maybeNounBRId = auction.activeAuction?.nounbrId;
      return maybeNounBRId ? BigNumber.from(maybeNounBRId).eq(BigNumber.from(nounbrId)) : false;
    })?.activeAuction?.startTime || 0,
  );
};

const NounBRInfoRowBirthday: React.FC<NounBRInfoRowBirthdayProps> = props => {
  const { nounbrId } = props;

  // If the nounbr is a nounderbr nounbr, use the next nounbr to get the mint date.
  // We do this because we use the auction start time to get the mint date and
  // nounderbr nounsbr do not have an auction start time.
  const nounbrIdForQuery = isNounderBRBRNounBR(BigNumber.from(nounbrId)) ? nounbrId + 1 : nounbrId;

  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);
  if (!pastAuctions || !pastAuctions.length) {
    return <></>;
  }

  const startTime = getNounBRBirthday(nounbrIdForQuery, pastAuctions);
  if (!startTime) {
    return <Trans>Error fetching NounBR birthday</Trans>;
  }

  const birthday = new Date(Number(startTime._hex) * 1000);

  return (
    <div className={classes.birthdayInfoContainer}>
      <span>
        <Image src={_BirthdayIcon} className={classes.birthdayIcon} />
      </span>
      <Trans>Born</Trans>
      <span className={classes.nounbrInfoRowBirthday}>
        {i18n.date(birthday, { month: 'long', year: 'numeric', day: '2-digit' })}
      </span>
    </div>
  );
};

export default NounBRInfoRowBirthday;
