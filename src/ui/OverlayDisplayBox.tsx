import { getDayPhaseForDate } from "../data/dayPhases";
import type { OverlayDisplayMode } from "../data/overlayDisplay";

type OverlayDisplayBoxProps = {
  currentDate: Date;
  displayMode: OverlayDisplayMode;
  onToggleDisplayMode: () => void;
  children: React.ReactNode;
};

export default function OverlayDisplayBox({
  currentDate,
  displayMode,
  onToggleDisplayMode,
  children,
}: OverlayDisplayBoxProps) {
  const dayPhase = getDayPhaseForDate(currentDate);

  const toggleLabel =
    displayMode === "clock" ? "Switch to timer" : "Switch to clock";

  const toggleText = displayMode === "clock" ? "⏱" : "🕒";

  return (
    <div
      className="overlay-display-box"
      style={{
        backgroundImage: `url("${dayPhase.containerImagePath}")`,
      }}
    >
      <div className="overlay-display-content">
        <span className="overlay-display-time">{children}</span>

        <button
            className="overlay-display-mode-button"
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