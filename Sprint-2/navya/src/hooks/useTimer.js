/**
 * Countdown Timer Hook for Aptitude Assessment Engine
 * Author: NAVYA R (PES2UG24CS308)
 */

import { useState, useEffect, useCallback } from 'react';

export function useTimer(initialSeconds, onExpire) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, secondsLeft, onExpire]);

  const start = useCallback((customSeconds) => {
    if (typeof customSeconds === 'number') setSecondsLeft(customSeconds);
    setRunning(true);
  }, []);

  const stop = useCallback(() => setRunning(false), []);

  const formattedTime = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;

  return { secondsLeft, formattedTime, running, start, stop };
}
