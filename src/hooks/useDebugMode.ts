import { useMemo } from 'react';

/**
 * useDebugMode
 *
 * Returns true when the debug panel should be shown.
 *
 * Conditions:
 *   1. Running in Vite dev mode (import.meta.env.DEV)
 *   2. OR URL contains ?debug=1  ← works on production kiosk for testing
 *
 * In production without ?debug=1, always returns false.
 * The debug panel has zero effect on scoring, state, or navigation.
 *
 * Usage on kiosk during testing:
 *   Navigate to: http://localhost:4173/?debug=1
 */
export function useDebugMode(): boolean {
  return useMemo(() => {
    if (import.meta.env.DEV) return true;
    const params = new URLSearchParams(window.location.search);
    return params.get('debug') === '1';
  }, []);
}
