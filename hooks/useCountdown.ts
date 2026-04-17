'use client';

import { useState, useEffect, useRef } from 'react';

export function useCountdown(targetTime: Date | null, onExpire?: () => void) {
  const [seconds, setSeconds] = useState(0);
  const cbRef = useRef(onExpire);
  cbRef.current = onExpire;

  useEffect(() => {
    if (!targetTime) return;
    const calc = () => Math.max(0, Math.floor((targetTime.getTime() - Date.now()) / 1000));
    setSeconds(calc());
    const id = setInterval(() => {
      const s = calc();
      setSeconds(s);
      if (s === 0) { clearInterval(id); cbRef.current?.(); }
    }, 1000);
    return () => clearInterval(id);
  }, [targetTime]);

  return seconds;
}