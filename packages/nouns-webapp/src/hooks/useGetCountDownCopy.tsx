import { Trans } from '@lingui/macro';
import dayjs, { locale } from 'dayjs';
import { useEffect, useState } from 'react';
import { SupportedLocale, SUPPORTED_LOCALE_TO_DAYSJS_LOCALE } from '../i18n/locales';
import { AVERAGE_BLOCK_TIME_IN_SECS } from '../utils/constants';
import { PartialProposal } from '../wrappers/nounsDao';
import en from 'dayjs/locale/en';

/**
 * A function that takes a proposal and block number and returns the timestamp of the event
 * @param proposal partial proposal object to retrieve the timestamp for
 * @param currentBlock target block number to base the timestamp off of
 * @returns string with the event timestamp
 */
export const useGetCountdownCopy = (
  proposal: PartialProposal,
  currentBlock: number,
  locale: SupportedLocale,
) => {
  const timestamp = Date.now();
  const startDate =
    proposal && timestamp && currentBlock
      ? dayjs(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * (proposal.startBlock - currentBlock),
          'seconds',
        )
      : undefined;

  const endDate =
    proposal && timestamp && currentBlock
      ? dayjs(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * (proposal.endBlock - currentBlock),
          'seconds',
        )
      : undefined;

  const expiresDate = proposal && dayjs(proposal.eta).add(14, 'days');

  const now = dayjs();

  if (startDate?.isBefore(now) && endDate?.isAfter(now)) {
    return (
      <Trans>
        Ends {endDate.locale(SUPPORTED_LOCALE_TO_DAYSJS_LOCALE[locale] || en).fromNow()}
      </Trans>
    );
  }
  if (endDate?.isBefore(now)) {
    return (
      <Trans>
        Expires {expiresDate.locale(SUPPORTED_LOCALE_TO_DAYSJS_LOCALE[locale] || en).fromNow()}
      </Trans>
    );
  }
  return (
    <Trans>
      Starts{' '}
      {dayjs(startDate)
        .locale(SUPPORTED_LOCALE_TO_DAYSJS_LOCALE[locale] || en)
        .fromNow()}
    </Trans>
  );
};
