type PetSpeechBubbleProps = {
  message: string | null;
  onDismiss: () => void;
};

export default function PetSpeechBubble({
  message,
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
      onClick={(event) => {
        event.stopPropagation();
        onDismiss();
      }}
    >
      {message}
    </button>
  );
}