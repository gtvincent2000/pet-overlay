import { useEffect, useState } from "react";
import { getNextOverlayDisplayMode } from "../data/overlayDisplay";
import {
  getStoredOverlayDisplayMode,
  saveOverlayDisplayMode,
} from "../data/overlayDisplayStorage";
import { parseTimerDurationInput } from "../data/timerDuration";
import {
  getStoredTimerDurationSeconds,
  saveTimerDurationSeconds,
} from "../data/timerDurationStorage";
import {
  formatTimerText,
  useCountdownTimer,
} from "../hooks/useCountdownTimer";
import OverlayClock from "./OverlayClock";
import OverlayDisplayBox from "./OverlayDisplayBox";
import OverlayTimer from "./OverlayTimer";
import {
  playTimerAlarmSound,
  prepareTimerAlarmSound,
} from "../audio/timerAlarm";

function getCurrentDate() {
  return new Date();
}

type OverlayStatusDisplayProps = {
  onTimerComplete: () => void;
};

export default function OverlayStatusDisplay({
  onTimerComplete,
}: OverlayStatusDisplayProps) {
  const [currentDate, setCurrentDate] = useState(getCurrentDate);
  const [displayMode, setDisplayMode] = useState(getStoredOverlayDisplayMode);
  const [isEditingTimerDuration, setIsEditingTimerDuration] = useState(false);
  const [timerEditValue, setTimerEditValue] = useState("");

  const timer = useCountdownTimer({
    initialSeconds: getStoredTimerDurationSeconds(),
    autoStart: false,
  });

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

  useEffect(() => {
    if (timer.completionId === 0) {
        return;
    }

    onTimerComplete();

    playTimerAlarmSound().catch((error) => {
        console.warn("Failed to play timer alarm sound:", error);
    });
  }, [timer.completionId, onTimerComplete]);

  function toggleDisplayMode() {
    setDisplayMode((currentMode) => getNextOverlayDisplayMode(currentMode));
  }

  function startEditingTimerDuration() {
    timer.pause();
    setTimerEditValue(formatTimerText(timer.remainingSeconds));
    setIsEditingTimerDuration(true);
  }

  function submitTimerDurationEdit() {
    const parsedDurationSeconds = parseTimerDurationInput(timerEditValue);

    if (parsedDurationSeconds === null) {
      setIsEditingTimerDuration(false);
      return;
    }

    timer.setDuration(parsedDurationSeconds);
    saveTimerDurationSeconds(parsedDurationSeconds);
    setIsEditingTimerDuration(false);
  }

  function cancelTimerDurationEdit() {
    setIsEditingTimerDuration(false);
  }

  async function startTimer() {
    try {
        await prepareTimerAlarmSound();
    } catch (error) {
        console.warn("Failed to prepare timer alarm sound:", error);
    }

    timer.start();
  }

  return (
    <OverlayDisplayBox
      currentDate={currentDate}
      displayMode={displayMode}
      onToggleDisplayMode={toggleDisplayMode}
      timerControls={{
        isRunning: timer.isRunning,
        isComplete: timer.isComplete,
        isEditing: isEditingTimerDuration,
        onStart: startTimer,
        onPause: timer.pause,
        onReset: timer.reset,
      }}
    >
      {displayMode === "clock" ? (
        <OverlayClock currentDate={currentDate} />
      ) : (
        <OverlayTimer
          remainingSeconds={timer.remainingSeconds}
          isEditing={isEditingTimerDuration}
          editValue={timerEditValue}
          onStartEditing={startEditingTimerDuration}
          onEditValueChange={setTimerEditValue}
          onSubmitEdit={submitTimerDurationEdit}
          onCancelEdit={cancelTimerDurationEdit}
        />
      )}
    </OverlayDisplayBox>
  );
}