export const DEFAULT_TIMER_DURATION_SECONDS = 25 * 60;

export const MIN_TIMER_DURATION_SECONDS = 1;
export const MAX_TIMER_DURATION_SECONDS = 99 * 60 + 59;

export function isValidTimerDurationSeconds(seconds: number) {
  return (
    Number.isInteger(seconds) &&
    seconds >= MIN_TIMER_DURATION_SECONDS &&
    seconds <= MAX_TIMER_DURATION_SECONDS
  );
}

export function parseTimerDurationInput(input: string): number | null {
  const trimmedInput = input.trim();

  if (trimmedInput.length === 0) {
    return null;
  }

  if (trimmedInput.includes(":")) {
    const parts = trimmedInput.split(":");

    if (parts.length !== 2) {
      return null;
    }

    const [minutesText, secondsText] = parts;

    if (!/^\d+$/.test(minutesText) || !/^\d+$/.test(secondsText)) {
      return null;
    }

    const minutes = Number(minutesText);
    const seconds = Number(secondsText);

    if (seconds > 59) {
      return null;
    }

    const totalSeconds = minutes * 60 + seconds;

    return isValidTimerDurationSeconds(totalSeconds) ? totalSeconds : null;
  }

  if (!/^\d+$/.test(trimmedInput)) {
    return null;
  }

  const minutes = Number(trimmedInput);
  const totalSeconds = minutes * 60;

  return isValidTimerDurationSeconds(totalSeconds) ? totalSeconds : null;
}