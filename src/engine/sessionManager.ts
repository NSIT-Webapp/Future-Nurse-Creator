/**
 * sessionManager.ts
 * Manages a session counter for deterministic tie-breaking.
 * Increments on each new game session (Welcome screen reset).
 * Stored in sessionStorage so it persists across refreshes within the same browser session
 * but resets when the tab is closed.
 *
 * Used as: sessionId % numTiedPaths  → deterministic, not random()
 */

const SESSION_KEY = 'fnc_session_counter';

export function getSessionId(): number {
  const stored = sessionStorage.getItem(SESSION_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

export function incrementSession(): number {
  const next = getSessionId() + 1;
  sessionStorage.setItem(SESSION_KEY, String(next));
  return next;
}
