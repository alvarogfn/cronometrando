import { useEffect } from "react";

function useKeyPress(
  targetKey: string,
  action: (event: KeyboardEvent) => void,
): void {
  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) action(event);
    };

    globalThis.addEventListener("keydown", downHandler);
    return (): void => {
      globalThis.removeEventListener("keydown", downHandler);
    };
  }, [action, targetKey]);
}

export default useKeyPress;
