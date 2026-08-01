type PetSpeechBubbleProps = {
  message: string | null;
  bottomOffset: number;
  onDismiss: () => void;
};

export default function PetSpeechBubble({
  message,
  bottomOffset,
  onDismiss,
}: PetSpeechBubbleProps) {
  if (!message) {
    return null;
  }

  return (
    <button
      className="pet-speech-bubble"
      type="button"
      data-overlay-interactive="true"
      aria-label="Dismiss pet message"
      style={{ bottom: `${bottomOffset}px` }}
      onClick={(event) => {
        event.stopPropagation();
        onDismiss();
      }}
    >
      {message}
    </button>
  );
}