import { useEffect, useRef } from "react";
import { formatTimerText } from "../hooks/useCountdownTimer";

type OverlayTimerProps = {
  remainingSeconds: number;
  isEditing: boolean;
  editValue: string;
  onStartEditing: () => void;
  onEditValueChange: (value: string) => void;
  onSubmitEdit: () => void;
  onCancelEdit: () => void;
};

export default function OverlayTimer({
  remainingSeconds,
  isEditing,
  editValue,
  onStartEditing,
  onEditValueChange,
  onSubmitEdit,
  onCancelEdit,
}: OverlayTimerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        className="overlay-timer-input"
        data-overlay-interactive="true"
        value={editValue}
        inputMode="numeric"
        aria-label="Timer duration"
        onChange={(event) => onEditValueChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onSubmitEdit();
          }

          if (event.key === "Escape") {
            event.preventDefault();
            onCancelEdit();
          }
        }}
        onBlur={onSubmitEdit}
      />
    );
  }

  return (
    <button
      className="overlay-timer-display"
      type="button"
      data-overlay-interactive="true"
      title="Double-click to edit timer duration"
      onDoubleClick={onStartEditing}
    >
      {formatTimerText(remainingSeconds)}
    </button>
  );
}