import PixelButton from "../ui/PixelButton";

type PetSelectionProps = {
  onBack: () => void;
};

export default function PetSelection({ onBack }: PetSelectionProps) {
  return (
    <div className="pet-selection-page">
      <PixelButton onClick={onBack}>Back</PixelButton>
      <h1>Pets</h1>
    </div>
  );
}