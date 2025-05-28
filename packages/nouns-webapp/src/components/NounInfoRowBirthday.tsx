import React from 'react';

import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';

import { useAppSelector } from '@/hooks';
import { cn } from '@/lib/utils';
import { AuctionState } from '@/state/slices/auction';
import { isNounderNoun } from '@/utils/nounderNoun';

interface NounInfoRowBirthdayProps {
  nounId: bigint;
  className?: string;
}

export const getNounBirthday = (nounId: bigint, pastAuctions: AuctionState[]) => {
  return BigInt(
    pastAuctions.find((auction: AuctionState) => {
      const maybeNounId = auction.activeAuction?.nounId;
      return maybeNounId ? BigInt(maybeNounId) === BigInt(nounId) : false;
    })?.activeAuction?.startTime || 0,
  );
};

const NounInfoRowBirthday: React.FC<NounInfoRowBirthdayProps> = ({ nounId, className }) => {
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
    <span className={cn('text-muted-foreground block', className)}>
      <Trans>Born {i18n.date(birthday, { month: 'long', year: 'numeric', day: '2-digit' })}</Trans>
    </span>
  );
};

export default NounInfoRowBirthday;
