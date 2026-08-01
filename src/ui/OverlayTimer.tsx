import {
  formatTimerText,
  useCountdownTimer,
} from "../hooks/useCountdownTimer";

const DEFAULT_TIMER_SECONDS = 25 * 60; // 25 minutes

export default function OverlayTimer() {
  const { remainingSeconds } = useCountdownTimer({
    initialSeconds: DEFAULT_TIMER_SECONDS,
    autoStart: true,
  });

  return <>{formatTimerText(remainingSeconds)}</>;
}