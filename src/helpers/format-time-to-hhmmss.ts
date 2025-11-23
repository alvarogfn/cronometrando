const pad = (value: number): string => value.toString().padStart(2, "0");

export function formatTimeToHHMMSS(timeInSeconds: number) {
  let remaining = timeInSeconds;

  const hours = Math.floor(remaining / 60 / 60);
  remaining = remaining - hours * 60 * 60;

  const minutes = Math.floor(remaining / 60);
  remaining = remaining - minutes * 60;

  return `${pad(hours)}:${pad(minutes)}:${pad(remaining)}`;
}
