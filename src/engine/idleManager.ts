import { useEffect, useRef, useState, useCallback } from 'react';

interface IdleManagerOptions {
  warningThresholdMs?: number; // default 45s
  resetThresholdMs?: number;   // default 60s
  onReset: () => void;
  enabled?: boolean;
}

export function useIdleTimer({
  warningThresholdMs = 45000,
  resetThresholdMs = 60000,
  onReset,
  enabled = true
}: IdleManagerOptions) {
  const [isWarning, setIsWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(15);
  const lastActivityRef = useRef<number>(Date.now());

  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    setIsWarning(false);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setIsWarning(false);
      return;
    }

    const handleUserActivity = () => {
      resetActivity();
    };

    const events = ['mousedown', 'touchstart', 'touchmove', 'keydown', 'scroll', 'pointerdown'];
    events.forEach((ev) => window.addEventListener(ev, handleUserActivity, { passive: true }));

    const checkInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;

      if (elapsed >= resetThresholdMs) {
        setIsWarning(false);
        onReset();
        lastActivityRef.current = Date.now();
      } else if (elapsed >= warningThresholdMs) {
        setIsWarning(true);
        const remaining = Math.ceil((resetThresholdMs - elapsed) / 1000);
        setSecondsRemaining(Math.max(1, remaining));
      } else {
        setIsWarning(false);
      }
    }, 1000);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleUserActivity));
      clearInterval(checkInterval);
    };
  }, [enabled, warningThresholdMs, resetThresholdMs, onReset, resetActivity]);

  return {
    isWarning,
    secondsRemaining,
    resetActivity
  };
}
