import { useEffect } from 'react';

export const useKeyDown = (
  { key, meta, shift }: { key: string; meta?: boolean; shift?: boolean },
  onKeyDown: () => void,
) => {
  return useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const keyMatch = e.key === key;
      const shiftMatch = shift ? e.shiftKey : true;
      const metaMatch = meta ? e.metaKey || e.ctrlKey : true;
      if (keyMatch && shiftMatch && metaMatch) {
        e.preventDefault();
        onKeyDown();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [key, onKeyDown, meta, shift]);
};
