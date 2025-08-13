'use client';

import { useBreakpointValues } from '@/hooks/useBreakpointValues';

const CalendarPage = () => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const mode =
    useBreakpointValues({
      sm: 'MONTH',
    }) ?? 'AGENDA';

  const calendarParams = {
    wkst: '1',
    ctz: userTimezone,
    showPrint: '0',
    showCalendars: '0',
    showTabs: '1',
    showDate: '1',
    mode,
    showTitle: '1',
    src: 'Zjc2MjVjNjdiZDFiZGZjYWQ2YWM0ZjYyOGJkYzg5YzMzMTg4MzY5YTUzMzJiOTU3Mzk0NzZkYWI1MjFlYTkwYUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t',
    color: '#f6bf26',
  };

  const queryString = new URLSearchParams(calendarParams).toString();

  return (
    <div className="container-xl mt-6">
      <h1>Calendar</h1>
      {/* eslint-disable-next-line @eslint-react/dom/no-missing-iframe-sandbox */}
      <iframe
        src={`https://calendar.google.com/calendar/embed?${queryString}`}
        className="mx-auto mt-4 h-[600px] w-full max-w-[calc(100%-20px)]"
      />
    </div>
  );
};

export default CalendarPage;
