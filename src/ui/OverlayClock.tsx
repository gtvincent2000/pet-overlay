import { useEffect, useState } from "react";
import { getDayPhaseForDate } from "../data/dayPhases";

function getCurrentDate() {
  return new Date();
}

function getCurrentTimeText(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function OverlayClock() {
  const [currentDate, setCurrentDate] = useState(getCurrentDate);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentDate(getCurrentDate());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const dayPhase = getDayPhaseForDate(currentDate);
  const timeText = getCurrentTimeText(currentDate);

  return (
    <div
      className="overlay-display-box"
      style={{
        backgroundImage: `url("${dayPhase.containerImagePath}")`,
      }}
    >
      <div className="overlay-display-text">{timeText}</div>
    </div>
  );
}