import dayjs from 'dayjs';
import { Trans } from '@lingui/macro';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const getCountdownCopy = (startTime: number, endTime: number) => {
  const startDate = dayjs.unix(startTime);
  const endDate = dayjs.unix(endTime);

  const now = dayjs();

  if (now?.isBefore(startDate)) {
    return <Trans>starts {endDate.fromNow()}</Trans>;
  } else if (now?.isBefore(endDate)) {
    return <Trans>ends {dayjs(endDate).fromNow()}</Trans>;
  } else {
    return <Trans>ended {dayjs(endDate).fromNow()}</Trans>;
  }
};

export interface StartOrEndTimeProps {
  startTime?: number;
  endTime?: number;
}

export default function StartOrEndTime({ startTime, endTime }: StartOrEndTimeProps) {
  return <>{getCountdownCopy(startTime ?? 0, endTime ?? 0)}</>;
}
