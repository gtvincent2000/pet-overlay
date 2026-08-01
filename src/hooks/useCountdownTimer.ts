import { useEffect, useState } from "react";

type UseCountdownTimerOptions = {
  initialSeconds: number;
  autoStart?: boolean;
};

export function formatTimerText(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);

  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function useCountdownTimer({
  initialSeconds,
  autoStart = false,
}: UseCountdownTimerOptions) {
  const [durationSeconds, setDurationSeconds] = useState(initialSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);

  const isComplete = remainingSeconds === 0;

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((currentRemainingSeconds) => {
        if (currentRemainingSeconds <= 1) {
          setIsRunning(false);
          return 0;
        }

        return currentRemainingSeconds - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isRunning]);

  function start() {
    if (remainingSeconds === 0) {
      setRemainingSeconds(durationSeconds);
    }

    setIsRunning(true);
  }

  function pause() {
    setIsRunning(false);
  }

  function reset() {
    setIsRunning(false);
    setRemainingSeconds(durationSeconds);
  }

  function setDuration(newDurationSeconds: number) {
    setIsRunning(false);
    setDurationSeconds(newDurationSeconds);
    setRemainingSeconds(newDurationSeconds);
  }

  return {
    durationSeconds,
    remainingSeconds,
    isRunning,
    isComplete,
    start,
    pause,
    reset,
    setDuration,
  };
}