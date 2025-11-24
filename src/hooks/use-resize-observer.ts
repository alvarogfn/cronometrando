import type { RefObject } from "react";

import { useEffect } from "react";

export function useResizeObserver(
  elementRef: RefObject<HTMLElement | null>,
  callback?: (entries: ResizeObserverEntry[]) => void,
) {
  useEffect(() => {
    if (!elementRef?.current) return;

    const resizeObserver = new ResizeObserver((entries) => callback?.(entries));
    resizeObserver.observe(elementRef.current);
    return () => resizeObserver.disconnect();
  }, [elementRef]);
}
