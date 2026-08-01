import { useEffect, useState } from "react";
import { DEFAULT_OVERLAY_DISPLAY_MODE } from "../data/OverlayDisplay";
import OverlayClock from "./OverlayClock";
import OverlayDisplayBox from "./OverlayDisplayBox";
import OverlayTimer from "./OverlayTimer";

function getCurrentDate() {
  return new Date();
}

export default function OverlayStatusDisplay() {
  const [currentDate, setCurrentDate] = useState(getCurrentDate);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentDate(getCurrentDate());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <OverlayDisplayBox currentDate={currentDate}>
      {DEFAULT_OVERLAY_DISPLAY_MODE === "clock" ? (
        <OverlayClock currentDate={currentDate} />
      ) : (
        <OverlayTimer />
      )}
    </OverlayDisplayBox>
  );
}