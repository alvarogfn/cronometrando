import type {MutableRefObject, Ref, RefCallback} from "react";

import {
  
  
  
  useMemo
} from "react";

const setRef = <T>(
  ref:
    | ((instance: null | T) => void)
    | MutableRefObject<null | T>
    | null
    | undefined,
  value: null | T,
) => {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
};

export const useForkRef = <Instance>(
  ...refs: Array<Ref<Instance> | undefined>
): null | RefCallback<Instance> => {
  /**
   * This will create a new function if the refs passed to this hook change and are all defined.
   * This means react will call the old forkRef with `null` and the new forkRef
   * with the ref. Cleanup naturally emerges from this behavior.
   */

  // biome-ignore lint/correctness/useExhaustiveDependencies: no need for rerenders
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }

    return (instance) => {
      for (const ref of refs) {
        setRef(ref, instance);
      }
    };
  }, refs);
};
