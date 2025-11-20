import { getCurrentTimestamp } from "helpers/get-current-timestamp.ts";
import { useEffect, useState } from "react";

export const useCurrentTime = () => {
  const [now, setNow] = useState(getCurrentTimestamp());

  useEffect(() => {
    let timeoutId: number;

    const clock = () => {
      const currentTime = 1000 * getCurrentTimestamp();

      setNow(currentTime);

      timeoutId = setTimeout(clock, currentTime + 1000 - currentTime);
    };

    clock();

    return () => clearTimeout(timeoutId);
  }, []);

  return now;
};
