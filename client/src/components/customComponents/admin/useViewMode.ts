'use client';

import { useEffect, useState } from 'react';
import { ViewMode } from './ViewToggle';

/**
 * Persists the admin card/table view mode in localStorage per page key.
 * This prevents the view from resetting when pagination changes the URL.
 */
export function useViewMode(
  storageKey: string
): [ViewMode, (mode: ViewMode) => void] {
  const [viewMode, setViewModeState] = useState<ViewMode>('table');

  // Read from localStorage once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`viewMode:${storageKey}`);
      if (stored === 'card' || stored === 'table') {
        setViewModeState(stored);
      }
    } catch {
      // ignore (SSR / private browsing)
    }
  }, [storageKey]);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    try {
      localStorage.setItem(`viewMode:${storageKey}`, mode);
    } catch {
      // ignore
    }
  };

  return [viewMode, setViewMode];
}
