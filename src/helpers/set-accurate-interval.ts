import type { Fn } from "./types.ts";

const getCurrentTime = () => {
  return 1000 * Math.floor(Date.now() / 1000 + 0.1);
};
/* https://gist.github.com/AlexJWayne/1d99b3cd81d610ac7351 */
export function setAccurateInterval(callback: Fn, time: number): Fn {
  let nextAt = getCurrentTime() + 1000;
  let timeout = 0;

  const clock = () => {
    nextAt += time;
    timeout = setTimeout(clock, nextAt - getCurrentTime());
    return callback();
  };

  timeout = setTimeout(clock, nextAt - getCurrentTime());

  return () => {
    return clearTimeout(timeout);
  };
}
