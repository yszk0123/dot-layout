import { useEffect } from 'react';

interface Options {
  onKeyDown: (event: KeyboardEvent) => void;
}

export function useGlobalKeyboard({ onKeyDown }: Options): void {
  useEffect(() => {
    const element = document.body;

    function handleKeyDown(event: KeyboardEvent): void {
      // Call onKeyDown only when no elements are focused
      if (event.target === element) {
        onKeyDown(event);
      }
    }

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [onKeyDown]);
}
