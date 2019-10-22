import { useEffect, useRef } from 'react';

const DELAY = 400;

function debounce(callback: () => void, delay: number): () => void {
  let timeoutId: number | null = null;
  function reset() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }
  function debounced() {
    reset();
    timeoutId = setTimeout(() => {
      callback();
    }, delay);
    return reset;
  }
  return debounced;
}

export function useResize(callback: () => void): void {
  const ref = useRef(callback);

  useEffect(() => {
    ref.current = callback;
  }, [ref, callback]);

  useEffect(() => {
    const handleResize = debounce(() => {
      ref.current();
    }, DELAY);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);
}
