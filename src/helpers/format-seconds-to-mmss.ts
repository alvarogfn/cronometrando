import { intervalToDuration } from "date-fns";

const pad = (num: number = 0) => String(num).padStart(1, "0");

export function formatSecondsToMMSS(seconds: number) {
  const duration = intervalToDuration({ end: seconds * 1000, start: 0 });

  return `${pad(duration.minutes)}m ${pad(duration.seconds)}s`;
}
