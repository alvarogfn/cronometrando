import { useEffect } from "react";

function useKeyPress(
  targetKey: string,
  action: (event: KeyboardEvent) => void,
): void {
  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) action(event);
    };

    window.addEventListener("keydown", downHandler);
    return (): void => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [action, targetKey]);
}

export default useKeyPress;
