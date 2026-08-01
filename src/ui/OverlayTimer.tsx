import { formatTimerText } from "../hooks/useCountdownTimer";

type OverlayTimerProps = {
  remainingSeconds: number;
};

export default function OverlayTimer({ remainingSeconds }: OverlayTimerProps) {
  return <>{formatTimerText(remainingSeconds)}</>;
}