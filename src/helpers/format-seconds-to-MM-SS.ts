import { intervalToDuration } from "date-fns";

export function formatSecondsToMMSS(seconds: number) {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

  const pad = (num: number = 0) => String(num).padStart(1, "0");

  return `${pad(duration.minutes)}m ${pad(duration.seconds)}s`;
}
