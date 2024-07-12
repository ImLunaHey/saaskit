'use client';
import { useCurrentLocale } from '@/locales/client';

/**
 * Adapted from https://stackoverflow.com/a/67374710/
 * source: https://stackoverflow.com/questions/67373795/how-to-use-intl-formatrelativetime-in-the-correct-way
 */
const millisecondsPerSecond = 1000;
const secondsPerMinute = 60;
const minutesPerHour = 60;
const hoursPerDay = 24;
const daysPerWeek = 7;

const formatRelativeTime = (locale: string, createTime: Date) => {
  const relativeDateFormat = new Intl.RelativeTimeFormat(locale, { style: 'long' });
  const diff = createTime.getTime() - new Date().getTime();
  const intervals = {
    week: millisecondsPerSecond * secondsPerMinute * minutesPerHour * hoursPerDay * daysPerWeek,
    day: millisecondsPerSecond * secondsPerMinute * minutesPerHour * hoursPerDay,
    hour: millisecondsPerSecond * secondsPerMinute * minutesPerHour,
    minute: millisecondsPerSecond * secondsPerMinute,
    second: millisecondsPerSecond,
  } as const;
  for (const interval in intervals) {
    if (intervals[interval as keyof typeof intervals] <= Math.abs(diff)) {
      return relativeDateFormat.format(
        Math.trunc(diff / intervals[interval as keyof typeof intervals]),
        interval as Intl.RelativeTimeFormatUnit,
      );
    }
  }
  return relativeDateFormat.format(diff / 1000, 'second');
};

export const RelativeDate = ({ date }: { date: Date }) => {
  const locale = useCurrentLocale();
  return <div>{formatRelativeTime(locale, date)}</div>;
};
