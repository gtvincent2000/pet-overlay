import { getDayPhaseForDate } from "../data/dayPhases";
import type { OverlayDisplayMode } from "../data/overlayDisplay";

type TimerControls = {
  isRunning: boolean;
  isComplete: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
};

type OverlayDisplayBoxProps = {
  currentDate: Date;
  displayMode: OverlayDisplayMode;
  onToggleDisplayMode: () => void;
  timerControls: TimerControls;
  children: React.ReactNode;
};

export default function OverlayDisplayBox({
  currentDate,
  displayMode,
  onToggleDisplayMode,
  timerControls,
  children,
}: OverlayDisplayBoxProps) {
  const dayPhase = getDayPhaseForDate(currentDate);

  const toggleLabel =
    displayMode === "clock" ? "Switch to timer" : "Switch to clock";

  const toggleText = displayMode === "clock" ? "⏱" : "◷";

  return (
    <div
      className="overlay-display-box"
      style={{
        backgroundImage: `url("${dayPhase.containerImagePath}")`,
      }}
    >
      <div className="overlay-display-content">
        <span className="overlay-display-time">{children}</span>

        {displayMode === "timer" && (
          <div className="overlay-timer-controls">
            <button
              className="overlay-hud-button"
              type="button"
              aria-label={timerControls.isRunning ? "Pause timer" : "Start timer"}
              data-overlay-interactive="true"
              onClick={(event) => {
                event.stopPropagation();

                if (timerControls.isRunning) {
                  timerControls.onPause();
                } else {
                  timerControls.onStart();
                }
              }}
            >
              {timerControls.isRunning ? "Ⅱ" : "▶"}
            </button>

            <button
              className="overlay-hud-button"
              type="button"
              aria-label="Reset timer"
              data-overlay-interactive="true"
              onClick={(event) => {
                event.stopPropagation();
                timerControls.onReset();
              }}
            >
              ↺
            </button>
          </div>
        )}

        <button
          className="overlay-hud-button overlay-display-mode-button"
          type="button"
          aria-label={toggleLabel}
          data-overlay-interactive="true"
          onClick={(event) => {
            event.stopPropagation();
            onToggleDisplayMode();
          }}
        >
          {toggleText}
        </button>
      </div>
    </div>
  );
}