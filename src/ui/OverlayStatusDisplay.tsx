import { useEffect, useState } from "react";
import { getNextOverlayDisplayMode } from "../data/overlayDisplay";
import {
  getStoredOverlayDisplayMode,
  saveOverlayDisplayMode,
} from "../data/overlayDisplayStorage";
import OverlayClock from "./OverlayClock";
import OverlayDisplayBox from "./OverlayDisplayBox";
import OverlayTimer from "./OverlayTimer";

function getCurrentDate() {
  return new Date();
}

export default function OverlayStatusDisplay() {
  const [currentDate, setCurrentDate] = useState(getCurrentDate);
  const [displayMode, setDisplayMode] = useState(getStoredOverlayDisplayMode);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentDate(getCurrentDate());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    saveOverlayDisplayMode(displayMode);
  }, [displayMode]);

  function toggleDisplayMode() {
    setDisplayMode((currentMode) => getNextOverlayDisplayMode(currentMode));
  }

  return (
    <OverlayDisplayBox
      currentDate={currentDate}
      displayMode={displayMode}
      onToggleDisplayMode={toggleDisplayMode}
    >
      {displayMode === "clock" ? (
        <OverlayClock currentDate={currentDate} />
      ) : (
        <OverlayTimer />
      )}
    </OverlayDisplayBox>
  );
}