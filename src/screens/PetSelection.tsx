import BackButton from "../ui/BackButton";

type PetSelectionProps = {
  onBack: () => void;
};

export default function PetSelection({ onBack }: PetSelectionProps) {
  return (
    <div className="screen-page">
      <div className="pet-selection-page">
        <BackButton onClick={onBack}>←Back</BackButton>
        <h1>Pets</h1>
      </div>
    </div>
  );
}