import dayjs from 'dayjs';
import { Trans } from '@lingui/macro';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const getCountdownCopy = (startTime: number, endTime: number) => {
  const startDate = dayjs.unix(startTime);
  const endDate = dayjs.unix(endTime);

  const now = dayjs();

  if (startDate?.isBefore(now) && endDate?.isAfter(now)) {
    return <Trans>ends {endDate.fromNow()}</Trans>;
  }

  return <Trans>starts {dayjs(startDate).fromNow()}</Trans>;
};

export interface StartOrEndTimeProps {
  startTime?: number;
  endTime?: number;
}

export default function StartOrEndTime({ startTime, endTime }: StartOrEndTimeProps) {
  return <>{getCountdownCopy(startTime ?? 0, endTime ?? 0)}</>;
}
