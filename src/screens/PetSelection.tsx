import BackButton from "../ui/BackButton";
import PetCard from "../ui/PetCard";

type PetSelectionProps = {
  onBack: () => void;
};

export default function PetSelection({ onBack }: PetSelectionProps) {
  return (
    <div className="screen-page">
      <div className="pet-selection-page">
        <BackButton onClick={onBack}>←Back</BackButton>
        <h1>Pets</h1>

        <div className="pet-grid">
          <PetCard name="Dog" />
          <PetCard name="Cat" />
          <PetCard name="Fox" />
        </div>
      </div>
    </div>
  );
}