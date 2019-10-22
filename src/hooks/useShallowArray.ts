import { useEffect, useRef } from 'react';

function isShallowEqual<T>(xs: T[], ys: T[]): boolean {
  if (xs.length !== ys.length) {
    return false;
  }

  const length = xs.length;
  for (let i = 0; i < length; i += 1) {
    if (xs[i] !== ys[i]) {
      return false;
    }
  }

  return true;
}

export function useShallowArray<T>(values: T[]): T[] {
  const ref = useRef(values);
  useEffect(() => {
    if (!isShallowEqual(values, ref.current)) {
      ref.current = values;
    }
  }, [values]);
  return ref.current;
}
