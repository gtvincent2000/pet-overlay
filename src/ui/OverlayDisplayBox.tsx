import { getDayPhaseForDate } from "../data/dayPhases";

type OverlayDisplayBoxProps = {
  currentDate: Date;
  children: React.ReactNode;
};

export default function OverlayDisplayBox({
  currentDate,
  children,
}: OverlayDisplayBoxProps) {
  const dayPhase = getDayPhaseForDate(currentDate);

  return (
    <div
      className="overlay-display-box"
      style={{
        backgroundImage: `url("${dayPhase.containerImagePath}")`,
      }}
    >
      <div className="overlay-display-text">{children}</div>
    </div>
  );
}