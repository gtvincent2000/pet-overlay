import {
  DEFAULT_TIMER_DURATION_SECONDS,
  isValidTimerDurationSeconds,
} from "./timerDuration";

const TIMER_DURATION_STORAGE_KEY = "timerDurationSeconds";

export function getStoredTimerDurationSeconds() {
  const savedValue = localStorage.getItem(TIMER_DURATION_STORAGE_KEY);

  if (!savedValue) {
    return DEFAULT_TIMER_DURATION_SECONDS;
  }

  const parsedValue = Number(savedValue);

  if (isValidTimerDurationSeconds(parsedValue)) {
    return parsedValue;
  }

  return DEFAULT_TIMER_DURATION_SECONDS;
}

export function saveTimerDurationSeconds(seconds: number) {
  if (!isValidTimerDurationSeconds(seconds)) {
    return;
  }

  localStorage.setItem(TIMER_DURATION_STORAGE_KEY, String(seconds));
}