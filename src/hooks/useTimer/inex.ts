import { useEffect, useRef, useState } from "react";
import { TIME_IN_MS } from "../../constants";

export const useTimer = (initialSeconds: number) => {
  const [time, setTime] = useState<number>(initialSeconds);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const initialTimeRef = useRef<number>(initialSeconds);

  useEffect(() => {
    if (isActive && !isPaused) {
      startTimeRef.current = startTimeRef.current ?? Date.now();

      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / TIME_IN_MS.SECOND);
          setTime(initialTimeRef.current + elapsed);
        }
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    } else if (isPaused || !isActive) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused]);

  const start = () => {
    setIsActive(true);
    setIsPaused(false);
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }
  };

  const pause = () => {
    setIsPaused(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const stop = () => {
    setIsActive(false);
    setIsPaused(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    startTimeRef.current = null;
  };

  return {
    time,
    isActive,
    isPaused,
    start,
    pause,
    stop,
  };
};
