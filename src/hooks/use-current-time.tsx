import {useEffect, useState} from "react";

export const getCurrentTime = () => {
  return 1000 * Math.floor(Date.now() / 1000 + 0.1)
}

export const getNextHourTimestamp = () => {
  const date = new Date();
  const currentHours = date.getHours();

  date.setHours(currentHours + 1)
  date.setMinutes(0)
  date.setSeconds(0)

  return date.getTime();
}

export const getNextMinuteTimestamp = () => {
  const date = new Date();
  const currentMinutes = date.getMinutes();

  date.setMinutes(currentMinutes + 1)
  date.setSeconds(0)
  return date.getTime();
}

export const subtractTimestamp = (first: number, second: number) => {
  return Math.ceil((first - second) / 1000);
}

export const useCurrentTime = () => {
  const [now, setNow] = useState(getCurrentTime())

  useEffect(() => {
    let timeoutId: number

    const clock = () => {
      const currentTime = getCurrentTime();

      setNow(currentTime)

      timeoutId = setTimeout(clock, (currentTime + 1000) - currentTime)
    }

    clock()

    return () => clearTimeout(timeoutId)
  }, [])

  return now
}